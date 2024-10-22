import React from 'react'
import './XoX.css'
import circle_icon from '../Assets/o.png'
import cross_icon from '../Assets/x.png'
export const XoX = () => {
  return (
    <div className='container' >
    <h1 className="tittle">XoX Game In <span>React</span></h1>
    <div className="board">
        <div className="row1">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
        </div>
        <div className="row2">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
        </div>
        <div className="row3">
            <div className="boxes"></div>
            <div className="boxes"></div>
            <div className="boxes"></div>
        </div>
    </div>
    <button className="reset">Reset</button>

    </div>
  )
}
