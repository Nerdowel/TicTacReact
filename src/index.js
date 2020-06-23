import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import './index.css';

function Square(props) {
  return (
    <button
      className={props.win ? "winsquare": "square"}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      win={this.props.winners.includes(i)}
      onClick={() => this.props.onClick(i)}
    />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    this.props.newHistory(this.props.stepCount)
    const history = this.props.hist;
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.props.next ? "X" : "O";
    this.props.addToHistory(squares);
    console.log('Before' +this.props.stepCount)
    this.props.setNewStep(history.length);
    this.props.next ? this.props.isOReallyNext() : this.props.isXReallyNext();


  }

  jumpTo(step) {
    this.props.setNewStep(step);
    step % 2 === 0 ? this.props.isXReallyNext() : this.props.isOReallyNext();
  }

  render() {
    const history = this.props.hist;
    const current = history[this.props.stepCount];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to move #" + move :
        "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let winSquares = [];
    if (winner) {
      status = "Winner: " + winner.winner;
      winSquares = winner.winningSquares;
    } else {
      status = "Next player: " + (this.props.next ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winners={winSquares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      };
    }
  }
  return null;
}

// ========================================

//Constants
const XISNEXT = 'XISNEXT';
const OISNEXT = 'OISNEXT'
const STEPINCREMENT = 'STEPINCREMENT';
const STEPSET = 'STEPSET';
const NEWHISTORY = 'NEWHISTORY';
const ADDHISTORY = 'ADDHISTORY';
//Action Events
const isXNext = () => {
  return {
    type: XISNEXT,
  }
};
const isONext = () => {
  return {
    type: OISNEXT
  }
};
const nextStep = () => {
  return {
    type: STEPINCREMENT,
  }
};
const setStep = (i) => {
  return {
    type: STEPSET,
    stepIndex: i,
  }
};
const addHistory = (sq) => {
  return {
    type: ADDHISTORY,
    squares: sq,
  }
};
const newHistory = (index) => {
  return {
    type: NEWHISTORY,
    index: index,
  }
};
//Reducers
const isXNextReducer = (state = { xIsNext: true }, action) => {
  switch (action.type) {
    case XISNEXT:
      return ({ xIsNext: true });
    case OISNEXT:
      return ({ xIsNext: false });
    default:
      return state;
  }
};

const nextStepReducer = (state = { stepNumber: 0 }, action) => {
  switch (action.type) {
    case STEPINCREMENT:
      return { stepNumber: state.stepNumber + 1 };
    case STEPSET:
      return { stepNumber: action.stepIndex };
    default:
      return state;
  }
};

const historyReducer = (state = {
  history: [
    { squares: Array(9).fill(null), }],
}, action) => {
  switch (action.type) {
    case NEWHISTORY:
      return { history: (state.history.slice(0, action.index + 1)) }
    case ADDHISTORY:
      return {
        history: [...state.history, { squares: action.squares }]
      }
    default:
      return state;
  }
};
//MapToProps
const mapStateToProps = (state) => {
  return {
    next: state.xReducer.xIsNext,
    stepCount: state.stepReducer.stepNumber,
    hist: state.histReducer.history,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    isXReallyNext: () => {
      dispatch(isXNext())
    },
    isOReallyNext: () => {
      dispatch(isONext())
    },
    increaseStepCount: () => {
      dispatch(nextStep())
    },
    setNewStep: (i) => {
      dispatch(setStep(i))
    },
    addToHistory: (sq) => {
      dispatch(addHistory(sq))
    },
    newHistory: (index) => {
      dispatch(newHistory(index))
    },
  }
};
//Connecting
const Container = connect(mapStateToProps, mapDispatchToProps)(Game);
// Combining reducers
const rootReducer = combineReducers({
  xReducer: isXNextReducer,
  stepReducer: nextStepReducer,
  histReducer: historyReducer,
});
//Store
const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')
);
