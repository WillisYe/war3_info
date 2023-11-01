// $ deno run -A ./getDataHero.js
import cheerio from "npm:cheerio";
import { format } from "npm:prettier";
import beautify from "npm:js-beautify";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

const json = Deno.readTextFileSync("../src/common/json/heroData.json");
var list = JSON.parse(json)
var listNew = list.filter(item => item[0].includes("中立"))
for (let item of listNew) {
  var $ = cheerio.load(item[1]);
  $('#zoom table').eq(0).find('tr').eq(0).find('td').eq(2).remove()
  var html = '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover">' + $('#zoom').html()
  writeFile(`./output/hero/${item[0]}.html`, html);
}

formatHtml()

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
}

async function formatHtml() {
  const folderPath = "./output/hero";
  const htmlFiles = [];

  for await (const file of walk(folderPath, { exts: [".html"] })) {
    htmlFiles.push(file.path);
  }

  for (const file of htmlFiles) {
    const data = await Deno.readTextFile(file);
    const formattedData = await beautify.html(data, {
      parser: "html",
      "indent_size": 2,
      "indent_char": " "
    });
    await Deno.writeTextFile(file, formattedData);
  }
}
