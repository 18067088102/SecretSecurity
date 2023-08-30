/*
  文件
*/

import config from '@/config';
import { getToken } from '@/utils/auth';
import request from '@/utils/request';
import { encode } from 'js-base64'
import axios from 'axios'

// 查看图片
export function viewMiniOImage(path) {
  return process.env.VUE_APP_BASE_API + '/file/noOauthView?path=' + path;
}

//文件下载
export function downloadFile(path) {
  return `${process.env.VUE_APP_BASE_API}/file/downloadOssFile?token=${getToken()}&path=${path}`;
}

//文件下载
export function noOauthDownloadOssFile(path) {
  return `${process.env.VUE_APP_BASE_API}/file/noOauthDownloadOssFile?path=${path}`;
}

//批量文件下载
export function downloadZipNetFile(path) {
  return `${process.env.VUE_APP_BASE_API}/file/downloadZipNetFile?token=${getToken()}&path=${path}`;
}

// 批量下载图片
// params: A url array
export function downloadPictures(params) {
  if (!Array.isArray(params)) {
    return console.error('The params is not a Array.')
  }
  const url = `${process.env.VUE_APP_BASE_API}/file/downloadZipOssFile?token=${getToken()}`
  axios({
    method: 'post',
    url,
    data: params,
    responseType: 'blob',
  }).then(res => {
    let blob = new Blob([res.data], { type: 'application/zip' })
    let url = window.URL.createObjectURL(blob)
    let link = document.createElement("a")
    link.href = url
    link.setAttribute('download', '图片包')
    link.click()
    URL.revokeObjectURL(url)
  }).catch(err => {
    console.error('download image error: ', err)
  })
}

// 下载单张图片
// params: A Object
// {
//   url: ''
// }
export function downloadPic(params) {
  if (typeof params !== 'object') {
    return console.error('The params is not a Object.')
  }
  if (typeof params.url !== 'string') {
    return console.error('The params.url is not a string.')
  }
  const url = `${process.env.VUE_APP_BASE_API}/file/downloadNetFile?token=${getToken()}`
  axios({
    method: 'post',
    url,
    data: params,
    responseType: 'blob',
  }).then(res => {
    let blob = new Blob([res.data], { type: 'image/png' })
    let url = window.URL.createObjectURL(blob)
    let link = document.createElement("a")
    link.href = url
    link.setAttribute('download', '图片')
    link.click()
    URL.revokeObjectURL(url)
  }).catch(err => {
    console.error('download image error: ', err)
  })
}

//文件查看
export function viewNotFile(path) {
  return `${process.env.VUE_APP_BASE_API}/file/noOauthView?token=${getToken()}&path=${path}`;
}

//不带token文件查看
export function viewFileNoAuth(url) {
  return `${process.env.VUE_APP_BASE_API}/file/noOauthView?path=` + url;
}

//文件查看
export function viewFile(url) {
  return `${process.env.VUE_APP_BASE_API}/file/view?token=${getToken()}&path=` + url;
}

//文件查看1
export function viewFile1(url) {
  return `${process.env.VUE_APP_BASE_API}/file/view1?token=${getToken()}&path=${url}&bucket=` + 'cncqs';
}

//文件上传
export function uploadFile() {
  return `${process.env.VUE_APP_BASE_API}/file/noOauthUpload?dir=` + 'installPic';
}

//门户上传
export function uploadPortalFile() {
  return `${process.env.VUE_APP_BASE_API}/file/upload?token=${getToken()}&dir=portal_source`;
}
// 门户上传图片
export function uploadPortalImg(data) {
  return request.post(`/file/upload?dir=portal_source`, {
    data,
  });
}


//图片查看
export function getImageUrl(url) {
  return `${process.env.VUE_APP_BASE_API}/file/download?token=${getToken()}&url=` + url;
}

export function uploadImg(data) {
  return request.post(`/file/upload`, {
    data,
  });
}

//Base64图片上传接口（需要授权）
export function uploadBase64Img(data) {
  return request.post(`/file/uploadBase64Image`, {
    data,
  });
}

//网络图片上传接口（需要授权）
export function uploadNetImage(data) {
  return request.post(`/file/uploadNetImage`, {
    data,
  });
}



// 网络图片查看接口【图片URL用Base64加密】（需要授权）
export function getBase64ImageUrl(url) {
  return `${process.env.VUE_APP_BASE_API}/file/load1?token=${getToken()}&url=` + url;
}

// 网络图片查看接口（需要授权）
export function getHttpImageUrl(url) {
  url = encode(url)
  return `${process.env.VUE_APP_BASE_API}/file/noOauthNetImageView?url=${url}`
}

// 网络图片查看接口【图片URL用Base64加密】（需要授权）
export function getEncodeOssBase64Image(url) {
  return `${process.env.VUE_APP_BASE_API}/file/noOauthEncodeOssBase64Image?path=` + url;
}

//删除文件
export function deleteFile(path) {
  return request.delete(`/file/delete?token=${getToken()}&path=${path}`);
}

export function getBase64ImageData(url) {
  return axios({
    method: 'get',
    url,
  })
}
