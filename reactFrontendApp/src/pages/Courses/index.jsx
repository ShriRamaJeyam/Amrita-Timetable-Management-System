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
const table = "Courses"
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
                url:"TimeSlotGroups",
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
        if( apiHits !== 1 || (edit && !apiFulfilled) )
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
                <Grid item>
                    <TextField fullWidth={true} value={data.CourseName} label="Course Name" onChange={(event) => this.onChangeHandler("CourseName",event.target.value)} variant="filled" />
                </Grid>
                <Grid item direction="row" spacing={3} container>
                    <Grid item sm={3}>
                        <TextField fullWidth={true} value={data.CourseCode} label="Course Code" onChange={(event) => this.onChangeHandler("CourseCode",event.target.value)} variant="filled" />
                    </Grid>
                    <Grid item sm={2}>
                        <TextField type="number" fullWidth={true} value={data.Theorey} label="Theorey" onChange={(event) => this.onChangeHandler("Theorey",event.target.value)} variant="filled" />
                    </Grid>
                    <Grid item sm={2}>
                        <TextField type="number" fullWidth={true} value={data.Lab} label="Lab" onChange={(event) => this.onChangeHandler("Lab",event.target.value)} variant="filled" />
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Theorey Time Slot</InputLabel>
                            <Select value={data.TheoreySlot} onChange={(event) => { this.onChangeHandler("TheoreySlot",event.target.value);}}>
                                <MenuItem value={undefined}>None</MenuItem>
                                {state.TimeSlotGroupsList.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.TimeSlotGroupName} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Lab Time Slot</InputLabel>
                            <Select value={data.LabSlot} onChange={(event) => { this.onChangeHandler("LabSlot",event.target.value);}}>
                                <MenuItem value={undefined}>None</MenuItem>
                                {state.TimeSlotGroupsList.map(itm =>{
                                    if(itm.Depreciated)
                                    {
                                        return null;
                                    }
                                    return(
                                        <MenuItem value={itm.id}> {itm.TimeSlotGroupName} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
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
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this); 
        this.apiHit = this.apiHit.bind(this);  
        this.onChangeHandler =this.onChangeHandler.bind(this);
        [
            {
                url:"TimeSlotGroups",
                type:"map",
                field:"TimeSlotGroupName"
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
    render()
    {
        const { data,showDepreciated,apiHits} = this.state;
        const { state } = this;
        if( apiHits !== 2 )
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
                                <TableCell>Course Name</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Theorey</TableCell>
                                <TableCell>Lab</TableCell>
                                <TableCell>TheoreySlot</TableCell>
                                <TableCell>LabSlot</TableCell>
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
                                    return (
                                        <TableRow>
                                            <TableCell>{entry.CourseName}</TableCell>
                                            <TableCell>{entry.CourseCode}</TableCell>
                                            <TableCell>{entry.Theorey}</TableCell>
                                            <TableCell>{entry.Lab}</TableCell>
                                            <TableCell>{state.TimeSlotGroupsMap[entry.TheoreySlot]}</TableCell>
                                            <TableCell>{state.TimeSlotGroupsMap[entry.LabSlot]}</TableCell>
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