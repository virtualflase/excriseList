import React from "react"
import { FC } from "react"
import style from "./style.css"

const ParallaxScrolling:FC=()=>{
    return<div>
        <img src={require('./img/bg.jpg')} alt="" />
        <img src={require('./img/moon.png')} alt="" />
        <img src={require('./img/mountain.png')} alt="" />
        <img src={require('./img/road.png')} alt="" />
    </div>
}
export default ParallaxScrolling;