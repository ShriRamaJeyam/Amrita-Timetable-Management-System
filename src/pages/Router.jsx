import React from 'react';
import { Switch,Route,Redirect} from "react-router-dom";
import Homepage from "./index";
import ListingRegions from "./Regions/list";
import CreateRegion from "./Regions/create"
import ListingPrograms from "./Programs/list";
import CreatePrograms from "./Programs/create"
import ListingDepartments from "./Departments/list";
import CreateDepartments from "./Departments/create"
import ListingDayLists from "./DayLists/list";
import CreateDayLists from "./DayLists/create"
import Settings from "./Settings/index"

const Router = () => {
    return (
        <Switch>
            <Route path="/omnamonaarayanaya" component={() => { return (<h1>Om Namo Naarayanaya</h1>);}} />
            <Route path="/Regions/:_id/edit" component={() => {return (<CreateRegion edit={true} />);}} />
            <Route path="/Regions/create" component={() => {return (<CreateRegion />);}} />
            <Route path="/Regions" component={() => {return (<ListingRegions />);}} />
            <Route path="/Departments/:_id/edit" component={() => {return (<CreateDepartments edit={true} />);}} />
            <Route path="/Departments/create" component={() => {return (<CreateDepartments />);}} />
            <Route path="/Departments" component={() => {return (<ListingDepartments />);}} />
            <Route path="/Programs/:_id/edit" component={() => {return (<CreatePrograms edit={true} />);}} />
            <Route path="/Programs/create" component={() => {return (<CreatePrograms />);}} />
            <Route path="/Programs" component={() => {return (<ListingPrograms />);}} />
            <Route path="/DayLists/:_id/edit" component={() => {return (<CreateDayLists edit={true} />);}} />
            <Route path="/DayLists/create" component={() => {return (<CreateDayLists />);}} />
            <Route path="/DayLists" component={() => {return (<ListingDayLists />);}} />
            <Route path="/Settings" component={()=>{return (<Settings />);}} />
            <Route path="/" component={()=>{return (<Homepage />);}} />
            <Redirect to="/" />
        </Switch>
    );

}

export default  Router;
