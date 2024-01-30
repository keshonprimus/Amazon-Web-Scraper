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

    await(browser.close())
    
    return [eltitlerawtxt, elimgvalue, url]
}

