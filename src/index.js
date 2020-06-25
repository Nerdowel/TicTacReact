import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import {Game} from './game.js'

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
