import { _decorator, Component, Node, log, warn, error } from 'cc';
import Hls from 'hls.js'

interface VideoSources {
    [quality: string]: string; // e.g. { "720": "url1", "1080": "url2", "origin": "originalUrl" }
}

interface HlsPlayerOptions {
    hls: typeof Hls;
    videoDOM: HTMLVideoElement;
    videoURL: VideoSources;
    timeUpdate?: (currentTime: number, duration: number, percent: number) => void;
}

export class HlsPlayer {
    private hls: Hls;
    private videoDOM: HTMLVideoElement;
    private videoURL: VideoSources;
    private timeUpdateCallback?: (currentTime: number, duration: number, percent: number) => void;

    constructor(options: HlsPlayerOptions) {
        if (!options.hls.isSupported()) {
            throw new Error('当前环境不支持 HLS！');
        }

        this.hls = new options.hls();
        this.videoDOM = options.videoDOM;
        this.videoURL = options.videoURL;
        this.timeUpdateCallback = options.timeUpdate;

        this.hls.attachMedia(this.videoDOM);
        this.initEventListeners();
    }

    private initEventListeners(): void {
        this.videoDOM.addEventListener("timeupdate", () => {
            const { currentTime, duration } = this.videoDOM;
            if (this.timeUpdateCallback) {
                this.timeUpdateCallback(currentTime, duration, (currentTime / duration) * 100);
            }
        });

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            warn('HLS 已绑定 Video 标签', this.videoDOM);
            const bestURL = this.selectBestURL();
            if (!bestURL) {
                error('HLS 地址为空');
                return;
            }

            this.hls.loadSource(bestURL);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.videoDOM.play()
                .then(() => {
                    // 播放成功後，CB
                    this.videoDOM.muted = false;
                })
                .catch((err) => {
                    error('HLS 播放错误', err);
                });
            });
        });
    }

    private selectBestURL(): string | null {
        const entries = Object.entries(this.videoURL).map(([type, url]) => ({ type, url }));
        entries.sort((a, b) => {
            if (a.type === 'origin' || b.type === 'origin') return 0;
            return Number(b.type) - Number(a.type);
        });
        return entries.length > 0 ? entries[0].url : null;
    }

    public seek(time: any): void {
        this.videoDOM.currentTime = time;
    }

    public play(): void {
        this.videoDOM.play().catch((err) => error('播放失败', err));
    }

    public stop(): void {
        this.videoDOM.pause();
        this.videoDOM.currentTime = 0;
    }

    public pause(): void {
        this.videoDOM.pause();
    }

    public toggle(): void {
        if (this.videoDOM.paused) {
            this.videoDOM.play();
        } else {
            this.videoDOM.pause();
        }
    }

    public destroy(): void {
        this.hls.destroy();
    }
}
