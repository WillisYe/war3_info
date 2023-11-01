var Crawler = require("crawler");
const csv = require('csvtojson');
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DRsXT5ZJ6Oi55LPQ',
    database: 'war3'
});
let $sql = `CREATE TABLE hero_table( 
id INT NOT NULL AUTO_INCREMENT, 
nation VARCHAR(10) NOT NULL, 
name VARCHAR(10) NOT NULL, 
name_en VARCHAR(20) NOT NULL, 
img VARCHAR(40) NOT NULL, 
introduction VARCHAR(400) NOT NULL, 
level VARCHAR(1000) NOT NULL, 
params VARCHAR(1000) NOT NULL, 
skill VARCHAR(4000) NOT NULL, 
rate FLOAT NOT NULL, 
scope VARCHAR(10) NOT NULL,
main VARCHAR(10) NOT NULL,
hp VARCHAR(10) NOT NULL,
mp FLOAT NOT NULL, 
ll FLOAT NOT NULL, 
zl FLOAT NOT NULL, 
mj FLOAT NOT NULL, 
day INT NOT NULL, 
night VARCHAR(10) NOT NULL,
speed INT NOT NULL, 
PRIMARY KEY(id, name)) ENGINE = InnoDB DEFAULT CHARSET = utf8;
`;
pool.query($sql, function(err, results, fields) {
    if(err) {
        console.log("数据库创建失败", err)
    }
})

var itemCrawler = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    callback: function(error, res, done) {
        if(error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ 默认为 Cheerio 解析器http://game.17173.com/zt/pc/war3/1/5.shtml
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素 http://images.17173.com/game/2006/08/17/20060817134616099.gif
            $("br,p:empty").remove();
            let $wrap = $("strong").parent().parent().parent().next("tr").find("td>span");
            let $tableInfo = $wrap.find("table").eq(0);
            let nameStr = $tableInfo.find("tr").eq(1).text().trim();
            if(!nameStr) {
                nameStr = "不死：死亡骑士";
            }
            let index = nameStr.indexOf("：");
            let nation = nameStr.slice(0, index).trim();
            if(nation === "人类") {
                nation = "人族"
            }
            let name = nameStr.slice(index + 1).trim();
            let name_en = nameStr.slice(index + 1).trim();
            let img = $tableInfo.find("img").attr("src");
            let introduction = $tableInfo.find("td").eq(1).text();

            let level = {
                "攻击力[平均值]": [],
                "护甲": [],
                "力量": [],
                "敏捷": [],
                "智力": [],
                "生命": [],
                "魔法": []
            };
            let i = name == "恶魔猎手" ? 4 : 2;
            let $trsLevel = $wrap.find("table").eq(i).find("tr");
            $trsLevel.each((tri, tr) => {
                if(tri) {
                    let $tds = $trsLevel.eq(tri).find("td");
                    level["攻击力[平均值]"].push($tds.eq(1).text().trim());
                    level["护甲"].push($tds.eq(2).text().trim());
                    level["力量"].push($tds.eq(3).text().trim());
                    level["敏捷"].push($tds.eq(4).text().trim());
                    level["智力"].push($tds.eq(5).text().trim());
                    level["生命"].push($tds.eq(6).text().trim());
                    level["魔法"].push($tds.eq(7).text().trim());
                }
            })
            level = JSON.stringify(level);

            let params = {};
            let $trs = $wrap.find("table").eq(1).find("tr");
            $trs.each((index, tr) => {
                if($trs.eq(index).find("td").length === 1) {
                    $trs.eq(index).remove();
                }
            })
            let $tds = $wrap.find("table").eq(1).find("td");
            $tds.each((tdi, td) => {
                let text = $tds.eq(tdi).text().trim();
                let textn = $tds.eq(tdi + 1).text().trim();
                if(tdi % 2 === 0 && text) {
                    params[text] = textn;
                }
            })
            params = JSON.stringify(params);
            let rate = $tds.eq(9).text().trim();
            let scope = $tds.eq(11).text().trim();
            let main = $tds.eq(13).text().trim();
            let hp = $tds.eq(15).text().trim();
            let mp = $tds.eq(17).text().trim();
            let ll = $tds.eq(19).text().trim();
            let zl = $tds.eq(23).text().trim();
            let mj = $tds.eq(21).text().trim();
            let day = $tds.eq(25).text().trim();
            let night = $tds.eq(27).text().trim();
            let speed = $tds.eq(29).text().trim().slice(-4, -1);

            let $prevs = $wrap.find("table").eq(2).nextAll();
            let skill = "";
            $prevs.each(function(i, ele) {
                let html = $prevs.eq(i).html().trim();
                if(html.startsWith("<tbody")) {
                    skill += `<table>` + html + `</table>`;
                } else {
                    skill += html;
                }
            });

            let sql = `INSERT INTO hero_table (nation, name, name_en, img, introduction, level, params, skill, rate, scope, main, hp, mp, ll, zl, mj, day, night, speed) VALUES('${nation}', '${name}', '${name_en}', '${img}', '${introduction}', '${level}', '${params}', '${skill}', ${rate}, '${scope}', '${main}', '${hp}', ${mp}, ${ll}, ${zl}, ${mj}, ${day}, '${night}', ${speed}) `
            pool.query(sql, function(err, results, fields) {
                if(err) {
                    console.log(name, "插入失败", err)
                }
            })
        }
        done();
    }
});

function dataType(data) {
    return ({}).toString.call(data).slice(8, -1)
}

var listCrawler = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    callback: function(error, res, done) {
        if(error) {
            console.log(error);
        } else {
            var $ = res.$;
            let $tr = $("tr:contains('《魔兽争霸3》—英雄详解')").next("tr");
            let $a = $tr.find("a");
            let arr = [];
            $a.each((index, a) => {
                arr.push(a.attribs.href);
            });
            itemCrawler.queue(arr);
        }
        done();
    }
});

listCrawler.queue(["http://game.17173.com/zt/pc/war3/1/5.shtml"])