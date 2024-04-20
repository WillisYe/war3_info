// deno run -A getHeroes.js
// 获取单位信息
import * as cheerio from 'npm:cheerio';

const BASE_URL = 'https://liquipedia.net';
// const HEROES_URL = `${BASE_URL}/warcraft/Hero`;

async function fetchHeros() {
    // const res = await fetch(HEROES_URL);
    // const htmlHeros = await res.text();
    const htmlHeros = await Deno.readTextFile('./Hero-LiquipediaWarcraftWiki_1094383615.html');
    const $ = cheerio.load(htmlHeros);

    const elements = $('.table-responsive tbody tr').get();
    const total = elements.length;
    let completed = 0;

    const navsPromises = elements.map((elem, index) => {
        return (async () => {
            let [key, val, icon] = [
                $(elem).find('td').eq(0).text(), 
                $(elem).find('td a').eq(0).attr('href'), 
                $(elem).find('td img').eq(0).attr('src')
            ];
            if (key && val) {
                key = getStr(key).split(':')[0];
                val = BASE_URL + getStr(val);

                // const response = await fetch(val);
                // const html = await response.text();
                // const $inner = cheerio.load(html);

                // let infoObj = {
                //     icon: `${BASE_URL}${$inner('.fo-nttax-infobox .image img').attr('src')}`,
                //     Description: $inner('.mw-parser-output p').text().replace('\n', '')
                // };
                // $inner('.fo-nttax-infobox>div').each((i, elem) => {
                //     let [key, val] = [$inner(elem).find('.infobox-cell-2').text(), $inner(elem).find('.infobox-cell-2').next().text()];
                //     if (key && val) {
                //         key = getStr(key).split(':')[0];
                //         val = getStr(val);
                //         infoObj[key] = val;
                //     }
                // });

                // 更新进度
                completed++;
                console.log(`Progress: ${completed}/${total}; ${key} has been fetched`);

                return {
                    name: key,
                    url: val,
                    icon: `${BASE_URL}${icon}`,
                    // ...infoObjs
                };
            }
        })();
    });

    const navs = await Promise.all(navsPromises);
    return navs.filter(nav => nav !== undefined);
}

function getStr(val) {
    return val.replace(/\s+/g, ' ').replace(/\\n/g, '').trim();
}

async function main() {
    const heroes = await fetchHeros();
    await Deno.writeTextFile('./heroes.json', JSON.stringify(heroes, null, 2));
    console.log("Heroes have been saved to heroes.json");
}

main();