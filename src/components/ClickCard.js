import React from 'react';

import './clickcards.css'


function ClickCard({ alt, src, display, doSpin, doDanger, onAnimationEnd,...props }) {
  const className=[
    "clickCard",
    doSpin ? 'spin' : '',
    doDanger ? 'danger' :''
  ];
  return (
    <button

      className={className.join(' ')}

      style={{
        display: display ? null: 'none'
      }}

      {...props}>

      <img alt={alt} src={src} onAnimationEnd={onAnimationEnd}/>

    </button>
  );
}


export default ClickCard;