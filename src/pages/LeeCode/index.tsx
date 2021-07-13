import React, { useEffect } from "react"
import { FC } from "react"
import styles from "./style.less"
import "./style.less"
import { useState } from "react"
import { Button, Input } from "antd"
import Tracer from "@/components/Tracer"

const LeeCode: FC = () => {
    const [msg, setMsg] = useState('');
    // 先写一个转字符串版本,在做一个不转字符版本
    function isPalindrome(x: number): boolean {
        if (x < 0) return false;
        if (x == 0) return true;
        if (x > Math.pow(2, 31) || x < Math.pow(-2, 31)) {
            return false;
        }
        let res = 0;
        let t = x;
        while (x != 0) {
            let num = x % 10;
            res = res * 10 + num;
            x = (x - num) / 10
        }
        return res == t;
    };

    function reverse(x: number): number {
        let res = 0;
        while (x != 0) {
            let num = x % 10;
            res = res * 10 + num;
            x = ~~(x / 10)
        }
        if (res > (Math.pow(2, 31) - 1) || res < Math.pow(-2, 31)) {
            return 0;
        }
        return res;
    };
    // 罗马数字中小的数字在大的数字的右边,如果小的数字在左边,那就是做减法(只用判断开头两个数字)
    // 以两个为一组去计算
    function romanToInt(s: string): number {
        let msg = '';
        const roman: any = {
            I: 1,
            V: 5,
            X: 10,
            L: 50,
            C: 100,
            D: 500,
            M: 1000,
        }
        if (s.length == 1) {
            return roman[s];
        }
        // const single = length % 2 != 0;
        // // 右边减左边
        // for (let k = 0; k < length; k += 1) {
        //     const a = roman[s[k]];
        //     if (k + 1 >= length) {
        //         res += a;
        //         msg += `a:${a}\r`
        //     } else {
        //         const b = roman[s[k + 1]];
        //         res += a < b ? -a : a;
        //         msg += `a:${a},b:${b}\r`
        //         msg += `a > b ? a + b : b - a:${a < b ? b - a : a + b}\r`
        //     }
        //     msg += `res:${res},k:${k}\r`
        // }
        let ans = 0
        const n = s.length
        for (let i = 0; i < n; ++i) {
            const value = roman[s[i]]
            if (i < n - 1 && value < roman[s[i + 1]]) {
                ans -= value
            } else {
                ans += value
            }
        }
        msg += `结果:${ans}\r`
        setMsg(msg);
        return ans;
    };
    function longestCommonPrefix(strs: string[]): string {
        let res = '';
        let pre: string[] = [...strs[0]];
        let msg = ''
        for (let s = 0, sl = strs.length; s < sl; ++s) {
            if (pre.length == 0) return '';
            const item = strs[s]
            let nPre: string[] = [];
            for (let k = 0, l = item.length; k < l; k++) {
                if (item[k] == pre[k]) {
                    nPre.push(item[k])
                    // msg += `nPre.push(item[k]):${item[k]}\r`;
                } else {
                    break;
                }
            }
            pre = nPre;

        }
        pre.forEach(item => res += item);
        // msg += res;
        // setMsg(msg);
        return res;
    };
    return <div className={styles.main}>
        <Button onClick={() => { reverse(131) }}>反转数</Button>
        <Button onClick={() => { isPalindrome(131) }}>回文数</Button>
        <Button onClick={() => { romanToInt("MCDLXXVI") }}>罗马数字转整数</Button>
        <Button onClick={() => { longestCommonPrefix(["ab", "a"]) }}>最长公共前缀</Button>
        <Input.TextArea value={msg} rows={10} />
    </div>
}
export default LeeCode;