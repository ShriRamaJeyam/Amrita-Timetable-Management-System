import React from "react";
import { Typography } from "@material-ui/core";
import { hostname, apiURL } from "./apiURL";
import styled from 'styled-components';
import * as axios_org from "axios";
import { 
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@material-ui/core";

const axios= axios_org.default;
const Table = styled.div`
    min-width: 1300px;
    border: 1px solid black;
`;
const Day = styled.div`
    border: 1px solid black;
    display: flex;
    position: relative;
    min-height: 800px;
`;
const Hour = styled.div`
    border: 1px solid black;
    height: 100%;
    position:absolute;
    top:0,
    bottom:0,
    word-break:break-word;
`;

class TimeTable extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0
        };
        this.apiHit = this.apiHit.bind(this);
        this.getText=this.getText.bind(this);
        this.lectureOnADay=this.lectureOnADay.bind(this);
        axios.post(hostname+'/api/SQL/',{sql:props.sqlfn(props.sol,props.opt)}).then(res=>{
            this.setState({Lectures:res.data});
            this.apiHit();
        });
        axios.post(apiURL.DayLists.list,{}).then(res=>{
            this.setState({Days:res.data});
            this.apiHit();
        });
        [
            {
                sql:`(select TeacherGroupID as [id],STRING_AGG(TeacherName, ', ') as [Teacher] from TeacherGroupMembers,Teachers where Teachers.id = TeacherGroupMembers.TeacherID group by TeacherGroupID) union (select id,TeacherName as [Teacher] from Teachers);`,
                type:"map",
                field:"Teacher",
                fn:false
            },
            {
                sql:`(SELECT id,CONCAT('[',starter,',',ender,']') as slot from TimeSlots where hasBreak=0) union (SELECT id,CONCAT('[',starter,',',ender,',',startBreak,',',endBreak,']') as slot from TimeSlots where hasBreak=1);`,
                type:"map",
                field:"slot",
                fn : JSON.parse
            },
            {
                sql:`select id,CONCAT(RoomDescription,'',CONCAT(' ',Wing,'-',FloorNo,RIGHT(CONCAT('000',RoomNo),2),'')) as Room from Rooms;`,
                type:"map",
                field:"Room",
                fn:false
            },
            {
                sql:`(Select d.id as id ,CONCAT(b.ProgramName,' ',c.SemesterNumber,' ',a.DepartmentName,' ',d.SectionName) as Section from Departments a,Programs b,Semesters c, Sections d where d.SemesterID = c.id and c.ProgramID= b.id and d.DepartmentID=a.id) UNION (select id,SectionGroupName as Section From SectionGroups);`,
                type:"map",
                field:"Section",
                fn:false
            },
            {
                sql:`select id,CONCAT(CourseName,' ',CourseCode) as Course from Courses;`,
                type:"map",
                field:"Course",
                fn:false
            }
        ].forEach(req =>{
            axios.post(hostname+'/api/SQL/',{
                sql:req.sql
            }).then(result => {
                let newState = {};
                let map = {};
                result.data.forEach(rec => { 
                    if(!req.fn || typeof(req.fn) !== "function")
                    map[rec.id] = rec[req.field];
                    else
                    map[rec.id] = req.fn(rec[req.field]);
                });
                newState[req.field+"Map"] = map;
                this.setState(newState);
                this.apiHit();
            })
        });
    }

    getText = (lecture) =>{
        const {TeacherMap,RoomMap,CourseMap,SectionMap} = this.state;
        return(
            <Typography variant="caption" color="primary">
                {CourseMap[lecture.CourseID]}
                <br />
                {TeacherMap[lecture.Faculty]}
                <br />
                {RoomMap[lecture.Room]}
                <br />
                {SectionMap[lecture.SectionID]}
                <br />
            </Typography>
        );
    }

    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1
        }));
    };

    lectureOnADay = (id) => {
        const {Lectures , slotMap} = this.state;
        const {isSection} = this.props;

        return (
            <React.Fragment>
                {Lectures.map(lecture => {
                    if(lecture.Day === id)
                    {
                        var result = null;
                        if(isSection)
                        {
                            if(lecture.CourseID <= 0)
                            {
                                result = Lectures.map(lec =>{
                                    if(lec.Parent === lecture.id)
                                    {
                                        console.log(lecture);
                                        return this.getText(lec);
                                    }
                                    return null;
                                });
                            }
                            else if(lecture.Parent === null)
                            {
                                result = this.getText(lecture);
                            }
                        }
                        else
                        {
                            if(lecture.CourseID > 0)
                            {
                                result = this.getText(lecture);
                            }
                        }
                        if(result)
                        {
                            var slot = slotMap[lecture.TimeSlot];
                            if(slot.length == 2)
                            {
                                var left=Math.round((slot[0]/470.00)*1200+100),width=Math.round(((slot[1]-slot[0])/470.00)*1200);
                                left = left + "px";
                                width= width + "px";
                                return (
                                    <Hour style={{left,width}}>
                                        {result}
                                    </Hour>
                                );
                            }
                            if(slot.length == 4)
                            {
                                var retu = [];
                                {
                                    var left=Math.round((slot[0]/470.00)*1200+100),width=Math.round(((slot[2]-slot[0])/470.00)*1200);
                                    left = left + "px";
                                    width= width + "px";
                                    retu.push(
                                        <Hour style={{left,width}}>
                                            {result}
                                        </Hour>
                                    );
                                }
                                {
                                    var left=Math.round((slot[2]/470.00)*1200+100),width=Math.round(((slot[3]-slot[2])/470.00)*1200);
                                    left = left + "px";
                                    width= width + "px";
                                    retu.push(
                                        <Hour style={{left,width}}>
                                            
                                        </Hour>
                                    );
                                }
                                {
                                    var left=Math.round((slot[3]/470.00)*1200+100),width=Math.round(((slot[1]-slot[3])/470.00)*1200);
                                    left = left + "px";
                                    width= width + "px";
                                    retu.push(
                                        <Hour style={{left,width}}>
                                            {result}
                                        </Hour>
                                    );
                                }
                                return retu;
                            }
                        }
                        return null;
                    }
                    return null;
                })}
            </React.Fragment>
        );
    };

    render()
    {
        const { Days } =this.state;
        if(this.state.apiHits !== 7)
            return null;
        return(
            <Table>
                {Days.map(day=>{
                    return (
                        <Day>
                            <Hour style={{left:"0px",width:"100px"}}>
                                {day.DayName}
                            </Hour>
                            {this.lectureOnADay(day.id)}
                        </Day>
                    );
                })}
            </Table>
        );
    }
}

