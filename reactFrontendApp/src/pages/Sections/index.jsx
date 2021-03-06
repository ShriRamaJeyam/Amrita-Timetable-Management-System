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
const table = "Sections"
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
            semesterList:[],
            departmentList:[],
            programMap:{},
            data : {    
                SemesterID:null,
                DepartmentID:null,
                SectionName:"",
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
                        let data = result.data[0];
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
                type:"list",
                field:"DepartmentName"
            },
            {
                url:"Programs",
                type:"both",
                field:"ProgramName"
            },
            {
                url:"Semesters",
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
                errorMessage : result.response.data.error
            });
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled,data,error,errorMessage,apiHits } = this.state;
        const { state } = this;
        if( apiHits !== 3 || (edit && !apiFulfilled) )
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
                <Grid sm={2} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Programs(filter)</InputLabel>
                        <Select value={this.state.program} onChange={(event) => { this.onChangeHandler("program",event.target.value,true);}}>
                            <MenuItem value={undefined}>None</MenuItem>
                            {state.ProgramsList.map(itm =>{
                                if(itm.Depreciated)
                                {
                                    return null;
                                }
                                return(
                                    <MenuItem value={itm.id}> {itm.ProgramName} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid sm={2} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Department</InputLabel>
                        <Select value={data.DepartmentID} onChange={(event) => { this.onChangeHandler("DepartmentID",event.target.value);}}>
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
                <Grid sm={2} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Semester</InputLabel>
                        <Select value={data.SemesterID} onChange={(event) => { this.onChangeHandler("SemesterID",event.target.value);}}>
                            {state.SemestersList.map(itm =>{
                                if(itm.Depreciated || ( state.program !== undefined && itm.ProgramID !== state.program))
                                {
                                    return null;
                                }
                                return(
                                    <MenuItem value={itm.id}>{state.ProgramsMap[itm.ProgramID]}{" "}{itm.SemesterNumber} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid sm={2} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Section</InputLabel>
                        <Select value={data.SectionName} onChange={(event) => { this.onChangeHandler("SectionName",event.target.value);}}>
                            {["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"].map(itm =>{
                                return(
                                    <MenuItem value={itm}>{itm} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControlLabel control = {
                    <RedCheckbox checked={data.Depreciated} onChange={(event) => { this.onChangeHandler("Depreciated",event.target.checked) } }></RedCheckbox>}
                    label="Is this depreciated" />
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
        [
            {
                url:"Departments",
                type:"both",
                field:"DepartmentName"
            },
            {
                url:"Programs",
                type:"both",
                field:"ProgramName"
            },
            {
                url:"Semesters",
                type:"map",
                field:["SemesterNumber","ProgramID"]
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
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this); 
        this.apiHit = this.apiHit.bind(this);  
        this.onChangeHandler =this.onChangeHandler.bind(this);
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
    render()
    {
        const { data,showDepreciated,apiHits} = this.state;
        const { state } = this;
        if(apiHits!==4)
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
                <Grid item  spacing={3} direction="row" container>
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Programs(filter)</InputLabel>
                            <Select value={this.state.program} onChange={(event) => { this.onChangeHandler("program",event.target.value,true);}}>
                                <MenuItem value={undefined}>None</MenuItem>
                                {state.ProgramsList.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.ProgramName} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sm={2} fullWidth={true} item>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Departments(filter)</InputLabel>
                            <Select value={this.state.department} onChange={(event) => { this.onChangeHandler("department",event.target.value,true);}}>
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
                    <Grid sm={2} item>
                        <TextField type="number" fullWidth={true} value={state.semester} label="semester" onChange={(event) => { this.onChangeHandler("semester",event.target.value,true);}} variant="filled" />
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Program</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Semester</TableCell>
                                <TableCell>Section</TableCell>
                                <TableCell>Live</TableCell>
                                <TableCell>
                                   Edit
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((entry)=>{
                                    if(!showDepreciated && entry.Depreciated)
                                    {
                                        return null;
                                    }
                                    //filters
                                    {
                                        if(state.semester && state.semester !== "" && state.SemestersMap[entry.SemesterID].SemesterNumber !== parseInt(state.semester))
                                            return null;
                                        if(state.program && state.program !== state.SemestersMap[entry.SemesterID].ProgramID )
                                            return null;
                                        if(state.department && state.department !== entry.DepartmentID)
                                            return null;
                                    }
                                    return (
                                        <TableRow>
                                            <TableCell>{state.ProgramsMap[state.SemestersMap[entry.SemesterID].ProgramID]}</TableCell>
                                            <TableCell>{state.DepartmentsMap[entry.DepartmentID]}</TableCell>
                                            <TableCell>{state.SemestersMap[entry.SemesterID].SemesterNumber}</TableCell>
                                            <TableCell>{entry.SectionName}</TableCell>
                                            <TableCell>{(entry.Depreciated?"???":"???")}</TableCell>
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