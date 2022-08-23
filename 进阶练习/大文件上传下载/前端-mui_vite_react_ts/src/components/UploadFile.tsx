import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import hashWorker from "../utils/Hash-worker";
import WorkerBuilder from "../utils/Worker-build";
import request from "../utils/Request";
// 分割大小
const CHUNK_SIZE = 1 * 1024 * 1024;

// 获取文件后缀名
const getFileSuffix = (fileName: string) => {
    let arr = fileName.split(".");
    if (arr.length > 0) {
        return arr[arr.length - 1]
    }
    return "";
}
// 拆分文件
const splitFile = (file: File, size = CHUNK_SIZE) => {
    return new Promise(resolve => {
        const worker = getWorker();
        worker.postMessage({ file, size, key: 'split' })
        worker.onmessage = e => {
            const { fileChunkList } = e.data;
            console.log("splitFile", "fileChunkList", fileChunkList);
            if (fileChunkList) {
                // 切割文件完成,返回文件列表
                resolve(fileChunkList)
            }
        }
    })
}
// 拆分文件
const localSplitFile = (file: File, size = CHUNK_SIZE) => {
    //文件数据包列表
    const fileChunkList = [];
    let curChunkIndex = 0;

    while (curChunkIndex <= file.size) {
        const chunk = file.slice(curChunkIndex, curChunkIndex + size);
        fileChunkList.push({ chunk: chunk });
        curChunkIndex += size;
    }

    console.log('文件切割完毕:', fileChunkList);
    return fileChunkList;
}
const getWorker = () => {
    if (webWorker) {
        return webWorker
    }
    webWorker = new WorkerBuilder(hashWorker);
    return webWorker
}
let webWorker: WorkerBuilder | undefined;
const UpLoadFile = function () {
    // 文件名称
    const [fileName, setFileName] = useState("");
    // 文件的hash
    const [fileHash, setFileHash] = useState("")
    // 分割的文件数据包
    const [chunkList, setChunkList] = useState<any[]>([])
    // 百分比
    const [hashPercentage, setHashPercentage] = useState(0)


    // 选择文件,并且进行切割
    const handleFileChange = async (e: any) => {
        const { files } = e.target;
        if (files.length === 0) return;
        // 保存文件名
        setFileName(files[0].name);
        const start = new Date().getTime();
        // 文件分片
        // const chunkList = await splitFile(files[0]) as any[];
        const chunkList = localSplitFile(files[0]) as any[];
        const end = new Date().getTime();
        console.log("花费时间", end - start)
        setChunkList(chunkList);
    }

    // 发送合并请求
    const mergeRequest = (hash: string) => {
        console.log("发送合并请求")
        request({
            url: "http://localhost:3001/merge",
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            data: JSON.stringify({
                // 服务器存储的文件名：hash+文件后缀名
                fileHash: hash,
                suffix: getFileSuffix(fileName),
                // 用于服务器合并文件
                size: CHUNK_SIZE
            })
        })
    }

    // 上传分片
    const uploadChunks = async (chunksData: any[], hash: string) => {
        // 上传参数列表
        const formDataList = chunksData.map(({ chunk, hash }) => {
            const formData = new FormData()
            formData.append("chunk", chunk);
            formData.append("hash", hash);
            formData.append("suffix", getFileSuffix(fileName));
            return { formData };
        })
        // 批量上传,这边还可以优化一下,一次最多20个,或者直接交给webworker
        const requestList = formDataList.map(({ formData }, index) => {
            return request({
                url: "http://localhost:3001/upload",
                data: formData,
                onprogress: e => {
                    let list = [...chunksData];
                    list[index].progress = parseInt(String((e.loaded / e.total) * 100));
                    setChunkList(list)
                }
            })
        })
        // 上传文件
        Promise.all(requestList).then(() => {
            // 延迟发送合并请求，方便观察服务器合并文件的步骤
            setTimeout(() => {
                mergeRequest(hash);
            }, 1000);

        })
    }
    // 计算文件hash
    const calculateHash = (chunkList: any[]) => {
        return new Promise(resolve => {
            const woker = new WorkerBuilder(hashWorker)
            woker.postMessage({ chunkList: chunkList, key: 'hash' })
            woker.onmessage = e => {
                const { percentage, hash } = e.data;
                setHashPercentage(percentage);
                if (hash) {
                    // 当hash计算完成时，执行resolve
                    resolve(hash)
                }
                // woker.close();
            }
        })
    }

    // 上传文件
    const handleUpload = async () => {
        if (!fileName) {
            alert("请先选择文件")
            return;
        }
        if (chunkList.length === 0) {
            alert("文件拆分中，请稍后...")
            return;
        }
        // 计算hash
        const hash: string = (await calculateHash(chunkList) as string)
        console.log("文件的hash为：", hash)
        setFileHash(hash)
        const { shouldUpload, uploadedChunkList } = await verfileIsExist(hash, getFileSuffix(fileName));
        console.log(shouldUpload)
        if (!shouldUpload) {
            alert("文件已存在，无需重复上传");
            return;
        }
        let uploadedChunkIndexList: number[] = [];
        if (uploadedChunkList && uploadedChunkList.length > 0) {
            uploadedChunkIndexList = uploadedChunkList.map((item: string) => {
                const arr = item.split("-");
                return parseInt(arr[arr.length - 1])
            })
            console.log(uploadedChunkIndexList)
            alert("已上传的区块号：" + uploadedChunkIndexList.toString())
        }
        const chunksData = chunkList.map(({ chunk }, index) => ({
            chunk: chunk,
            hash: hash + "-" + index,
            progress: 0
        })).filter(item2 => {
            // 过滤掉已上传的块
            const arr = item2.hash.split("-")
            return uploadedChunkIndexList.indexOf(parseInt(arr[arr.length - 1])) === -1;
        })
        console.log(chunksData)
        // 保存分片数据
        setChunkList(chunksData)
        // 开始上传分片
        uploadChunks(chunksData, hash)
    }

    // 秒传：验证文件是否存在服务器
    const verfileIsExist = async (fileHash: string, suffix: string) => {
        const { data } = await request({
            url: "http://localhost:3001/verFileIsExist",
            headers: {
                "content-type": "application/json"
            },
            data: JSON.stringify({
                fileHash: fileHash,
                suffix: suffix
            })
        }) as any;
        return JSON.parse(data);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} /><br />
            <button onClick={handleUpload}>上传</button>
            {chunkList.length}
            {/* <ProgressBox chunkList={chunkList} /> */}
        </div>
    )
}
const BlockWraper = styled.div`
  width: ${({ size }) => size + "px"};
  height: ${({ size }) => size + "px"};
  text-align: center;
  font-size: 12px;
  line-height: ${({ size }) => size + "px"}; 
  border: 1px solid #ccc;
  position: relative;
  float: left;
  &:before {
    content: "${({ chunkIndex }) => chunkIndex}";
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    top: 0;
    font-size: 12px;
    text-align: left;
    line-height: initial;
    color: #000
  }
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: ${({ progress }) => progress + "%"};
    background-color: pink;
    left: 0;
    top: 0;
    z-index: -1;
  }
`
const ChunksProgress = styled.div`
  *zoom: 1;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`
const Label = styled.h3``
const ProgressWraper = styled.div``
type BlockProps = { progress: number, size: number, chunkIndex: number }
const Block = ({ progress, size, chunkIndex }: BlockProps) => {
    return (<BlockWraper size={size} chunkIndex={chunkIndex + 1} progress={progress}>
        {progress}%
    </BlockWraper>)
}

const ProgressBox = ({ chunkList = [], size = 40 }: { chunkList: any[], size: number }) => {
    const sumProgress = useMemo(() => {
        if (chunkList.length === 0) return 0
        const result = chunkList.reduce((pre, cur, sum) => pre + cur.progress / 100, 0) * 100 / (chunkList.length);
        if (isNaN(result)) return 0
        return result
    }, [chunkList])

    return (
        <ProgressWraper>
            <Label>文件切分为{chunkList.length}段，每段上传进度如下：</Label>
            <ChunksProgress>
                {chunkList.map(({ progress }, index) => (
                    <Block key={index} size={size} chunkIndex={index} progress={progress} />
                ))}
            </ChunksProgress>
            <Label>总进度:{sumProgress.toFixed(2)}%</Label>
        </ProgressWraper >
    )
}

export default UpLoadFile;
