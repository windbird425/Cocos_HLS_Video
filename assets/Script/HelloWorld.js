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
    },

    // use this for initialization
    onLoad: function () {
        // cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
        this.hls = null;
        this.VideoPlayer = this.vidioNode.getComponent(cc.VideoPlayer);
    },

    start() {
        this.hls = createHlsVideo({
            hls: Hls,
            videoDOM: this.VideoPlayer._impl._video,
            volume: 1,
            videoURL: {
                '1080': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                '720': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                origin: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
            },
            timeUpdate: this.timeUpdate,
        });

        window.Hls = this.hls;
    },

    // called every frame
    update: function (dt) {

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
        let btnNode = event.target;
        let sprite = btnNode.getChildByName("Background").getComponent(cc.Sprite);

        console.log(event);
        console.log(sprite);
        this.hls.toggle();
        if (this.hls.video.paused) {
            sprite.spriteFrame = this.playIcon;
        } else {
            sprite.spriteFrame = this.pauseIcon;
        }
    },

});
