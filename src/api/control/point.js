import request from '@/utils/request'

// 查询点位要素列表
export function listPoint(query) {
    return request({
        url: '/point/building/list',
        method: 'get',
        params: query
    })
}

// 查询点位要素列表不分页（大屏）
export function listBuilding(query) {
    return request({
        url: '/point/building/buildingList',
        method: 'get',
        params: query
    })
}

// 查询点位要素详细(大屏)
export function getBuildingPoint(query) {
    return request({
        url: '/point/building/buildingInfo',
        method: 'get',
        params: query
    })
}

// 查询点位要素详细
export function getPoint(query) {
    return request({
        url: '/point/building/getInfo',
        method: 'get',
        params: query
    })
}

// 新增点位要素
export function addPoint(data) {
    return request({
        url: '/point/building',
        method: 'post',
        data: data
    })
}

// 修改点位要素
export function updatePoint(data) {
    return request({
        url: '/point/building',
        method: 'put',
        data: data
    })
}

// 删除点位要素
export function delPoint(id) {
    return request({
        url: '/point/building/' + id,
        method: 'delete'
    })
}

// 查询点位类型下拉树结构
export function pointTypeTree() {
    return request({
        url: '/point/type/tree',
        method: 'get'
    })
}

// 根据子节点id查询父节点id
export function getTreeParentId(childId) {
    return request({
        url: '/point/type/' + childId,
        method: 'get'
    })
}

// 行政区域下拉树结构
export function areaTree(query) {
    return request({
        url: '/system/area/tree',
        method: 'get',
        params: query
    })
}

// poi查询树
export function poiTree() {
    return request({
        url: '/point/poi/tree',
        method: 'get'
    })
}

// 查询poi点位要素列表
export function listPoi(data) {
    return request({
        url: '/point/poi/list',
        method: 'post',
        data: data
    })
}

// poi信息详情
export function getPoiDetail(id) {
    return request({
        url: '/point/poi/' + id,
        method: 'get'
    })
}

// 根据经纬度计算范围内建筑点位信息
export function getBuildingList(data) {
    return request({
        url: '/point/building/getBuildingListByCoordinate',
        method: 'post',
        data: data
    })
}

