export function WebVideo() {
    this.g_iWndIndex = 0
    this.g_bPTZAuto = false
    this.szDeviceIdentify = ''
    this.deviceport = ''
    this.rtspPort = ''
    this.channels = []
    this.ip = ''
    this.port = ''
    this.username = ''
    this.password = ''
    this.init = function (ip, port, username, password) {
        this.ip = ip
        this.port = port
        this.username = username
        this.password = password
        // var self = this
        // 检查插件是否已经安装过
        // var iRet = WebVideoCtrl.I_CheckPluginInstall();
        // if (-1 == iRet) {
        //     alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        //     return;
        // }
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(960, 540, {
            szColorProperty: 'plugin-background:#102749; sub-background:#102749; sub-border:#18293c; sub-border-select:red',
            bWndFull: true, // 全屏
            // iPackageType: 2,
            iWndowType: 1, //分屏
            bNoPlugin: true, // 支持无插件
            cbInitPluginComplete: function () {
                WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            }
        });
    }
    // 登录
    this.clickLogin = function () {
        var self = this
        if ("" == self.ip || "" == self.port) {
            return;
        }
        debugger
        self.szDeviceIdentify = self.ip + "_" + self.port;
        WebVideoCtrl.I_Login(self.ip, 1, self.port, self.username, self.password, {
            success: function (xmlDoc) {
                setTimeout(function () {
                    console.log('登录成功');
                    self.getChannelInfo();
                    self.getDevicePort();
                }, 10);
                setTimeout(function () {
                    self.clickStartRealPlay()
                }, 500)
            },
            error: function (status, xmlDoc) {
                console.log('登录失败');
            }
        });
    }
    // 退出
    this.clickLogout = function () {
        var self = this
        self.channels = []

        if (null == self.szDeviceIdentify) {
            return;
        }
        var iRet = WebVideoCtrl.I_Logout(self.szDeviceIdentify);
        if (0 == iRet) {
            self.getChannelInfo();
            self.getDevicePort();
        }
    }
    // 获取通道
    this.getChannelInfo = function () {
        var self = this
        self.channels = []
        if (null == self.szDeviceIdentify) {
            return;
        }
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(self.szDeviceIdentify, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("VideoInputChannel");
                $.each(oChannels, function (i) {
                    var id = $(this).find("id").eq(0).text(),
                        name = $(this).find("name").eq(0).text();
                    if ("" == name) {
                        name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                    }
                    self.channels.push({
                        id: id,
                        name: name
                    })
                });
                console.log('获取模拟通道号成功', self.channels)
            },
            error: function (status, xmlDoc) {
                console.log('获取模拟通道号失败')
            }
        });
    }
    // 获取端口
    this.getDevicePort = function () {
        var self = this
        if (null == self.szDeviceIdentify) {
            return;
        }
        var oPort = WebVideoCtrl.I_GetDevicePort(self.szDeviceIdentify);
        if (oPort != null) {
            self.deviceport = oPort.iDevicePort;
            self.rtspPort = oPort.iRtspPort;
        }
        console.log('获取端口号成功')
    }
    // 开始预览
    this.clickStartRealPlay = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex),
            iChannelID = self.channels[0].id

        if (null == self.szDeviceIdentify) {
            return;
        }
        var startRealPlay = function () {
            WebVideoCtrl.I_StartRealPlay(self.szDeviceIdentify, {
                iChannelID: iChannelID,
                bZeroChannel: false,
                iStreamType: 2,
                success: function () {
                    console.log('预览成功')
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        console.log('设备不支持Websocket取流')
                    } else {
                        console.log('预览失败')
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        };

        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop({
                success: function () {
                    startRealPlay();
                }
            });
        } else {
            startRealPlay();
        }
    }
    // 停止预览
    this.clickStopRealPlay = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex)
        if (oWndInfo != null) {
            WebVideoCtrl.I_Stop({
                success: function () {
                    console.log('停止预览成功')
                },
                error: function () {
                    console.log('停止预览失败')
                    self.clickLogout()
                    self.clickLogin()
                }
            });
        }
    }
    // 设置预置点
    this.clickSetPreset = function (iPresetID) {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex)

        if (oWndInfo != null) {
            WebVideoCtrl.I_SetPreset(iPresetID, {
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 设置预置点成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 设置预置点失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
    this.mouseDownPTZControl = function (iPTZIndex) {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo !== null) {
            if (iPTZIndex === 9 && self.g_bPTZAuto) {
                iPTZSpeed = 0;
            } else {
                self.g_bPTZAuto = false;
            }

            WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
                iPTZSpeed: 4,
                mysuccess: function (xmlStr) {
                    console.log("I_PTZControl", xmlStr);
                    if (iPTZIndex === 9 && self.g_bPTZAuto) {
                        console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！mouseDown");
                    } else {
                        console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！mouseDown");
                    }
                    if (iPTZIndex === 9) {
                        self.g_bPTZAuto = !self.g_bPTZAuto;
                    }
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 开启云台失败！mouseDown", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 方向PTZ停止
    this.mouseUpPTZControl = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);
        if (oWndInfo !== null) {
            WebVideoCtrl.I_PTZControl(1, true, {
                mysuccess: function (xmlStr) {
                    console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！mouseUp", xmlStr)
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！mouseUp", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 调焦+
    this.PTZZoomIn = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(10, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 调焦+成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  调焦+失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 调焦-
    this.PTZZoomout = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 调焦-成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  调焦-失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 调焦停止
    this.PTZZoomStop = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, true, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 调焦停止成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  调焦停止失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 聚焦+
    this.PTZFocusIn = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(12, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 聚焦+成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  聚焦+失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 聚焦-
    this.PTZFoucusOut = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(13, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 聚焦-成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  聚焦-失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 聚焦停止
    this.PTZFoucusStop = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(12, true, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 聚焦停止成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  聚焦停止失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 光圈+
    this.PTZIrisIn = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(14, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 光圈+成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  光圈+失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 光圈-
    this.PTZIrisOut = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(15, false, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 光圈-成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  光圈-失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 光圈停止
    this.PTZIrisStop = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(14, true, {
                iWndIndex: self.g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + " 光圈停止成功！");
                },
                error: function (status, xmlDoc) {
                    console.log(oWndInfo.szDeviceIdentify + "  光圈停止失败！", status, xmlDoc);
                    if (status === 401) {
                        self.clickLogout()
                        self.clickLogin()
                    }
                }
            });
        }
    }
    // 抓图
    this.clickCapturePic = function () {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex),
            szInfo = "";
    
        if (oWndInfo != null) {
            var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
            var szCaptureFileFormat = "0";
            if (xmlDoc != null) {
                szCaptureFileFormat = $(xmlDoc).find("CaptureFileFormat").eq(0).text();
            }
    
            // var szChannelID = $("#channels").val();
            // var szPicName = oWndInfo.szDeviceIdentify + "_" + szChannelID + "_" + new Date().getTime();
            var szPicName = oWndInfo.szDeviceIdentify + "_" + new Date().getTime();
            
            szPicName += ("0" === szCaptureFileFormat) ? ".jpg": ".bmp";
    
            WebVideoCtrl.I2_CapturePic(szPicName, {
                bDateDir: true  //是否生成日期文件
            }).then(function(){
                szInfo = "抓图成功！";
                console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },function(){
                szInfo = "抓图失败！";
                console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            });
        }
    }
    // 全屏
    this.clickFullScreen = function () {
        WebVideoCtrl.I_FullScreen(true);
    }
}
