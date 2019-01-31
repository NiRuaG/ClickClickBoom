import React, { Component } from 'react';

import ClickCard from './ClickCard';

import nameMap from './../names';

import shuffle from './../util/shuffle';

class Main extends Component {
  state = {
    curScore: 0,
    maxScore: 12,
    bestScore: 0,
    numbers: [...Array(13).keys()].splice(1),
    clicked: [],
    clickedSet: new Set()
  }


  handleClick(keyNum) {
    let { curScore } = this.state;


    const numbers = [...this.state.numbers];
    shuffle(numbers);

    const clicked = [...this.state.clicked];

    const clickedSet = new Set(this.state.clickedSet);
    if (clickedSet.has(keyNum)) {
      clicked.push(`DUPLICATE\n${nameMap[keyNum]}`);
    }
    else {
      ++curScore;
      clickedSet.add(keyNum);
      clicked.push(nameMap[keyNum]);
    }

    this.setState({
      curScore,
      numbers,
      clicked,
      clickedSet
    });
  }

  render() {

    const clickcards = this.state.numbers.map(n => {
      const name = nameMap[n];
      return (
        <ClickCard
          key={n}
          alt={name}
          src={`img/${String(n).padStart(3,'0')} ${name}.png`}
          onClick={() => this.handleClick(n)}
          /> 
      )
    });


    return (
      <>
        <header className="App-header">
          <p>
            Current Score: {`${this.state.curScore} of ${this.state.maxScore}`}
          </p>
          <p>
            Best Score: {this.state.bestScore}
          </p>
        </header>

        <aside style={{
          float: 'left',
          display: 'flex',
          flexFlow: 'column nowrap'
        }}>
          {this.state.clicked.map(mon => <p>{mon}</p>)}
        </aside>

        <main style={{
          maxWidth: '50rem',
          margin: '0 auto',
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'space-around',
        }}>
          {clickcards}
        </main>
      </>
    )
  }
}


export default Main;