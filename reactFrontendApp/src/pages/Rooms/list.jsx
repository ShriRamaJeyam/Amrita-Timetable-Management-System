import React from 'react';
import { apiURL } from "../../components/apiURL";
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
    FormControlLabel
} from "@material-ui/core";
import * as axios_org from "axios";
import { appURL } from '../../components/appURL';
const axios= axios_org.default;
class ListingRooms extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            apiHits:0,
            regionMap:{},
            showDepreciated:false,
            data: []
        };
        axios.post(apiURL.Rooms.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
            }
        });
        axios.post(apiURL.Regions.list).then(result => {
            let regionMap = this.state.regionMap;
            result.data.forEach(itm =>{
                regionMap[itm.id] = itm.Region;
            });
            this.setState({regionMap});
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
        const { data,showDepreciated,basetime,apiHits,regionMap } = this.state;
        if(apiHits==1)
        {
            return null;
        }
        return (
            <Grid container spacing={3} direction="column">
                <Grid item spacing={3} direction="row">
                        <Grid>
                            <Button color="primary" variant="contained" href={appURL.Rooms.create}>Create New</Button>
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
                                <TableCell>RoomDescription</TableCell>
                                <TableCell>Region</TableCell>
                                <TableCell>Wing</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>RoomNo</TableCell>
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
                                            <TableCell>{entry.RoomDescription}</TableCell>
                                            <TableCell>{regionMap[entry.RegionID]}</TableCell>
                                            <TableCell>{entry.Wing}</TableCell>
                                            <TableCell>{entry.FloorNo}</TableCell>
                                            <TableCell>{entry.RoomNo}</TableCell>
                                            <TableCell>{(entry.Depreciated?"???":"???")}</TableCell>
                                            <TableCell>
                                                <Button href={appURL.Rooms.list+"/"+entry.id+"/edit"} variant="contained" color="primary">Edit</Button>
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

export default ListingRooms;