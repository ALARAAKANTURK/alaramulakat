import React, { useState, useRef, useEffect } from 'react';
import './XoX.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

export const XoX = () => {
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [symbols, setSymbols] = useState({ player1: 'x', player2: 'o' });
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [boardSize, setBoardSize] = useState(3);
  const [data, setData] = useState(Array(9).fill(''));
  const [lock, setLock] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const [highScores, setHighScores] = useState([]);
  const titleRef = useRef(null);

 
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('highScores')) || [];
    setHighScores(storedScores);
  }, []);
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
    if (lock || data[num]) return; 
    const newData = [...data];
    const currentPlayerSymbol = symbols[currentPlayer];
    const playerIcon = currentPlayerSymbol === 'x' ? cross_icon : circle_icon;

    e.target.innerHTML = `<img src='${playerIcon}' alt='${currentPlayerSymbol}'>`;
    newData[num] = currentPlayerSymbol;
    setData(newData);

    if (newData.every(cell => cell !== '')) {
      setLock(true); 
      calculateScores(newData); 
      titleRef.current.innerHTML = 'Fınısh!';
    }

    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1'); 
  };

  
  const calculateScores = (data) => {
    let pointsX = 0;
    let pointsO = 0;

    for (let i = 0; i < boardSize; i++) {
      pointsX += checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'x');
      pointsO += checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'o');

      const column = data.filter((_, index) => index % boardSize === i);
      pointsX += checkLineScore(column, 'x');
      pointsO += checkLineScore(column, 'o');
    }

    const mainDiagonal = data.filter((_, index) => index % (boardSize + 1) === 0);
    pointsX += checkLineScore(mainDiagonal, 'x');
    pointsO += checkLineScore(mainDiagonal, 'o');

    const antiDiagonal = data.filter((_, index) => index % (boardSize - 1) === 0 && index > 0 && index < (boardSize * boardSize - 1));
    pointsX += checkLineScore(antiDiagonal, 'x');
    pointsO += checkLineScore(antiDiagonal, 'o');

    const finalScores = { x: pointsX, o: pointsO };
    setScores(prevScores => ({
      x: prevScores.x + pointsX,
      o: prevScores.o + pointsO
    }));

    handleGameEnd(finalScores);
  };

  
  const checkLineScore = (line, player) => {
    let count = 0;
    let totalPoints = 0;

    for (const cell of line) {
      if (cell === player) {
        count++;
      } else {
        if (count > 0) {
          totalPoints += count * count; 
        }
        count = 0;
      }
    }

    if (count > 0) {
      totalPoints += count * count;
    }

    return totalPoints;
  };

  
  const handleGameEnd = (finalScores) => {
    const winner = finalScores.x > finalScores.o ? 'X' : 'O';
    titleRef.current.innerHTML = `Game Over! Winner: ${winner}`;

    const newHighScore = {
      playerX: playerNames.player1,
      playerO: playerNames.player2,
      scoreX: finalScores.x,
      scoreO: finalScores.o,
    };

    const updatedHighScores = [...highScores, newHighScore];
    setHighScores(updatedHighScores);
    localStorage.setItem('highScores', JSON.stringify(updatedHighScores));
  };


  const reset = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    setScores({ x: 0, o: 0 });
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCurrentPlayer('player1');
  };

 
  const handlePlayerNames = () => {
    const player1Name = prompt('Enter Player 1 Name:');
    const player2Name = prompt('Enter Player 2 Name:');
    const player1Symbol = prompt(`${player1Name}, choose your symbol (X or O):`).toLowerCase();

    setPlayerNames({ player1: player1Name, player2: player2Name });
    setSymbols({ player1: player1Symbol, player2: player1Symbol === 'x' ? 'o' : 'x' });
    reset();
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
            reset();
          }}
        />
      </div>

      <button className="start" onClick={handlePlayerNames}>Start Game</button>

      <div className="board">
        {generateBoard()}
      </div>

      <div className="scores">
        <h2>Scores</h2>
        <p>{playerNames.player1} (X): {scores.x}</p>
        <p>{playerNames.player2} (O): {scores.o}</p>
      </div>

      <div className="high-scores">
        <h2>High Scores</h2>
        <ul>
          {highScores.map((score, index) => (
            <li key={index}>
              {score.playerX} (X) - {score.scoreX} | {score.playerO} (O) - {score.scoreO}
            </li>
          ))}
        </ul>
      </div>

      <button className="reset" onClick={reset}>Reset</button>
    </div>
  );
};
