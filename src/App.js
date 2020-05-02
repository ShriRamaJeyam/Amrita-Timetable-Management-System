import React,{Fragment} from 'react';
import { Typography } from '@material-ui/core';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Fragment>
    <div style={{width:"100%",padding:"10px",backgroundColor:"white"}}>
      <a href="/">
        <img style={{height:"80px"}} alt="amrita" src="/logo.png">
      </img></a>
    </div>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload1.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </Fragment>
  );
}

export default App;
