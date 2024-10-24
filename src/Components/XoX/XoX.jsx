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
  const [boardSize, setBoardSize] = useState(3); 
  const [data, setData] = useState(Array(9).fill('')); 
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0 });
  const [highScores, setHighScores] = useState([]); 
  const titleRef = useRef(null);

  const handleStartGame = () => {
    if (!player1 || !player2) {
      alert("Please enter both player names.");
      return;
    }
    setIsGameStarted(true);
    reset(); 
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
          
      const finalScores = { x: scores.x, o: scores.o }; 
      updateHighScores(finalScores);
      
      endGame();      
      
    }
    else{
      calculateScores(newData);
    }
  };
  const calculateScores = (data) => {
    let pointsX = 0;
    let pointsO = 0;
    let lastpointsX = 0;
    let lastpointsO = 0;
  
    for (let i = 0; i < boardSize; i++) {
     
      lastpointsX = checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'x');
      lastpointsO = checkLineScore(data.slice(i * boardSize, (i + 1) * boardSize), 'o');
      if(lastpointsX> pointsX){
        pointsX = lastpointsX;
      }
      if(lastpointsO> pointsO){
        pointsO = lastpointsO;
      }
     
      const column = data.filter((_, index) => index % boardSize === i);
      lastpointsX = checkLineScore(column, 'x');
      lastpointsO = checkLineScore(column, 'o');

      if(lastpointsX> pointsX){
        pointsX = lastpointsX;
      }
      if(lastpointsO> pointsO){
        pointsO = lastpointsO;
      }
    }
  
    lastpointsX = checkAllDiagonals(data, 'x');
    lastpointsO = checkAllDiagonals(data, 'o');
  
    if(lastpointsX> pointsX){
      pointsX = lastpointsX;
    }
    if(lastpointsO> pointsO){
      pointsO = lastpointsO;
    }

    const finalScores = { x: pointsX, o: pointsO };
    setScores(prevScores => ({
      x: pointsX,
      o: pointsO
    }));
  
  };
  
 
  const checkAllDiagonals = (data, player) => {
    let totalPoints = 0;
    let lastPoints = 0;
  
    for (let startRow = 0; startRow < boardSize; startRow++) {
      let diagonal = [];
      let row = startRow;
      let col = 0;
      while (row < boardSize && col < boardSize) {
        diagonal.push(data[boardSize*row+col]);
        row++;
        col++;
      }
      lastPoints = checkLineScore(diagonal, player);
      if(lastPoints>totalPoints)
      {
        totalPoints = lastPoints;
      }
    }
    
    for (let startCol = 1; startCol < boardSize; startCol++) {
      let diagonal = [];
      let row = 0;
      let col = startCol;
      while (row < boardSize && col < boardSize) {
        diagonal.push(data[boardSize*row+col]);
        row++;
        col++;
      }
      
      lastPoints = checkLineScore(diagonal, player);
      if(lastPoints>totalPoints)
      {
        totalPoints = lastPoints;
      }
    }

    for (let startRow = 0; startRow < boardSize; startRow++) {
      let diagonal = [];
      let row = startRow;
      let col = boardSize - 1;
      while (row < boardSize && col >= 0) {
        diagonal.push(data[boardSize*row+col]);
        row++;
        col--;
      }
      lastPoints = checkLineScore(diagonal, player);
      if(lastPoints>totalPoints)
      {
        totalPoints = lastPoints;
      }
      
    }
    
    for (let startCol = boardSize - 2; startCol >= 0; startCol--) {
      let diagonal = [];
      let row = 0;
      let col = startCol;
      while (row < boardSize && col >= 0) {
        diagonal.push(data[boardSize*row+col]);
        row++;
        col--;
      }
      lastPoints = checkLineScore(diagonal, player);
      if(lastPoints>totalPoints)
      {
        totalPoints = lastPoints;
      }
    }
  
  
    return totalPoints;
  };
  
 
  const checkLineScore = (line, player) => {
    let count = 0;
    let totalPoints = 0;
    let lastPoints = 0;
  
    for (const cell of line) {
      if (cell === player) {
        count++; 
      } 
      else {
        if (count > 0) 
        {
          lastPoints = count * count; 
          if(lastPoints> totalPoints)
          {
            totalPoints = lastPoints;
          }
        }
        count = 0; 
      }
    }
  
    if (count > 0) {
      lastPoints = count * count; 
      if(lastPoints> totalPoints)
      {
        totalPoints = lastPoints;
      }
    }
  
    return totalPoints;
  };
  

  const updateHighScores = (finalScores) => {
    const newHighScores = [
      ...highScores,
      { name: player1, score: player1Symbol == 'x'? finalScores.x : finalScores.o, boardSize:boardSize },
      { name: player2, score: player2Symbol == 'x'? finalScores.x : finalScores.o, boardSize:boardSize }
    ].sort((a, b) => b.score - a.score); 
    setHighScores(newHighScores.slice(0, 5)); 
  };  

  const reset = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    setScores({ x: 0, o: 0 }); 
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0); 
  };

  const newGame = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    setScores({ x: 0, o: 0 }); 
    titleRef.current.innerHTML = 'XoX Game In <span>React</span>';
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0);
    setIsGameStarted(false);
  };

  const endGame = () => {
    setLock(false);
    setData(Array(boardSize * boardSize).fill(''));
    
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = '';
    });
    setCount(0); 
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
          <label>Select symbol for player 1: </label>
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
            <h2>Last Game Result</h2>
            <p>{player1} ({player1Symbol}): {player1Symbol == 'x'? scores.x : scores.o}</p>
            <p>{player2} ({player2Symbol}): {player2Symbol == 'x'? scores.x : scores.o}</p>
          </div>
          <div>
            <h2>High Scores</h2>
            <ul className="list-group" style={{paddingLeft:20}}>
              {highScores.map((player, index) => (
                <li key={index} className="list-group-item">
                  {player.name}: {player.score} | {player.boardSize}x{player.boardSize}
                </li>
              ))}
            </ul>
          </div>
          </div>
          <div>
            <label>Enter matrix size (3, 4, 5, ...): </label>
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

          <button className="start" onClick={handleStartGame}>Start the game</button>
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