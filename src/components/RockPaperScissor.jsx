import React, { useState, useEffect, useCallback } from 'react';
import "./rockPaperScissor.css";
import Confetti from "react-confetti"
import { FaHandPaper, FaHandRock, FaHandScissors, FaRegHandshake } from "react-icons/fa";
import { addPoints, recordPaperScissorsStoneGame } from "../redux/gamesSlice";
import { useDispatch } from 'react-redux';
import {PopOutWindow} from "./PopOutWindow";
const choices = {
    paper: <FaHandPaper />,
    scissors: <FaHandScissors style={{transform: "rotate(90deg) rotateX(180deg)"}}/>,
    stone: <FaHandRock />,
};

const convertCIdxKey = {0: "paper", 1: "scissors", 2: "stone"};
const convert = {paper: 0, scissors: 1, stone: 2};
const currentDate = new Date();
const month = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

export const RockPaperScissor = () => {
    const [computer, setComputer] = useState("paper");
    const [computerIcon, setComputerIcon] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gameStatusCount, setGameStatusCount] = useState([]);
    const [showRule, setShowRule] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const dispatch = useDispatch();

    const playerWins = gameStatusCount.filter(each => each === "P").length;
    const computerWins = gameStatusCount.filter(each => each === "C").length;
    const fairGameCount = gameStatusCount.filter(each => each === "F").length;

    useEffect(() => {
            if (playerWins === 3 || computerWins === 3 || fairGameCount === 3) {
                    setIsAnimating(false);
                    setGameOver(true);
                    gameResult();
                    return;
            }
            if (isAnimating) {
                const interval = setInterval(() => {
                    setComputerIcon(prevIcon => (prevIcon + 1) % 3);
                }, 200);
                return () => clearInterval(interval);
            }
        
    }, [isAnimating, gameStatusCount]);

    const gameResult = useCallback(() => {
        const playerWins = gameStatusCount.filter(each => each === "P").length;
        const fairGameCount = gameStatusCount.filter(each => each === "F").length;

        if(playerWins === 3){
            const point = 10;
            dispatch(addPoints({points: point}));
            dispatch(recordPaperScissorsStoneGame({result: "win"}));
        } else if (fairGameCount === 3){
            const point = 5;
            dispatch(addPoints({points: point}));
            dispatch(recordPaperScissorsStoneGame({result: "fair"}));
        } else {
            const point = -5;
            dispatch(addPoints({points: point}));
            dispatch(recordPaperScissorsStoneGame({result: "lose"}));
        }
    }, [gameStatusCount, dispatch]);

    const playRound = useCallback((humanChoice, computerChoice) => {
        const h = convert[humanChoice];
        const c = convert[computerChoice];
        const result = ((h - c + 3) % 3);
        setGameStatusCount(prev => [...prev, result === 0 ? "F" : result === 1 ? "P" : "C"]);
    }, []);

    const handleClick = useCallback((humanSelection) => {
        setIsAnimating(false);
        if(!gameOver){
            setTimeout(() => setIsAnimating(true), 1000);
            const computerSelection = convertCIdxKey[Math.floor(Math.random() * 3)];
            setComputer(computerSelection);
            playRound(humanSelection, computerSelection);
        }
    }, [gameOver, playRound]);

    const handleRestart = useCallback(() => {
        setGameOver(false);
        if (gameStatusCount.length === 0) {
            setIsAnimating(true);
        } else {
            setGameStatusCount([]);
            setIsAnimating(false);
        }
    }, [gameStatusCount.length]);

    function handleStart(){
        setIsAnimating(true);
        setShowRule(false);
    }

    
    
    return (
        <div className="gameBox rockPaperScissorBox">
            {playerWins === 3 && <Confetti/>}
            {showRule && <PopOutWindow 
                            gameName={<>Paper-Scissors-Stone!
                                        <FaHandPaper/>
                                        <FaHandRock/>
                                        <FaHandScissors style={{transform: "rotate(90deg) rotateX(180deg)"}}/>
                                    </>}
                            uniClassName="rps-ruleBox"
                            ruleContents={<>The best of three!<br/>Click the Start button to play!</>}
                            buttonName={"Start!"} buttonFunc={handleStart}/>}
            <div className="game-rps-header">
                <h3 className="game-rps-title">Paper, Scissors, Stone!</h3>
                <div className="rps-gamestatus">
                    {gameStatusCount.length>0? gameStatusCount.map((each, index) => (
                        <p key={index}>
                            {each === "F" ? 
                                <FaRegHandshake style={{fontSize: "20px", fontWeight: "700", margin: "0 2px", color: "#ecb62e"}}/> :
                            each === "P" ? 
                                <i className={`bx bx-smile bx-sm ${playerWins === 2 && "bx-tada"}`} style={{color: "#50f03b"}}></i> :
                                <i className={`bx bx-sad bx-sm ${computerWins === 2 && "bx-flashing"}`} style={{color: "red"}}></i>}
                        </p>
                    )): <p className="gamestatus-initial">game status count 
                            <i className={`bx bx-smile bx-sm`} style={{color: "#50f03b"}}></i>
                            <i className="bx bx-sad bx-sm" style={{color: "red"}}></i>
                            <FaRegHandshake style={{fontSize: "17px", fontWeight: "700", margin: "0 2px", color: "#ecb62e"}}/>
                        </p>
                    }
                </div>
            </div>
            <div className="game-rps">
                <div className="rps-sec human">
                    <h3>Player:</h3>
                    <div className="myChoice">
                        {Object.entries(choices).map(([key, Icon]) => (
                            <button
                                className="myChoiceBtn"
                                key={key}
                                onClick={() => handleClick(key)}
                            >
                                {Icon}
                            </button>
                        ))}
                    </div>
                </div>
                <h3 className="rps-sec computer">
                    Computer: <span>{isAnimating ? choices[convertCIdxKey[computerIcon]] : choices[computer]}</span>
                </h3>
            </div>
            <h3 className="rps-result">
                Result:
                <span style={{display: "block"}}>
                    {gameOver ? (playerWins === 3 ? "You Win!!": fairGameCount===3? "Fair Game" : "You Lose...") : " "}
                </span>
            </h3>
            <button className="restartBtn" onClick={handleRestart}>{gameOver ? "NewGame" : "Restart"}</button>
        </div>
    );
}