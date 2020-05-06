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

class CreateTimeSlotGroups extends React.Component 
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
            timeSlotList:[],
            data : {    
                name:"",
                data:[],
                AskFacultyPref:false,
                Depreciated:false
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(apiURL.TimeSlotGroups.get,{id:id}).then(result => {
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
        axios.post(apiURL.TimeSlots.list).then(result => {
            this.setState({ timeSlotList : result.data });
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
            url = apiURL.TimeSlotGroups.edit;
        }
        else
        {
            url = apiURL.TimeSlotGroups.create;
        }
        axios.post(url,data).then((result) => {
            window.location = appURL.TimeSlotGroups.list;
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
        const { apiFulfilled,data,error,errorMessage,apiHits,timeSlotList } = this.state;
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
                <Grid sm={12} fullWidth={true} item>
                    <TextField fullWidth={true} value={data.name} label="Timeslot Group Name" onChange={(event) => { this.onChangeHandler("name",event.target.value)}} variant="filled"></TextField>
                </Grid>
                <Grid sm={12} fullWidth={true} item>
                    <FormControl fullWidth={true}  variant="filled">
                        <InputLabel>Member Time Slots</InputLabel>
                        <Select value={data.data} multiline multiple onChange={(event) => { this.onChangeHandler("data",event.target.value);}}>
                            {timeSlotList.map(itm =>{
                                return(
                                    <MenuItem value={itm.id}>{itm.description   }</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControlLabel control = {
                    <Checkbox checked={data.AskFacultyPref} color="primary"  onChange={(event) => { this.onChangeHandler("AskFacultyPref",event.target.checked) } }></Checkbox>}
                    label="Do you want to ask faculty preference for this timeslot group." />
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

export default withRouter(CreateTimeSlotGroups);