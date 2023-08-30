import request from '@/utils/request'

//查询设备统计
export function getDeviceStatistics(query) {
    return request({
        url: '/device/census/deviceCensus',
        method: 'get',
        params: query
    })
}

//查询实时告警
export function getAlertList(query) {
    return request({
        url: '/device/census/alertPage',
        method: 'get',
        params: query
    })
}

//查询实时警告
export function getFaultDeviceList(query) {
    return request({
        url: '/device/census/faultDevicePage',
        method: 'get',
        params: query
    })
}

//查询离线设备
export function getOfflineDeviceList(query) {
    return request({
        url: '/device/census/offlineDevicePage',
        method: 'get',
        params: query
    })
}

//设备故障概览
export function getFaultStatistics() {
    return request({
        url: '/device/census/faultCensus',
        method: 'get'
    })
}

// 根据经纬度计算范围内设备信息
export function getBuildingDeviceList(data) {
    return request({
        url: '/device/census/getDeviceListByCoordinate',
        method: 'post',
        data: data
    })
}



// 视频资源数量
export function getVideoResource() {
    return request({
        url: '/point/view/videoResource',
        method: 'get'
    })
}

// 视频资源搜索
export function getSearchPoint(query) {
    return request({
        url: '/point/view/searchPoint',
        method: 'get',
        params: query
    })
}

// 获取当日值班
export function getDutyInfo() {
    return request({
        url: '/point/duty/todayInfo',
        method: 'get'
    })
}

// 警情态势--警情数量
export function getAlertCount(query) {
    return request({
        url: '/alert/alertManage/getAlertCount',
        method: 'get',
        params: query
    })
}

// 警情统计
export function getAlertStatistics() {
    return request({
        url: '/alert/alertManage/statistics',
        method: 'get'
    })
}

// 警情情况--按照警情类别统计
export function getClassifyByType() {
    return request({
        url: '/alert/alertManage/classifyByType',
        method: 'get'
    })
}

// 查询人员布控告警总数
export function getCountPersonAlarm() {
    return request({
        url: '/hkservice/personAlarmManage/doCountPersonAlarm',
        method: 'get'
    })
}

// 查询车辆告警总数
export function getCountCarAlarm() {
    return request({
        url: '/hkservice/carAlarm/doCountCarAlarm',
        method: 'get'
    })
}

// 查询人员告警任务分页列表接口
export function getPersonAlarmPage(query) {
    return request({
        url: '/hkservice/personAlarmManage/page',
        method: 'get',
        params: query
    })
}

// 查询车辆告警分页列表接口
export function getCarAlarmPage(query) {
    return request({
        url: '/hkservice/carAlarm/page',
        method: 'get',
        params: query
    })
}

// 【警情】可视化面板：警情类别排名top
export function getAlertTop5(query) {
    return request({
        url: '/alert/view/alertManage/top',
        method: 'get',
        params: query
    })
}

// 在线勤务
export function getZXQW() {
    return request({
        url: '/forces/forces/statistics',
        method: 'get'
    })
}

// 在线任务
export function getZXRW(query) {
    return request({
        url: '/forces/onlineTask/list',
        method: 'get',
        params: query
    })
}

// 警力信息
export function getJLXXList(query) {
    return request({
        url: '/forces/forces/list',
        method: 'get',
        params: query
    })
}

// 预案总览
export function getYAStatistics() {
    return request({
        url: '/forces/plan/statistics',
        method: 'get'
    })
}

// 预案列表
export function getYAList(query) {
    return request({
        url: '/forces/plan/list',
        method: 'get',
        params: query
    })
}

// 查询单个预案
export function getSingleYAInfo(id) {
    return request({
        url: '/forces/plan/info/' + id,
        method: 'get'
    })
}

// 新增预案
export function addYAInfo(data) {
    return request({
        url: '/forces/plan/save',
        method: 'post',
        data: data
    })
}

// 删除单个预案
export function deleteSingleYAInfo(id) {
    return request({
        url: '/forces/plan/delete/' + id,
        method: 'delete'
    })
}