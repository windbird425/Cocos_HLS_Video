import { _decorator, Component, Node, log, resources, instantiate, Sprite, Texture2D, SpriteFrame, ImageAsset, Vec2, Toggle, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {
    @property(Node)
    public spriteNode = null;
    @property(Toggle)
    public filmStyleToggle = null;

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

    protected update(dt: number): void {
        if( this.filmStyleToggle.isChecked ){
            this.spriteNodeMaterial.setProperty('resolution', new Vec2(this.spriteNode.getComponent(UITransform).width, this.spriteNode.getComponent(UITransform).height));
            this.spriteNodeMaterial.setProperty('time', performance.now() / 1000); // 每幀更新可用於動畫 noise
            // this.spriteNodeMaterial.setProperty('time', dt); // 每幀更新可用於動畫 noise
        }
    }

    _initVideo () {
        this.videoDOM = this.videoNode.getComponent("VideoPlayerEx").VideoPlayer.nativeVideo; 
        this.canvas = document.createElement("canvas"); 
        // this.canvas.style.width = 350;
        // document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true }); 
        this.canvas.width = this.spriteNode.getComponent(UITransform).width;  // 設定解析度 
        this.canvas.height = this.spriteNode.getComponent(UITransform).height; 

        this.texture = new Texture2D(); 
        this.texture.reset({
            width: this.canvas.width,
            height: this.canvas.height,
            format: Texture2D.PixelFormat.RGBA8888
        });

        this.spriteFrame = new SpriteFrame(); 
        this.spriteFrame.texture = this.texture;
        this.spriteNode.getComponent(Sprite).spriteFrame = this.spriteFrame; 
        this.schedule(this._updateFrame.bind(this), 1 / 60);  // 60FPS 更新 
    }

    _updateFrame () {
        if (this.videoDOM.readyState >= 2) { // 確保影片有足夠幀可讀取 

            this.ctx.drawImage(this.videoDOM, 0, 0, this.canvas.width, this.canvas.height); 
            let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); 
            this.texture.uploadData(imageData.data);

            // this.texture.updateMipmaps(); // optional
            this.spriteFrame.texture = this.texture; 
            this.spriteNode.getComponent(Sprite).spriteFrame = this.spriteFrame;
        } 
    }

    setVideoSpriteGray (event: any, customEventData: any) {
        log(event.progress); 
        this.spriteNodeMaterial.setProperty("grayEffect", event.progress);
    }

    onToggleFilmStyle (event: any, customEventData: any) {
        this.spriteNodeMaterial.setProperty( "enableFilmEffect", Number(event.isChecked) );
    }

}