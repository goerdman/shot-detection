'use strict';

function HistogramDrawer() {
    this.initialize();
}

HistogramDrawer.prototype = {
    initialize: function() {
        this.canvas = document.getElementById("histogram");
        this.ctx = this.canvas.getContext("2d");
    },
    draw: function (histogram) {
        this.canvas.width = histogram.valuesLength;
        var ctx = this.ctx;
        var height = this.ctx.canvas.height;
        var max = Math.max.apply(this, histogram.values);

        ctx.fillStyle = "rgb(255,255,255)";
        for(var index = 0; index < histogram.values.length; index++) {
            var percentageValue = (histogram.values[index] / max) * height;
            ctx.fillRect(index, height, 1, -Math.round(percentageValue));
        }
    }
};