import Tracer from "@/components/Tracer"
import React, { useEffect } from "react"
import { FC } from "react"
import styles from "./style.css"
import "./style.css"

const ParallaxScrolling: FC = () => {
    useEffect(() => {
        const bg = document.getElementById("bg");
        const moon = document.getElementById("moon");
        const mountain = document.getElementById("mountain");
        const road = document.getElementById("road");
        const moonLightTitle = document.getElementById("moonLightTitle");
        window.addEventListener("scroll", (e) => {
            // Tracer.infoch("addEventListener", 'e', e);
            // 滚动的高度
            const value = window.scrollY;
            if (moon && bg && mountain && moonLightTitle && road) {
                moon.style.left = -value * 0.5 + 'px';
                mountain.style.top = -value * 0.15 + 'px';
                moonLightTitle.style.top = value + 'px';
                bg.style.top = value * 0.5 + "px";
                road.style.top = value * 0.15 + 'px';
            }
        })

        return () => {
            window.removeEventListener?.("scroll", (e) => {
                // Tracer.infoch("removeEventListener", 'e', e);
            });
        }
    }, [])
    return <section className={styles.main}>
        <img className={styles.bg} id="bg" src={require('./img/bg.jpg')} alt="" />
        <img className={styles.moon} id="moon" src={require('./img/moon.png')} alt="" />
        <img className={styles.mountain} id="mountain" src={require('./img/mountain.png')} alt="" />
        <img className={styles.road} id="road" src={require('./img/road.png')} alt="" />
        <div className={styles.title} id="moonLightTitle">MOON LIGHT</div>
    </section>
}
export default ParallaxScrolling;