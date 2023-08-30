<template>
  <div
    id="divPlugin"
    class="divPlugin"
    style="width: 960px; height: 540px"
  ></div>
</template>

<script>
import { WebVideo } from "@/utils/webVideoCtrl.js";
export default {
  props: {
    //数据源
    previewInfo: {
      type: Object,
    },
  },
  data() {
    return {
      webVideo: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initVideoPlay();
    });
  },
  methods: {
    initVideoPlay() {
      this.webVideo = new WebVideo();
      this.$nextTick(() => {
        this.webVideo.init(
          this.previewInfo.ip,
          this.previewInfo.port,
          this.previewInfo.username,
          this.previewInfo.password
        );
        this.webVideo.clickLogin();
      });
    },
    stopVideoPlay() {
      this.webVideo.clickStopRealPlay();
      this.webVideo.clickLogout();
    },
  },
};
</script>

<style>

</style>