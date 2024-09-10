import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Confetti from "react-confetti";
import "./minesweeper.css";
import { MineCounter } from './MineCounter';
import { addPoints, recordMineSweeperGame } from "../../redux/gamesSlice";
import { PopOutWindow } from "../PopOutWindow";

const GameBoard = ({ handleboxClicked, handleRightClick, row, row_index }) => {
    return (
        <div className="mineBox-row">
            {Array.isArray(row) ? row.map((col, col_index) => {
                const boxStyle = {
                    boxShadow: col.isRevealed && "inset 1.5px 1.5px 2px #727171, inset -1.5px -1.5px 2px #c9c8c8",
                    color: col.bombAroundNum === 1 ? "blue" : col.bombAroundNum === 2 ? "green" : "red",
                    backgroundColor: col.isRevealed ? "#a7a5a5" : ""
                };
                return (
                    <button 
                        key={`${row_index}-${col_index}`} 
                        className="mineBox" 
                        style={boxStyle}
                        onContextMenu={(e) => handleRightClick(e, row_index, col_index)}
                        onClick={() => handleboxClicked(row_index, col_index)}
                    >
                        {col.isFlag ? <i className='bx bxs-flag flag'></i> :
                            col.isRevealed && (col.isBomb 
                                ? <i className='bx bxs-bomb' style={{color: "red"}}></i> 
                                : col.bombAroundNum === 0 ? " " : col.bombAroundNum)
                        }
                    </button>
                );
            }) : null}
        </div>
    );
};

const Setting = ({ handleSelected, size }) => {
    return (
        <select value={size} onChange={handleSelected}>
            {[5, 7, 9, 11].map((value) => (
                <option key={value} value={value}>{value}x{value}</option>
            ))}
        </select>
    );
};

