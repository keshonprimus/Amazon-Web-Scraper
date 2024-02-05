import puppeteer from 'puppeteer'


// Scrape Amazon Webpage
export async function ScrapeAmazon(url){    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Element image
    const [elimg] = await page.$x('//*[@id="landingImage"]');
    const elsrc = await elimg.getProperty('src');
    const elimgvalue = await elsrc.jsonValue();

    //Element title
    const [eltitle] = await page.$x('//*[@id="productTitle"]');
    const eltitletxt = await eltitle.getProperty('textContent');
    const eltitlerawtxt = await eltitletxt.jsonValue();

    //Element price
    const [elprice] = await page.$x('//*[@id="tp_price_block_total_price_ww"]/span[1]');
    const elpriceraw = await elprice.getProperty('textContent');
    const elpricejson = await elpriceraw.jsonValue();
    const elpricevalue = elpricejson.slice(1);
    const elpricefloat = parseFloat(elpricevalue);

    // Element availability
    const [elavailable] = await page.$x('//*[@id="availability"]');
    const elavailabletxt = await elavailable.getProperty('textContent');
    const elavailablerawtxt = await elavailabletxt.jsonValue();
    const elavailableclean = elavailablerawtxt.trim();

    // Element Delivery Estimate
    const [eldelivery] = await page.$x('//*[@id="mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE"]');
    const eldeliverytxt = await eldelivery.getProperty('textContent');
    const eldeliveryrawtxt = await eldeliverytxt.jsonValue();
    
    await(browser.close())

    return [eltitlerawtxt, elimgvalue, elpricefloat, elavailableclean, eldeliveryrawtxt, url]
}
