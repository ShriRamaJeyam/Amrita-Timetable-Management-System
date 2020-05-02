import React from 'react';
import { Switch,Route,Redirect} from "react-router-dom";
import Homepage from "./index";
import ListingRegions from "./Regions/list";

const Router = () => {
    return (
        <Switch>
            <Route path="/omnamonaarayanaya" component={() => { return (<h1>Om Namo Naarayanaya</h1>);}} />
            <Route path="/Regions" component={() => {return (<ListingRegions />);}} />
            <Route path="/" component={()=>{return (<Homepage />);}} />
            <Redirect to="/" />
        </Switch>
    );

}

export default  Router;
