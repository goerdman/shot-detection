'use strict';

var shotDetection = function() {

    var histograms = [];
    var lastFrameNo = -1;
    var frameDisplacement = 12;

    var sceneChangeWorker = new Worker("scene-change.worker.js");
    sceneChangeWorker.onmessage = function addSceneChange(event){
        var index = event.data;
        countSceneChange(index);
    };

    function detectSceneChange() {
        lastFrameNo++;
        if(lastFrameNo % frameDisplacement !== 0) {
            return
        }
        var numberOfHistograms = histograms.length;
        if(numberOfHistograms < frameDisplacement) {
            return;
        }
        var currentHistogram = histograms[numberOfHistograms - 1];
        var lastHistogram = histograms[numberOfHistograms - frameDisplacement];

        sceneChangeWorker.postMessage({
            currentHistogramValues: currentHistogram.values,
            lastHistogramValues: lastHistogram.values,
            index: numberOfHistograms - 1
        });
    }

    function countSceneChange(index) {
        visualizeFrame(index);
        statistics.increaseDetectedCuts(index);
    }

    function visualizeFrame(index) {
        var frame = videoProcessor.getFrame(index);
        var sceneContainer = document.getElementById('sceneContainer');
        sceneContainer.insertBefore(frame.createElement(), sceneContainer.firstChild);
    }

    return {
        addHistogram: function (histogram) {
            histograms.push(histogram);
            detectSceneChange();
        },
        clear: function () {
            lastFrameNo = -1;
            histograms = [];
            var sceneContainer = document.getElementById('sceneContainer');
            sceneContainer.innerHTML = '';
        }
    };
}();
