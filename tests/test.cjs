const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' }).catch(e => console.log('GOTO ERROR:', e.message));
    
    // Wait for the Run Query button and click it
    try {
        await page.waitForSelector('button.btn');
        await page.click('button.btn');
        
        // Wait a bit for results to render
        await new Promise(r => setTimeout(r, 1000));
        
        // Read the text inside the results container
        const resultsText = await page.$eval('.results-container', el => el.innerText);
        console.log('RESULTS TEXT:', resultsText);
    } catch (e) {
        console.log('TEST ERROR:', e.message);
    }
    
    await browser.close();
})();
