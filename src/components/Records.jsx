import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {resetState, resetGameState} from "../redux/gamesSlice";
// import { persistor } from '../redux/store';
import "./records.css";

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ComfirmDeleteBox = ({gameName, clickFunc})=>{
    const boxYposition = (window.scrollY)*0.9;
    return(
        <div className="confirmDeleteBox" style={{position: "absolute", top: boxYposition}}>
            <h3>Sure to delete the {gameName} data?</h3>
            <div className="btns">
                <button className="btn yes" value="yes" onClick={(e)=>clickFunc(e)}>Yes</button>
                <button className="btn no" onClick={(e)=>clickFunc(e)}>No</button>
            </div>
        </div>
    )
}

const months = {
    1: "JAN",2: "FEB",3: "MAR",4: "APR",5: "MAY", 6: "JUN",
    7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC",
  }
export const Records = () => {
    const [deleteCheck, setDeleteCheck] = useState(false);
    const [deleteBox, setDeleteBox] = useState(false);
    const [deleteGame, setDeleteGame] = useState("");
    const momthlyPoints = useSelector(state=>state.games.monthlyPoints);
    const mineSweeperGames = useSelector(state => state.games.mineSweeper.games);
    const tenzieGames = useSelector(state => state.games.tenzie.games);
    const ticTacToeGames = useSelector(state => state.games.ticTacToe.monthlyRecord);
    const paperScissorsStoneGames = useSelector(state => state.games.paperScissorsStone.monthlyRecord);
    const dispatch = useDispatch();
    // console.log("type:", typeof(mineSweeperGames)); //object? not array? 
    
    // const handleClearAllData = () => {
    //     persistor.purge().then(() => {
    //         console.log('All persisted data has been cleared');
    //     });
    // };
    function handleClick(e){
        e.preventDefault();
        if(e.target.value==="yes") setDeleteCheck(true);
        else setDeleteCheck(false);
        setDeleteBox(false);
    }
    const handleResetData = () => {
        dispatch(resetState());
      };
    
      function handleGameResetData(game){
        setDeleteBox(true);
        setDeleteGame(game);
        if(deleteCheck) dispatch(resetGameState({gameName: game}));
      }

    return (
        <div className="gameBox recordsBox">
            {deleteBox && <ComfirmDeleteBox gameName={deleteGame} clickFunc={handleClick}/> }
            <div className="record-header">
                <h3>Game Records: </h3>
                <button className="btn clearAllBtn" onClick={handleResetData}><i className='bx bx-trash'></i></button>
                {/* <input type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}/> */}
                
            </div>
            <div className="gamesRecords">
                <div className="box totalPoints">
                    <p className="title">Points Records:</p>
                    <ol>
                        {Object.keys(momthlyPoints).length>0? Object.entries(momthlyPoints).map((month, index)=>{
                            return(
                                <li key={index} style={{ marginBottom: '10px', paddingBottom: '5px' }}>
                                    <strong>{month[0]}:</strong> {month[1]}points
                                </li>
                            );
                        }): <p className="no-records">No Records</p>}
                    </ol>
                </div>
                <div className="box" id="tenzieRecords">
                    <p className="title">Tenzie: <button className="btn titleBtn" onClick={()=>handleGameResetData("tenzie")}><i className='bx bx-trash'></i></button></p>
                    <ol>
                        {tenzieGames.length>0? tenzieGames.map((game, index) => (
                            <li key={index} style={{ marginBottom: '10px', paddingBottom: '5px' }}>
                                <strong>Game {index + 1}:</strong><br />
                                Date: {new Date(game.date).toLocaleString()}<br />
                                TotalTime: {formatTime(game.timeSpent)}<br />
                                Rolls: <span style={{ color: game.result === 'clear' ? 'green' : 'red' }}>{game.rollNum}</span>
                            </li>
                        )): <p className="no-records">No Records...</p>}
                    </ol>
                </div>
                <div className="box" id="ticTacToeRecords">
                    <p className="title">TicTacToe: <button className="btn titleBtn" onClick={()=>handleGameResetData("ticTacToe")}><i className='bx bx-trash'></i></button></p>
                    <ol>
                        {Object.keys(ticTacToeGames).length>0? Object.entries(ticTacToeGames).map((month, index) => {
                            const monthStr = month[0].split("-")[1];
                            return(
                                <li key={index} style={{ marginBottom: '10px', paddingBottom: '5px' }}>
                                    <strong>Month: {months[monthStr]}:</strong><br />
                                    win: {month[1].wins? month[1].wins: 0}<br />
                                    lose: {month[1].losses? month[1].losses: 0}<br />
                                    fair: {month[1].fairs? month[1].fairs: 0}
                                </li>
                            )
                            
                        }): <p className="no-records">No Records...</p>}
                    </ol>
                </div>
                <div className="box rpsRecords">
                    <p className="title">Paper-Scissors-Stone: <button className="btn titleBtn" onClick={()=>handleGameResetData("paperScissorsStone")}><i className='bx bx-trash'></i></button></p>
                    <ol>
                        {Object.keys(paperScissorsStoneGames).length>0? Object.entries(paperScissorsStoneGames).map((month, index) => {
                            const monthStr = month[0].split("-")[1];
                            // console.log(monthStr);
                            return(
                                <li key={index} style={{ marginBottom: '10px', paddingBottom: '5px' }}>
                                    <strong>Month: {months[monthStr]}:</strong><br />
                                    win: {month[1].wins? month[1].wins: 0}<br />
                                    lose: {month[1].losses? month[1].losses: 0}<br />
                                    fair: {month[1].fairs? month[1].fairs: 0}
                                </li>
                            );
                        }): <p className="no-records">No Records...</p>}
                    </ol>
                </div>
                <div className="box mineSweeperRecords">
                    <p className="title">Mine Sweeper: <button className="btn titleBtn" onClick={()=>handleGameResetData("mineSweeper")}><i className='bx bx-trash'></i></button></p>
                    <ol>
                        {mineSweeperGames.length>0? mineSweeperGames.map((game, index) => (
                            <li key={index} style={{ marginBottom: '10px', paddingBottom: '5px' }}>
                                <strong>Game {index + 1}:</strong><br />
                                Date: {new Date(game.date).toLocaleString()}<br />
                                Time: {formatTime(game.timeSpent)}<br />
                                Result: <span style={{ color: game.result === 'clear' ? 'green' : 'red' }}>{game.result}</span>
                            </li>
                        )): <p className="no-records">No Records...</p>}
                    </ol>
                </div>
            </div>
        </div>
    )
}
