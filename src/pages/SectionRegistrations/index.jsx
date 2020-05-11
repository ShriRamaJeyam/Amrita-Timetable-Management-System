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
const table = "SectionRegistrations"
const api = apiURL[table];
const app = appURL[table];



const RedCheckbox = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

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
                SectionID:null,
                FacultyID:null,
                RoomGroupID:null,
                CourseID:null,
                TimeSlot:null,
                Lectures: 0
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
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
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
                url:"TimeSlotGroups",
                type:"both",
                field:"TimeSlotGroupName"
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
                url:"Courses",
                type:"both",
                field:"CourseName"
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
                errorMessage : result.data.error
            });
        });
    };
    add = () =>{
        const {theoreyteacher,labteacher,course,labrooms,theoreyrooms} = this.state;
        console.log()
        if( theoreyteacher !== undefined && labteacher !== undefined && course !== undefined && labrooms!== undefined && theoreyrooms !== undefined)
        {
            const { data } = this.state;
            data.CoursesList.push({theoreyteacher,labteacher,course,labrooms,theoreyrooms});
            this.setState({data});
        }
        else{
            alert("Fields cant be null");
        }
    };
    remove = (idx) =>{
        const { data } = this.state;
        data.CoursesList.splice(idx,1);
        this.setState({data});
    };
    render()
    {
        const { edit } = this.props;
        const { state } = this;
        const { apiFulfilled,data,error,errorMessage,apiHits } = this.state;
        if( apiHits !== 9 || (edit && !apiFulfilled) )
        {
            return null;
        }
        const FullTeacherMap = { ...(state.TeachersMap), ...(state.TeacherGroupsMap) };
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
                <Grid container spacing={2} direction="row" item>
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
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Teacher(s)</InputLabel>
                            <Select value={data.FacultyID} onChange={(event) => { this.onChangeHandler("FacultyID",event.target.value);}}>
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
                            <InputLabel>Room Group</InputLabel>
                            <Select value={data.RoomGroupID} onChange={(event) => { this.onChangeHandler("RoomGroupID",event.target.value);}}>
                                {state.RoomGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.RoomGroupName}`}</MenuItem>
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
                            <InputLabel>Time Slot</InputLabel>
                            <Select value={data.TimeSlot} onChange={(event) => { this.onChangeHandler("TimeSlot",event.target.value);}}>
                                {state.TimeSlotGroupsList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{itm.TimeSlotGroupName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={3} fullWidth={true} item>
                        <TextField type="number" fullWidth={true} value={data.Lectures} label="No Of Lectures" onChange={(event) => { this.onChangeHandler("Lectures",event.target.value)}} variant="filled"></TextField>
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
        super(props)
        this.state = {
            apiHits:0,
            showDepreciated:false,
            data: [],
            sectionfilt:""
        };
        axios.post(api.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
                this.apiHit();
            }
        });
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this); 
        this.onChangeHandler = this.onChangeHandler.bind(this); 
        this.apiHit = this.apiHit.bind(this);
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
                url:"TimeSlotGroups",
                type:"both",
                field:"TimeSlotGroupName"
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
                url:"Courses",
                type:"both",
                field:"CourseName"
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
    showDepreciatedHandler = (event) => {
        this.setState({showDepreciated : event.target.checked});
    } 
    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1 
        }));
    };
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
    delete = (id) => {
        axios.post(api.delete,{ id }).then(result => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
        });
    }
    render()
    {
        const { data,apiHits} = this.state;
        const { state } = this;
        const AllTeachersMap = { ...(state.TeachersMap), ...(state.TeacherGroupsMap) };
        if(apiHits!==10)
        {
            return null;
        }
        return (
            <Grid container spacing={3} direction="column">
                <Grid item spacing={3} direction="row" alignItems="center" container>
                        <Grid item>
                            <Button color="primary" variant="contained" href={app.create}>Create New</Button>
                        </Grid> 
                        <Grid item>
                            <TextField fullWidth={true} value={state.sectionfilt} label="Room Description" onChange={(event) => { this.onChangeHandler("sectionfilt",event.target.value,true)}} variant="filled"></TextField>
                        </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Section</TableCell>
                                <TableCell>Teacher(s)</TableCell>
                                <TableCell>Room Group</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>TimeSlot</TableCell>
                                <TableCell>LectureCount</TableCell>
                                <TableCell>Delete</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((itm)=>{
                                    var sec= `${state.ProgramsMap[state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].ProgramID]} ${state.DepartmentsMap[state.SectionsMap[itm.SectionID].DepartmentID]} ${state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].SemesterNumber} ${state.SectionsMap[itm.SectionID].SectionName}`;
                                    if(sec.toLowerCase().indexOf(state.sectionfilt.toLowerCase())=== -1)
                                        return null;
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                {`${state.ProgramsMap[state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].ProgramID]} ${state.DepartmentsMap[state.SectionsMap[itm.SectionID].DepartmentID]} ${state.SemestersMap[state.SectionsMap[itm.SectionID].SemesterID].SemesterNumber} ${state.SectionsMap[itm.SectionID].SectionName}`}
                                            </TableCell>
                                            <TableCell>{AllTeachersMap[itm.FacultyID]}</TableCell>
                                            <TableCell>{state.RoomGroupsMap[itm.RoomGroupID]}</TableCell>
                                            <TableCell>{state.CoursesMap[itm.CourseID]}</TableCell>
                                            <TableCell>{state.TimeSlotGroupsMap[itm.TimeSlot]}</TableCell>
                                            <TableCell>{itm.Lectures}</TableCell>
                                            <TableCell>
                                                <Button onClick={ () => { this.delete(itm.id) }} variant="contained" color="primary">Delete</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button href={app.list+"/"+itm.id+"/edit"} variant="contained" color="primary">Edit</Button>
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