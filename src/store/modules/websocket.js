/**
 * 此处导入store，是想要在mutations中的socketInit中调用start和reconnect
 * 不这样写的话，mutations中的方法在当前文件只有在actions中才能调用（我实现时是这样的），因此导入了再使用
 */

import store from "../index";
const wsURL = require('../../../src/config.js').ws_url

const state = {
    ws: null, // socket
    tt: null, // 重连时的定时器
    wsUrl: "", // socket链接地址
    socketMsg: null, // socket推送回来的消息
    lockReconnect: false, // 是否真正建立连接
    timeout: 5000, //5秒一次心跳
    timeoutObj: null, //心跳心跳倒计时
    serverTimeoutObj: null //心跳心跳倒计时
};

const mutations = {
    // 心跳检测
    start(state) {
        state.timeoutObj && clearTimeout(state.timeoutObj);
        state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj);
        this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            let message = {
                msgType: "sub",
                data: {
                    // 发送的数据
                }
            };
            state.ws.send(JSON.stringify(message));
            store.commit("websocket/start");
        }, state.timeout);
    },

    // 初始化socket
    socketInit(state) {
        let userId = store.state.user.userId;
        state.wsUrl = `${wsURL}/userSocket/${userId}`;
        state.ws = new WebSocket(state.wsUrl);
        state.ws.onopen = res => {
            console.log("连接成功");
            // 心跳检测
            store.commit("websocket/start");
        };
        state.ws.onmessage = res => {
            let socketMsg = JSON.parse(res.data);
            // 这里的判断是根据服务端返回来的参数判断本条数据是需要的数据还是心跳检测数据
            if (socketMsg.type !== 0) {
                // console.log(socketMsg.data);
                state.socketMsg = socketMsg.data;
            }
        };
        state.ws.onclose = res => {
            console.log("连接关闭");
            store.commit("websocket/reconnect"); // 重连
        };
        state.ws.onerror = res => {
            console.log("连接错误");
            store.commit("websocket/reconnect"); // 重连
        };
    },

    // 重新连接
    reconnect(state) {
        if (state.lockReconnect) return;
        state.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        state.tt && clearTimeout(state.tt);
        state.tt = setTimeout(function () {
            store.commit("websocket/socketInit");
            state.lockReconnect = false;
        }, 2000);
    }
};

const actions = {
    webSocketInit({ commit }, url) {
        commit("socketInit", url);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};