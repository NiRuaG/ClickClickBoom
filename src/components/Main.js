import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';

import shuffle from './../util/shuffle';

import './main.css'

class Main extends Component {
  state = {
    maxScore: nameMap.length-1, //! '-1' because 0-index name mapping

    locked: false,

    curScore: 0,
    bestScore: 0,
    numbers: [...Array(nameMap.length).keys()].splice(1), //! '..splice(1)' because 0-index name mapping
    clickedSet: new Set()
  }


  handleClick(keyNum) {

    if (this.state.clickedSet.has(keyNum)) {
      this.setState({
        clickedSet: new Set(),
        curScore: 0
      });
    }

    else {

      // Add this new keyNum to Set
      const clickedSet = new Set(this.state.clickedSet);
      clickedSet.add(keyNum);

      // Shuffle the tiles
      const numbers = [...this.state.numbers];
      shuffle(numbers);

      // Score updates
      let { curScore, bestScore } = this.state;
      if (++curScore > bestScore) {
        bestScore = curScore;
      }


      this.setState({
        curScore,
        bestScore,
        numbers,
        clickedSet
      });

    }
    
  }

  render() {

    const clickcards = this.state.numbers.map( (num, i) => {
      const name = nameMap[num];
      //% We have all the click cards "render to DOM" and just 'toggle' the display property in its styling as a prop
      //% seems to help with not reloading images
      return (
        <ClickCard
          key={num}
          alt={name}
          display={i < 12} //! only show first 12
          src={`img/${String(num).padStart(3,'0')} ${name}.png`}
          onClick={() => this.handleClick(num)}
          />
      )
    });


    return (
      <>
        <header className="App-header">
          <p>
            Current Score: <span id="curScore">{this.state.curScore}</span>{` of ${this.state.maxScore}`}
          </p>
          <p>
            Best Score: <span id="bestScore">{this.state.bestScore}</span>{` of ${this.state.maxScore}`}
          </p>
        </header>

        <main style={{
          maxWidth: '53rem',
          margin: '0 auto',
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'space-around',
          pointerEvents: this.state.locked && 'none'
        }}>
          {clickcards}
        </main>
      </>
    )
  }
}


export default Main;