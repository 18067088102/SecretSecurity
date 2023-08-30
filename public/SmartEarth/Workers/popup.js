//项目弹出窗口
//类型为 工程树、属性窗口、结果窗口、选择操作窗口
var layerProp = null;
var layerRes = null;


//属性窗口
function popupProp(title, width, height, url, fn) {
    layer.close(layerProp);

    //获取相关回调事件
    var cancelFn = null;
    var successFn = null;
    var endFn = null;
    for (key in fn) {
        cancelFn = (key == 'cancel') ? fn[key] : cancelFn;
        successFn = (key == 'success') ? fn[key] : successFn;
        endFn = (key == 'end') ? fn[key] : endFn;
    }

    layerProp = layer.open({
        title: title,
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        skin: 'other-class fadeInRight',
        shade: 0,
        shadeClose: true,
        anim: -1,
        offset: ['135px', $(window).width() - width + 'px'],
        resize: false,
        isOutAnim: false,
        area: [width + 'px', typeof height === 'number' ? height + 'px' : height],
        content: url,
        success: function (layero, index) {
            //弹出框iframe高度调整
            layero.find('iframe').css('height', layero.find('iframe').height() - 6);
            if (successFn && typeof successFn === 'function') {
                successFn(layero, index);
            }
        },
        cancel: function () {
            if (cancelFn && typeof cancelFn === 'function') {
                cancelFn();
            }
        },
        end: function () {
            if (endFn && typeof endFn === 'function') {
                endFn();
            }
        }
    })
}

//结果窗口
function popupRes(title, width, height, url, fn) {
    layer.close(layerRes);

    //获取相关回调事件
    var cancelFn = null;
    var successFn = null;
    var endFn = null;
    for (key in fn) {
        cancelFn = (key == 'cancel') ? fn[key] : cancelFn;
        successFn = (key == 'success') ? fn[key] : successFn;
        endFn = (key == 'end') ? fn[key] : endFn;
    }

    layerRes = layer.open({
        title: title || '信息',
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        skin: 'other-class fadeInRight',
        shade: 0,
        shadeClose: true,
        anim: -1,
        offset: 'r',
        resize: false,
        isOutAnim: false,
        area: [width + 'px', typeof height === 'number' ? height + 'px' : height],
        content: url,
        success: function (layero, index) {
            if (successFn && typeof successFn === 'function') {
                successFn();
            }
        },
        cancel: function () {
            if (cancelFn && typeof cancelFn === 'function') {
                cancelFn();
            }
        },
        end: function () {
            if (endFn && typeof endFn === 'function') {
                endFn();
            }
        }
    })
}


//layui iframe弹出框高度不能自适应的解决办法
// h 增加的高度
// type弹出框类型
function fnLayerHauto(type, h) {
    var $layer = $('#layui-layer' + type, document.parent);
    if (!type || $layer.length == 0) return;

    $layer.css({ 'height': h + 'px' });
    $layer.find('iframe').css('height', h - 40 + 'px');
    $layer.find('iframe').contents().find('body').css({ 'height': h - 40 + 'px', 'overflow': 'hidden' });
}