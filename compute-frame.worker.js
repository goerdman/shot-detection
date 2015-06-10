'use strict';

importScripts('./histogram.js');

self.addEventListener('message', function(e) {
    var frame = e.data.frame;
    var messageIndex = e.data.index;

    var histogram = computeFrameAndReturnHistogram(frame);

    if(!histogram) {
        return;
    }

    self.postMessage({ histogramValues: histogram.values, index: messageIndex });

}, false);

function computeFrameAndReturnHistogram(frame) {

    var histogram = new Histogram();
    for (var index = 0; index < frame.data.length; index += 4) {
        var red = frame.data[index + 0];
        var green = frame.data[index + 1];
        var blue = frame.data[index + 2];
        histogram.increaseValuesFromRGB(red, green, blue);
    }

    return histogram;
}

