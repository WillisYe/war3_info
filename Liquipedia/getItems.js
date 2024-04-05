// deno run -A getItems.js
// 获取宝物信息
import * as cheerio from 'npm:cheerio';

const BASE_URL = 'https://liquipedia.net';
const ITEMS_URL = `${BASE_URL}/warcraft/Items`;

async function fetchItems() {
    const res = await fetch(ITEMS_URL);
    const htmlItems = await res.text();
    const $ = cheerio.load(htmlItems);

    const elements = $('.navbox-subgroup a').get();
    const total = elements.length;
    let completed = 0;

    const navsPromises = elements.map((elem, index) => {
        return (async () => {
            let [key, val] = [$(elem).text(), $(elem).attr('href')];
            if (key && val) {
                key = getStr(key).split(':')[0];
                val = BASE_URL + getStr(val);

                const response = await fetch(val);
                const html = await response.text();
                const $inner = cheerio.load(html);

                let infoObj = {
                    icon: `${BASE_URL}${$inner('.fo-nttax-infobox .image img').attr('src')}`,
                    Description: $inner('.mw-parser-output p').text().replace('\n', '')
                };
                $inner('.fo-nttax-infobox>div').each((i, elem) => {
                    let [key, val] = [$inner(elem).find('.infobox-cell-2').text(), $inner(elem).find('.infobox-cell-2').next().text()];
                    if (key && val) {
                        key = getStr(key).split(':')[0];
                        val = getStr(val);
                        infoObj[key] = val;
                    }
                });

                // 更新进度
                completed++;
                console.log(`Progress: ${completed}/${total}; ${key} has been fetched`);

                return {
                    name: key,
                    url: val,
                    ...infoObj
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
    const items = await fetchItems();
    await Deno.writeTextFile('./items.json', JSON.stringify(items, null, 2));
    console.log("Items have been saved to items.json");
}

main();