const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')

/**
 * 获取商店贴图页面地址
 */
const getShopPageUrl = (index) => (`https://store.line.me/stickershop/product/${index}/ja`)

/**
 * 获取商店贴图页面内容
 */
const getShopPageContent = (index) => {
  let url = getShopPageUrl(index)
  console.log(`requesting: ${url}`)
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    res.on('data', (d) => {
      console.log(d)
      process.stdout.write(d);
    })
  }).on('error', (e) => {
    console.error(e)
  })
}

getShopPageContent(9913)