// import Hls from 'hls.js'
// import createHlsVideo from 'cocos-hls-player'

cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode: {// 影片要顯示的節點 (cc.Sprite)
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        // cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
        this.videoNode = null;
        this.spriteNodeMaterial = this.spriteNode.getComponent(cc.Sprite).getMaterial(0);
    },

    start() {
        let resName = "prefab/VideoPlayer";
        // Al Jazeera 直播源 https://live-hls-web-aje.getaj.net/AJE/01.m3u8
        let videoData = {
            videoURLs: {
                '1080': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
                '720': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
                origin: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8'
            },
            // videoURLs: {
            //     '1080': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            //     '720': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            //     origin: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
            // },
            posterURL: "img/poster.jpg"
        }

        cc.resources.load(resName, function (err, prefab) {
            let videoPlayerNode = cc.instantiate(prefab);
            this.node.addChild(videoPlayerNode);
            videoPlayerNode.setPosition(-410, 30);
            videoPlayerNode.getComponent("VideoPlayer").createHls(videoData);

            this.videoNode = videoPlayerNode;
            this.videoNode.active = false;
            // window.videoNode = this.videoNode;
            this._initVideo();
        }.bind(this));
    },

    _initVideo() {
        this.videoDOM = this.videoNode.getComponent("VideoPlayer").VideoPlayer._impl._video;

        // 創建 Canvas 用於繪製影片
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });

        this.canvas.width = 428;  // 設定解析度
        this.canvas.height = 240;

        // 創建 cc.Texture2D 來接收影片幀
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        this.spriteNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;

        // 開始更新影片畫面
        this.schedule(this._updateFrame, 1 / 60);  // 60FPS 更新
    },

    _updateFrame() {
        if (this.videoDOM.readyState >= 2) { // 確保影片有足夠幀可讀取
            this.ctx.drawImage(this.videoDOM, 0, 0, this.canvas.width, this.canvas.height);

            let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.texture.initWithData(imageData.data, cc.Texture2D.PixelFormat.RGBA8888, this.canvas.width, this.canvas.height);
            this.spriteFrame.setTexture(this.texture);
        }
    },

    setVideoSpriteGray(event, customEventData) {
        cc.log(event.progress);
        this.spriteNodeMaterial.setProperty("grayEffect", event.progress);
    },

});
