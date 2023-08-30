export default {
	data() {
		return {
			zoomScale: 1,
			zoomScaleY: 1,
		};
	},
	mounted() {
		this.setScale();
		window.onresize = this.setScale.bind(this);
	},
	methods: {
		//设置屏幕缩放比例，利用 css zoom属性
		setScale() {
			let designW = 1920;
			let designH = 1080;
			let zoomScaleX = document.documentElement.clientWidth / designW;
			let zoomScaleY = document.documentElement.clientHeight / designH;
			// zoomScale = zoomScale < 0.6 ? 0.6 : zoomScale > 0.8 ? 0.8 : zoomScale;
			if (zoomScaleX > zoomScaleY) {
				this.zoomScale = zoomScaleY < 0.6 ? 0.6 : zoomScaleY;
			} else {
				this.zoomScale = zoomScaleX < 0.6 ? 0.6 : zoomScaleX;
			}
			this.zoomScaleY = zoomScaleY;
			// this.zoomScale = zoomScale;
		},
	},
};
