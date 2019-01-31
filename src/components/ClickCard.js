import React from 'react';

import './clickcards.css'


function ClickCard({ alt, src, display, ...props }) {
  return (
    <button
      className="clickCard"
      style={{
        display: !display && 'none'
      }}
      {...props}>
      <img alt={alt} src={src}/>
    </button>
  );
}




export default ClickCard;