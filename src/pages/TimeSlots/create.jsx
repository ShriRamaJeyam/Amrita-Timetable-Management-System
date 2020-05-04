import React from "react";
import { TextField,Button,Grid, Typography,Checkbox,FormControlLabel } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { apiURL } from "../../components/apiURL";
import * as axios_org from "axios";
import { appURL } from "../../components/appURL";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { KeyboardTimePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import * as date_fns from "date-fns";
import {Alert, AlertTitle} from "@material-ui/lab";

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

class CreateTimeSlots extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiFulfilled:false,
            basetime:null,
            error:false,
            data : {
                description:"",
                starter:0,
                ender:0,
                hasBreak:false,
                startBreak:0,
                endBreak:0,
                Depreciated:false
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(apiURL.TimeSlots.get,{id:id}).then(result => {
                    if(result.data.length !== 0)
                    {
                        let data = result.data[0];
                        this.setState({data,apiFulfilled:true});
                    }
                }
            );

        }
        axios.post(apiURL.Settings.get,{SettingID:"basetime"}).then(result => {
            let basetime = new Date(result.data.Data);
            this.setState({basetime});
        });
        this.save = this.save.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDepreciated =this.onChangeDepreciated.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }
    onChangeHandler = (property,value) => {
        let data = this.state.data;
        data[property] = value;
        this.setState({data});
    };
    getTimeFromNumber = (offset) => {
        let basetime = this.state.basetime ;
        return date_fns.addMinutes(basetime,(offset?offset:0));
    };
    getNumberFromTime = (time) => {
        let basetime = this.state.basetime ;
        return date_fns.differenceInMinutes(time,basetime);
    };
    onChangeDescription = (event) => {
        const data = this.state.data;
        data.description = event.target.value;
        this.setState({ data });
    };
    onChangeDepreciated = (event) => {
        const data = this.state.data;
        data.Depreciated = event.target.checked;
        this.setState({ data });
    };
    save = () => {
        const { edit } = this.props;
        const { data } = this.state;
        let url;
        if(edit)
        {
            url = apiURL.TimeSlots.edit;
        }
        else
        {
            url = apiURL.TimeSlots.create;
        }
        axios.post(url,data).then((result) => {
            window.location = appURL.TimeSlots.list;
        }).catch(result => {
            console.log(result);
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled,basetime,data,error,errorMessage } = this.state;
        if(!basetime)
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
                    <TextField fullWidth={true} value={this.state.data.description} label="TimeSlot Name" onChange={this.onChangeDescription} variant="filled"></TextField>
                </Grid>
                <Grid item spacing={2}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            value={this.getTimeFromNumber(data.starter)}
                            onChange={(time) => { this.onChangeHandler("starter", this.getNumberFromTime(time)); } }
                            margin="normal"
                            label="Starting"
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                        <KeyboardTimePicker
                            value={this.getTimeFromNumber(data.ender)}
                            onChange={(time) => { this.onChangeHandler("ender", this.getNumberFromTime(time)); } }
                            margin="normal"
                            label="Ending"
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                    <FormControlLabel control = {
                    <Checkbox color="primary" checked={data.hasBreak} onChange={(event) => { this.onChangeHandler("hasBreak",event.target.checked); }}></Checkbox>}
                    label="Does this timeslot have a break in between?" />
                </Grid>
                {   
                    data.hasBreak &&
                    (
                        <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    value={this.getTimeFromNumber(data.startBreak)}
                                    onChange={(time) => { this.onChangeHandler("startBreak", this.getNumberFromTime(time)); } }
                                    margin="normal"
                                    label="Starting of break"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                                <KeyboardTimePicker
                                    value={this.getTimeFromNumber(data.endBreak)}
                                    onChange={(time) => { this.onChangeHandler("endBreak", this.getNumberFromTime(time)); } }
                                    margin="normal"
                                    label="Ending of break"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    )
                }
                <Grid item>
                    <FormControlLabel control = {
                    <RedCheckbox checked={this.state.data.Depreciated} onChange={this.onChangeDepreciated}></RedCheckbox>}
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

export default withRouter(CreateTimeSlots);