export const Minesweeper = () => {
    const [boardSize, setBoardSize] = useState(5);
    const [gameBoard, setGameBoard] = useState([]);
    const [showSetting, setShowSetting] = useState(false);
    const [bombs, setBombs] = useState(0);
    const [gameLose, setGameLose] = useState(false);
    const [gameWin, setGameWin] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [timer, setTimer] = useState(0);
    const [flagNum, setFlagNum] = useState(0);
    const dispatch = useDispatch();

    const initializeBoard = useCallback(() => {
        const bombsNum = Math.floor(Math.pow(boardSize, 2) * 0.2);
        setBombs(bombsNum);
        setFlagNum(bombsNum);

        let newBoard = Array(boardSize).fill().map(() => 
            Array(boardSize).fill().map(() => ({
                isBomb: false,
                isRevealed: false,
                isFlag: false,
                bombAroundNum: 0
            }))
        );

        // Place bombs
        let placedBombs = 0;
        while (placedBombs < bombsNum) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            if (!newBoard[row][col].isBomb) {
                newBoard[row][col].isBomb = true;
                placedBombs++;
            }
        }

        // Calculate bomb counts
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (newBoard[i][j].isBomb) {
                    newBoard[i][j].bombAroundNum = 'B';
                } else {
                    newBoard[i][j].bombAroundNum = calculateBombCount(newBoard, i, j);
                }
            }
        }

        return newBoard;
    }, [boardSize]);

    const calculateBombCount = (board, row, col) => {
        let count = 0;
        for (let i = Math.max(0, row - 1); i <= Math.min(boardSize - 1, row + 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(boardSize - 1, col + 1); j++) {
                if (board[i][j].isBomb) count++;
            }
        }
        return count;
    };

    useEffect(() => {
        const newBoard = initializeBoard();
        setGameBoard(newBoard);
    }, [boardSize, initializeBoard]);

    useEffect(() => {
        if (gameStart) {
            const timeCounter = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
            return () => clearInterval(timeCounter);
        }
    }, [gameStart]);

    const handleStart = () => {
        setGameStart(true);
    };

    const handleSelected = (e) => {
        setBoardSize(Number(e.target.value));
    };

    const handleboxClicked = (row, col) => {
        if (gameLose || gameWin || gameBoard[row][col].isFlag || gameBoard[row][col].isRevealed) return;

        let newBoard = JSON.parse(JSON.stringify(gameBoard));

        // First click safety
        if (!gameStart) {
            while (newBoard[row][col].isBomb || newBoard[row][col].bombAroundNum !== 0) {
                newBoard = initializeBoard();
            }
            setGameStart(true);
        }

        newBoard = revealCell(row, col, newBoard);

        if (newBoard[row][col].isBomb) {
            newBoard = revealAllBomb(newBoard);
            dispatch(addPoints({ points: -10 }));
            dispatch(recordMineSweeperGame({ result: "bomb!", timeSpent: timer }));
            setTimeout(() => setGameLose(true), 1500);
        }
        setGameBoard(newBoard);

        // Check win condition
        if (newBoard.every(row => row.every(cell => cell.isRevealed || cell.isBomb))) {
            setGameWin(true);
            const point = timer < 60 ? 20 : timer < 90 ? 10 : 5;
            dispatch(addPoints({ points: point }));
            dispatch(recordMineSweeperGame({ result: "clear", timeSpent: timer }));
        }

    };

    const revealCell = (row, col, board) => {
        if (board[row][col].isRevealed || board[row][col].isFlag) return board;
        board[row][col].isRevealed = true;
        if (board[row][col].bombAroundNum === 0) {
            for (let i = Math.max(0, row - 1); i <= Math.min(boardSize - 1, row + 1); i++) {
                for (let j = Math.max(0, col - 1); j <= Math.min(boardSize - 1, col + 1); j++) {
                    if (i !== row || j !== col) {
                        board = revealCell(i, j, board);
                    }
                }
            }
        }
        return board;
    };

    const revealAllBomb=(board)=>{
        for(let i=0; i<boardSize; i++){
            for(let j=0; j<boardSize; j++){
                if(board[i][j].isBomb){
                    board[i][j].isRevealed = true;
                }
            }
        }
        return board;
    }

    const handleRightClick = (e, row, col) => {
        e.preventDefault();
        if (gameLose || gameWin || gameBoard[row][col].isRevealed) return;

        const newBoard = JSON.parse(JSON.stringify(gameBoard));
        if (!newBoard[row][col].isFlag && flagNum > 0) {
            newBoard[row][col].isFlag = true;
            setFlagNum(prev => prev - 1);
        } else if (newBoard[row][col].isFlag) {
            newBoard[row][col].isFlag = false;
            setFlagNum(prev => prev + 1);
        }
        setGameBoard(newBoard);
    };

    const handleRestart = () => {
        const newBoard = initializeBoard();
        setGameBoard(newBoard);
        setTimer(0);
        setGameLose(false);
        setGameWin(false);
        setGameStart(false);
    };

    return (
        <div className="gameBox mineSweeperBox">
            {gameLose && <PopOutWindow 
                            gameName={<>Game Lose...<i className='bx bxs-sad'></i></>}
                            uniClassName="gameLose"
                            ruleContents={<>click the <span>Try Again button for new game!</span></>}
                            buttonName={"Restart"} buttonFunc={handleRestart}/>}
            {!gameStart && <PopOutWindow 
                            gameName={<>Welcome to MineSweeper!</>}
                            uniClassName="gameStart"
                            ruleContents={<>click the <span>start</span> button to play!</>}
                            buttonName={"Start!"} buttonFunc={handleStart}/>}
            {gameWin && <Confetti/>}
            <h3>Mine Sweeper</h3>
            <div className="setting">
                <button className="btn" onClick={() => setShowSetting((prev) => !prev)}><i className='bx bx-cog'></i></button>
                {showSetting && <Setting handleSelected={handleSelected} size={boardSize}/>}
            </div>
            <div className="records">
                <MineCounter timer={timer}/>
                <p>Bombs<i className='bx bxs-bomb'></i>: {bombs}</p>
                <p className={`${flagNum <= 1 && "flag-shake"}`}>
                    Flags<i className={`bx bxs-flag flag ${flagNum <= 1 && "bx-tada"}`}></i>: {flagNum}
                </p>
            </div>
            <div className="minesweeper-gameBoard">
                {gameBoard.map((row, row_index) => (
                    <GameBoard 
                        key={row_index} 
                        handleboxClicked={handleboxClicked} 
                        handleRightClick={handleRightClick} 
                        row={row} 
                        row_index={row_index}
                    />
                ))}
            </div>
            <button className="restartBtn" onClick={handleRestart}>Restart</button>
        </div>
    );
};