// $ deno run -A ./getDataProp.js
import cheerio from "npm:cheerio";
import { format } from "npm:prettier";
import beautify from "npm:js-beautify";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

var obj = {
  handleChange(index) {
    this.index = index;
    var selected = this.tabs[index].key;
    this.changeNation(selected);
  },
  getList(data) {
    data = data.map(item => item[0]);
    data = data.filter(item => item.length > 10);
    data = data.map(item => {
      let arr = item.split("</table>");
      arr = arr.slice(1);
      let [name, html] = [this.getName(arr[0]), arr.join("</table>")];
      var type = name.includes("：") ? "hero" : "unit"
      var nation = name.slice(0, 2);
      if (name.includes("：")) {
        name = name.slice(3);
      }
      return {
        name,
        type,
        nation,
        html,
      };
    });
    return data;
  },
  getName(html) {
    let temp = html.match(/<td([\S\s]*?)<\/td>/g);
    let name = temp[2] || temp[0];
    name = name.replace(/<([\S\s]*?)>/g, "");
    name = name.replace(/\s*/g, "");
    name = name.replace(/[\(（].*[\)）]/, "");
    return name == "状态" ? "破法" : name;
  },
  changeNation(nation) {
    // document.querySelector(".content-wrap").scrollTo(0, 0);
    this.current.list = this[nation];
    this.current.nation = nation;
    this.changeUnit(0);
  },
  changeUnit(index) {
    this.current.html = this.current.list[index].html;
    this.current.index = index;
  }
}

const json = Deno.readTextFileSync("../src/common/json/creeps.json");
var list = JSON.parse(json)
// var list = obj.getList(list)
// var listNew = list
// for (let item of listNew) {
//   var $ = cheerio.load(item.html);
//   $('body table').eq(0).find('tr').eq(2).remove()
//   var html = '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover">' + $('body').html()
//   writeFile(`./output/unit/${item.nation}-${item.type}-${item.name}.html`, html);
// }

// setTimeout(() => {
//   formatHtml()
// }, 100)
writeFile(`./output/creeps.json`, JSON.stringify(list, null, 2));


async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
}

async function formatHtml() {
  const folderPath = "./output/unit";
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


