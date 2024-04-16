import React from 'react';
import { Typography, Container } from '@mui/material';
import DriverAppBar from './DriverPortal/DriverAppBar';

export default function DriverGuidelines() {
    return (
        <div>
            <DriverAppBar/>
            <Container style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Truck Driver Driving Guidelines</Typography>
                <Typography variant="body1" paragraph>Truck driver driving guidelines are crucial for ensuring safety on the roads. These guidelines encompass various aspects such as speed limits, proper use of signals, adherence to traffic rules, and maintenance of the vehicle. One of the primary rules is to strictly adhere to speed limits, as over-speeding can lead to accidents, especially when driving large trucks with heavy loads. Additionally, maintaining a safe following distance is essential to allow for ample reaction time in case of unexpected events on the road.</Typography>
                <Typography variant="body1" paragraph>Furthermore, truck drivers must be vigilant about their surroundings and constantly check their blind spots before changing lanes or making turns. Utilizing signals effectively helps communicate intentions to other drivers, reducing the risk of collisions. Regular vehicle maintenance is also emphasized in driving guidelines to ensure that trucks are in optimal condition, reducing the likelihood of mechanical failures that could lead to accidents. By following these guidelines, truck drivers contribute to safer roads for themselves and other motorists.</Typography>
                <Typography variant="body1">Incorporating these guidelines into daily driving routines is essential for all truck drivers. Wearing a seatbelt, following the speed limit, adhering to school/work zone speed limits, arriving with all items in good condition, and stopping for trains at railroad crossings are among the good driving habits that should be practiced consistently.</Typography>
                <Typography variant="body1">However, truck drivers should avoid engaging in bad driving habits such as texting and driving, speeding, getting into a wreck, running a red light/stop sign, impaired driving, and off-roading. These habits not only endanger the driver and others on the road but also violate traffic laws and regulations. It's imperative for truck drivers to prioritize safety and adhere to responsible driving practices at all times to ensure the well-being of themselves and other road users.</Typography>
            </Container>
        </div>
    );
}
