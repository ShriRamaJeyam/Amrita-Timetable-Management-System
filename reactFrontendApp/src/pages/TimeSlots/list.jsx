import React,{Fragment} from 'react';
import { apiURL } from "../../components/apiURL";
import * as date_fns from "date-fns";
import {
    Grid,
    Button,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    FormControlLabel
} from "@material-ui/core";
import * as axios_org from "axios";
import { appURL } from '../../components/appURL';
const axios= axios_org.default;
class ListingTimeSlots extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            showDepreciated:false,
            basetime:null,
            data: []
        };
        axios.post(apiURL.Settings.get,{SettingID:"basetime"}).then(result => {
            let basetime = new Date(result.data.Data) ; 
            this.setState({basetime});
        });
        axios.post(apiURL.TimeSlots.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
            }
        });
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this);   
    }
    getTimeFromNumber = (offset) => {
        let basetime = this.state.basetime ;
        return date_fns.format(date_fns.addMinutes(basetime,offset),'p');
    };
    showDepreciatedHandler = (event) => {
        this.setState({showDepreciated : event.target.checked});
    } 
    render()
    {
        const { data,showDepreciated,basetime } = this.state;
        if(!basetime)
        {
            return null;
        }
        return (
            <Grid container spacing={3} direction="column">
                <Grid item spacing={3} direction="row">
                        <Grid>
                            <Button color="primary" variant="contained" href={appURL.TimeSlots.create}>Create New</Button>
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
                                <TableCell>TimeSlot Name</TableCell>
                                <TableCell>Starting</TableCell>
                                <TableCell>Ending</TableCell>
                                <TableCell>break?</TableCell>
                                <TableCell>Break Start</TableCell>
                                <TableCell>BreakEnd</TableCell>
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
                                            <TableCell>{entry.description}</TableCell>
                                            <TableCell>{this.getTimeFromNumber(entry.starter)}</TableCell>
                                            <TableCell>{this.getTimeFromNumber(entry.ender)}</TableCell>
                                            <TableCell>{(entry.hasBreak?"✅":"❌")}</TableCell>
                                            <TableCell>{(entry.hasBreak?this.getTimeFromNumber(entry.startBreak):"-")}</TableCell>
                                            <TableCell>{(entry.hasBreak?this.getTimeFromNumber(entry.endBreak):"-")}</TableCell>
                                            <TableCell>{(entry.Depreciated?"❌":"✅")}</TableCell>
                                            <TableCell>
                                                <Button href={appURL.TimeSlots.list+"/"+entry.id+"/edit"} variant="contained" color="primary">Edit</Button>
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

export default ListingTimeSlots;