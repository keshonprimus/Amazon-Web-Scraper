import schedule from 'node-schedule';
import { sendEmail } from './render_results.mjs';


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

let task; 

task = schedule.scheduleJob('* * /23 * *' , function(){
    const urlArgument = process.argv[2];
    const estFormattedString = formatter.format(new Date());
    console.log('scheduled job execution at ' + estFormattedString);
    sendEmail(urlArgument);
});