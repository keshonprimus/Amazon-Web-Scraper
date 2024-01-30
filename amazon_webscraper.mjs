import puppeteer from 'puppeteer'

// Scrape Amazon Webpage
export async function ScrapeAmazon(url){    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    // Element image
    const [elimg] = await page.$x('//*[@id="landingImage"]');
    const elsrc = await elimg.getProperty('src');
    const elimgvalue = await elsrc.jsonValue();

    //Element title
    const [eltitle] = await page.$x('//*[@id="productTitle"]')
    const eltitletxt = await eltitle.getProperty('textContent')
    const eltitlerawtxt = await eltitletxt.jsonValue();

    //Element price
    const [elprice] = await page.$x('//*[@id="tp_price_block_total_price_ww"]/span[1]')
    const elpricetxt = await elprice.getProperty('textContent')
    const elpricerawtxt = await elpricetxt.jsonValue();

    // Elment availability
    const [elavailable] = await page.$x('//*[@id="availability"]')
    const elavailabletxt = await elavailable.getProperty('textContent')
    const elavailablerawtxt = await elavailabletxt.jsonValue();
    const elavailableclean = elavailablerawtxt.trim();


    await(browser.close())
    
    return [eltitlerawtxt, elimgvalue, elavailableclean, elpricerawtxt, url]
}

