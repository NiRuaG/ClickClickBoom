import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';
import shuffle from './../util/shuffle';

import reactLogo from './../reactLogo.svg';

import './main.css'


class Main extends Component {
  state = { ...Main.stateReset, //* primitives
    numbers: [...Array(nameMap.length).keys()].splice(1), //! '..splice(1)' because 0-index name mapping
    clickedSet: new Set()
  }

  componentWillMount(){
    this.shuffleTiles();
  }

  shuffleTiles() {
    // Shuffle the tiles
    const numbers = [...this.state.numbers];
    shuffle(numbers);
    this.setState({ numbers });
  }

  handleClick(keyNum) {
    if (this.state.clickLocked) return;
    this.setState({ clickLocked: true });

    if (this.state.clickedSet.has(keyNum)) {
      this.setState({ 
        duplicate: keyNum,
        title: `You already clicked ${nameMap[keyNum]}`
      })
    }

    else {
      this.setState({
        selected: keyNum,
        title: `You clicked ${nameMap[keyNum]}`
      });
    }

  }

  
  updateSetAndScore(keyNum) {
    // Add this new keyNum to Set
    const clickedSet = new Set(this.state.clickedSet);
    clickedSet.add(keyNum);

    // Score updates
    let { curScore, bestScore } = this.state;
    if (++curScore > bestScore) {
      bestScore = curScore;
    }


    this.setState({
      curScore,
      bestScore,
      clickedSet
    });

    this.shuffleTiles();
  }


  handleAnimEnd({ animationName }, keyNum) {
    if (animationName === 'zoom') return;

    this.setState({ clickLocked: false });


    switch(animationName) {

      case 'spin': // after spin animation, shuffle the board
        this.setState({ selected: NaN });
        this.updateSetAndScore(keyNum);
        break;

      case 'danger': // after danger animation, reset the game
        this.setState({...Main.stateReset,
          clickedSet: new Set(),
        });

        this.shuffleTiles();
        break;

      default:;

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
          src={`img/${String(num).padStart(3,'0')} ${name}.png`}

          display={i < 12} //! only show first 12
          
          onClick={() => this.handleClick(num)}

          doDanger={this.state.duplicate === num}
          doSpin={this.state.selected === num}
          onAnimationEnd={(event) => this.handleAnimEnd(event, num)}
        />
      )
    });


    return (
      <div style={{
         userSelect: 'none',
      MozUserSelect: 'none',
      }}>
      
        <header className="App-header">
          
          <a href="https://github.com/NiRuaG/ClickClickBoom">
          <img src={reactLogo } className="App-logo" alt="React Logo" />
          <svg 
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="github"
            className="svg-inline--fa fa-github fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
          </svg>
          </a>

          <h3>{this.state.title}</h3>
          <p>
            Best Score: <span id="bestScore">{this.state.bestScore}</span>
          </p>
          <p>
            You clicked <span id="curScore">{this.state.curScore}</span>{` of ${this.state.maxScore}`}
          </p>
        </header>

          <main style={{
            maxWidth: '53rem',
            margin: '0 auto',
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-around',
            

            pointerEvents: this.state.clickLocked && 'none'
          }}>
            {clickcards}
          </main>

      </div>
    )
  }
}

//* primitive properties on reset
Main.stateReset = {
  maxScore: nameMap.length-1, //! '-1' because 0-index name mapping
  clickLocked: false,
  selected: NaN,
  duplicate: NaN,
  title: "Gotta Click 'em All Just Once",
  curScore: 0,
  bestScore: 0,
}


export default Main;