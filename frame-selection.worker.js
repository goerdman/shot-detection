'use strict';

importScripts('./frame-selection.js');

self.addEventListener('message', function(e) {
    var frame = e.data.frame;
    var previousFrame = e.data.previousFrame;
    var messageIndex = e.data.index;

    if(frameSelection.isEqualFrame(frame, previousFrame)) {
        return; // ignore equal frames
    }

    self.postMessage({ frame: frame, index: messageIndex});

}, false);

