const hashWorker = () => {
  self?.importScripts(location.origin + '/spark-md5.min.js');

  // 切割数据包
  const doSplit = (e: any) => {
    const file = e.data.file as File;
    const size = e.data.size as number;
    //文件数据包列表
    const fileChunkList = [];
    let curChunkIndex = 0;

    while (curChunkIndex <= file.size) {
      const chunk = file.slice(curChunkIndex, curChunkIndex + size);
      fileChunkList.push({ chunk: chunk });
      curChunkIndex += size;
    }

    console.log('文件切割完毕:', fileChunkList);
    self.postMessage({
      fileChunkList,
    });
  };

  const getHash = (e: any) => {
    const { chunkList } = e.data;
    console.log('这是worker');
    const spark = new self.SparkMD5.ArrayBuffer();
    let percentage = 0;
    let count = 0;
    const loadNext = (index: number) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunkList[index].chunk);
      reader.onload = (event) => {
        count++;
        spark.append(event?.target?.result);
        if (count === chunkList.length) {
          self.postMessage({
            percentage: 100,
            hash: spark.end(),
          });
          self.close();
        } else {
          percentage += 100 / chunkList.length;
          self.postMessage({
            percentage,
          });
          loadNext(count);
        }
      };
    };
    loadNext(count);
  };

  const workerType: { [key: string]: Function } = {
    hash: getHash,
    split: doSplit,
  };

  self.onmessage = (e: any) => {
    const key = e.data.key as string;
    console.log('self.onmessage', key, e);
    workerType[key](e);
  };
};

export default hashWorker;
