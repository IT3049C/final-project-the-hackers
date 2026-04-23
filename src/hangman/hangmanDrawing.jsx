import React from "react";
import "./hangman.css";

const bodyParts = [
  <div key="head" className="head"></div>,
  <div key="body" className="body-line"></div>,
  <div key="leftArm" className="left-arm"></div>,
  <div key="rightArm" className="right-arm"></div>,
  <div key="leftLeg" className="left-leg"></div>,
  <div key="rightLeg" className="right-leg"></div>,
];

export function HangmanDrawing({ mistakes }) {
  return (
    <div className="hangman-drawing">
      <div className="rope" />
      <div className="bar-top" />
      <div className="bar-up" />
      <div className="bar-bottom" />
      {/* Slices the array to render parts based on wrong guess count */}
      {bodyParts.slice(0, mistakes)}
    </div>
  );
}
