// import * as Hls from 'hls.js'
import Hls from 'hls.js'
// import createHlsVideo from 'cocos-hls-player'
const hlsPlayer = require("cocos-hls-player");
const bufferTime = 15; // 預設直播的緩衝秒數

cc.Class({
    extends: cc.Component,

    properties: {
        vidioNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this.hls = null;
        this.VideoPlayer = this.vidioNode.getComponent(cc.VideoPlayer);

    },

    start() {
    },

    // called every frame

    update: function (dt) {
        if (this.liveBadge != null && this.liveBadge != undefined) {
            if ((this.hls.video.duration - this.hls.video.currentTime) > (bufferTime * 2)) {
                this.liveBadge.style["cursor"] = "pointer";
                this.liveBadge.style["background-color"] = "#757575";
            } else {
                this.liveBadge.style["cursor"] = "";
                this.liveBadge.style["background-color"] = "";
            }
        }
    },

    // 添加URL
    addRemoteUrl() {

    },

    // 更换播放地址URL
    changeRemoteUrl() {

    },

    // 每幀更新
    timeUpdate(currentTime, duration, percentage) {
        // console.log(currentTime, duration, percentage)
    },

    // 從第幾秒開始
    setCurrentTime(second) {
        this.hls.seek(second);
    },

    // 播放
    playVideo() {
        this.hls.play()
    },

    // 停止
    stopVideo() {
        this.hls.stop()
    },

    // 暂停
    pauseVideo() {
        this.hls.pause()
    },

    // 影片播放切換按鈕
    toggle(event, customEventData) {
        // let btnNode = event.target;
        // let sprite = btnNode.getChildByName("Background").getComponent(cc.Sprite);

        this.hls.toggle();
    },

    createHls(options) {
        this.VideoPlayer._impl._video.controls = true; // 顯示控制面板
        this.VideoPlayer._impl._video.crossorigin = "anonymous";
        // this.VideoPlayer._impl._video.poster = "https://dev-api.iplaystar.net/game/HostImages/0/PSC-ON-00016/loading_ad_1.png" //影片預覽圖範例
        this.VideoPlayer._impl._video.poster = options.posterURL;
        this.VideoPlayer._impl._video.disablePictureInPicture = true;
        this.VideoPlayer._impl._video.controlsList = "nofullscreen nodownload noremoteplayback noplaybackrate";
        this.VideoPlayer._impl._video.addEventListener("click", this._mouseHandler, false);
        this.VideoPlayer._impl._video.addEventListener("contextmenu", this._mouseHandler, false);
        this.hls = hlsPlayer.createHlsVideo({
            hls: Hls,
            videoDOM: this.VideoPlayer._impl._video,
            volume: 1,
            // videoURL: {
            //     '1080': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
            //     '720': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
            //     origin: 'https://newsvodmobilewsa.erg.cdn.ssdm.sohu.com/cdn/live/Phoenixtv.m3u8'
            // },
            videoURL: options.videoURLs,
            timeUpdate: this.timeUpdate,
        });
        // 直播中的圖示
        let liveBadge = this._createDOM("button", "live-badge", "", this.VideoPlayer._impl._videoContainer);
        liveBadge.textContent = "LIVE";
        liveBadge.addEventListener("click", function () {
            // this.hls.seek(this.hls.video.duration - bufferTime);
            this.setCurrentTime(this.hls.video.duration - bufferTime);
            this.playVideo();
        }.bind(this), false)
        this.liveBadge = liveBadge;
        // 提醒直播延遲文字
        let pinnedText = this._createDOM("div", "video-pinned-text", "", this.VideoPlayer._impl._videoContainer);
        pinnedText.textContent = "Streaming delay 30-60 second";

        window.Hls = this.hls;
        window.VideoPlayer = this.VideoPlayer;
    },

    _createDOM(tagName, className, id, parentNode) {
        const DOM = document.createElement(tagName);
        DOM.classList.add(className);
        DOM.id = id;
        parentNode.appendChild(DOM);

        return DOM;
    },

    _mouseHandler(event) {
        event.preventDefault();
    }

});
