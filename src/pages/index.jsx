import React from 'react';
import { Grid,Button } from "@material-ui/core";
export default function Homepage()
{
    return (
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item fullWidth={true} sm={2}>
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
                        <Button color="primary"  variant="contained" href="/Teachers/">Teachers</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item fullWidth={true} sm={2}>
                <Grid fullWidth={true} container direction="column"  justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary"  variant="contained" href="/TeacherGroups/">Teacher Groups</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Rooms/">Rooms</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Programs/">Room Groups</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/TimeSlots/">TimeSlots</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button  fullWidth={true} color="primary"  variant="contained" href="/TimeSlotGroups/">TimeSlot Groups</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary"  variant="contained" href="/Teachers/">Sections</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item fullWidth={true} sm={2}>
                <Grid fullWidth={true} container direction="column"  justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary"  variant="contained" href="/Settings/">Section Groups</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Regions/">Courses</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Programs/">Electives</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Departments/">Semester Registrations</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button  fullWidth={true} color="primary"  variant="contained" href="/DayLists/">Section Registrations</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary"  variant="contained" href="/Teachers/">Lectures</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item fullWidth={true} sm={2}>
                <Grid fullWidth={true} container direction="column"  justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary"  variant="contained" href="/Settings/">Faculty Preferences</Button>
                    </Grid>
                    <Grid item fullWidth={true}>
                        <Button fullWidth={true} color="primary" variant="contained" href="/Regions/">View Timetables</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}