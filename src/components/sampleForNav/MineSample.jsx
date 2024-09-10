import React, {useState, useEffect} from 'react';
import "../minesweeper/minesweeper.css";
import "./mineSample.css";

export const MineSample = () => {
    const [board, setBoard] = useState(Array.from({length:25}).fill(null));
    useEffect(()=>{
        const randomCellArr = Array.from({length: 4}).reduce((arr, each, index)=>{
            const randomNum = Math.floor(Math.random()*25);
            arr.push(randomNum);
            return arr;
        }, []);
        let newboard = board.map((_, index)=>{
            if(randomCellArr.includes(index)){
                const randomBombNum = Math.ceil(Math.random()*4);
                return randomBombNum;
            } else return null;
        })
        const randomBombIdx = Math.floor(Math.random()*24);
        newboard[randomBombIdx] = "B";
        setBoard(newboard);
    }, [])
    

    return (
        <div id="mineSampleBox">
            <h3>Mine Sweeper</h3>
            <div className="setting">
                <button className="btn"><i className='bx bx-cog'></i></button>
            </div>
            <div className="records">
                <div className="counter"><p>Timer: 0 mins 38 sec</p></div>
                <p>Bombs<i className='bx bxs-bomb'></i>: 8</p>
            </div>
            <div className="mineSample-board">
                {board.length>0 && board.map((each, index)=>{
                    return (
                        <div className="mineSample-cell"
                            style={{backgroundColor: each!==null? "#dfdfdf": "#70737c",
                                    boxShadow: each!==null? "inset -3px -2px 1.1px gray, inset 3px 2px 1.1px gray" : ""
                            }}
                        >
                            {each? each==="B"? <i className='bx bxs-bomb' style={{color: "red"}}></i>:
                                    each: " "}
                        </div>
                    )
                })}
            </div>
            <button className="restartBtn">Restart</button>
        </div>
    )
}
