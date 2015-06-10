'use strict';

var frameSelection = function() {

    function isEqualFrame(frame1, frame2) {
        if(!frame1 || !frame1.data || !frame2 || !frame2.data) {
            return false;
        }
        if(frame1.data.length != frame2.data.length) {
            return false;
        }
        for (var index = 0; index < frame1.data.length; index++) {
            if(frame2.data[index] != frame1.data[index]) {
                return false;
            }
        }
        return true;
    }

    return {
        isEqualFrame: isEqualFrame
    };
}();
