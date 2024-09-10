import React from 'react'
import "./minesweeper.css";
export const MineCounter = ({timer}) => {
    const counter = timer;
    const seconds = counter % 60;
    const minutes = Math.floor(counter / 60);
    return (
        <div className="counter">
            <p>Timer: {minutes}mins {seconds}sec</p>
        </div>
    )
}
