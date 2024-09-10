import React from 'react';

export const Counter=(props)=>{
    const totalSec = props.timer;
    const seconds = totalSec % 60;
    const minutes = Math.floor(totalSec / 60);
    return(
        <div className="tenzie-counter">
            <div className="timerContainer">
                <p className="timerText">timer:</p>
                <p className='time' style={{color: minutes>=1?"red":"#606060"}}>{minutes}mins {seconds}secs</p>
            </div>
            <p className="dieCounter">total: {props.dieCounter} rolls</p>
        </div>
    )
}