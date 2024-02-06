import nodemailer from 'nodemailer'
import { ScrapeAmazon } from './amazon_webscraper.mjs'

// Initialization of initial pricing and stock count
let initialPrice = 1
let initialAvailability = 'In Stock'
var htmlContent = ``

// sendStockMessage generates the message about the product stock changes
function sendStockMessage(title, img, price, availability, delivery, url){

    // if chancg in stock count occurs
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

// sendPriceMessage generates the message about the product price changes
function sendPriceMessage(title, img, price, availability, delivery, url){

    // if change in price occurs
    if (price != initialPrice){
        var percentChange = ( ( price-initialPrice ) / initialPrice ) *100

        // if price increases > 20%
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

        // if price decreases > 20%
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

//  sendEmail generates the email body and configuration and sends the email to recipient via transponder protocol 
export async function sendEmail(url) {
    
    try {   
        // scrape product webpage
        var [ title, img, price, availability, delivery, buyUrl ] = await ScrapeAmazon(url);

        // price-change and stock-change validation
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
            // if price change was detected and relayed
            if (priceMessage != null){
                            const info = await transporter.sendMail(priceMessage);
                            console.log("Email sent: " + info.response);  
                        }
            // if stock count change was detected and relayed
            if (stockMessage != null) {
                const info = await transporter.sendMail(stockMessage);
                console.log("Email sent: " + info.response);  
            }

        }

        // if no change in product attribute was detected and relayed
        else {
            console.log("No notification needed")
        }

    // failure to fetch web results
    } catch (error) {
        console.error('Internal Error:', error);
    }

}