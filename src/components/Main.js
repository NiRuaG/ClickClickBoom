import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';
import shuffle from './../util/shuffle';


import './main.css'
import Header from './Header';


class Main extends Component {
  state = { ...Main.stateReset, //* primitives
    bestScore: 0,
    numbers: [...Array(nameMap.length).keys()].splice(1), //! '..splice(1)' because 0-index name mapping 
    clickedSet: new Set(),
    unclicked: [...Array(nameMap.length).keys()].splice(1) //% to assure there will always be a new (not previously clicked) 'mon in the lineup 
  }

  componentWillMount(){
    this.shuffleTiles();
  }

  shuffleTiles() {
    // start with the general array of [1,2,3,4,...]
    const numbers = [...Array(nameMap.length).keys()].splice(1); //! '..splice(1)' because 0-index name mapping

    // pick a random 'mon-number from those that have NOT been clicked
    const guaranteedNotClicked = this.state.unclicked [
      Math.floor(Math.random() * this.state.unclicked.length)
    ];

    // take that un-clicked number OUT of the general array
    numbers.splice(guaranteedNotClicked - 1, 1); //! -1 because 0-index mapping

    // shuffle the rest of array (that is less 1, without the un-clicked)
    shuffle(numbers);

    // find a random spot in the lineup (first 12 spots) to put the unclicked 'mon-number back in
    const randomSpotInLineup = Math.floor(Math.random()*12);

    // insert the un-clicked 'mon-number back into numbers array (somewhere within the first 12 lineup)
    numbers.splice(randomSpotInLineup, 0, guaranteedNotClicked);

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

    // Remove this keyNum from array of unclicked
    const unclicked = [...this.state.unclicked];
    unclicked.splice(keyNum-1, 1); //! keyNum-1 because 0-index name mapping

    // Score updates
    let { curScore, bestScore } = this.state;
    if (++curScore > bestScore) {
      bestScore = curScore;
    }


    this.setState({
      curScore,
      bestScore,
      clickedSet,
      unclicked
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
          unclicked: [...Array(nameMap.length).keys()].splice(1)
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