import React from 'react'
import {NavLink} from "react-router-dom";
import {RPSsample} from "./sampleForNav/RPSsample";
import {TenzieSample} from "./sampleForNav/TenzieSample"
import {TictactoeSample} from "./sampleForNav/TictactoeSample"
import {MineSample} from "./sampleForNav/MineSample"

export const Home = () => {
    return (
        <>
            <nav>
                <NavLink to="/rockPaperScissor" className="navBox"><RPSsample/></NavLink>
                <NavLink className="navBox" to="/tenzies"><TenzieSample/></NavLink>
                <NavLink className="navBox" to="/tictactoe"><TictactoeSample/></NavLink>
                <NavLink className="navBox" to="/minesweeper"><MineSample/></NavLink>
            </nav>
        </>
    )
}
