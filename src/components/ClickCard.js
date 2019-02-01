import React from 'react';

import './clickcards.css'


function ClickCard({ alt, src, display, onAnimationEnd,...props }) {
  return (
    <button
      className={"clickCard"}
      style={{
        display: !display && 'none'
      }}
      {...props}>
      <img alt={alt} src={src} onAnimationEnd={onAnimationEnd}/>
    </button>
  );
}


export default ClickCard;