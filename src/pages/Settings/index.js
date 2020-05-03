import "date-fns";
import React from 'react';
import { Grid,Button } from "@material-ui/core";
import * as axios_org from "axios";
import { KeyboardTimePicker,MuiPickersUtilsProvider, } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { apiURL } from "../../components/apiURL";
const axios= axios_org.default;

class Settings extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
           data:{ 
                basetime:new Date('2014-08-18T21:11:54'),
                defaultdaylist:null
            }
        }
        var Fns=["ChangeBaseTime","save"];
        var Stngs = ["basetime","defaultdaylist"];
        Stngs.forEach(stng => {
            axios.post(apiURL.Settings.get,{SettingID:stng}).then(result => {
                let data = this.state.data ;
                data[stng] = result.data.Data;
                this.setState({data});
            });
        });
        Fns.forEach(fn =>{
            this[fn] = this[fn].bind(this);
        });
    }

    ChangeBaseTime = (time) =>{
        let data = this.state.data;
        data.basetime = time;
        this.setState({ data});
    }
    save(property)
    {
        axios.post(apiURL.Settings.set,{SettingID:property,Data:this.state.data[property]}).then(result => {});
    }
    render()
    {
        console.log(this.state);
        return (
            <Grid container direction="column" justify="center" spacing={2} >
                <Grid item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            margin="normal"
                            label="Select Base Time"
                            onChange={this.ChangeBaseTime}
                            value={this.state.data.basetime}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                    <Button onClick={()=> {this.save("basetime")}} variant="contained" color="primary">Save</Button>
                </Grid>
            </Grid>
        );
    }
}

export default Settings; 

