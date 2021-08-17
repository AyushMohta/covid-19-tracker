import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css';

function InfoBox(props) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/* Title i.e. Coronavirus cases */}
                <Typography className="infoBox__title" color="textSecondary">
                    {props.title}
                </Typography>

                {/* +120k Number of cases */}
                <h2 className="infoBox__cases">{props.cases}</h2>

                {/* 1.2M Total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {props.total} Total
                </Typography>

            </CardContent>
        </Card>
    );
}

export default InfoBox;
