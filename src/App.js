import {HashRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import {Tenzies} from "./components/Tenzies/Tenzies";
import {RockPaperScissor} from "./components/RockPaperScissor";
import {Home} from "./components/Home";
import {Tictactoe} from "./components/Tictactoe";
import {Minesweeper} from "./components/minesweeper/Minesweeper";
import {Records} from "./components/Records";
import { FaHome } from "react-icons/fa";
import React from "react";
import {useSelector} from "react-redux";
import './App.css';
import { IoGameControllerSharp } from "react-icons/io5";

const months = {
  1: "JAN",2: "FEB",3: "MAR",4: "APR",5: "MAY", 6: "JUN",
  7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC",
}
const PointsRecords=({monthlyPoints, months})=>{
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}`;
  const current_month = `${date.getMonth() + 1}`;
  return(
    <div id="gameRecords">
      <h4>Monthly Points: </h4>
      {Object.entries(monthlyPoints).map(([month, points]) => {
        // console.log(`current_month:${current_month}, month:${month}, point:${points}, typeof Point: ${typeof(points)}`);
        if(month===currentDate){
          return(
            <p key={month}>{months[current_month]} {points} points</p>
          );
        }
      })}
    </div>
  );
}

function App() {
  const monthlyPoints = useSelector(state => state.games.monthlyPoints);
  // const [showFuncs, setShowFuncs] = useState(false);
  function handleMouseEnter(e){
    e.preventDefault();
    const elements = document.querySelectorAll(".menuEles");
    elements.forEach((each)=>each.classList.toggle('visible'));
  }
  function handleMouseLeave(e){
    e.preventDefault();
    const elements = document.querySelectorAll(".menuEles");
    elements.forEach((each)=>each.classList.toggle('visible'));
  }
  return (
    <div className="App">
      <Router>
        <header>
          <div className="home-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="btn"><i className='bx bx-dots-vertical-rounded'></i></button>
            <NavLink to="/home" className="menuEles goToHomeLink" >
              <button className="btn goToHomeBtn"><FaHome/></button>
            </NavLink>
            <NavLink to="/records" className="menuEles goToRecordLink">
              <button className="btn"><i className='bx bx-award'></i></button>
            </NavLink>
          </div>
          <div className="home-title">
            <h2>Hello!</h2>
            <div className="home-records">
              <NavLink to="/records" className="recordBtnLink">
                <button><i className='bx bx-award'></i></button>
              </NavLink>
              <PointsRecords months={months} monthlyPoints={monthlyPoints}/>
              <IoGameControllerSharp className="gameIcon"/>
            </div>
          </div>
          
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/tenzies" element={<Tenzies/>}></Route>
            <Route path="/rockPaperScissor" element={<RockPaperScissor/>}></Route>
            <Route path="/tictactoe" element={<Tictactoe/>}></Route>
            <Route path="/minesweeper" element={<Minesweeper/>}></Route>
            <Route path="/records" element={<Records/>}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
