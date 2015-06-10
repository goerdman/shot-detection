'use strict';

var videoProcessor = function() {

    var video,
        canvas,
        ctx,
        frameWidth = 0,
        frameHeight = 0,
        framesDataURLDuplicates = [],
        framesDataURL = [],
        histogramDrawer;

    var frameSelectionWorker = new Worker("frame-selection.worker.js");
    var computeFrameWorker = new Worker("compute-frame.worker.js");

    frameSelectionWorker.onmessage = function forwardToComputation(event) {
        computeFrameWorker.postMessage(event.data);
    };

    computeFrameWorker.onmessage = function processUniqueHistogram(event){
        // only data from unique frames get to here
        var index = event.data.index;
        var histogramValues = event.data.histogramValues;
        var histogram = new Histogram();
        histogram.values = histogramValues;
        shotDetection.addHistogram(histogram);
        framesDataURL.push(framesDataURLDuplicates[index]);
        histogramDrawer.draw(histogram);
    };

    function timerCallback() {
        if (video.paused || video.ended) {
            return;
        }

        computeFrame();
        setTimeout(function () {
            timerCallback();
        }, 0);
    }

    var previousFrame;

    function computeFrame() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        framesDataURLDuplicates.push(new Frame(canvas.toDataURL(), video.currentTime));
        var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

        frameSelectionWorker.postMessage({
            frame: frame,
            previousFrame: previousFrame,
            index: framesDataURLDuplicates.length - 1
        });

        previousFrame = frame;
    }

    function clearFrameData() {
        framesDataURLDuplicates = [];
        framesDataURL = [];
    }

    return {
        doLoad: function () {
            video = document.getElementById("video");
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            video.addEventListener("play", function () {
                frameWidth = video.videoWidth;
                frameHeight = video.videoHeight;
                timerCallback();
            }, false);
            video.addEventListener("seeked", function () {
                clearFrameData();
                shotDetection.clear();
                statistics.resetDetectedCuts();
            }, false);
            histogramDrawer = new HistogramDrawer()
        },
        getFrame: function (index) {
            return framesDataURL[index];
        },
        getCurrentTime: function () {
            if(!video) {
                return 0;
            }
            return video.currentTime;
        }
    };
}();