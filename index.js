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
const getShopPageContent = (index, after) => {
  let htmlData = ''
  let url = getShopPageUrl(index)
  console.log(`requesting: ${url}`)
  https.get(url, (res) => {
    res.on('data', (d) => {
      // console.log(d)
      htmlData += d
    })
    res.on('end', () => {
      after.apply(null, [htmlData])
    })
  }).on('error', (e) => {
    console.error(e)
  })
}

/**
 * 解析图包标题以及图片ID,生成图片地址并下载
 */
const getTitleAndStickerIds = (data) => {
  let $ = cheerio.load(data)
  const titleElement = $('.mdCMN08Ttl')[0]
  if (!titleElement) {
    console.log('not getable stickers')
    return false
  }
  let title = titleElement.children[0].data
  console.log(title)
  let script = $('script')[6].children[0].data
  let ids =  /ids\: \[(.+)\]/.exec(script)[1].split(',')
  let typeList =  /type\: \"(.+)\"/.exec(script)
  let type = typeList ? typeList[1] : ""
  let prefix = fromTypeToPrefix(type)
  // console.log(ids)
  console.log(type)
  console.log(prefix)
  fs.mkdirSync(`output/${title}`)
  ids.forEach((id, index) => {
    let url = getStickerUrl(id, prefix)
    let target = prefix === 'IOS/sticker_sound.m4a' ? `/output/${title}/${index + 1}.m4a` : `/output/${title}/${index + 1}.png`
    download(url, target)
    console.log(index)
    console.log(url)
  })
}

/**
 * 由type推测后缀 
 */
const fromTypeToPrefix = (type) => {
  switch (type) {
    case 'animation':
      return 'IOS/sticker_animation@2x.png'
      break
    case 'popup':
      return 'IOS/main_popup@2x.png'
      break
    case 'sound':
    case 'soundanimation':
    case 'popupsound':    
      return 'IOS/sticker_sound.m4a'
      break
    default:
      return 'ANDROID/sticker.png' 
      break;
  }
}

/**
 * 获取图片地址
 */
const getStickerUrl = (id, prefix) => (`https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/${prefix}`)

/**
 * 下载图片
 */
const download = (url, target) => {
  let stream = fs.createWriteStream(__dirname + target)
  https.get(url, (res) => {
    res.on('data', (d) => {
      stream.write(d)
    })
    res.on('end', () => {
      stream.end()
      console.log(`${url} finished`)
    })
  }).on('error', (e) => {
    console.error(e)
  })
}

getShopPageContent(8463, getTitleAndStickerIds)