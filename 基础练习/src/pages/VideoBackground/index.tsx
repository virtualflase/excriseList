import React, { useEffect } from "react"
import { FC } from "react"
import styles from "./style.less"
import "./style.less"

const VideoBackground: FC = () => {
    useEffect(() => {
    }, [])
    return <div className={styles.main}>
        <div  className={styles.banner}>
            <section >
                <video autoPlay controls={false} muted loop src={require("./video/Light Leak 08.mp4")} />
                <div className={styles.mainArea}>
                    这是视频背景
                </div>
            </section>
        </div>
    </div>
}
export default VideoBackground;