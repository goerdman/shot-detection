'use strict';

var statistics = function() {

    videoProcessor.subscribe(notify);

    var detectedCuts = 0;
    var falslyDetectedCuts = 0;
    var sintelTrailerCutsAtSecond = [
        5,
        9,
        12,
        14,
        16,
        17,
        18,
        22,
        24,
        26,
        28,
        29,
        32,
        36,
        42,
        47,
        49,
        51
    ];
    var undetectedCutsAtSecond = sintelTrailerCutsAtSecond.slice();
    function getNumberOfCutsUntil(timeInSeconds) {
        var numberOfCuts = 0;
        for(var index = 0; index <= sintelTrailerCutsAtSecond.length; index++) {
            if(sintelTrailerCutsAtSecond[index] > timeInSeconds) {
                break;
            }
            numberOfCuts++;
        }
        return numberOfCuts
    }
    function getCorrectCut(currentTimeInSeconds) {
        var undetectedCut;
                (undetectedCut = undetectedCutsAtSecond.indexOf(parseInt(currentTimeInSeconds+0.5))) !== -1
                ||
                (undetectedCut = undetectedCutsAtSecond.indexOf(parseInt(currentTimeInSeconds-0.5))) !== -1;
        return undetectedCut < 0 ? undefined : undetectedCut;
    }

    function notify() {
        var currentTime = videoProcessor.getCurrentTime();
        updateUi(currentTime);
    }

    function updateUi(currentTime) {
        var recall = calculateRecall(currentTime);
        var precision = calculatePrecision();
        var recallFormatted = (Math.round(recall * 10000) / 100).toString() + "%";
        var precisionFormatted = (Math.round(precision * 10000) / 100).toString() + "%";
        var recallUi = document.getElementById('recall');
        var precisionUi = document.getElementById('precision');
        recallUi.innerHTML = recallFormatted;
        precisionUi.innerHTML = precisionFormatted;
    }

    function calculateRecall(currentTimeInSeconds) {
        if(currentTimeInSeconds === undefined) {
            currentTimeInSeconds = Number.MAX_VALUE;
        }
        var numberOfNotDetectedCuts = getNumberOfCutsUntil(currentTimeInSeconds) - detectedCuts;
        if(numberOfNotDetectedCuts < 0) {
            numberOfNotDetectedCuts = 0;
        }
        var recall = detectedCuts / (detectedCuts + numberOfNotDetectedCuts);
        return recall || 0;
    }
    function calculatePrecision() {
        var numberOfFalslyDetectedCuts = falslyDetectedCuts;
        var precision = detectedCuts / (detectedCuts + numberOfFalslyDetectedCuts);
        console.log(detectedCuts, numberOfFalslyDetectedCuts);
        return precision || 0;
    }

    return {
        increaseDetectedCuts: function () {
            var currentTimeInSeconds = videoProcessor.getCurrentTime();
            var undetectedCut = getCorrectCut(currentTimeInSeconds);
            if(undetectedCut !== undefined) {
                console.log('correctly detected at', undetectedCut);
                undetectedCutsAtSecond.splice(undetectedCutsAtSecond.indexOf(undetectedCut), 1);
                detectedCuts++;
            } else {
                falslyDetectedCuts++;
            }
        },
        resetDetectedCuts: function () {
            detectedCuts = 0;
            undetectedCutsAtSecond = sintelTrailerCutsAtSecond.slice();
        }
    };
}();