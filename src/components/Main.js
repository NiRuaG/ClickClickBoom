import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';
import shuffle from './../util/shuffle';

import reactLogo from './../reactLogo.svg';

import './main.css'


class Main extends Component {
  state = { ...Main.stateReset, //* primitives
    bestScore: 0,
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


    const { title, bestScore, curScore, maxScore, clickLocked } = this.state;
    const headerProps = { title, bestScore, curScore, maxScore };

    return (
      <div style={{
         userSelect: 'none',
      MozUserSelect: 'none',
      }}>
      
       <Header {...headerProps} />

          <main style={{
            maxWidth: '53rem',
            margin: '0 auto',
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-around',
            

            pointerEvents: clickLocked && 'none'
          }}>
            {clickcards}
          </main>

      </div>
    )

  }

}

//* PRIMITIVE properties on reset
Main.stateReset = {
  maxScore: nameMap.length-1, //! '-1' because 0-index name mapping
  clickLocked: false,
  selected: NaN,
  duplicate: NaN,
  title: "Gotta Click 'em All Just Once",
  curScore: 0,
}


export default Main;