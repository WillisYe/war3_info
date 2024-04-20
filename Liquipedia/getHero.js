// deno run -A getHero.js
// 获取单位信息
import * as cheerio from 'npm:cheerio'

const BASE_URL = 'https://liquipedia.net'
// const HERO_URL = `${BASE_URL}/warcraft/Dragonhawk_Rider`;

// const res = await fetch(HERO_URL);
// const html = await res.text();
const html = await Deno.readTextFile('./Alchemist-LiquipediaWarcraftWiki_1288136237.html')
const $ = cheerio.load(html)

var infoObj = {}
infoObj.name = $('.fo-nttax-infobox .infobox-header').eq(0).text().replace('[e][h]', '')
infoObj.icon = `${BASE_URL}${$('.infobox-image img').eq(0).attr('src')}`
var levelsObj = {}
$('.fo-nttax-infobox>div').each(function (i, elem) {
  var [key, val] = [$(this).find('.infobox-cell-2').text(), $(this).find('.infobox-cell-2').next().text()]
  if (key && val) {
    key = getStr(key).split(':')[0]
    val = getStr(val)
    infoObj[key] = val
  }

  var $Attributes = $(this).find('.infobox-cell-3')
  if ($Attributes.length) {
    $Attributes.each(function (i, elem) {
      var [key, val] = [$(this).find('a').attr('title'), $(this).text()]
      if (key && val) {
        key = getStr(key).split(':')[0]
        val = getStr(val)
        if (!infoObj[key]) {
          infoObj[key] = val
        } else {
          infoObj[val] = key
        }
      }
    })
  }

  var $levels = $(this).find('.infobox-cell-4')
  if ($levels.length) {
    var [key, val1, val5, val10] = [$levels.eq(0).text(), $levels.eq(1).text(), $levels.eq(2).text(), $levels.eq(3).text()]
    levelsObj[key] = [val1, val5, val10]
  }
})

infoObj.levelsObj = levelsObj

var spells = []
$('.spellcard').each(function (i, elem) {
  var $tr = $(this).find('tr')
  var tit = $tr.eq(0).text()

  var icon = $tr.eq(1).find('td').eq(0).find('img').attr('src')

  var obj = {
    tit: getStr(tit),
    icon: `${BASE_URL}${icon}`,
    des: getStr($(this).find('.spellcard-description').text()),
  }

  $tr
    .eq(1)
    .find('td')
    .eq(1)
    .find('tr')
    .each(function (j, tr) {
      var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
      obj[getStr(key)] = getStr(val)
      var $td3 = $(this).find('td').eq(3)
      if ($td3.text()) {
        var [key1, val1] = $td3.text().split(':')
        obj[getStr(key1)] = getStr(val1)
      }
    })

  $tr
    .eq(3)
    .find('td')
    .eq(0)
    .find('tr')
    .each(function (j, tr) {
      var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
      obj[getStr(key)] = getStr(val)
      var $td3 = $(this).find('td').eq(3)
      if ($td3.text()) {
        var [key1, val1] = $td3.text().split(':')
        obj[getStr(key1)] = getStr(val1)
      }
    })

  $tr
    .eq(5)
    .find('td')
    .eq(0)
    .find('tr')
    .each(function (j, tr) {
      var [key, val] = [$(this).find('td').eq(0).text(), $(this).find('td').eq(2).text()]
      obj[getStr(key)] = getStr(val)
      var $td3 = $(this).find('td').eq(3)
      if ($td3.text()) {
        var [key1, val1] = $td3.text().split(':')
        obj[getStr(key1)] = getStr(val1)
      }
    })

  if (obj['Cast Type']) {
    spells.push(obj)
  }
})
infoObj.spells = spells

await Deno.writeTextFile('./hero.json', JSON.stringify(infoObj, null, 2))
console.log('hero have been saved to hero.json')

function getStr(val) {
  return val.replace(/\s+/g, ' ').replace(/\\n/g, '').trim()
}
