import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'
import './index.css';

function Square(props) {
      return (
        <button 
        className="square" 
        onClick = {() => props.onClick()}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (<Square
       value={this.props.squares[i]}
       onClick= {() => this.props.onClick(i)} 
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
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
        };
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.props.next.xIsNext ? "X" : "O";
        this.props.next.xIsNext ? this.props.isOReallyNext() : this.props.isXReallyNext();
        this.setState(
            {
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
            }
        );
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        const moves = history.map((step,move) => {
            const desc = move ?
            "Go to move #" + move :
            "Go to game start";
            return (
                <li key ={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner){
            status = "Winner: " + winner;
        }else{
            status = "Next player: " + (this.props.next.xIsNext ? "X" : "O");
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board
            squares= {current.squares}
            onClick= {(i) => this.handleClick(i)} />
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
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
 /* 
 const WINNER = 'WINNER';
  const declareWinner = (status) =>{
    return {
      type: WINNER,
    }
  };
  const winnerReducer = (state = {}, action) =>{
    switch(action.type){
      
    }
  };
    this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
  */

  //Constants
  const XISNEXT = 'XISNEXT';
  const OISNEXT = 'OISNEXT'
  // const NEXTSTEP = 'NEXTSTEP';
  //Action Events
  const isXNext = () => {
    return {
      type: XISNEXT,
    }
  };
  const isONext = () => {
    return{
      type: OISNEXT
    }
  }
  //Reducers
  const isXNextReducer = (state = {xIsNext: true}, action) => {
    switch(action.type) {
      case XISNEXT:
        return ({xIsNext: true});
      case OISNEXT:
        return ({xIsNext: false})
      default:
        return state;
    }
  };
  //MapToProps
  const mapStateToProps = (state) => {
    return {
      next: state
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
    }
  };
  //Connecting
  const Container = connect(mapStateToProps,mapDispatchToProps)(Game);
  //Store
  const store = createStore(isXNextReducer);

  ReactDOM.render(
    <Provider store = {store}>
        <Container />
        </Provider>,
    document.getElementById('root')
  );
  