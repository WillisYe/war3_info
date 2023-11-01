// $ deno run -A ./getDataUnit.js
// 待完成
import cheerio from "npm:cheerio";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

const html = Deno.readTextFileSync("Archmage.html");
const $ = cheerio.load(html);

var obj = {}
$('.fo-nttax-infobox>div').each(function (index, item) {
  switch (index) {
    case 0:
      obj.name = $(item).text()
      break;
    case 1:
      obj.img = $(item).find('img').attr('src')
      break;
    case 2:
      break;
    case 3:
    case 4:
      $(item).find('.infobox-cell-3').each(function (j, item1) {
        var key = $(item1).find('a').attr('title')
        var val = $(item1).text()
        if ((/\d+/).test(val)) {
          obj[key] = val
        } else {
          obj[val] = key
        }
      })
      break;
    case 5:
    case 6:
      break;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      var key = $(item).find('a').attr('title') || $(item).find('.infobox-cell-2').eq(0).text()
      var val = $(item).find('.infobox-cell-2').eq(1).text()
      obj[key] = val
      break;
    case 12:
      break;
    case 13:
      obj['icon'] = $(item).find('img').attr('src')
      break;
    case 14:
      break;
    default:
      var key = $(item).find('.infobox-cell-4').eq(0).text()
      var val = []
      $(item).find('.infobox-cell-4').each(function (j, item1) {
          if (j>0) {
            val.push($(item1).text())
          }
      })
      obj[key] = val
      break;
  }
})

var data = changeData(obj)

writeFile("output/hero.json", JSON.stringify(data, null, 2));

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
}

function changeData(obj) {
  var _data = structuredClone(obj)
  return _data
}