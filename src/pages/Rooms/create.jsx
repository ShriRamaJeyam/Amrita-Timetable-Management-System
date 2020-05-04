import React from "react";
import { 
    TextField,
    Button,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { apiURL } from "../../components/apiURL";
import * as axios_org from "axios";
import { appURL } from "../../components/appURL";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import {Alert} from "@material-ui/lab";

const axios= axios_org.default;

const RedCheckbox = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

class CreateRooms extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiHits:0,
            apiFulfilled:false,
            basetime:null,
            error:false,
            errorMessage:"",
            regionList:[],
            data : {    
                RegionID:null,
                FloorNo:null,
                Wing:null,
                RoomNo:null,
                RoomDescription : (new Date()).getTime().toString(36),
                Depreciated:false
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(apiURL.Rooms.get,{id:id}).then(result => {
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
        axios.post(apiURL.Regions.list).then(result => {
            this.setState({ regionList : result.data });
            this.apiHit();
        });
    }
    apiHit = () => {
        this.setState((state,props) => ({
            apiHits : state.apiHits + 1
        }));
    };
    onChangeHandler = (property,value) => {
        let data = this.state.data;
        data[property] = value;
        this.setState({data});
    };
    save = () => {
        const { edit } = this.props;
        const { data } = this.state;
        let url;
        if(edit)
        {
            url = apiURL.Rooms.edit;
        }
        else
        {
            url = apiURL.Rooms.create;
        }
        axios.post(url,data).then((result) => {
            window.location = appURL.Rooms.list;
        }).catch(result => {
            this.setState({
                error : true,
                errorMessage : result.response
            });
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled,data,error,errorMessage,apiHits,regionList } = this.state;
        if( apiHits !== 1 )
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
                    <TextField fullWidth={true} value={data.RoomDescription} label="Room Description" onChange={(event) => { this.onChangeHandler("RoomDescription",event.target.value)}} variant="filled"></TextField>
                </Grid>
                <Grid container item direction="row" sm={12} spacing={2}>
                    <Grid item sm={2}>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Region</InputLabel>
                            <Select value={data.RegionID} onChange={(event) => { this.onChangeHandler("RegionID",event.target.value);}}>
                                {regionList.map(itm =>{
                                    return(
                                        <MenuItem value={itm.id}>{itm.Region}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={1}>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Wing</InputLabel>
                            <Select value={data.Wing} onChange={(event) => { this.onChangeHandler("Wing",event.target.value);}}>
                                {["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"].map(itm =>{
                                    return(
                                        <MenuItem value={itm}>{itm}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={1}>
                        <FormControl fullWidth={true}  variant="filled">
                            <InputLabel>Floor</InputLabel>
                            <Select value={data.FloorNo} onChange={(event) => { this.onChangeHandler("FloorNo",event.target.value);}}>
                                {[0,1,2,3,4,5,6,7,8,9].map(itm =>{
                                    return(
                                        <MenuItem value={itm}>{itm}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField value={data.RoomNo} onChange={(event) => { this.onChangeHandler("RoomNo",Math.min(Math.max(event.target.value,0),99)); }} fullWidth={true} type="number" label="Room Number" variant="filled" />
                    </Grid>
                </Grid>
                <Grid item>
                    <FormControlLabel control = {
                    <RedCheckbox checked={data.Depreciated} onChange={(event) => { this.onChangeHandler("Depreciated",event.target.checked) } }></RedCheckbox>}
                    label="Is this depreciated" />
                </Grid>
                <Grid item>
                    {
                        (!edit || apiFulfilled) &&
                        <Button color="primary" variant="contained" onClick={this.save}>Save</Button> 
                    }
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(CreateRooms);