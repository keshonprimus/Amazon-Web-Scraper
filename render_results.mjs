import nodemailer from 'nodemailer'
import { ScrapeAmazon } from './amazon_webscraper.mjs'


var amazonUrl = ''

var { initTitle, initImg, initPrice, initAvailbility } = [ ' ', ' ', 1, ' ' ]


function sendStockMessage(availability){
    if (availability != initAvailbility) {
        if (availability == 'In Stock') {
            const htmlContent = `
                <h2>Your favorite Amazon product is back in stock!</h2>
                <p>Product: ${title}</p>
                <p>Price: ${price}</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initAvailbility = availability
        }
        else {
            const htmlContent = `
                <h2>Your favorite Amazon product is low in stock!</h2>
                <p>Product: ${title}</p>
                <p>Price: ${price}</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initAvailbility = availability
        }
        return {
            from: "keshonprimus21@hotmail.com",
            to: 'keshonprimus4@gmail.com',
            subject: "Your Amazon Product Update",
            html: htmlContent,
        };
    }
    return null;
}

function sendPriceMessage(price){
    if (price != initPrice){
        percentChange = ( ( price-initPrice ) / initPrice ) *100
        if ( percentChange > 20 ) {
            const htmlContent = `
                <h2>Your favorite Amazon product just went up in price!</h2>
                <p>Product: ${title}</p>
                <p>New Price: ${price} (was ${initPrice})</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
        }
        else if ( percentChange < 20 ) {
            const htmlContent = `
                <h2>Your favorite Amazon product just dropped in price!</h2>
                <p>Product: ${title}</p>
                <p>New Price: ${price} (was ${initPrice})</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
        }
        return {
            from: "keshonprimus21@hotmail.com",
            to: 'keshonprimus4@gmail.com',
            subject: "Your Amazon Product Update",
            html: htmlContent,
        };
    }

}




