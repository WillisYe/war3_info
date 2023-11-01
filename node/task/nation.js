var Crawler = require("crawler");
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DRsXT5ZJ6Oi55LPQ',
    database: 'war3'
});

// 种族信息亦可插入，待完善
let $sql = `CREATE TABLE unit_table( 
id INT NOT NULL AUTO_INCREMENT, 
name VARCHAR(10) NOT NULL, 
name_en VARCHAR(20) NOT NULL, 
nation VARCHAR(20) NOT NULL, 
img VARCHAR(100) NOT NULL, 
introduction VARCHAR(500) NOT NULL, 
profile VARCHAR(500) NOT NULL, 
params VARCHAR(1000) NOT NULL, 
skill VARCHAR(4000) NOT NULL, 
PRIMARY KEY(id, name)) ENGINE = InnoDB DEFAULT CHARSET = utf8;
`;
pool.query($sql, function(err, results, fields) {
    if(err) {
        console.log("数据库创建失败", err)
    }
})

let list = [{
        name: "human",
        nation: "人族",
        url: "http://games.sina.com.cn/z/war3/human/peasant.shtml",
        urlList: []
    },
    {
        name: "ne",
        nation: "暗夜",
        url: "http://games.sina.com.cn/z/war3/ne/wisp.shtml",
        urlList: []
    },
    {
        name: "orc",
        nation: "兽族",
        url: "http://games.sina.com.cn/z/war3/orc/kugong.shtml",
        urlList: []
    },
    {
        name: "un",
        nation: "不死",
        url: "http://games.sina.com.cn/z/war3/un/acolyte.shtml",
        urlList: []
    }
]

// 人族破法未采集到，待修复  报错待修复
var c = new Crawler({
    // 在每个请求处理完毕后将调用此回调函数
    callback: function(error, res, done) {
        if(error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ 默认为 Cheerio 解析器
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
            $("br,p:empty").remove();
            if($("td>h1").text().trim()) {
                let nameStr = res.options.uri.split("/")[5];
                let currentNation = list.find(item => item.name === nameStr);
                if(currentNation.urlList.length) {
                    let nameStr = $("img[src^='http://image2.sina.com.cn/gm/ol/war3']").eq(0).parent().parent().parent().next().text().trim();
                    if(!nameStr.includes("：")) {
                        // 只采集普通单位数据
                        let index = nameStr.indexOf("(") + 1 || nameStr.indexOf("（") + 1;
                        let name = nameStr.slice(0, index - 1).trim();
                        let name_en = nameStr.slice(index, -1).trim().replace(/[)）]/, "");
                        let nation = currentNation.nation;
                        let img = $("img[src^='http://image2.sina.com.cn/gm/ol/war3']").eq(0).attr("src");
                        let introduction = $("img[src^='http://image2.sina.com.cn/gm/ol/war3']").eq(0).parent().parent().next("td").text().trim().slice(0, 500);
                        let profile = $("tr:contains('简介')").next().text().trim();

                        let params = {}
                        let $tds = $("div:contains('训练费用'),p:contains('训练费用')").eq(0).parent().parent().parent().find("td");
                        $tds.each((tdi, td) => {
                            let text = $tds.eq(tdi).text().trim();
                            let textn = $tds.eq(tdi + 1).text().trim();
                            if(tdi % 2 === 0 && text) {
                                params[text] = textn
                            }
                        })
                        params = JSON.stringify(params);


                        let $prevs = $("p:contains('魔法技能'),div:contains('魔法技能')").eq(0).parent().parent().parent().prev().nextAll();
                        let skill = "";
                        $prevs.each(function(i, ele) {
                            let html = $prevs.eq(i).html().trim();
                            if(html.startsWith("<tbody")) {
                                skill += `<table>` + html + `</table>`;
                            } else {
                                skill += html;
                            }
                        });
                        let sql = `INSERT INTO unit_table  (name, name_en, nation, img, introduction, profile, params, skill)  VALUES ('${name}', '${name_en}', '${nation}', '${img}', '${introduction}', '${profile}', '${params}', '${skill}')`
                        pool.query(sql, function(err, results, fields) {
                            if(err) {
                                console.log(name, "插入失败", err)
                            }
                        })
                    }
                } else {
                    let $list = $("p:contains('仅对地单位'),div:contains('仅对地单位')").eq(0).parent().parent().parent();
                    $list.find("a").each((i, a) => {
                        let href = a.attribs.href
                        if(!href.includes("heroes")) {
                            if(!href.startsWith("http")) {
                                href = "http://games.sina.com.cn" + href;
                            }
                            currentNation.urlList.push(href);
                        }
                    })
                    c.queue(currentNation.urlList);
                }
            } else {
                // console.log("tree")
                // 科技树
            }
        }
        done();
    }
});

c.queue(list.map(item => {
    return item.url
}))