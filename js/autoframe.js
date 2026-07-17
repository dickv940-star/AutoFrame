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

        // akan diisi pada tahap berikutnya

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

        // hasil:
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

        const vw = this.video.videoWidth;
        const vh = this.video.videoHeight;

        if(!vw) return;

        const cropWidth = vh*9/16;

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

};
