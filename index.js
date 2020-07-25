const puppeteer = require('puppeteer');

async function track(code){
    async function searchCode(page){
        const searchButton = await page.$('#btnPesq');

        await page.focus('#objetos');
        await page.keyboard.type(code);
        await searchButton.click();
    }

    async function getTracks(page){
        await page.waitFor('.sroDtEvent', { timeout: 3000 }).catch(e=>console.error('timeout'));
        const locations = await page.$$eval('.sroDtEvent', 
        locations=>locations.map(location=>location.innerText));
        const infos = await page.$$eval('.sroLbEvent', infos=>infos.map(info=>info.innerText));
        const tracks = [];

        locations.forEach((location, index)=>{
            const locationsParts = location.split('\n');
            const infosParts = infos[index].split('\n');
            const local = locationsParts[2];
            const date = locationsParts[0];
            const time = locationsParts[1];

            const status = infosParts[0];
            const info = infosParts[1];


            tracks.push({ 
                local, 
                data: date, 
                hora: time, 
                status,
                info
            });
        });

        return tracks;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www2.correios.com.br/sistemas/rastreamento/default.cfm');

    await searchCode(page);

    const tracks = await getTracks(page);
    await browser.close();

    return tracks;
}

module.exports = track;