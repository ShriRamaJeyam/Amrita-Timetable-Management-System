import React from 'react';
import { Typography, Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Router from "./pages/Router"
import { Switch,Route,Redirect,BrowserRouter } from "react-router-dom";
function App() {
  return (
    <div>
      <div style={{width:"100%",padding:"10px",backgroundColor:"azure",borderBottom:"1px solid black"}}>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          <Grid>
            <a href="/">
              <img style={{height:"80px",paddingRight:"20px"}} alt="amrita" src="/logo.png" />
            </a>
          </Grid>
          <Grid>
            <Typography variant="h2" color="textPrimary">Amrita Timetable Management System</Typography>
          </Grid>
        </Grid>
      </div>
      <div style={{width:"95%",height:"100%", padding:"3%"}}>
        <Router />
      </div>
    </div>
  );
}

export default App;
