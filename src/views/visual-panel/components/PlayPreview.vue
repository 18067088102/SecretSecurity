<template>
  <div v-if="wsUrl" style="width: 100%; height: 100%">
    <canvas
      :id="'videoCanvas' + title"
      class="canvas"
      ref="canvas"
      width="100%"
      height="100%"
    ></canvas>
    <canvas id="drawCanvas" class="canvas" width="100%" height="100%"></canvas>
  </div>
</template>
  
<script>
export default {
  props: {
    title: {
      type: Number,
      default: 0,
    },
    wsUrl: {
      type: String,
      default: "",
    },
  },
  components: {},
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initPlayer();
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  },
  methods: {
    changeVideoSrc() {
      if (this.player) {
        this.player.destroy();
      }
    },
    showVideoSrc() {
      this.$nextTick(() => {
        this.initPlayer();
      });
    },
    initPlayer() {
      this.player = new wsPlayer(
        "videoCanvas" + this.title,
        "drawCanvas",
        ".",
        this.callbackFunc,
        true,
        true
      );
      this.player.start(this.wsUrl);
    },
    // 播放器回调方法
    callbackFunc(code, msg) {
      let cvs = document.getElementById("videoCanvas" + this.title);
      let cvs2 = document.getElementById("drawCanvas");
      let videoWidth = 772;
      let videoHeigth = 375;
      if (cvs) {
        cvs.width = videoWidth - 1;
        cvs.height = videoHeigth - 1;
      }
      if (cvs2) {
        cvs2.width = 0;
        cvs2.height = 0;
      }
    },
    destroyPlayer() {
      if (this.player) {
        this.player.destroy();
      }
    },
  },
};
</script>
  
<style scoped lang="scss">
.canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
  