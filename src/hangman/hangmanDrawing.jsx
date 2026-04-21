import React from 'react';
import "./hangman.css"

const bodyParts = [
    <div key="head" className="head"></div>,
    <div key="body" className="body"></div>,
    <div key="leftArm" className="left-arm"></div>,
    <div key="rightArm" className="right-arm"></div>,
    <div key="leftLeg" className="left-leg"></div>,
    <div key="rightLeg" className="right-leg"></div>
];

export function HangmanDrawing({ wrongGuesses }) {
    return (
        <div className="hangman-drawing">
            <div className="rope"/>
            <div className="bar-top"/>
            <div className="bar-up"/>
            <div className="bar-bottom"/>
        </div>
    );
}