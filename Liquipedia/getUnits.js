// deno run -A getUnits.js
// 获取单位信息
import * as cheerio from 'npm:cheerio';

const BASE_URL = 'https://liquipedia.net';
const UNITS_URL = `${BASE_URL}/warcraft/Units`;

async function fetchUnits() {
    const res = await fetch(UNITS_URL);
    const htmlUnits = await res.text();
    const $ = cheerio.load(htmlUnits);

    const elements = $('.template-box li').get();
    const total = elements.length;
    let completed = 0;

    const navsPromises = elements.map((elem, index) => {
        return (async () => {
            let [key, val, icon] = [
                $(elem).find('a').eq(0).attr('title'), 
                $(elem).find('a').eq(0).attr('href'), 
                $(elem).find('a').eq(0).find('img').attr('src')
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
    const units = await fetchUnits();
    await Deno.writeTextFile('./units.json', JSON.stringify(units, null, 2));
    console.log("Units have been saved to units.json");
}

main();