// deno run -A getUnit.js
// 获取单位信息
import * as cheerio from 'npm:cheerio';

const BASE_URL = 'https://liquipedia.net';
const UNIT_URL = `${BASE_URL}/warcraft/Dragonhawk_Rider`;

const res = await fetch(UNIT_URL);
const html = await res.text();
const $ = cheerio.load(html);

var infoObj = {}
infoObj.name = $('title').text().split(' - ')[0]
infoObj.icon = `${BASE_URL}${ $('.infobox-center img').attr('src')}`;
$('.fo-nttax-infobox>div').each(function (i, elem) {
    var [key, val] = [$(this).find('.infobox-cell-2').text(), $(this).find('.infobox-cell-2').next().text()]
    if (key && val) {
        key = getStr(key).split(':')[0]
        val = getStr(val)
        infoObj[key] = val
    }
});

var spells = []
$('table[cellpadding=0]').each(function (i, elem) {
    var $tr = $(this).children().children()
    var tit = $tr.eq(0).text()

    var icon = $tr.eq(1).find('td').eq(0).find('img').attr('src')

    var obj = { tit: getStr(tit), icon: `${BASE_URL}${icon}` }

    $tr.eq(1).find('td').eq(1).find('tr').each(function (j, tr) {
        var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
        obj[getStr(key)] = getStr(val)
    });

    $tr.eq(3).find('td').eq(0).find('tr').each(function (j, tr) {
        var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
        obj[getStr(key)] = getStr(val)
    });

    $tr.eq(5).find('td').eq(0).find('tr').each(function (j, tr) {
        var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
        obj[getStr(key)] = getStr(val)
    });

    if (obj['Cast Type']) {
        spells.push(obj)
    }
});
infoObj.spells = spells

await Deno.writeTextFile('./unit.json', JSON.stringify(infoObj, null, 2));
console.log("unit have been saved to unit.json");

function getStr(val) {
    return val.replace(/\s+/g, ' ').replace(/\\n/g, '').trim()
}
