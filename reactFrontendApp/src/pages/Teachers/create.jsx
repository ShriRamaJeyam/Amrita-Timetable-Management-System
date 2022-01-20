import React from "react";
import { TextField,Button,Grid, Typography,Checkbox,FormControlLabel,Select,MenuItem,FormControl,InputLabel } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { apiURL } from "../../components/apiURL";
import { appURL } from "../../components/appURL";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import * as axios_org from "axios";
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

class CreateTeachers extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiFulfilled:false,
            DeptList:[],
            data : {
                TeacherName:"",
                DepartmentID:0,
                Depreciated:false
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(apiURL.Teachers.get,{id:id}).then(result => {
                    if(result.data.length !== 0)
                    {
                        let data = result.data[0];
                        this.setState({data,apiFulfilled:true});
                    }
                }
            );

        }
        axios.post(apiURL.Departments.list,{}).then(result => {
            this.setState({DeptList:result.data});
        });
        this.save = this.save.bind(this);
        this.onChangeTeacher = this.onChangeTeacher.bind(this);
        this.onChangeDepreciated =this.onChangeDepreciated.bind(this);
        this.onChangeDepartment= this.onChangeDepartment.bind(this);
    }
    onChangeTeacher = (event) => {
        const data = this.state.data;
        data.TeacherName = event.target.value;
        this.setState({ data });
    };
    onChangeDepartment = (event) => {
        const data = this.state.data;
        data.DepartmentID = event.target.value;
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
            url = apiURL.Teachers.edit;
        }
        else
        {
            url = apiURL.Teachers.create;
        }
        axios.post(url,data).then((result) => {
            window.location = appURL.Teachers.list;
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled,DeptList } = this.state;
        return (
            <Grid container direction="column" spacing={2} >
                <Grid item>
                    <TextField fullWidth={true} value={this.state.data.TeacherName} label="Teacher Name" onChange={this.onChangeTeacher} variant="filled" />
                </Grid>
                <Grid item>
                    <FormControl fullWidth={true} variant="filled">
                        <InputLabel>Department</InputLabel>
                        <Select value={this.state.data.DepartmentID} onChange={this.onChangeDepartment} fullWidth={true}>
                            {DeptList.map(dep =>{
                                return(
                                    <MenuItem value={dep.id}>{dep.DepartmentName}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container direction="row" spacing={1}>
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

export default withRouter(CreateTeachers);