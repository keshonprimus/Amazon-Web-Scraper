import nodemailer from 'nodemailer'
import { ScrapeAmazon } from './amazon_webscraper.mjs'


var amazonUrl = 'https://www.amazon.com/Crix-Original-Crackers-Packs-Individually/dp/B0CKWK5797/ref=sr_1_1?crid=2G035BAQNG7RF&keywords=crix&qid=1706038690&rdc=1&sprefix=crix%2Caps%2C260&sr=8-1'

let initialPrice = 1
let initialAvailability = 'In Stock'
var htmlContent = ``


function sendStockMessage(title, img, price, availability, url){

    if (availability != initialAvailability) {
        if (availability == 'In Stock') {
            htmlContent = `
                <h2>Your favorite Amazon product is back in stock!</h2>
                <p>Product: ${title}</p>
                <p>Price: ${price}</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initialAvailability = availability
        }
        else {
            htmlContent = `
                <h2>Your favorite Amazon product is low in stock!</h2>
                <p>Product: ${title}</p>
                <p>Price: ${price}</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initialAvailability = availability
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

    if (price != initialPrice){
        var percentChange = ( ( price-initialPrice ) / initialPrice ) *100
        if ( percentChange > 20 ) {
            htmlContent = `
                <h2>Your favorite Amazon product just went up in price!</h2>
                <p>Product: ${title}</p>
                <p>New Price: ${price} (was ${initialPrice})</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initialPrice = price
        }
        else if ( percentChange < 20 ) {
            htmlContent = `
                <h2>Your favorite Amazon product just dropped in price!</h2>
                <p>Product: ${title}</p>
                <p>New Price: ${price} (was ${initialPrice})</p>
                <p>Availability: ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p> <a href="${url}" style="text-align: center;">BUY NOW</a></p>
            </div>`
            initialPrice = price
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



async function sendEmail(url) {

    try {
        var [ title, img, price, availability, buyUrl ] = await ScrapeAmazon(url);
        
        if (sendStockMessage(title, img, price, availability, buyUrl) != null || sendPriceMessage(title, img, price, availability, buyUrl) != null){
            
            const transporter = nodemailer.createTransport({
                host: "smtp.elasticemail.com",
                port: 2525,
                secure: false,
                auth: {
                    user: "keshonprimus21@hotmail.com",
                    pass: "A6CC5ACA623C39D5A2F3E91BCEA2CD6F4053"
                }
            });

            if (sendStockMessage(title, img, price, availability, buyUrl) != null) {
                const info = await transporter.sendMail(sendStockMessage(title, img, price, availability, buyUrl));
                console.log("Email sent: " + info.response);  
            }
            
            if (sendPriceMessage(title, img, price, availability, buyUrl) != null){
                const info = await transporter.sendMail(sendPriceMessage(title, img, price, availability, buyUrl));
                console.log("Email sent: " + info.response);  
            }

        }

        else {
            console.log("No notification needed")
        }

    } catch (error) {
        console.error('Internal Error:', error);
    }
    

}


sendEmail(amazonUrl)