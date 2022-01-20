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
const table = "RoomGroups"
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
            showRoomNames:false,
            apiHits:0,
            apiFulfilled:false,
            error:false,
            errorMessage:"",
            roomList:[],
            regionMap:{},
            data : {    
                name:"",
                data:[],
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
        axios.post(apiURL.Rooms.list).then(result => {
            this.setState({ roomList : result.data });
            this.apiHit();
        });
        axios.post(apiURL.Regions.list).then(result => {
            const { regionMap } = this.state;
            result.data.forEach(rec => {
                regionMap[rec.id] = rec.Region ;
            });
            this.setState({ regionMap });
            this.apiHit();
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
        const { apiFulfilled,data,error,errorMessage,apiHits,roomList, regionMap, showRoomNames } = this.state;
        if( apiHits !== 2 || (edit && !apiFulfilled) )
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
                <Grid sm={12} fullWidth={true} item>
                    <TextField fullWidth={true} value={data.name} label="Room Group Name" onChange={(event) => { this.onChangeHandler("name",event.target.value)}} variant="filled"></TextField>
                </Grid>
                <Grid sm={12} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Room List</InputLabel>
                        <Select value={data.data} multiline multiple onChange={(event) => { this.onChangeHandler("data",event.target.value);}}>
                            {roomList.map(itm =>{
                                return(
                                    <MenuItem value={itm.id}>{`${regionMap[itm.RegionID]} ${itm.RoomDetail} ${(showRoomNames? itm.RoomDescription:"")}  `}</MenuItem>
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
                    <FormControlLabel control = {
                    <Checkbox color="primary" checked={data.showRoomNames} onChange={(event) => { this.onChangeHandler("showRoomNames",event.target.checked,true) } }></Checkbox>}
                    label="Do you want to show room names?" />
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
    }
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
                        <Grid> 
                            <FormControlLabel control={
                                <Checkbox checked={showDepreciated} onChange={this.showDepreciatedHandler} color="primary" /> 
                            } label="Do you want to show depreciated records?" />
                        </Grid>  
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Room Group Name</TableCell>
                                <TableCell>Live</TableCell>
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
                                            <TableCell>{entry.RoomGroupName}</TableCell>
                                            <TableCell>{(entry.Depreciated?"❌":"✅")}</TableCell>
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