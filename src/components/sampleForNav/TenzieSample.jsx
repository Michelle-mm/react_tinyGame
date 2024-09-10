import React, { useMemo } from 'react'
import "./tenzieSample.css";
import "../Tenzies/tenzies.css"

const generateDieSample = () => {
    return Array.from({ length: 10 }, () => Math.ceil(Math.random() * 6));
};

const DieSample = ({ value, isHeld }) => (
    <div className="die-face tenzieSample-dieFace" style={{ backgroundColor: isHeld ? "cornflowerblue" : "white" }}>
        <p>{value}</p>
    </div>
);

export const TenzieSample = () => {
    const dieSample = useMemo(() => generateDieSample(), []);

    const { mostFrequentNumber, frequency } = useMemo(() => {
        const frequencyMap = dieSample.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});

        const mostFrequentNumber = Object.keys(frequencyMap).reduce((a, b) => 
            frequencyMap[a] > frequencyMap[b] ? a : b
        );

        return {
            mostFrequentNumber: Number(mostFrequentNumber),
            frequency: frequencyMap[mostFrequentNumber]
        };
    }, [dieSample]);

    return (
        <div id="tenzieSample">
            <h3>Tenzies</h3>
            <div className="tenzie-counter tenzieSample-counter">
                <div className="timerContainer tenzieSample-timer">
                    <p>Timer: </p>
                    <p>0 mins 18 secs</p>
                </div>
                <p className="dieCounter tenzieSample-dieCounter">total: 2 rolls</p>
            </div>
            <div className="dice-container">
                {dieSample.map((value, index) => (
                    <DieSample 
                        key={index} 
                        value={value} 
                        isHeld={value === mostFrequentNumber}
                    />
                ))}
            </div>
            <div className="tenzieSample-btns">
                <button className="btn">Roll</button>
                <button className="restartBtn"><i className='bx bx-refresh'></i></button>
            </div>
            
        </div>
    );
};