import { _decorator, Component, Node, VideoPlayer, log  } from 'cc';
import { HlsPlayer } from './Utilities/cocos-hls-player';
const { ccclass, property } = _decorator;

import Hls from 'hls.js'
const bufferTime = 15; // 預設直播的緩衝秒數
@ccclass('VideoPlayerEx')
export class VideoPlayerEx extends Component {
    @property(Node)
    public vidioNode = null;

    private hls: HlsPlayer | null = null;
    public VideoPlayer: VideoPlayer | null = null;
    onLoad () {
        this.hls = null; 
        this.VideoPlayer = this.vidioNode.getComponent(VideoPlayer);
        this.VideoPlayer._impl.createVideoPlayer("");
    }

    start () {
    }

    update (dt: any) {
        // if (this.liveBadge != null && this.liveBadge != undefined) { 
            // if ((this.hls.video.duration - this.hls.video.currentTime) > (bufferTime * 2)) { 
                // this.liveBadge.style["cursor"] = "pointer"; 
                // this.liveBadge.style["background-color"] = "#757575"; 
            // } else { 
                // this.liveBadge.style["cursor"] = ""; 
                // this.liveBadge.style["background-color"] = ""; 
            // } 
        // } 
    }

    addRemoteUrl () {
    }

    changeRemoteUrl () {
    }

    timeUpdate (currentTime: any, duration: any, percentage: any) {
    }

    setCurrentTime (second: any) {
        this.hls.seek(second); 
    }

    playVideo () {
        this.hls.play() 
    }

    stopVideo () {
        this.hls.stop() 
    }

    pauseVideo () {
        this.hls.pause() 
    }

    toggle (event: any, customEventData: any) {
        this.hls.toggle(); 
    }

    createHls (options: any) {
        // log("哈哈是我啦");
        // this.VideoPlayer._impl._video.controls = true; // 顯示控制面板 
        // this.VideoPlayer._impl._video.crossorigin = "anonymous"; 
        // this.VideoPlayer._impl._video.poster = options.posterURL; 
        // this.VideoPlayer._impl._video.disablePictureInPicture = true; 
        // this.VideoPlayer._impl._video.addEventListener("click", this._mouseHandler, false); 
        // if (this.VideoPlayer._impl._video.canPlayType("application/vnd.apple.mpegurl")) { 
        //     this.VideoPlayer._impl._video.src = options.videoURLs.origin; 
        // } else { 
        //     this.hls = HlsPlayer.createHlsVideo({ 
        //         hls: Hls, 
        //         videoDOM: this.VideoPlayer._impl._video, 
        //         volume: 1, 
        //         videoURL: options.videoURLs, 
        //         timeUpdate: this.timeUpdate, 
        //     }); 
        // } 
        // this.VideoPlayer._impl._video.autoplay = true; 
        // this.VideoPlayer._impl._video.muted = false; 
        // if( !this.VideoPlayer.nativeVideo ){
        //     this.VideoPlayer._impl.createVideoPlayer("");
        // }

        this.VideoPlayer.nativeVideo.controls = true; // 顯示控制面板 
        this.VideoPlayer.nativeVideo.crossOrigin = "anonymous"; 
        this.VideoPlayer.nativeVideo.poster = options.posterURL; 
        this.VideoPlayer.nativeVideo.disablePictureInPicture = true; 
        this.VideoPlayer.nativeVideo.addEventListener("click", this._mouseHandler, false); 
        this.VideoPlayer.nativeVideo.muted = true;
        // this.VideoPlayer.nativeVideo.preload = "none";
        if (this.VideoPlayer.nativeVideo.canPlayType("application/vnd.apple.mpegurl")) { 
            this.VideoPlayer.nativeVideo.src = options.videoURLs.origin; 
        } else { 
            this.hls = new HlsPlayer({ 
                hls: Hls, 
                videoDOM: this.VideoPlayer.nativeVideo,
                videoURL: options.videoURLs, 
                timeUpdate: this.timeUpdate, 
            }); 
        } 
        this.VideoPlayer.nativeVideo.autoplay = true; 
    }

    _createDOM (tagName: string, className: string, id: any, parentNode: any) {
        const DOM = document.createElement(tagName); 
        DOM.classList.add(className); 
        DOM.id = id; 
        parentNode.appendChild(DOM); 
        return DOM; 
    }

    _mouseHandler (event: any) {
        event.preventDefault(); 
    }

}
