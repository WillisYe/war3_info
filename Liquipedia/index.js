// deno run -A index.js
import * as cheerio from 'npm:cheerio';

var html = Deno.readTextFileSync('./DragonhawkRider-LiquipediaWarcraftWiki_1730832384.html')
const $ = cheerio.load(html);

var infoObj = {}
$('.fo-nttax-infobox>div').each(function (i, elem) {
    var [key, val] = [$(this).find('.infobox-cell-2').text(), $(this).find('.infobox-cell-2').next().text()]
    if (key && val) {
        key = getStr(key).split(':')[0]
        val = getStr(val)
        infoObj[key] = val
    }
});
infoObj.icon = $('.infobox-center img').attr('src')

console.log(JSON.stringify(infoObj, null, 2))

var spells = []
$('table[cellpadding=0]').each(function (i, elem) {
    var $tr = $(this).children().children()
    var tit = $tr.eq(0).text()

    var icon = $tr.eq(1).find('td').eq(0).find('img').attr('src')

    var obj = { tit: getStr(tit), icon }

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

function getStr(val) {
    return val.replace(/\s+/g, ' ').replace(/\\n/g, '').trim()
}

console.log(spells.length)
console.log(JSON.stringify(spells, null, 2))