import { getHttpImageUrl } from '@/api/oss';

// obj: 要转换的对象, key: 要转换对象的key
export function setHWImageUrl(obj, ...urlKeys) {

  // let _hwUrl = /https:\/\/34\.12\.\d\.^\d{2}:1174/
  // let _hwUrl = /https:\/\/34\.12\.\d+\.\d+:\d+/
  // let _targetUrl = 'http://34.12.0.254:30000/hwImg'

  if (obj === null || obj === undefined) {
    return console.error('The Object must be not null or undefined. obj > ', obj)
  }

  if (!urlKeys.every(item => typeof item === 'string')) {
    return console.error('The keys must be a String type.')
  }

  urlKeys.forEach(item => {
    if (!obj[item]) {
      return
    }

    obj[item] = getHttpImageUrl(obj[item])

    // if (obj[item].includes('http:')) {
    //   obj[item] = getHttpImageUrl(obj[item])
    // }

    // if (_hwUrl.test(obj[item]) && !obj[item].includes('downloadImg')) {
    //   obj[item] = obj[item].replace(_hwUrl, _targetUrl)
    // } else {
    //   obj[item] = getHttpImageUrl(obj[item])
    //   // console.error( "The url is not matches, that's will be use the getHttpImageUrl API. url > ",  obj[item] )
    // }
  })

}