import request from '@/utils/request'

// 查询物联感知设备类型信息列表
export function listDeviceType(query) {
    return request({
        url: '/device/type/list',
        method: 'get',
        params: query
    })
}

// 查询物联感知设备信息列表
export function listDevice(query) {
    return request({
        url: '/device/sensing/list',
        method: 'get',
        params: query
    })
}

// 查询物联感知设备信息列表
export function pageDevice(query) {
    return request({
        url: '/device/sensing/page',
        method: 'get',
        params: query
    })
}

// 查询点位要素详细
export function getDevice(id) {
    return request({
        url: '/device/sensing/' + id,
        method: 'get'
    })
}

// 新增点位要素
export function addDevice(data) {
    return request({
        url: '/device/sensing',
        method: 'post',
        data: data
    })
}

// 修改点位要素
export function updateDevice(data) {
    return request({
        url: '/device/sensing',
        method: 'put',
        data: data
    })
}

// 删除点位要素
export function delDevice(id) {
    return request({
        url: '/device/sensing/' + id,
        method: 'delete'
    })
}

// 查询告警列表
export function listAlert(query) {
    return request({
        url: '/device/alert/list',
        method: 'get',
        params: query
    })
}

// 查询告警详细
export function getAlert(id) {
    return request({
        url: '/device/alert/' + id,
        method: 'get'
    })
}

// 编辑告警信息
export function editAlert(data) {
    return request({
        url: '/device/alert',
        method: 'put',
        data: data
    })
}

// 物联设备查询树
export function deviceTree() {
    return request({
        url: '/device/type/tree',
        method: 'get'
    })
}

// 查询点位中所有设备信息统计
export function getDeviceInfo(buildingId) {
    return request({
        url: '/device/sensing/deviceInfo/' + buildingId,
        method: 'get'
    })
}

// 查询点位中所有设备运行状况
export function getDeviceRunningInfo(buildingId, query) {
    return request({
        url: '/device/alert/deviceRunningInfo/' + buildingId,
        method: 'get',
        params: query
    })
}

// 设置心跳
export function setHeartBeat(deviceId, query) {
    return request({
        url: '/device/sensing/setHeartBeat/' + deviceId,
        method: 'get',
        params: query
    })
}

// 查询预置位列表
export function pagePreset(query) {
    return request({
        url: '/device/preset/page',
        method: 'get',
        params: query
    })
}

// 查询预置位列表
export function listPreset(query) {
    return request({
        url: '/device/preset/list',
        method: 'get',
        params: query
    })
}

// 新增预置位
export function addPreset(data) {
    return request({
        url: '/device/sensing/setCameraPreset',
        method: 'post',
        data: data
    })
}

// 删除预置位
export function delPreset(id) {
    return request({
        url: '/device/preset/' + id,
        method: 'delete'
    })
}