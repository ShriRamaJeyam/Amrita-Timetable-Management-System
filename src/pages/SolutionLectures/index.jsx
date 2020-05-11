// React
import React from "react";
import { withRouter } from "react-router-dom";

// Material UI
import { 
    TextField,
    Button,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { Alert } from "@material-ui/lab";

// Others Modules
import * as axios_org from "axios";


// This Project
import { appURL } from "../../components/appURL";
import { apiURL } from "../../components/apiURL";

const axios= axios_org.default;
const table = "SolutionLectures"
const api = apiURL[table];
const app = appURL[table];

class Create extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0,
            apiFulfilled:false,
            error:false,
            errorMessage:"",
            data : {    
                SolutionID:null,
                Faculty:null,
                SectionID:null,
                CourseID:null,
                TimeSlotSource:null,
                RoomSource:null,
                DaySource:"[]",
                TimeSlot:null,
                Room:null,
                Day:null,
                Parent:null
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(api.get,{id:id}).then(result => {
                    if(result.data.length !== 0)
                    {
                        let data = result.data;
                        this.setState({data,apiFulfilled:true});
                    }
                }
            );

        }
        this.apiHit = this.apiHit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.save = this.save.bind(this);
        [
            {
                url:"Departments",
                type:"map",
                field:"DepartmentName"
            },
            {
                url:"Programs",
                type:"map",
                field:"ProgramName"
            },
            {
                url:"Semesters",
                type:"map",
                field:["ProgramID","SemesterNumber"]
            },
            {
                url:"Sections",
                type:"both",
                field:["SectionName","SemesterID","DepartmentID"]
            },
            {
                url:"Solutions",
                type:"both",
                field:"SolutionName"
            },
            {
                url:"TimeSlotGroups",
                type:"both",
                field:"TimeSlotGroupName"
            },
            {
                url:"TimeSlots",
                type:"both",
                field:"TimeSlotName"
            },
            {
                url:"Teachers",
                type:"both",
                field:"TeacherName"
            },
            {
                url:"TeacherGroups",
                type:"both",
                field:"TeacherGroupName"
            },
            {
                url:"RoomGroups",
                type:"both",
                field:"RoomGroupName"
            },
            {
                url:"Rooms",
                type:"both",
                field:["RoomName","RoomDetail"]
            },
            {
                url:"DayLists",
                type:"both",
                field:"DayName"
            },
            {
                url:"Courses",
                type:"both",
                field:"CourseName"
            },
            {
                url:"SectionGroups",
                type:"both",
                field:"SectionGroupName"
            }

        ].forEach(req =>{
            axios.post(apiURL[req.url].list,{}).then(result => {
                let newState = { dummy:1 };
                if(req.type !== "map")
                {
                    newState[req.url+"List"] = result.data;
                }
                if(req.type !== "list")
                {
                    let map = {};
                    result.data.forEach(rec => { 
                        if(typeof(req.field)==="string")
                        map[rec.id] = rec[req.field];
                        else if(Array.isArray(req.field))
                        {
                            let dict = {};
                            req.field.forEach(fld => {
                                dict[fld] =  rec[fld];
                            });
                            map[rec.id] = dict
                        }
                    });
                    newState[req.url+"Map"] = map;
                }
                this.setState(newState);
                this.apiHit();
            })
        });
    }
    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1
        }));
    };
    onChangeHandler = (property,value,root) => {
        if(property === "Parent" && value==="" )
        {
            value = null;
        }
        if(root)
        {
            var temp ={};
            temp[property]=value;
            this.setState(temp);
        }
        else
        {
            let data = this.state.data;
            data[property] = value;
            this.setState({data});
        }
    };
    save = () => {
        const { edit } = this.props;
        const { data } = this.state;
        let url;
        if(edit)
        {
            url = api.edit;
        }
        else
        {
            url = api.create;
        }
        axios.post(url,data).then((result) => {
            window.location = app.list;
        }).catch(result => {
            this.setState({
                error : true,
                errorMessage : result.response.data.error
            });
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled,data,error,errorMessage,apiHits } = this.state;
        const { state } = this;
        console.log(state);
        if( apiHits!==14 || (edit && !apiFulfilled) )
        {
            return null;
        }
        return (
            <Grid fullWidth={true} container direction="column" spacing={2} >
                {
                    error &&
                    (
                        <Grid item>
                            <Alert severity="error">
                                {errorMessage}
                            </Alert>
                        </Grid>
                    )
                }
                <Grid item sm={12} spacing={2} container direction="row">
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Solution</InputLabel>
                            <Select value={data.SolutionID} onChange={(event) => { this.onChangeHandler("SolutionID",event.target.value);}}>
                                {state.SolutionsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.SolutionName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Teacher(s)</InputLabel>
                            <Select value={data.Faculty} onChange={(event) => { this.onChangeHandler("Faculty",event.target.value);}}>
                                {state.TeachersList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.TeacherName}`}</MenuItem>
                                    );
                                })}
                                {state.TeacherGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.TeacherGroupName}`}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Section</InputLabel>
                            <Select value={data.SectionID} onChange={(event) => { this.onChangeHandler("SectionID",event.target.value);}}>
                                {state.SectionsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${state.ProgramsMap[state.SemestersMap[itm.SemesterID].ProgramID]} ${state.DepartmentsMap[itm.DepartmentID]} ${state.SemestersMap[itm.SemesterID].SemesterNumber} ${itm.SectionName}`}</MenuItem>
                                    );
                                })}
                                {state.SectionGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.SectionGroupName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Course</InputLabel>
                            <Select value={data.CourseID} onChange={(event) => { this.onChangeHandler("CourseID",event.target.value);}}>
                                {state.CoursesList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.CourseName} ${itm.CourseCode}`}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>TimeSource</InputLabel>
                            <Select value={data.TimeSlotSource} onChange={(event) => { this.onChangeHandler("TimeSlotSource",event.target.value);}}>
                                {state.TimeSlotGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.TimeSlotGroupName}</MenuItem>
                                    );
                                })}
                                {state.TimeSlotsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.description}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>RoomSource</InputLabel>
                            <Select value={data.RoomSource} onChange={(event) => { this.onChangeHandler("RoomSource",event.target.value);}}>
                                {state.RoomGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.RoomGroupName}</MenuItem>
                                    );
                                })}
                                {state.RoomsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.RoomDetail} ${itm.RoomDescription}`}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Day Source</InputLabel>
                            <Select multiple value={JSON.parse(data.DaySource)} onChange={(event) => { this.onChangeHandler("DaySource",JSON.stringify(event.target.value));}}>
                                {state.DayListsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.DayName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item sm={12} spacing={2} container direction="row">
                <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>TimeSlot</InputLabel>
                            <Select value={data.TimeSlot} onChange={(event) => { this.onChangeHandler("TimeSlot",event.target.value);}}>
                                {state.TimeSlotsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.description}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Room</InputLabel>
                            <Select value={data.Room} onChange={(event) => { this.onChangeHandler("Room",event.target.value);}}>
                                {state.RoomsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.RoomDetail} ${itm.RoomDescription}`}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Day</InputLabel>
                            <Select value={data.Day} onChange={(event) => { this.onChangeHandler("Day",event.target.value);}}>
                                {state.DayListsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.DayName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button color="primary" variant="contained" onClick={this.save}>Save</Button>
                </Grid>
            </Grid>
        );
    }
}
class Listing extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0,
            showDepreciated:false,
            data: []
        };
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this); 
        this.apiHit = this.apiHit.bind(this);  
        this.onChangeHandler =this.onChangeHandler.bind(this);
        [
            {
                url:"Departments",
                type:"map",
                field:"DepartmentName"
            },
            {
                url:"Programs",
                type:"map",
                field:"ProgramName"
            },
            {
                url:"Semesters",
                type:"map",
                field:["ProgramID","SemesterNumber"]
            },
            {
                url:"Sections",
                type:"both",
                field:["SectionName","SemesterID","DepartmentID"]
            },
            {
                url:"Solutions",
                type:"both",
                field:"SolutionName"
            },
            {
                url:"TimeSlotGroups",
                type:"both",
                field:"TimeSlotGroupName"
            },
            {
                url:"TimeSlots",
                type:"both",
                field:"description"
            },
            {
                url:"Teachers",
                type:"both",
                field:"TeacherName"
            },
            {
                url:"TeacherGroups",
                type:"both",
                field:"TeacherGroupName"
            },
            {
                url:"RoomGroups",
                type:"both",
                field:"RoomGroupName"
            },
            {
                url:"Rooms",
                type:"both",
                field:["RoomName","RoomDetail"]
            },
            {
                url:"DayLists",
                type:"both",
                field:"DayName"
            },
            {
                url:"Courses",
                type:"both",
                field:"CourseName"
            },
            {
                url:"SectionGroups",
                type:"both",
                field:"SectionGroupName"
            }
        ].forEach(req =>{
            axios.post(apiURL[req.url].list,{}).then(result => {
                let newState = { dummy:1 };
                if(req.type !== "map")
                {
                    newState[req.url+"List"] = result.data;
                }
                if(req.type !== "list")
                {
                    let map = {};
                    result.data.forEach(rec => { 
                        if(typeof(req.field)==="string")
                        map[rec.id] = rec[req.field];
                        else if(Array.isArray(req.field))
                        {
                            let dict = {};
                            req.field.forEach(fld => {
                                dict[fld] =  rec[fld];
                            });
                            map[rec.id] = dict
                        }
                    });
                    newState[req.url+"Map"] = map;
                }
                this.setState(newState);
                this.apiHit();
            })
        });
        axios.post(api.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
                this.apiHit();
            }
        });
    }
    onChangeHandler = (property,value,root) => {
        
        if(root)
        {
            var temp ={};
            temp[property]=value;
            this.setState(temp);
        }
        else
        {
            let data = this.state.data;
            data[property] = value;
            this.setState({data});
        }
    };
    showDepreciatedHandler = (event) => {
        this.setState({showDepreciated : event.target.checked});
    } 
    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1 
        }));
    };
    delete = (id) => {
        axios.post(api.delete,{ id }).then(result => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
        });
    }
    render()
    {
        const { data,showDepreciated,apiHits} = this.state;
        const { state } = this;
        const AllTS= {...(state.TimeSlotsMap), ...(state.TimeSlotGroupsMap)};
        console.log(AllTS);
        if(apiHits!==15)
        {
            return null;
        }
        return (
            <Grid container spacing={3} direction="column">
                <Grid item  spacing={3} direction="row" container>
                    <Grid item>
                        <Button color="primary" variant="contained" href={app.create}>Create New</Button>
                    </Grid> 
                    <Grid item> 
                        <FormControlLabel control={
                            <Checkbox checked={showDepreciated} onChange={this.showDepreciatedHandler} color="primary" /> 
                        } label="Do you want to show depreciated records?" />
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Solution</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>TimeSrc</TableCell>
                                <TableCell>Live</TableCell>
                                <TableCell>Delete</TableCell>
                                <TableCell>
                                   Edit
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((itm)=>{
                                    if(!showDepreciated && itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return (
                                        <TableRow>
                                            <TableCell>{state.SolutionsMap[itm.SolutionID]}</TableCell>
                                            <TableCell>
                                                {`${state.ProgramsMap[state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].ProgramID]} ${state.DepartmentsMap[state.SectionsMap[itm.SectionID].DepartmentID]} ${state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].SemesterNumber} ${state.SectionsMap[itm.SectionID].SectionName}`}
                                            </TableCell>
                                            <TableCell>
                                                {state.CoursesMap[itm.CourseID]}
                                            </TableCell>
                                            <TableCell>
                                                {AllTS[itm.TimeSlotSource]}
                                            </TableCell>
                                            <TableCell>{(itm.Depreciated?"❌":"✅")}</TableCell>
                                            <TableCell>
                                                <Button onClick={ () => { this.delete(itm.id) }} variant="contained" color="primary">Delete</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button href={app.list+"/"+itm.id+"/edit"} variant="contained" target="_blank" color="primary">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }
}

export default { Listing, Create : withRouter(Create) };