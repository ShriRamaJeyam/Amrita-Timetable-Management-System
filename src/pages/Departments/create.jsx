import React from "react";
import { TextField,Button,Grid, Typography,Checkbox,FormControlLabel } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { apiURL } from "../../components/apiURL";
import * as axios_org from "axios";
import { appURL } from "../../components/appURL";
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
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

class CreateDepartments extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            apiFulfilled:false,
            data : {
                DepartmentName:"",
                Depreciated:false
            }
        };
        const { edit , match:{params:{_id}} } = props;
        if(edit)
        {
            let id=parseInt(_id);
                axios.post(apiURL.Departments.get,{id:id}).then(result => {
                    if(result.data.length !== 0)
                    {
                        let data = result.data[0];
                        this.setState({data,apiFulfilled:true});
                    }
                }
            );

        }
        this.save = this.save.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.onChangeDepreciated =this.onChangeDepreciated.bind(this);
    }
    onChangeDepartment = (event) => {
        const data = this.state.data;
        data.DepartmentName = event.target.value;
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
            url = apiURL.Departments.edit;
        }
        else
        {
            url = apiURL.Departments.create;
        }
        axios.post(url,data).then((result) => {
            window.location = appURL.Departments.list;
        });
    };
    render()
    {
        const { edit } = this.props;
        const { apiFulfilled } = this.state;
        return (
            <Grid container direction="column" spacing={2} >
                <TextField value={this.state.data.DepartmentName} label="Department Name" onChange={this.onChangeDepartment} variant="filled"></TextField>
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

export default withRouter(CreateDepartments);