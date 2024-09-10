import React from 'react';

export const Die=(props)=>{
    // const styles = {
    //     backgroundColor: props.isHeld ? "#59E391" : "white"
    // }
    const styles = {
        backgroundColor: props.isHeld ? "cornflowerblue" : "white",
        transform: props.isHeld && "translate(1px, 1px)",
        boxShadow: props.isHeld && "0.6px 0.6px #4e4e4e, inset 2px 2px 2.2px #00000057, inset -2px -2px 2px #80a9f7"
    }
    return (
        <div className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <h2 className="die-num">
                {props.value}
            </h2>
        </div>
    )
}