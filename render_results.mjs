import nodemailer from 'nodemailer'
import { ScrapeAmazon } from './amazon_webscraper.mjs'


let initialPrice = 1
let initialAvailability = 'In Stock'
var htmlContent = ``


function sendStockMessage(title, img, price, availability, delivery, url){

    if (availability != initialAvailability) {
        if (availability == 'In Stock') {
            htmlContent = `
                <h2>Your tracked product is back in stock!</h2>
                <h4>${title}</h4>
                <p><strong>Price:</strong> $${price.toFixed(2)}</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p><strong>Earliest <u>FREE</u> Delivery:</strong> ${delivery}</p>
                <p><a href="${url}" style="text-align: center;"><strong>BUY NOW</strong></a></p>
            </div>`
            initialAvailability = availability
        }
        else {
            htmlContent = `
                <h2>Your tracked product is low in stock!</h2>
                <h4>${title}</h4>
                <p><strong>Price:</strong> $${price.toFixed(2)}</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p><strong>Earliest <u>FREE</u> Delivery:</strong> ${delivery}</p>
                <p><a href="${url}" style="text-align: center;"><strong>BUY NOW</strong></a></p>
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

function sendPriceMessage(title, img, price, availability, delivery, url){

    if (price != initialPrice){
        var percentChange = ( ( price-initialPrice ) / initialPrice ) *100
        if ( percentChange > 20 ) {
            htmlContent = `
                <h2>Your tracked product just went up in price!</h2>
                <h4>${title}</h4>
                <p><strong>New Price:</strong> $${price.toFixed(2)} (was <strike>$${initialPrice.toFixed(2)}</strike>)</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p><strong>Earliest <u>FREE</u> Delivery:</strong> ${delivery}</p>
                <p><a href="${url}" style="text-align: center;"><strong>BUY NOW</strong></a></p>
            </div>`
            initialPrice = price
        }
        else if ( percentChange < 20 ) {
            htmlContent = `
                <h2>Your tracked product just dropped in price!</h2>
                <h4${title}</h4>
                <p><strong>New Price:</strong> $${price.toFixed(2)} (was <strike>$${initialPrice.toFixed(2)}</strike>)</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <div style="text-align: center;">
                <img src="${img}" alt="Product Image" style="width: 50%;">
                <p><strong>Earliest <u>FREE</u> Delivery:</strong> ${delivery}</p>
                <p><a href="${url}" style="text-align: center;"><strong>BUY NOW</strong></a></p>
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
    else {
        return null;
    }

}


export async function sendEmail(url) {
    
    try {    
        var [ title, img, price, availability, delivery, buyUrl ] = await ScrapeAmazon(url);

        var stockMessage = sendStockMessage(title, img, price, availability, delivery, buyUrl)
        var priceMessage = sendPriceMessage(title, img, price, availability, delivery, buyUrl)
    
        if (stockMessage!= null || priceMessage != null){
            
            const transporter = nodemailer.createTransport({
                host: "smtp.elasticemail.com",
                port: 2525,
                secure: false,
                auth: {
                    user: "<user-defined>",
                    pass: "<user-defined>"
                }
            });

            if (priceMessage != null){
                            const info = await transporter.sendMail(priceMessage);
                            console.log("Email sent: " + info.response);  
                        }

            if (stockMessage != null) {
                const info = await transporter.sendMail(stockMessage);
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