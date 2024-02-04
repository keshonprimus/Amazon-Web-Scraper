This project will invoke a simple webscraper for a particular Amazon product. It is designed to launch a browser and conduct a webscrape for an amazon product, prodvided the url. The scrape will be automated to be conducted every 12 hours and relay any change in the availibility of the product via email notifications.

BEFORE YOU RUN: 

    1. In schedule_scrape, set the desired configurations for job scheduling.
        E.g
            ` task = schedule.scheduleJob('* * /23 * *' , function()){} ` will run the job every 23 hours. For more information on job scheduling, see https://www.npmjs.com/package/node-schedule

        Default configuration is set to run every 23 hours

    2. In schedule_scrape, set the desired timezone configurations for logging. Default configurations set to EN-US, timezone: New York.


TO RUN: ` node --experimental-modules schedule_scrape.mjs <your_target_url> `


