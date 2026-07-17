import {
    FilesetResolver,
    FaceDetector
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const AutoFrame = {

    video: null,
    canvas: null,
    ctx: null,

    detector: null,

    tracking: false,
    animationId: null,

    outputWidth: 1080,
    outputHeight: 1920,

    cropX: 0,
    cropY: 0,

    smoothX: 0,
    smoothY: 0,

    cropWidth: 0,
    cropHeight: 0,

    lastFace: null,

    async start(video){

        this.video = video;

        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = this.outputWidth;
        this.canvas.height = this.outputHeight;

        this.cropHeight = video.videoHeight;
        this.cropWidth = this.cropHeight * 9 / 16;

        if(this.cropWidth > video.videoWidth){

            this.cropWidth = video.videoWidth;
            this.cropHeight = this.cropWidth * 16 / 9;

        }

        this.smoothX = 0;
        this.smoothY = 0;

        await this.loadModel();
if(!this.detector){

    console.error("Face Detector gagal dimuat.");

    return;

}
        this.tracking = true;

        this.loop();

    },

    stop(){

        this.tracking = false;

        if(this.animationId){

            cancelAnimationFrame(this.animationId);

        }

    },

   async loadModel() {

    console.log("================================");
    console.log("AUTO FRAME");
    console.log("Loading MediaPipe...");
    console.log("================================");

    try {

        const vision = await FilesetResolver.forVisionTasks(

            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"

        );

        this.detector = await FaceDetector.createFromOptions(

            vision,

            {

                baseOptions: {

                    modelAssetPath:

"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"

                },

                runningMode: "VIDEO",

                minDetectionConfidence: 0.5

            }

        );

        console.log("MediaPipe Loaded");
        console.log(this.detector);

    }

    catch(error){

        console.error("MediaPipe Error");

        console.error(error);

        this.detector = null;

    }

       },

async detectFace() {

    if (!this.detector) {

        return null;

    }

    if (this.video.readyState < 2) {

        return null;

    }

    try {

        const result = this.detector.detectForVideo(

            this.video,

            performance.now()

        );

        if (!result || !result.detections || result.detections.length === 0) {

            return null;

        }

        const detection = result.detections[0];

        const box = detection.boundingBox;

        this.lastFace = {

            x: box.originX,
            y: box.originY,
            width: box.width,
            height: box.height

        };

        return this.lastFace;

    }

    catch(error){

        console.error(error);

        return null;

    }

    },

    follow(face){

    const videoWidth = this.video.videoWidth;
    const videoHeight = this.video.videoHeight;

    if (!videoWidth || !videoHeight) return;

    // Titik tengah wajah
    const faceCenterX = face.x + (face.width / 2);
    const faceCenterY = face.y + (face.height / 2);

    // Crop 9:16
    const cropWidth = this.cropWidth;
    const cropHeight = this.cropHeight;

    // Target posisi crop
    let targetX = faceCenterX - (cropWidth / 2);
    let targetY = faceCenterY - (cropHeight / 2);

    // Batasi agar crop tidak keluar video
    targetX = Math.max(0, Math.min(targetX, videoWidth - cropWidth));
    targetY = Math.max(0, Math.min(targetY, videoHeight - cropHeight));

    // Smooth Camera
    const smooth = 0.12;

    this.smoothX += (targetX - this.smoothX) * smooth;
    this.smoothY += (targetY - this.smoothY) * smooth;

    this.cropX = this.smoothX;
    this.cropY = this.smoothY;

    },

    draw(){

    if (!this.video) return;
    if (!this.ctx) return;

    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;

    if (!vw || !vh) return;

    let sx = this.cropX;
    let sy = this.cropY;

    let sw = this.cropWidth;
    let sh = this.cropHeight;

    // Pastikan crop tidak keluar video
    if (sx < 0) sx = 0;
    if (sy < 0) sy = 0;

    if (sx + sw > vw) {
        sx = vw - sw;
    }

    if (sy + sh > vh) {
        sy = vh - sh;
    }

    this.ctx.clearRect(
        0,
        0,
        this.outputWidth,
        this.outputHeight
    );

    this.ctx.drawImage(

        this.video,

        sx,
        sy,

        sw,
        sh,

        0,
        0,

        this.outputWidth,
        this.outputHeight

    );

} 

    },

        async loop() {

    if (!this.tracking) {
        return;
    }

    if (!this.video) {
        this.animationId = requestAnimationFrame(
            this.loop.bind(this)
        );
        return;
    }

    if (this.video.paused || this.video.ended) {

        this.animationId = requestAnimationFrame(
            this.loop.bind(this)
        );

        return;

    }

    try {

        const face = await this.detectFace();

        if (face) {

            this.follow(face);

        }

        this.draw();

    }

    catch (error) {

        console.error("AutoFrame Loop Error");

        console.error(error);

    }

    this.animationId = requestAnimationFrame(
        this.loop.bind(this)
    );


    },

};

window.AutoFrame = AutoFrame;
