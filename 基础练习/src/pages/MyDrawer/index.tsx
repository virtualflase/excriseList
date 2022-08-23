import React, { useEffect } from "react"
import { FC } from "react"
import styles from "./style.less"
import "./style.less"
import { useState } from "react"

const Drawer: FC = () => {
    const [active, setActive] = useState(false);
    return <div className={styles.main}>
        <div>
            <a onClick={() => {setActive(true);console.log('点击成功')}}>点击打开抽屉</a>
        </div>

        <div onClick={() => {setActive(false)}} className={`${styles.drawer} ${active && styles.active}`}>
            这是mask
            <div onClick={(e)=>{e.stopPropagation()}} className={`${styles.drawerCn} ${active && styles.drawerCnACtive}`}>
                这是内容
            </div>
        </div>
    </div>
}
export default Drawer;