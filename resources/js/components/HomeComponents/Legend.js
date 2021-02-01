import React from 'react';
import clsx from 'clsx';

const legendBox = {
    display: 'inline-block',
    marginTop: '20px',
    marginRight: '5px',
    width: '20px',
    height: '20px',
    border: '1px solid black'
};

const legendOngoing = {
    display: 'inline-block',
    marginTop: '20px',
    marginRight: '5px',
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: '#32CD32'
};
const legendFinished = {
    display: 'inline-block',
    marginTop: '20px',
    marginRight: '5px',
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: '#00B2EE'
};

const legendPending = {
    display: 'inline-block',
    marginTop: '20px',
    marginRight: '5px',
    width: '20px',
    height: '20px',
    border: '1px solid black',
    backgroundColor: '#ffa726'
};
const legendPos = {
    display: 'inline-block',
    marginRight: '5px',
    marginBottom: '5px'
    // float: "left"
};

const Legend = () => {
    return (
        <>
            <div style={legendPos}>
                <b>Legend: </b>
            </div>
            <div style={legendBox}></div>
            <div style={legendPos}>Not yet started</div>
            <div style={legendOngoing}></div>
            <div style={legendPos}>On-going</div>
            <div style={legendFinished}></div>
            <div style={legendPos}>Finished</div>
            <div style={legendPending}></div>
            <div style={legendPos}>Pending</div>
        </>
    );
};
export default Legend;
