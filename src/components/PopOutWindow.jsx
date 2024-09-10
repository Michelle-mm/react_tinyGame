import React from 'react'
import "./popoutWindow.css";
// import { FaHandPaper, FaHandRock, FaHandScissors, FaRegHandshake } from "react-icons/fa";

export const PopOutWindow = ({gameName, uniClassName, ruleContents, buttonName, buttonFunc}) => {
    return (
        <div className={`popoutBox ${uniClassName}`} style={{position: "absolute", top: "20%"}}>
            <h4>{gameName}</h4>
            <p>{ruleContents}</p>
            <button className="btn" onClick={buttonFunc}>{buttonName}</button>
        </div>
    )
}
