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
    Typography,
    FormControlLabel
} from "@material-ui/core";
import * as axios_org from "axios";
import { appURL } from '../../components/appURL';
const axios= axios_org.default;
class ListingDepartments extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            showDepreciated:false,
            data: []
        };
        axios.post(apiURL.Departments.list,{}).then(result => {
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
                <Grid item spacing={3} direction="row">
                        <Grid>
                            <Button color="primary" variant="contained" href={appURL.Departments.create}>Create New</Button>
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
                                <TableCell>Department</TableCell>
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
                                            <TableCell>{entry.DepartmentName}</TableCell>
                                            <TableCell>{(entry.Depreciated?"???":"???")}</TableCell>
                                            <TableCell>
                                                <Button href={appURL.Departments.list+"/"+entry.id+"/edit"} variant="contained" color="primary">Edit</Button>
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

export default ListingDepartments;