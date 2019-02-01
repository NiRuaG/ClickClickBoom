import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';
import shuffle from './../util/shuffle';

import './main.css'


class Main extends Component {
  state = {
    maxScore: nameMap.length-1, //! '-1' because 0-index name mapping

    locked: false,
    selected: NaN,
    duplicate: NaN,

    title: "Gotta Click em All, but Once and Once Only",

    curScore: 0,
    bestScore: 0,
    numbers: [...Array(nameMap.length).keys()].splice(1), //! '..splice(1)' because 0-index name mapping
    clickedSet: new Set()
  }

  componentWillMount(){
    this.shuffleTiles();
  }

  handleClick(keyNum) {

    this.setState({ locked: true });

    if (this.state.clickedSet.has(keyNum)) {
      this.setState({ 
        title: `You already captured ${nameMap[keyNum]}`,
        duplicate: keyNum
      })
    }

    else {
      this.setState({ selected: keyNum });
    }

  }

  shuffleTiles() {
    // Shuffle the tiles
    const numbers = [...this.state.numbers];
    shuffle(numbers);
    this.setState({ numbers });
  }

  updateSet(keyNum) {
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

    this.setState({ locked: false });


    switch(animationName) {

      case 'spin':
        this.setState({ selected: NaN });
        this.updateSet(keyNum)
        break;

      case 'danger':
        this.setState({
          clickedSet: new Set(),
          curScore: 0,
          duplicate: NaN,
          title: "Gotta Click em All, but Once and Once Only"
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
          doSpin={this.state.selected === num}
          doDanger={this.state.duplicate === num}

          display={i < 12} //! only show first 12
          src={`img/${String(num).padStart(3,'0')} ${name}.png`}
          onClick={() => this.handleClick(num)}
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
          <h3>{this.state.title}</h3>
          <p>
            Best Score: <span id="bestScore">{this.state.bestScore}</span>
          </p>
          <p>
            You caught <span id="curScore">{this.state.curScore}</span>{` of ${this.state.maxScore}`}
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

      </div>
    )
  }
}


export default Main;