class TimeTablePage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            apiHits:0
        };
        this.apiHit = this.apiHit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        axios.post(apiURL.Solutions.list,{}).then(res => {
            this.setState({Sols:res.data});
            this.apiHit();
        });
        axios.post(hostname+'/api/SQL/',{sql:props.seleSQL}).then(res => {
            this.setState({Opts:res.data});
            this.apiHit();
        });
    }

    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1
        }));
    };

    onChangeHandler = (property,value) => {
        var temp ={};
        temp[property]=value;
        this.setState(temp);
    };

    render()
    {
        const { state } = this;
        const {Opt,Sol} = state;
        const {FieldName} =this.props;
        if(this.state.apiHits !== 2)
        {
            return null;
        }
        return (
            <Grid container direction="column" spacing={2}>
                <Grid item container spacing={2} direction="row">
                    <Grid sm={4} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Solution</InputLabel>
                            <Select value={state.Sol} onChange={(event) => { this.onChangeHandler("Sol",event.target.value);}}>
                                {state.Sols.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.SolutionName} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={4} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>{FieldName}</InputLabel>
                            <Select value={state.Opt} onChange={(event) => { this.onChangeHandler("Opt",event.target.value);}}>
                                {state.Opts.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.name} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {
                    (state.Sol?true:false) && (state.Opt?true:false) &&
                    (<Grid item container spacing={2} direction="row">
                        <TimeTable isSection={this.props.isSection} opt={Opt} sol={Sol} sqlfn={this.props.sqliser}>
                        </TimeTable>
                    </Grid>)
                }
            </Grid>
        );
    }
}


export default TimeTablePage;