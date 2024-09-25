// import * as Hls from 'hls.js'
import Hls from 'hls.js'
import createHlsVideo from 'cocos-hls-player'

cc.Class({
    extends: cc.Component,

    properties: {
        vidioNode: {
            default: null,
            type: cc.Node
        },
        playIcon: {
            default: null,
            type: cc.SpriteFrame
        },
        pauseIcon: {
            default: null,
            type: cc.SpriteFrame
        },
        playButton: {
            default: null,
            type: cc.Button
        }
    },

    onLoad: function () {
        this.hls = null;
        this.VideoPlayer = this.vidioNode.getComponent(cc.VideoPlayer);

    },

    start() {
        this.VideoPlayer._impl._video.controls = true; // 顯示控制面板
        this.VideoPlayer._impl._video.crossorigin = "anonymous";
        this.VideoPlayer._impl._video.poster = "https://dev-api.iplaystar.net/game/HostImages/0/PSC-ON-00016/loading_ad_1.png"
        this.hls = createHlsVideo({
            hls: Hls,
            videoDOM: this.VideoPlayer._impl._video,
            volume: 1,
            videoURL: {
                '1080': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
                '720': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
                origin: 'https://newsvodmobilewsa.erg.cdn.ssdm.sohu.com/cdn/live/Phoenixtv.m3u8'
            },
            // posterURL: "https://dev-api.iplaystar.net/game/HostImages/0/PSC-ON-00016/loading_ad_1.png",
            timeUpdate: this.timeUpdate,
        });

        window.Hls = this.hls;
    },

    // called every frame

    update: function (dt) {

        // 每幀判斷播放按鈕狀態
        if (this.hls.video != null) {
            if (this.hls.video.paused) {
                this.playButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.playIcon;
            } else {
                this.playButton.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.pauseIcon;
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

    // 从10秒开始播放
    setCurrentTime() {
        this.hls.seek(5)
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
        // if (this.hls.video.paused) {
        //     sprite.spriteFrame = this.playIcon;
        // } else {
        //     sprite.spriteFrame = this.pauseIcon;
        // }
    },

});
