import React from 'react';
import clsx from 'clsx';

const legendBox = {
	display: 'inline-block',
	marginTop: '0px',
	marginRight: '5px',
	width: '20px',
	height: '20px',
	border: '1px solid black'
};

const legendOngoing = {
	display: 'inline-block',
	marginTop: '0px',
	marginRight: '5px',
	width: '20px',
	height: '20px',
	border: '1px solid black',
	backgroundColor: '#9FDF7D'
};
const legendFinished = {
	display: 'inline-block',
	marginTop: '0px',
	marginRight: '5px',
	width: '20px',
	height: '20px',
	border: '1px solid black',
	backgroundColor: '#00B2EE'
};

const legendPending = {
	display: 'inline-block',
	marginTop: '0px',
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

const Legend = (props) => {
	return (
		<>
			<div style={legendPos}>
				<b>Legend: </b>
			</div>
			<div style={legendBox}></div>
			<div style={legendPos}>{props.title1} </div>
			<div style={legendOngoing}></div>
			<div style={legendPos}>{props.title2}</div>
			{!props.hideSomeLegends ? (
				<>
					<div style={legendFinished}></div>
					<div style={legendPos}>{props.title3}</div>
					<div style={legendPending}></div>
					<div style={legendPos}>{props.title4}</div>
				</>
			) : null}
		</>
	);
};
export default Legend;
