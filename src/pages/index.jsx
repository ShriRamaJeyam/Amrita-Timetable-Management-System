import React from 'react';
import { Grid,Button } from "@material-ui/core";
export default function Homepage()
{
    return (
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item>
                <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid item>
                        <Button color="primary"  variant="contained" href="/Settings/">Settings</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" href="/Regions/">Regions</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" href="/Programs/">Programs</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" href="/Departments/">Departments</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary"  variant="contained" href="/DayLists/">DayLists</Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary"  variant="contained" href="/Courses/">Courses</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}