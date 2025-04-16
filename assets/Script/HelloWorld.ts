import { _decorator, Component, Node, log, resources, instantiate, Sprite, Texture2D, SpriteFrame, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {
    @property(Node)
    public spriteNode = null;

    private videoNode: Node | null = null;
    private spriteNodeMaterial: any;
    private videoDOM: any;
    private canvas: any;
    private ctx: any;
    private imageAsset: ImageAsset;
    private texture: Texture2D;
    private spriteFrame: SpriteFrame;
    
    onLoad () {
        this.videoNode = null; 
        this.spriteNodeMaterial = this.spriteNode.getComponent(Sprite).getSharedMaterial(0); 
    }

    start () {
        let resName = "prefab/VideoPlayer"; 
        let videoData = { 
            videoURLs: { 
                '1080': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8', 
                '720': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8', 
                origin: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8' 
            }, 
            posterURL: "img/poster.jpg" 
        } 
        resources.load(resName, function (err, prefab) { 
            let videoPlayerNode = instantiate(prefab); 
            this.node.addChild(videoPlayerNode); 
            videoPlayerNode.setPosition(-410, 30); 
            videoPlayerNode.getComponent("VideoPlayerEx").createHls(videoData); 
            this.videoNode = videoPlayerNode; 
            // this.videoNode.active = false; 
            this._initVideo(); 
        }.bind(this)); 
    }

    // _initVideo () {
    //     this.videoDOM = this.videoNode.getComponent("VideoPlayerEx").VideoPlayer.nativeVideo; 
    //     this.canvas = document.createElement("canvas"); 
    //     this.ctx = this.canvas.getContext("2d", { willReadFrequently: true }); 
    //     this.canvas.width = 428;  // 設定解析度 
    //     this.canvas.height = 240; 
    //     this.texture = new Texture2D(); 
    //     this.spriteFrame = new SpriteFrame(); 
    //     this.spriteFrame.texture = this.texture;
    //     this.spriteNode.getComponent(Sprite).spriteFrame = this.spriteFrame; 
    //     this.schedule(this._updateFrame, 1 / 60);  // 60FPS 更新 
    // }

    // _updateFrame () {
    //     if (this.videoDOM.readyState >= 2) { // 確保影片有足夠幀可讀取 
    //         this.ctx.drawImage(this.videoDOM, 0, 0, this.canvas.width, this.canvas.height); 
    //         let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); 
    //         // this.texture.initWithData(imageData.data, Texture2D.PixelFormat.RGBA8888, this.canvas.width, this.canvas.height); 
    //         const imageAsset = new ImageAsset({
    //             _data: imageData.data,
    //             _compressed: false,
    //             width: this.canvas.width,
    //             height: this.canvas.height,
    //             format: Texture2D.PixelFormat.RGBA8888,
    //         });
    //         this.texture.image = imageAsset;
    //         this.spriteFrame.texture = this.texture; 
    //         this.spriteNode.getComponent(Sprite).spriteFrame = this.spriteFrame;
    //     } 
    // }

    _initVideo () {
        this.videoDOM = this.videoNode.getComponent("VideoPlayerEx").VideoPlayer.nativeVideo;
        
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = 350;
        document.body.appendChild(this.canvas);
        this.canvas.width = 428;
        this.canvas.height = 240;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        this.imageAsset = new ImageAsset(this.canvas);
        log(this.imageAsset);

        this.texture = new Texture2D();
        this.texture.image = this.imageAsset;

        this.spriteFrame = new SpriteFrame();
        this.spriteFrame.texture = this.texture;
        // this.spriteFrame = SpriteFrame.createWithImage(this.imageAsset)

        this.spriteNode.getComponent(Sprite).spriteFrame = this.spriteFrame;

        this.schedule(this._updateFrame, 1 / 30); // 用 30 FPS 測試即可
    }
    
    _updateFrame () {
        if (this.videoDOM.readyState >= 2) {
            this.ctx.drawImage(this.videoDOM, 0, 0, this.canvas.width, this.canvas.height);
            this.imageAsset._nativeAsset = this.canvas;
        }
    }

    setVideoSpriteGray (event: any, customEventData: any) {
        // cc.log(event.progress); 
        // this.spriteNodeMaterial.setProperty("grayEffect", event.progress);  
    }

}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         spriteNode: {// 影片要顯示的節點 (cc.Sprite)
//             default: null,
//             type: cc.Node
//         },
//     },
// 
//     // use this for initialization
//     onLoad: function () {
//         // cc.Camera.main.backgroundColor = cc.color(0, 0, 0, 0);
//         this.videoNode = null;
//         this.spriteNodeMaterial = this.spriteNode.getComponent(cc.Sprite).getMaterial(0);
//     },
// 
//     start() {
//         let resName = "prefab/VideoPlayer";
//         // Al Jazeera 直播源 https://live-hls-web-aje.getaj.net/AJE/01.m3u8
//         let videoData = {
//             videoURLs: {
//                 '1080': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
//                 '720': 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
//                 origin: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8'
//             },
//             // videoURLs: {
//             //     '1080': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
//             //     '720': 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
//             //     origin: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
//             // },
//             posterURL: "img/poster.jpg"
//         }
// 
//         cc.resources.load(resName, function (err, prefab) {
//             let videoPlayerNode = cc.instantiate(prefab);
//             this.node.addChild(videoPlayerNode);
//             videoPlayerNode.setPosition(-410, 30);
//             videoPlayerNode.getComponent("VideoPlayer").createHls(videoData);
// 
//             this.videoNode = videoPlayerNode;
//             this.videoNode.active = false;
//             // window.videoNode = this.videoNode;
//             this._initVideo();
//         }.bind(this));
//     },
// 
//     _initVideo() {
//         this.videoDOM = this.videoNode.getComponent("VideoPlayer").VideoPlayer._impl._video;
// 
//         // 創建 Canvas 用於繪製影片
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
// 
//         this.canvas.width = 428;  // 設定解析度
//         this.canvas.height = 240;
// 
//         // 創建 cc.Texture2D 來接收影片幀
//         this.texture = new cc.Texture2D();
//         this.spriteFrame = new cc.SpriteFrame(this.texture);
//         this.spriteNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;
// 
//         // 開始更新影片畫面
//         this.schedule(this._updateFrame, 1 / 60);  // 60FPS 更新
//     },
// 
//     _updateFrame() {
//         if (this.videoDOM.readyState >= 2) { // 確保影片有足夠幀可讀取
//             this.ctx.drawImage(this.videoDOM, 0, 0, this.canvas.width, this.canvas.height);
// 
//             let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
//             this.texture.initWithData(imageData.data, cc.Texture2D.PixelFormat.RGBA8888, this.canvas.width, this.canvas.height);
//             this.spriteFrame.setTexture(this.texture);
//         }
//     },
// 
//     setVideoSpriteGray(event, customEventData) {
//         cc.log(event.progress);
//         this.spriteNodeMaterial.setProperty("grayEffect", event.progress); 
//     },
// 
// });
