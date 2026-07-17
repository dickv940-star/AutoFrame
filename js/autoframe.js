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

}

    async detectFace(){

        // PART 3

        return null;

    },

    follow(face){

        // PART 4

    },

    draw(){

        // PART 5

    },

    loop(){

        // PART 6

    }

};

window.AutoFrame = AutoFrame;
