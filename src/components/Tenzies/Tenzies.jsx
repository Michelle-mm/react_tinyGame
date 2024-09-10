import React, {useState, useEffect} from "react"
import {Die} from "./Die"
import {Counter} from "./Counter";
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useDispatch } from 'react-redux';
import {PopOutWindow} from "../PopOutWindow";
import "./tenzies.css";
import { addPoints, recordTenzieGame } from "../../redux/gamesSlice";

export const Tenzies=()=> {
    const [showRule, setShowRule] = useState(true);
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [gameTime, setGameTime] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [dieCounter, setDieCounter] = useState(0);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        let interval;
        if(isTimerActive){
            interval = setInterval(()=>{
                setGameTime(prevMillisec => prevMillisec+1);
            }, 1000);
        }
        return ()=> clearInterval(interval);
    }, [isTimerActive])
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue && dieCounter<20) {
            //win!
            setTenzies(true);
            setIsTimerActive(false);

            // Add game record
            const point = gameTime > 30? 5: 3;
            dispatch(addPoints({ points: point }));
            dispatch(recordTenzieGame({rollNum: dieCounter, timeSpent: gameTime}));
            // console.log("You won!");
        }else if (allHeld && !allSameValue){
            setIsTimerActive(false);
            const point = -5;
            dispatch(addPoints({ points: point }));
            dispatch(recordTenzieGame({rollNum: dieCounter, timeSpent: gameTime}));
            // alert("you lost...\nClick the button to try again");
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    
    function rollDice() {
        if(tenzies){
            setDice(allNewDice)
            setTenzies(false)
            setGameTime(0);
            setDieCounter(0);
        
        } else if(!tenzies && dice.every(perDice => perDice.isHeld)){
            setDice(allNewDice)
            setGameTime(0);
            setDieCounter(0);
        }
        else{
            setDieCounter(prevDieCount => prevDieCount+1)
            setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
            }))
        }
    }
    
    function holdDice(id) {
        setIsTimerActive(true)
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function handleRuleClose(){
        setIsTimerActive(true);
        setShowRule((prev)=>!prev);
    }

    function handleRestart(){
        setDice(allNewDice)
        setTenzies(false)
        setGameTime(0);
        setDieCounter(0);
        setIsTimerActive(false);
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    

    return (
        <div className="gameBox tenziespage">
            {showRule && <PopOutWindow 
                            gameName={<>Tenzies Game</>}
                            uniClassName="gameStart"
                            ruleContents={<>Roll until all dice are the same.<br/>Click each die to freeze it at its current value between rolls.</>}
                            buttonName={"Start!"} buttonFunc={handleRuleClose}/>}
            {tenzies && <Confetti />}
            <h3 className="tenzie-title">Tenzies</h3>
            <Counter timer={gameTime} dieCounter={dieCounter}/>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="roll-btns">
                <button 
                    className="roll-dicebtn" 
                    onClick={rollDice}
                >
                    {tenzies && dice.every(die => die.isHeld)?
                            "New Game" : 
                            !tenzies && (dice.every(die => die.isHeld))?
                            "Try Again": "Roll"}
                </button>
                <button className="restartBtn" onClick={handleRestart}><i className='bx bx-refresh'></i></button>
            </div>
        </div>
    )
}