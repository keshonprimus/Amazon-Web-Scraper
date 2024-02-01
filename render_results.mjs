import nodemailer from 'nodemailer'
import { ScrapeAmazon } from './amazon_webscraper.mjs'


var amazonUrl = ''

var { initPrice, initAvailbility } = [ 1, ' ' ]


function sendStockMessage(title, img, price, availability, url){
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

function sendPriceMessage(title, img, price, availability, url){
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
    return null;

}


async function sendEmail() {

    try {
        var { title, img, price, availability, buyUrl } = await ScrapeAmazon(url);

        const transporter = nodemailer.createTransport({
            host: "smtp.elasticemail.com",
            port: 2525,
            secure: false,
            auth: {
                user: "keshonprimus21@hotmail.com",
                pass: "A6CC5ACA623C39D5A2F3E91BCEA2CD6F4053"
            }
        });
        if (sendStockMessage(title, img, price, availability, buyUrl) != null){
            const info = await transporter.sendMail(sendStockMessage(title, img, price, availability, buyUrl));
            console.log("Email sent: " + info.response);
        }
        else if (sendPriceMessage(title, img, price, availability, buyUrl) != null){
            const info = await transporter.sendMail(sendPriceMessage(title, img, price, availability, buyUrl));
            console.log("Email sent: " + info.response);
        }

    } catch (error) {
        console.error('Internal Error:', error);
    }
}

