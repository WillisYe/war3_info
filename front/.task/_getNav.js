// $ deno run -A ./test.js
import cheerio from "npm:cheerio";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

const html = Deno.readTextFileSync("test.html");
const $ = cheerio.load(html);

var list = []
$('table.navbox-subgroup a').each(function() {
  list.push(({
    ename: $(this).text().replaceAll('\n', '').replace(/\s+/g, ' '),
    href: $(this).attr('href')
  }))
})

writeFile("output/nav.json", JSON.stringify(list, null, 2));

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
}