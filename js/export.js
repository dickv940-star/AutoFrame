const ExportVideo = {

    recorder: null,
    chunks: [],

    stream: null,

    recording: false,

    start(canvas, fps = 30) {

        this.chunks = [];

        this.stream = canvas.captureStream(fps);

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: "video/webm;codecs=vp9"
        });

        this.recorder.ondataavailable = (e) => {

            if (e.data.size > 0) {

                this.chunks.push(e.data);

            }

        };

        this.recorder.start();

        this.recording = true;

        console.log("Recording...");

    },

    async stop() {

        if (!this.recording) return;

        return new Promise(resolve => {

            this.recorder.onstop = async () => {

                const blob = new Blob(this.chunks, {
                    type: "video/webm"
                });

                const mp4 = await this.convertToMP4(blob);

                resolve(mp4);

            };

            this.recorder.stop();

            this.recording = false;

        });

    },

    async convertToMP4(webmBlob) {

        console.log("Convert WebM -> MP4");

        // Di sini nanti dipanggil FFmpeg.wasm
        // writeFile()
        // exec("-i input.webm output.mp4")
        // readFile()

        return webmBlob;

    },

    download(blob, filename = "autoframe.mp4") {

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = filename;

        a.click();

        URL.revokeObjectURL(url);

    }

};

window.ExportVideo = ExportVideo;
