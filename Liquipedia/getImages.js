// deno run -A getImages.js
// 批量下载图片
// 引入Deno的文件系统和路径模块
import { basename } from "https://deno.land/std/path/mod.ts";
import items from "./items.json" assert { type: "json" };

/**
 * 下载单个图片并保存到指定路径
 * @param {string} url 图片的URL
 * @param {string} path 保存图片的本地路径
 */
async function downloadImage(url, path) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    await Deno.writeFile(path, new Uint8Array(buffer));
    console.log(`Downloaded ${url} to ${path}`);
  } catch (error) {
    console.error(`Error downloading ${url}: ${error}`);
  }
}

/**
 * 批量下载图片
 * @param {Array<string>} urls 图片URL数组
 * @param {string} dir 保存图片的目录
 */
async function downloadImages(urls, dir) {
  // 确保目录存在
  await Deno.mkdir(dir, { recursive: true });

  // 使用Promise.all并发下载所有图片
  await Promise.all(urls.map(url => {
    // 使用图片URL的basename作为本地文件名
    const filename = basename(new URL(url).pathname);
    const path = `${dir}/${filename}`;
    return downloadImage(url, path);
  }));
}

// 示例用法
const urls = items.map(item => item.icon)
const dir = "./downloaded_images"; // 保存图片的本地目录

downloadImages(urls, dir).then(() => console.log("All images have been downloaded."));