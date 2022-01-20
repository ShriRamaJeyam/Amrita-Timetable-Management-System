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
const table = "Electives"
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
                ElectiveName:"",
                TheoreySlot:null,
                LabSlot:null,
                SectionGroupID:null,   
                CoursesList: [],
                Depreciated:false
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
                url:"Courses",
                type:"both",
                field:"CourseName"
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
                url:"TimeSlotGroups",
                type:"both",
                field:"TimeSlotGroupName"
            },
            {
                url:"SectionGroups",
                type:"both",
                field:"SectionGroupName"
            },
            {
                url:"RoomGroups",
                type:"both",
                field:"RoomGroupName"
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
        if( apiHits !== 6 || (edit && !apiFulfilled) )
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
                <Grid sm={12} fullWidth={true} item>
                    <TextField fullWidth={true} value={data.ElectiveName} label="Elective Name" onChange={(event) => { this.onChangeHandler("ElectiveName",event.target.value)}} variant="filled"></TextField>
                </Grid>
                <Grid container spacing={2} direction="row" item>
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>LabSlot</InputLabel>
                            <Select value={data.LabSlot} onChange={(event) => { this.onChangeHandler("LabSlot",event.target.value);}}>
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
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>TheoreySlot</InputLabel>
                            <Select value={data.TheoreySlot} onChange={(event) => { this.onChangeHandler("TheoreySlot",event.target.value);}}>
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
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>SectionGroup</InputLabel>
                            <Select value={data.SectionGroupID} onChange={(event) => { this.onChangeHandler("SectionGroupID",event.target.value);}}>
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
                </Grid>
                <Grid container spacing={2} direction="row" item alignContent="center" alignItems="center">
                    <Grid sm={3} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Course</InputLabel>
                            <Select value={state.course} onChange={(event) => { this.onChangeHandler("course",event.target.value,true);}}>
                                {state.CoursesList.map(itm =>{
                                    //filters
                                    if(itm.Depreciated)
                                        return null;
                                    return(
                                        <MenuItem value={itm.id}>{`${itm.CourseCode} ${itm.CourseName}`}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Theorey Teacher(s)</InputLabel>
                            <Select value={state.theoreyteacher} onChange={(event) => { this.onChangeHandler("theoreyteacher",event.target.value,true);}}>
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
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Lab Teacher(s)</InputLabel>
                            <Select value={state.labteacher} onChange={(event) => { this.onChangeHandler("labteacher",event.target.value,true);}}>
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
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Theorey Rooms</InputLabel>
                            <Select value={state.theoryrooms} onChange={(event) => { this.onChangeHandler("theoreyrooms",event.target.value,true);}}>
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
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Lab Rooms</InputLabel>
                            <Select value={state.labrooms} onChange={(event) => { this.onChangeHandler("labrooms",event.target.value,true);}}>
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
                    
                    <Grid item>
                        <Button  color="primary" variant="contained" onClick={this.add}>Add</Button>
                    </Grid>
                </Grid>
                <Grid sm={12} container spacing={2} direction="row" item alignContent="center" alignItems="center">
                    <TableContainer fullWidth={true} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Course</TableCell>
                                    <TableCell>Theorey Teacher</TableCell>
                                    <TableCell>Lab Teacher</TableCell>
                                    <TableCell>Theorey Room</TableCell>
                                    <TableCell>Lab Room</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.CoursesList.map((entry,index)=>{
                                        return (
                                            <TableRow>
                                                <TableCell>{state.CoursesMap[entry.course]}</TableCell>
                                                <TableCell>{FullTeacherMap[entry.theoreyteacher]}</TableCell>
                                                <TableCell>{FullTeacherMap[entry.labteacher]}</TableCell>
                                                <TableCell>{state.RoomGroupsMap[entry.theoreyrooms]}</TableCell>
                                                <TableCell>{state.RoomGroupsMap[entry.labrooms]}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => { this.remove(index); }} variant="contained" color="primary">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
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
            data: []
        };
        axios.post(api.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
                this.apiHit();
            }
        });
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this);  
        this.apiHit = this.apiHit.bind(this); 
    }
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
        if(apiHits!==1)
        {
            return null;
        }
        return (
            <Grid container spacing={3} direction="column">
                <Grid item spacing={3} direction="row">
                        <Grid>
                            <Button color="primary" variant="contained" href={app.create}>Create New</Button>
                        </Grid> 

                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Elective Name</TableCell>
                                <TableCell>Live</TableCell>
                                <TableCell>Delete</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((entry)=>{
                                    if(!showDepreciated && entry.Depreciated)
                                    {
                                        return null;
                                    }
                                    return (
                                        <TableRow>
                                            <TableCell>{entry.ElectiveName}</TableCell>
                                            <TableCell>{(entry.Depreciated?"❌":"✅")}</TableCell>
                                            <TableCell>
                                                <Button onClick={ () => { this.delete(entry.id) }} variant="contained" color="primary">Delete</Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button href={app.list+"/"+entry.id+"/edit"} variant="contained" color="primary">Edit</Button>
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