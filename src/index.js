import React from 'react';
import ReactDOM from 'react-dom';
import Home from './containers/Home/Home';
import Board from './components/Board/Board'
import BoardNew from './components/BoardNew/BoardNew';
import reportWebVitals from './reportWebVitals';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BoardNew />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
