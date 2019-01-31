import React from 'react';

import './clickcards.css'


function ClickCard({ alt, src, ...props }) {
  return (
    <button className="clickCard" {...props}>
      <img alt={alt} src={src}/>
    </button>
  );
}




export default ClickCard;