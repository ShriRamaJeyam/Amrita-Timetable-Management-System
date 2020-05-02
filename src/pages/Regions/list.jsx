import React,{Fragment} from 'react';
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
    Typography
} from "@material-ui/core";
import * as axios_org from "axios";
const axios= axios_org.default;
class ListingRegions extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            showDepreciated:false,
            data: []
        };
        axios.post(apiURL.Regions.list,{}).then(result => {
            if(result.data)
            {
                this.setState({data:result.data});
            }
        });
        this.showDepreciatedHandler = this.showDepreciatedHandler.bind(this);   
    }

    showDepreciatedHandler = (event) => {
        this.setState({showDepreciated : event.target.checked});
    } 
    render()
    {
        const { data,showDepreciated } = this.state;
        return (
            <Grid container spacing={3} direction="column">
                <Grid item spacing={1} direction="column">
                    <Grid alignItems="center" alignContent="center">
                        <Button color="primary" variant="contained" href="create">Create New</Button>
                        <Checkbox checked={showDepreciated} onChange={this.showDepreciatedHandler} color="primary"></Checkbox>
                        <Typography component="span"> Do you want to show depreciated records?</Typography>
                    </Grid>
                </Grid>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Region</TableCell>
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
                                            <TableCell>{entry.Region}</TableCell>
                                            <TableCell>{(entry.Depreciated?"❌":"✅")}</TableCell>
                                            <TableCell>
                                                <Button href={entry.id+"/edit"} variant="contained" color="primary">Edit</Button>
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

export default ListingRegions;