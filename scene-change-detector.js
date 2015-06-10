'use strict';

var sceneChangeDetector = function () {
    
    function isSceneChange(currentHistogramValues, lastHistogramValues) {
        var difference;
        difference = arrayDifferenceAssociation(currentHistogramValues, lastHistogramValues);

        var sum1, sum2;
        sum1 = arraySum(currentHistogramValues);
        sum2 = arraySum(difference);


        if (sum1 <= sum2) {
            return true;
        }
        return false;
    }

    function arrayDifferenceAssociation(arrays) {
        var differencesArray = {},
            argl = arguments.length,
            k1 = '',
            i = 1,
            k = '',
            arr = {};

        arr1keys: for (k1 in arrays) {
            for (i = 1; i < argl; i++) {
                arr = arguments[i];
                for (k in arr) {
                    if (arr[k] === arrays[k1] && k === k1) {
                        // If it reaches here, it was found in at least one array, so try next value
                        continue arr1keys;
                    }
                }
                differencesArray[k1] = arrays[k1];
            }
        }
        return differencesArray;

    }

    function arraySum(array) {
        var key;
        var sum = 0;

        if (array && typeof array === 'object' && array.change_key_case) {
            return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
        }

        if (typeof array !== 'object') {
            return null;
        }

        for (key in array) {
            if (!isNaN(parseFloat(array[key]))) {
                sum += parseFloat(array[key]);
            }
        }

        return sum;
    }

    return {
        isSceneChange: isSceneChange
    };
}();