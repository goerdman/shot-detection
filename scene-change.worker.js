'use strict';

importScripts('./scene-change-detector.js');

self.addEventListener('message', function(e) {

    var currentHistogramValues = e.data.currentHistogramValues;
    var lastHistogramValues = e.data.lastHistogramValues;

    if(sceneChangeDetector.isSceneChange(currentHistogramValues, lastHistogramValues)) {
        self.postMessage(e.data.index); // return message only if scene has changed
        return;
    }

}, false);
