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
import Courses from "./Courses/index";
import SemesterRegistrations from "./SemesterRegistrations/index";
import Electives from "./Electives/index";
import SectionRegistrations from "./SectionRegistrations/index";
import Solutions from "./Solutions/index";
import SolutionLectures from "./SolutionLectures/index";
import StudentTimetable from "./StudentTimetable/index";
import TimeTablePage from "../components/TimeTable";
const tableMap = { 
    TeacherGroups,
    RoomGroups,
    Sections,
    Semesters,
    SectionGroups,
    Courses,
    Electives,
    SectionRegistrations,
    Solutions,
    SolutionLectures,
    StudentTimetable
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
            <Route path="/SemesterRegistrations" component={() => {return (<SemesterRegistrations />);}} />
            {
                ["TeacherGroups","RoomGroups","Sections","Semesters","SectionGroups","Courses","Electives","SectionRegistrations","Solutions","SolutionLectures"].map((tbl,idx) => {
                    const { Create, Listing } = tableMap[tbl];
                    return ([
                        <Route path={"/"+tbl+"/:_id/edit"} component={() => {return (<Create edit={true} />);}} />,
                        <Route path={"/"+tbl+"/create"} component={() => {return (<Create />);}} />,
                        <Route path={ "/" + tbl } component={() => {return (<Listing />);}} />,
                    ]);
                })
            }
            
            <Route path="/StudentTimetable" component={() => {
                return (<TimeTablePage
                    isSection={true}
                    FieldName="Section"
                    sqliser={(a,b) =>{
                        return `SELECT * from SolutionLectures where SolutionID = ${a} and SectionID = ${b} or SectionID in (select DISTINCT(SectionGroupID) from SectionGroupMembers where SectionID=${b});`;
                    }}
                    seleSQL={`(Select d.id as id ,CONCAT(b.ProgramName,' ',c.SemesterNumber,' ',a.DepartmentName,' ',d.SectionName) as [name] from Departments a,Programs b,Semesters c, Sections d where d.SemesterID = c.id and c.ProgramID= b.id and d.DepartmentID=a.id)`}
                />);
            }} />
            <Route path="/TeacherTimetable" component={() => {
                return(<TimeTablePage
                isSection={false}
                FieldName="Teacher"
                sqliser={(a,b) =>{
                    return `SELECT * from SolutionLectures where SolutionID = ${a} and Faculty = ${b} or Faculty in (select DISTINCT(TeacherGroupID) from TeacherGroupMembers where TeacherID=${b});`;
                }}
                seleSQL="select id,TeacherName as [name] from Teachers;"
                />);
            }} />
            <Route path="/RoomTimetable" component={() => {
                return(<TimeTablePage
                isSection={false}
                FieldName="Room"
                sqliser={(a,b) =>{
                    return `select * from SolutionLectures where Room = ${b} and SolutionID = ${a};`;
                }}
                seleSQL="select id,CONCAT(RoomDescription,'',CONCAT(' ',Wing,'-',FloorNo,RIGHT(CONCAT('000',RoomNo),2),'')) as [name] from Rooms;"
                />);
            }} />
                



            <Route path="/Settings" component={()=>{return (<Settings />);}} />
            <Route path="/" component={()=>{return (<Homepage />);}} />
            <Redirect to="/" />
        </Switch>
    );

}

export default  Router;
