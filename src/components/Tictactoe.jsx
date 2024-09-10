import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import "./tictactoe.css";
import Confetti from "react-confetti";
import { addPoints, recordTicTacToeGame } from "../redux/gamesSlice";
import { PopOutWindow } from "./PopOutWindow";

function Player({ handleChangePlayerNum }) {
  return (
    <div className="playerNum">
      <button className="p1" onClick={() => handleChangePlayerNum(true)}>1 player</button>
      <button className="p2" onClick={() => handleChangePlayerNum(false)}>2 players</button>
    </div>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square" 
      onClick={onSquareClick} 
      style={{ color: value === "X" ? "cornflowerblue" : "sandybrown" }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onePlayer, onWin }) {
  const dispatch = useDispatch();

  const handleClick = useCallback((i) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }, [squares, xIsNext, onPlay]);

  const winner = calculateWinner(squares);
  const secondPlayer = onePlayer ? "computer" : "O";
  let status;

  useEffect(() => {
    if (winner) {
      if (winner === "Fair") {
        status = "Fair Game";
        dispatch(addPoints({ points: 3 }));
        dispatch(recordTicTacToeGame({ result: "fair" }));
      } else {
        onWin();
        status = 'Winner: ' + winner;
        dispatch(addPoints({ points: 10 }));
        dispatch(recordTicTacToeGame({ result: "win" }));
      }
    } else if (squares.every(square => square !== null)) {
      status = 'Next player: ' + (xIsNext ? 'X' : secondPlayer);
      dispatch(addPoints({ points: -5 }));
      dispatch(recordTicTacToeGame({ result: "lose" }));
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : secondPlayer);
    }
  }, [winner, squares, xIsNext, secondPlayer, dispatch, onWin]);

  return (
    <>
      <div className="tictactoe-status">{status}</div>
      {[0, 3, 6].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => (
            <Square 
              key={row + col} 
              value={squares[row + col]} 
              onSquareClick={() => handleClick(row + col)} 
            />
          ))}
        </div>
      ))}
    </>
  );
}

export const Tictactoe = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [onePlayer, setPlayer] = useState(false);
  const [playerWin, setPlayerWin] = useState(false);
  const [showRule, setShowRule] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handleChangePlayerNum = useCallback((isOnePlayer) => {
    setPlayer(isOnePlayer);
  }, []);

  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [history, currentMove]);

  const handleWin = useCallback(() => {
    setPlayerWin(true);
  }, []);

  const handleRestart = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setPlayer(false);
    setPlayerWin(false);
  }, []);

  const jumpTo = useCallback((nextMove) => {
    setCurrentMove(nextMove);
  }, []);

  const handleRuleClose = useCallback(() => {
    setShowRule(false);
  }, []);

  useEffect(() => {
    if (onePlayer && !xIsNext && !calculateWinner(currentSquares)) {
      const timer = setTimeout(() => {
        const o_nextStep = isGonnaWin(currentSquares);
        const newSquares = [...currentSquares];
        newSquares[o_nextStep] = "O";
        handlePlay(newSquares);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [onePlayer, xIsNext, currentSquares, handlePlay]);

  const moves = history.map((_, move) => (
    <li key={move} className="statusBtn">
      <button onClick={() => jumpTo(move)}>
        {move > 0 ? `Go to move #${move}` : 'Go to game start'}
      </button>
    </li>
  ));

  return (
    <div className="gameBox tictactoeGameBox">
      {showRule && (
        <PopOutWindow 
          gameName={<><i className='bx bx-x'></i>Tenzies Game<i className='bx bx-radio-circle'></i></>}
          uniClassName="titactoe-ruleBox"
          ruleContents={<>Click the player option button to choose to compete with your friend or computer!<br/>Click the Start button to play!</>}
          buttonName="Start!"
          buttonFunc={handleRuleClose}
        />
      )}
      {playerWin && <Confetti />}
      <div className="tictactoe-title">
        <h3><i className='bx bx-x'></i>Tic-Tac-Toe!<i className='bx bx-radio-circle'></i></h3>
        <Player handleChangePlayerNum={handleChangePlayerNum} />
        <p>{onePlayer ? "Player(X) vs. Computer(O)" : "PlayerX vs. PlayerO"}</p>
      </div>
      <div className="tictactoe">
        <div className="game-board">
          <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
            onePlayer={onePlayer} 
            onWin={handleWin}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
      <button className="restartBtn" onClick={handleRestart}>Restart</button>
    </div>
  );
};

function isGonnaWin(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  const currentBlank = squares.reduce((acc, sq, index) => sq === null ? [...acc, index] : acc, []);
  
  if (currentBlank.length <= 6) {
    for (const [a, b, c] of lines) {
      const lineSquares = [squares[a], squares[b], squares[c]];
      const notNull = lineSquares.filter(Boolean);
      if (notNull.length === 2 && notNull.every(sq => sq === notNull[0])) {
        const nullIndex = lineSquares.findIndex(sq => sq === null);
        if (nullIndex !== -1) return [a, b, c][nullIndex];
      }
    }
  }
  
  return currentBlank[Math.floor(Math.random() * currentBlank.length)];
}

function calculateWinner(squares) {
  if (squares.every(Boolean)) return "Fair";
  
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  
  return null;
}