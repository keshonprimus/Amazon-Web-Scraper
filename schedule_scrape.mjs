import schedule from 'node-schedule';
import { sendEmail } from './render_results.mjs';

// Timezone configuration for logging of scheduler-executed tasks 
const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
});


const urlArgument = process.argv[2];

// isValodUrl checks if a string is a valid URL
function isValidURL(url) {
    // Regular expression for a simple URL validation
    const urlRegex = /^(http[s]?:\/\/)?[^\s(["<,>]*\.[^\s[",><]*$/;
    return urlRegex.test(url);
}

// instantiation of task
let task;

// Check if a valid URL is provided as an argument
if (urlArgument && isValidURL(urlArgument)) {
    // Schedule the task if the URL is valid
    task = schedule.scheduleJob('*/2 * * * *', function() {
        const estFormattedString = formatter.format(new Date());
        console.log('Scheduled job execution at ' + estFormattedString);
        sendEmail(urlArgument);
    });
} else {
    // Log error if the URL is invalid or not provided
    console.error('Invalid or missing URL argument. Please provide a valid URL.');
}