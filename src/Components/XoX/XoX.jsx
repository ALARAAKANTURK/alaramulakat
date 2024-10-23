import React, { useState, useRef } from 'react';
import './XoX.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

export const XoX = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Symbol, setPlayer1Symbol] = useState('x');
  const [player2Symbol, setPlayer2Symbol] = useState('o');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [boardSize, setBoardSize] = useState(3); // Default size
  const [data, setData] = useState(Array(9).fill('')); // Initialize board data
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const [highScores, setHighScores] = useState([]); 
  const titleRef = useRef(null);

  const handleStartGame = () => {
    if (!player1 || !player2) {
      alert("Lütfen iki oyuncu adını da girin.");
      return;
    }
    setIsGameStarted(true);
    reset(); // Reset game when starting new
  };

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
    const playerSymbol = count % 2 === 0 ? 'x' : 'o';
    const playerIcon = playerSymbol === 'x' ? cross_icon : circle_icon;

    e.target.innerHTML = `<img src='${playerIcon}' alt='${playerSymbol}'>`;
    newData[num] = playerSymbol;
    setData(newData);
    setCount(count + 1);

    if (newData.every(cell => cell !== '')) {
      setLock(true);
      calculateScores(newData);
      titleRef.current.innerHTML = 'Game Over!';
      endGame();
    }
    
    calculateScores(newData);
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
    const finalScores = { x: pointsX, o: pointsO };
    setScores(prevScores => ({
      x: prevScores.x + pointsX,
      o: prevScores.o + pointsO
    }));

    // Display final scores
    const winner = pointsX > pointsO ? player1 : pointsO > pointsX ? player2 : "Berabere";
    titleRef.current.innerHTML = `Game Over! Final Scores - X: ${pointsX}, O: ${pointsO} Winner:${winner}`;
    updateHighScores(finalScores);
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

  const updateHighScores = (finalScores) => {
    const newHighScores = [
      ...highScores,
      { name: player1, score: finalScores.x },
      { name: player2, score: finalScores.o }
    ].sort((a, b) => b.score - a.score); // Sort by score descending
    setHighScores(newHighScores.slice(0, 5)); // Keep top 5
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

  const newGame = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    setScores({ x: 0, o: 0 }); // Reset scores
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0); // Reset turn counter
    setIsGameStarted(false);
  };

  const endGame = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0); // Reset turn counter
    setIsGameStarted(false);
  };


  return (
    <div>
      <h1 className="title container" ref={titleRef}>XoX Game In <span>React</span></h1>
      {!isGameStarted ? (
        <div className="container">
          <label>Player 1 Name: </label>
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          
          <div>
          <label>Player 2 Name: </label>
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
          </div>
          <div>
          <label>Oyuncu 1 için simge seçimi: </label>
          <select
            value={player1Symbol}
            onChange={(e) => {
              const selectedSymbol = e.target.value;
              setPlayer1Symbol(selectedSymbol);
              setPlayer2Symbol(selectedSymbol === 'x' ? 'o' : 'x');
            }}
          >
            <option value="x">X</option>
            <option value="o">O</option>
          </select>

          <p>Player 1: {player1Symbol}</p>
          <p>Player 2: {player2Symbol}</p>
          <div className="scores">
            <h2>Score Board</h2>
            <p>{player1} ({player1Symbol}): {player1Symbol == 'x'? scores.x : scores.o}</p>
            <p>{player2} ({player2Symbol}): {player2Symbol == 'x'? scores.x : scores.o}</p>
          </div>
          <div>
            <h2>High Scores</h2>
            <ul className="list-group" style={{paddingLeft:20}}>
              {highScores.map((player, index) => (
                <li key={index} className="list-group-item">
                  {player.name}: {player.score}
                </li>
              ))}
            </ul>
          </div>
          </div>
          <div>
            <label>Matris boyutunu girin (3, 4, 5, ...): </label>
            <input
              type="number"
              min="3"
              value={boardSize}
              onChange={(e) => {
                
                let newSize = Number(e.target.value);
                if (newSize < 3) {
                  newSize = 3; 
                }
                setBoardSize(newSize);
                reset();
              }}
            />
          </div>

          <button class="start" onClick={handleStartGame}>Başlat</button>
        </div>
        
      ):
      (
        <div>
          

          <div className="row">
            <div className="col-2 container">
              <div className="scores">
                <h2>Score Board</h2>
                <p>{player1} ({player1Symbol}): {player1Symbol == 'x'? scores.x : scores.o}</p>
                <p>{player2} ({player2Symbol}): {player2Symbol == 'x'? scores.x : scores.o}</p>
              </div>
              
              <button className="reset" onClick={reset}>Reset</button>
              <button className="reset" onClick={newGame}>New Game</button>
              
              
            </div>
            <div className="col-10">
              <div className="container board">
                {generateBoard()}
              </div>
            </div>
          </div>

        </div>
      )}

</div>
  );

}