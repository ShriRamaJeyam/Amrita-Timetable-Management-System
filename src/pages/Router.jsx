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
import ListingTeachers from "./Teachers/list";
import CreateTeachers from "./Teachers/create"
import ListingTimeSlots from "./TimeSlots/list";
import CreateTimeSlots  from "./TimeSlots/create"
import ListingRooms from "./Rooms/list";
import CreateRooms  from "./Rooms/create"
import ListingTimeSlotGroups from "./TimeSlotGroups/list";
import CreateTimeSlotGroups  from "./TimeSlotGroups/create";
import TeacherGroups from  "./TeacherGroups/index";
import RoomGroups from  "./RoomGroups/index";
import Sections from './Sections/index';
import Semesters from "./Semesters/index";
import SectionGroups from "./SectionGroups/index";
const tableMap = { 
    TeacherGroups,
    RoomGroups,
    Sections,
    Semesters,
    SectionGroups
};

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
            <Route path="/Teachers/:_id/edit" component={() => {return (<CreateTeachers edit={true} />);}} />
            <Route path="/Teachers/create" component={() => {return (<CreateTeachers />);}} />
            <Route path="/Teachers" component={() => {return (<ListingTeachers />);}} />
            <Route path="/TimeSlots/:_id/edit" component={() => {return (<CreateTimeSlots edit={true} />);}} />
            <Route path="/TimeSlots/create" component={() => {return (<CreateTimeSlots />);}} />
            <Route path="/TimeSlots" component={() => {return (<ListingTimeSlots />);}} />
            <Route path="/Rooms/:_id/edit" component={() => {return (<CreateRooms edit={true} />);}} />
            <Route path="/Rooms/create" component={() => {return (<CreateRooms />);}} />
            <Route path="/Rooms" component={() => {return (<ListingRooms />);}} />
            <Route path="/TimeSlotGroups/:_id/edit" component={() => {return (<CreateTimeSlotGroups edit={true} />);}} />
            <Route path="/TimeSlotGroups/create" component={() => {return (<CreateTimeSlotGroups />);}} />
            <Route path="/TimeSlotGroups" component={() => {return (<ListingTimeSlotGroups />);}} />
            {
                ["TeacherGroups","RoomGroups","Sections","Semesters","SectionGroups"].map((tbl,idx) => {
                    const { Create, Listing } = tableMap[tbl];
                    return ([
                        <Route path={"/"+tbl+"/:_id/edit"} component={() => {return (<Create edit={true} />);}} />,
                        <Route path={"/"+tbl+"/create"} component={() => {return (<Create />);}} />,
                        <Route path={ "/" + tbl } component={() => {return (<Listing />);}} />,
                    ]);
                })
            }
            <Route path="/Settings" component={()=>{return (<Settings />);}} />
            <Route path="/" component={()=>{return (<Homepage />);}} />
            <Redirect to="/" />
        </Switch>
    );

}

export default  Router;
