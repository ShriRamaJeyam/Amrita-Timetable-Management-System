import React from 'react';
import { Switch,Route,Redirect} from "react-router-dom";
import Homepage from "./index";
import ListingRegions from "./Regions/list";
import CreateRegion from "./Regions/create"

const Router = () => {
    return (
        <Switch>
            <Route path="/omnamonaarayanaya" component={() => { return (<h1>Om Namo Naarayanaya</h1>);}} />
            <Route path="/Regions/:_id/edit" component={() => {return (<CreateRegion edit={true} />);}} />
            <Route path="/Regions/create" component={() => {return (<CreateRegion />);}} />
            <Route path="/Regions" component={() => {return (<ListingRegions />);}} />
            <Route path="/" component={()=>{return (<Homepage />);}} />
            <Redirect to="/" />
        </Switch>
    );

}

export default  Router;
