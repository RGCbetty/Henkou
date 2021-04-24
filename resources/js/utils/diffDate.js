import moment from 'moment';

const durationAsString = (start, end) => {
	const duration = moment.duration(moment(end).diff(moment(start)));

	//Get Days
	const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
	const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all

	//Get Hours
	const hours = duration.hours();
	const hoursFormatted = hours ? `${hours}h ` : '';

	//Get Minutes
	const minutes = duration.minutes();
	const minutesFormatted = minutes ? `${minutes}m ` : '';

	const seconds = duration.seconds();
	const secondsFormatted = `${seconds}s`;

	return [daysFormatted, hoursFormatted, minutesFormatted, secondsFormatted].join('');
};
export default durationAsString;
