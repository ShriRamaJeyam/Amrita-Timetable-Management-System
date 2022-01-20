// React
import React from "react";

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
import { apiURL } from "../../components/apiURL";

const axios= axios_org.default;

class SemesterRegistrations extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0,
            error:false,
            errorMessage:"",
            data : []
        };
        this.apiHit = this.apiHit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        [
            {
                url:"Departments",
                type:"list",
                field:"DepartmentName"
            },
            {
                url:"Programs",
                type:"map",
                field:"ProgramName"
            },
            {
                url:"Semesters",
                type:"list",
                field:"DepartmentName"
            },
            {
                url:"Courses",
                type:"list",
                field:"DepartmentName"
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
                        map[rec.id] = rec[req.field];
                    });
                    newState[req.url+"Map"] = map;
                }
                this.setState(newState);
                this.apiHit();
            })
        });
    }
    onChangeHandler = (property,value) => {
        var temp ={};
        const {semester,department} = this.state;
        let DepartmentID = (property !== "department"?department:value);
        let SemesterID = (property !== "semester"?semester:value);
        temp[property]=value;
        console.log(SemesterID && DepartmentID)
        if(property === "data"  || (SemesterID && DepartmentID ? false : true))
        {
            this.setState(temp);
            console.log(SemesterID,DepartmentID,"if");
        }
        else
        {
            axios.post(apiURL.SemesterRegistrations.get,{ 
                SemesterID,
                DepartmentID
            }).then( result => {
                    temp.data = result.data;
                    this.setState(temp);
                }
            );
        }
    };
    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1
        }));
    };
    save = () =>{
        axios.post(apiURL.SemesterRegistrations.edit,{ 
            SemesterID: this.state.semester,
            DepartmentID: this.state.department,
            data:this.state.data
        }).then(result => {
            alert("Successfully saved");
        }).catch(result => {
            alert("Save failed");
        });
    }
    render()
    {
        const {state} = this ;
        if(state.apiHits !== 4)
            return null;
        return (
            <Grid container direction="column" spacing={3}>
                <Grid container direction="row" spacing={3} item>
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Semester</InputLabel>
                            <Select value={state.semester} onChange={(event) => { this.onChangeHandler("semester",event.target.value);}}>
                                <MenuItem value={undefined}>None</MenuItem>
                                {state.SemestersList.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {`${state.ProgramsMap[itm.ProgramID]} ${itm.SemesterNumber}`} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Department</InputLabel>
                            <Select value={state.department} onChange={(event) => { this.onChangeHandler("department",event.target.value,true);}}>
                                <MenuItem value={undefined}>None</MenuItem>
                                {state.DepartmentsList.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.DepartmentName} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {
                    (
                        !(state.semester && state.department) ? 
                        null:
                        <React.Fragment>
                        <Grid container fullWidth={true} sm={12} direction="row" spacing={3} item>
                            <FormControl fullWidth={true}  variant="filled">
                                <InputLabel>Course List</InputLabel>
                                <Select value={state.data} multiline multiple onChange={(event) => { this.onChangeHandler("data",event.target.value);}}>
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
                        <Grid item>
                            <Button color="primary" variant="contained" onClick={this.save}>Save</Button>
                        </Grid>
                        </React.Fragment>
                    )
                }
            </Grid>
        );
    }
};

export default SemesterRegistrations;