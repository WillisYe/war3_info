// deno run -A getWinLosses.js
// 批量下载图片
// 引入Deno的文件系统和路径模块
import { basename } from "https://deno.land/std/path/mod.ts";
import items from "./mmr2200.json" assert { type: "json" };

console.log(items.patchToStatsPerModes["1.36.1"][0])