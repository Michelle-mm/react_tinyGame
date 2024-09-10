import React from 'react'
import "./tictactoeSample.css";
export const TictactoeSample = () => {
    return (
        <div id="tictactoeBox-sample">
            <div className="tictactoe-title">
                <h3>Tic-Tac-Toe!</h3>
                <div className="playerNum">
                    <button className="btn p1">1 player</button>
                    <button className="btn p2">2 players</button>
                    </div>
                <p>Player(X) vs. Computer(O)</p>
            </div>
            <div className="tictactoe sample-tictactoe">
                <div className="sample-gameboard">
                    {Array.from({length: 9}).map((_,index)=>(
                        <button className="btn squares-sample" key={index}
                            style={{color: index===0 || index===4? "cornflowerblue": index===7? "sandybrown": "transparent"}}>
                            {index===0 || index===4? "X": index===7? "O": " "}
                        </button>
                    ))}
                </div>
                <div className="sample-gameInfo">
                    <ol>
                        <li>Go to game start</li>
                        <li>1. Go to move #1</li>
                        <li>2. Go to move #2</li>
                    </ol>
                </div>
            </div>
            <button className="restartBtn">Restart</button>
        </div>
    )
}
