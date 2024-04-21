import React from 'react';
import { Box, Paper, Typography, Divider, Grid, FormControl, Container } from '@mui/material';
import DriverAppBar from './DriverPortal/DriverAppBar';

export default function DriverGuidelines() {
    return (
        <div>
            <DriverAppBar/>
            <Paper style={{ maxWidth: 800, margin: '0 auto', padding: '20px', marginTop: '50px' }}>
                <Typography variant="h4" gutterBottom>Truck Driver Driving Guidelines</Typography>
                <Typography variant="body1" paragraph>Truck driver driving guidelines are crucial for ensuring safety on the roads. These guidelines encompass various aspects such as speed limits, proper use of signals, adherence to traffic rules, and maintenance of the vehicle. Sponsors have the ability to review a driver's trip and add points for good behavior.</Typography>
                <Typography variant="body1" paragraph>Driving habits that earn points:</Typography>
                <Typography variant="body1" paragraph>1: Wearing a seatbelt</Typography>
                <Typography variant="body1" paragraph>2: Following the speed limit</Typography>
                <Typography variant="body1" paragraph>3: Following school/work zone speed limits</Typography>
                <Typography variant="body1" paragraph>4: Arrived with all items in good condition</Typography>
                <Typography variant="body1" paragraph>5: Stopping for trains at railroad crossings</Typography>
                <Typography variant="body1" paragraph>Truck drivers should avoid engaging in bad driving habits. These habits endager both the drriver and the people on the road. Sponsors have the ability to review a driver's trip and take away points for any negative incidents.</Typography>
                <Typography variant="body1" paragraph>Driving habits that negate points:</Typography>
                <Typography variant="body1" paragraph>1: Texting and driving</Typography>
                <Typography variant="body1" paragraph>2: Speeding</Typography>
                <Typography variant="body1" paragraph>3: Getting into a wreck</Typography>
                <Typography variant="body1" paragraph>4: Running a red light/stop sign</Typography>
                <Typography variant="body1" paragraph>5: Impaired driving</Typography>
                <Typography variant="body1" paragraph>6: Off-roading</Typography>
            </Paper>
        </div>
    );
}
