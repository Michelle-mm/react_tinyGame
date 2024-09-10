import React from "react";
import "./rpsSample.css";
import { FaHandPaper, FaHandRock, FaHandScissors, FaRegHandshake } from "react-icons/fa";

import { TbPointerFilled } from "react-icons/tb";
export const RPSsample = ()=>{
    return (
        <div className="rpsSampleBox">
            <div className="game-rps-header">
                <h3>Rock-Papaer-Scissor</h3>
                <p className="status">
                    <i className={`bx bx-smile`} style={{color: "#50f03b"}}></i>
                    <i className="bx bx-sad" style={{color: "red"}}></i>
                    <FaRegHandshake style={{fontWeight: "700", margin: "0 2px", color: "#ecb62e"}}/>
                </p>
            </div>
            <div className="sampleHuman">
                <p>Player:</p>
                <div className="myChoice">
                    <button className="rpsSampleBtn sampleClickedBtn"><FaHandPaper /><p className="cursor"><TbPointerFilled/></p></button>
                    <button className="rpsSampleBtn"><FaHandScissors style={{transform: "rotate(90deg) rotateX(180deg)"}}/></button>
                    <button className="rpsSampleBtn"><FaHandRock /></button>
                </div>
            </div>
            <p className="sampleComputer">
                Computer: <span className="sampleClickedBtn"><FaHandRock /></span>
            </p>
            <p className="sampleResult">Result: <span>You Win!</span></p>
        </div>
    )
}