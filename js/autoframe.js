const AutoFrame = {

    video: null,
    canvas: null,
    ctx: null,

    detector: null,

    tracking: false,

    outputWidth: 1080,
    outputHeight: 1920,

    cropX: 0,
    smoothX: 0,

    async start(video){

        this.video = video;

        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = this.outputWidth;
        this.canvas.height = this.outputHeight;

        await this.loadModel();

        this.tracking = true;

        requestAnimationFrame(this.loop.bind(this));
        
    },

    async loadModel(){

        console.log("Loading MediaPipe...");

        /import {
    FilesetResolver,
    FaceDetector
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

async loadModel(){

    const vision = await FilesetResolver.forVisionTasks(

        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"

    );

    this.detector = await FaceDetector.createFromOptions(

        vision,

        {

            baseOptions:{

                modelAssetPath:

"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"

            },

            runningMode:"VIDEO",

            minDetectionConfidence:0.5

        }

    );

    console.log("MODEL READY");

}/ akan diisi pada tahap berikutnya

    },

    async loop(){

        if(!this.tracking) return;

        if(this.video.paused){

            requestAnimationFrame(this.loop.bind(this));
            return;

        }

        const face = await this.detectFace();

        if(face){

            this.follow(face);

        }

        this.draw();

        requestAnimationFrame(this.loop.bind(this));

    },

    async detectFace(){

        async detectFace(){

    if(!this.detector) return null;

    const result = this.detector.detectForVideo(

        this.video,

        performance.now()

    );

    if(!result.detections.length){

        return null;

    }

    const box = result.detections[0].boundingBox;

    return{

        x:box.originX,

        y:box.originY,

        width:box.width,

        height:box.height

    };

}// hasil:
        // {x,y,width,height}

        return null;

    },

    follow(face){

        const center = face.x + face.width/2;

        const videoWidth = this.video.videoWidth;

        const cropWidth = videoWidth * 9 / 16;

        let target = center - cropWidth/2;

        if(target < 0) target = 0;

        if(target > videoWidth-cropWidth)
            target = videoWidth-cropWidth;

        this.cropX = target;

        this.smoothX += (this.cropX-this.smoothX)*0.15;

    },

    draw(){

    const vw=this.video.videoWidth;

    const vh=this.video.videoHeight;

    if(!vw||!vh) return;

    let cropWidth=vh*9/16;

    if(cropWidth>vw){

        cropWidth=vw;

    }

    this.ctx.clearRect(

        0,
        0,
        this.outputWidth,
        this.outputHeight

    );

    this.ctx.drawImage(

        this.video,

        this.smoothX,
        0,

        cropWidth,
        vh,

        0,
        0,

        this.outputWidth,
        this.outputHeight

    );

}
