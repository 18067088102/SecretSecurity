<template>
    <div>
        <div class="right-out"></div>
        <div :class="[poiHover ? 'poi-btn-s' : 'poi-btn-c']">
            <img class="icon-poi" src="../../../assets/images/panel/icon-poi.png" alt="" @mouseenter="onMouseEnter(0)"
                @mouseleave="onMouseLeave(0)" @click="showDialog(0)" />
        </div>
        <div :class="[spjkHover ? 'spjk-btn-s' : 'spjk-btn-c']">
            <img class="icon-spjk" src="../../../assets/images/panel/icon-spdw.png" alt="" @mouseenter="onMouseEnter(1)"
                @mouseleave="onMouseLeave(1)" @click="showDialog(1)" />
        </div>
        <div :class="[wlsbHover ? 'wlsb-btn-s' : 'wlsb-btn-c']">
            <img class="icon-wlsb" src="../../../assets/images/panel/icon-wlsb.png" alt="" @mouseenter="onMouseEnter(2)"
                @mouseleave="onMouseLeave(2)" @click="showDialog(2)" />
        </div>
        <img class="clear-img" src="../../../assets/images/panel/icon-clear.png" alt="" @click="showDialog(3)" />
    </div>
</template>

<script>
import bus from "@/utils/bus";
export default {
    data() {
        return {
            poiHover: false,
            spjkHover: false,
            wlsbHover: false,
        };
    },
    methods: {
        //三个按钮点击事件
        showDialog(idx) {
            bus.$emit("showDialog", idx);
        },
        onMouseEnter(idx) {
            switch (idx) {
                case 0:
                    this.poiHover = true;
                    break;
                case 1:
                    this.spjkHover = true;
                    break;
                case 2:
                    this.wlsbHover = true;
                    break;

                default:
                    break;
            }
        },
        onMouseLeave(idx) {
            switch (idx) {
                case 0:
                    this.poiHover = false;
                    break;
                case 1:
                    this.spjkHover = false;
                    break;
                case 2:
                    this.wlsbHover = false;
                    break;

                default:
                    break;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.right-out {
    position: absolute;
    top: 161px;
    right: 399px;
    width: 172px;
    height: calc(100% - 316px);
    background: url("../../../assets/images/panel/right-out.png");
    background-size: 100% 100%;
}

.poi-btn-c {
    position: absolute;
    top: 173px;
    right: 480px;
    width: 159px;
    height: 46px;
    background: transparent;
    z-index: 99;
}

.poi-btn-s {
    position: absolute;
    top: 173px;
    right: 480px;
    width: 159px;
    height: 46px;
    background: url("../../../assets/images/panel/poi-btn.png");
    background-size: 100% 100%;
    z-index: 99;
}

.icon-poi {
    width: 50px;
    height: 33px;
    margin-top: 5px;
    margin-left: 108px;
    cursor: pointer;
}

.spjk-btn-c {
    position: absolute;
    top: 248px;
    right: 465px;
    width: 159px;
    height: 46px;
    background: transparent;
    z-index: 99;
}

.spjk-btn-s {
    position: absolute;
    top: 248px;
    right: 465px;
    width: 159px;
    height: 46px;
    background: url("../../../assets/images/panel/spjk-btn.png");
    background-size: 100% 100%;
    z-index: 99;
}

.icon-spjk {
    width: 50px;
    height: 33px;
    margin-top: 5px;
    margin-left: 108px;
    cursor: pointer;
}

.wlsb-btn-c {
    position: absolute;
    top: 322px;
    right: 450px;
    width: 159px;
    height: 46px;
    background: transparent;
    z-index: 99;
}

.wlsb-btn-s {
    position: absolute;
    top: 322px;
    right: 450px;
    width: 159px;
    height: 46px;
    background: url("../../../assets/images/panel/wlsb-btn.png");
    background-size: 100% 100%;
    z-index: 99;
}

.icon-wlsb {
    width: 50px;
    height: 33px;
    margin-top: 7px;
    margin-left: 108px;
    cursor: pointer;
}

.clear-img {
    width: 54px;
    height: 49px;
    position: absolute;
    right: 430px;
    bottom: 99px;
    z-index: 99;
    cursor: pointer;
}
</style>