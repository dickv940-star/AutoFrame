/*
=========================================
Auto Frame Studio
Export Engine
Version 1.0
=========================================
*/

"use strict";

const ExportVideo = {

    recorder: null,
    stream: null,
    chunks: [],
    recording: false,

    /*
    =========================================
    START RECORDING
    =========================================
    */

    start(canvas, fps = 30) {

        if (!canvas) {

            console.error("Canvas tidak ditemukan.");

            return false;

        }

        this.chunks = [];

        this.stream = canvas.captureStream(fps);

        const options = {};

        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {

            options.mimeType = "video/webm;codecs=vp9";

        }
        else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {

            options.mimeType = "video/webm;codecs=vp8";

        }
        else {

            options.mimeType = "video/webm";

        }

        this.recorder = new MediaRecorder(
            this.stream,
            options
        );

        this.recorder.ondataavailable = (event) => {

            if (event.data && event.data.size > 0) {

                this.chunks.push(event.data);

            }

        };

        this.recorder.onstart = () => {

            console.log("Recording Started");

        };

        this.recorder.onerror = (error) => {

            console.error(error);

        };

        this.recorder.start();

        this.recording = true;

        return true;

    },

    /*
    =========================================
    STOP RECORDING
    =========================================
    */

    stop() {

        return new Promise((resolve) => {

            if (!this.recording || !this.recorder) {

                resolve(null);

                return;

            }

            this.recorder.onstop = () => {

                const blob = new Blob(

                    this.chunks,

                    {

                        type: "video/webm"

                    }

                );

                this.recording = false;

                resolve(blob);

            };

            this.recorder.stop();

        });

    },

    /*
    =========================================
    DOWNLOAD
    =========================================
    */

    download(blob, filename = "AutoFrame.webm") {

        if (!blob) {

            alert("Video belum direkam.");

            return;

        }

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

};

window.ExportVideo = ExportVideo;

console.log("Export Engine Loaded");
