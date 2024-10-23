import React, { useState, useRef } from 'react';
import './XoX.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

export const XoX = () => {
  const [boardSize, setBoardSize] = useState(3); // Default size
  const [data, setData] = useState(Array(9).fill('')); // Initialize board data
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0 }); // Initialize scores
  const titleRef = useRef(null);

  const generateBoard = () => {
    return Array.from({ length: boardSize }, (_, rowIndex) => (
      <div className="row" key={rowIndex}>
        {Array.from({ length: boardSize }, (_, colIndex) => {
          const index = rowIndex * boardSize + colIndex;
          return (
            <div
              className="boxes"
              key={index}
              onClick={(e) => toggle(e, index)}
            ></div>
          );
        })}
      </div>
    ));
  };

  const toggle = (e, num) => {
    if (lock || data[num]) return; // Prevent action if game is locked or box is already filled

    const newData = [...data];
    const playerSymbol = count % 2 === 0 ? 'x' : 'o';
    const playerIcon = playerSymbol === 'x' ? cross_icon : circle_icon;

    e.target.innerHTML = `<img src='${playerIcon}' alt='${playerSymbol}'>`;
    newData[num] = playerSymbol;
    setData(newData);
    setCount(count + 1);

    // Check for a draw
    if (newData.every(cell => cell !== '')) {
      setLock(true);
      calculateScores(newData); // Calculate scores before declaring a draw
      titleRef.current.innerHTML = 'It\'s a Draw!';
    }
  };

  const calculateScores = (data) => {
    let pointsX = 0;
    let pointsO = 0;

    // Check rows, columns, and diagonals for scoring
    for (let i = 0; i < boardSize; i++) {
      // Check Rows
      pointsX += checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'x');
      pointsO += checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'o');
      
      // Check Columns
      const column = data.filter((_, index) => index % boardSize === i);
      pointsX += checkLineScore(column, 'x');
      pointsO += checkLineScore(column, 'o');
    }

    // Check Diagonal
    const mainDiagonal = data.filter((_, index) => index % (boardSize + 1) === 0);
    pointsX += checkLineScore(mainDiagonal, 'x');
    pointsO += checkLineScore(mainDiagonal, 'o');

    // Check Anti-Diagonal
    const antiDiagonal = data.filter((_, index) => index % (boardSize - 1) === 0 && index > 0 && index < (boardSize * boardSize - 1));
    pointsX += checkLineScore(antiDiagonal, 'x');
    pointsO += checkLineScore(antiDiagonal, 'o');

    // Update scores
    setScores(prevScores => ({
      x: prevScores.x + pointsX,
      o: prevScores.o + pointsO
    }));

    // Display final scores
    titleRef.current.innerHTML = `Game Over! Final Scores - X: ${pointsX}, O: ${pointsO}`;
  };

  const checkLineScore = (line, player) => {
    let count = 0;
    let totalPoints = 0;

    for (const cell of line) {
      if (cell === player) {
        count++;
      } else {
        if (count > 0) {
          totalPoints += count * count; // Square of the count
        }
        count = 0; // Reset count
      }
    }

    // Check for a remaining count at the end of the line
    if (count > 0) {
      totalPoints += count * count;
    }

    return totalPoints;
  };

  const reset = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    setScores({ x: 0, o: 0 }); // Reset scores
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0); // Reset turn counter
  };

  return (
    <div className='container'>
      <h1 className="title" ref={titleRef}>XoX Game In <span>React</span></h1>
      
      <div>
        <label>Enter board size (3, 4, 5, ...): </label>
        <input
          type="number"
          min="3"
          max="10"
          value={boardSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setBoardSize(newSize);
            reset(); // Reset the game when board size changes
          }}
        />
      </div>

      <div className="board">
        {generateBoard()}
      </div>

      <div className="scores">
        <h2>Scores</h2>
        <p>X: {scores.x}</p>
        <p>O: {scores.o}</p>
      </div>
      
      <button className="reset" onClick={reset}>Reset</button>
    </div>
  );
}
