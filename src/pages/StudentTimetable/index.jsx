// React
import React from "react";
import { withRouter } from "react-router-dom";
import * as Styled from "styled-components";
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
    Paper,
    Collapse
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

class Create extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0,
            error:false,
            errorMessage:"",
        };
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
            <React.Fragment>
            <Grid fullWidth={true} container direction="row" spacing={2} >
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
                        <InputLabel>Department</InputLabel>
                        <Select value={state.DepartmentID} onChange={(event) => { this.onChangeHandler("DepartmentID",event.target.value,true);}}>
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
                        <Select value={state.SemesterID} onChange={(event) => { this.onChangeHandler("SemesterID",event.target.value,true);}}>
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
                        <Select value={state.SectionName} onChange={(event) => { this.onChangeHandler("SectionName",event.target.value,true);}}>
                            {["A","B","C","D","E","F"].map(itm =>{
                                return(
                                    <MenuItem value={itm}>{itm} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <br></br>
            <Grid item>
            {
                true &&
                (
                    <div style={{width:"1300px",height:"550px"}}>
                        <div style={{height:"110px",border:"1px solid black",display:"flex"}}>
                            <div style={{height:"100%",width:"100px",border:"1px solid black"}}>Monday</div>
                            <div style={{height:"100%",border:"1px solid black",position:"relative",left:"127px",width:"127px"}}>
                                15CSE402 
                                <br />
                                C.Shanmuga Velayutham
                                <br />
                                C-205
                            </div>
                            <div style={{height:"100%",border:"1px solid black",position:"relative",left:"127px",width:"127px"}}>
                                NULL 
                                <br />
                                Elective
                                <br />
                            </div>
                        </div>
                        <div style={{height:"110px",border:"1px solid black"}}>
                            <div style={{height:"100%",width:"100px",border:"1px solid black"}}>Tuesday</div>
                        </div>
                        <div style={{height:"110px",border:"1px solid black"}}>
                            <div style={{height:"100%",width:"100px",border:"1px solid black"}}>Wednesday</div>
                        </div>
                        <div style={{height:"110px",border:"1px solid black"}}>
                            <div style={{height:"100%",width:"100px",border:"1px solid black"}}>Thursday</div>
                        </div>
                        <div style={{height:"110px",border:"1px solid black"}}>
                            <div style={{height:"100%",width:"100px",border:"1px solid black"}}>Friday</div>
                        </div>

                    </div>
                )
            }
            </Grid>
            </React.Fragment>
        );
    }
}
export default { Listing: Create, Create };