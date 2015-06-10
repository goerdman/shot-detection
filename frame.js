'use strict';


function Frame(dataURL, time) {
    this.dataURL = dataURL;
    this.time = time;
};

Frame.prototype = {
    createElement: function () {
        var frameContainer = document.createElement('div');
        frameContainer.className = 'frame';
        var imageElement = document.createElement('img');
        var caption = document.createElement('span');
        frameContainer.onclick = function(){
            //function to jump to the time in the video by clicking on the time of the thumbnail
            var formattedTime = caption.innerHTML;
            var jumpToTime = 0;
            
            if(formattedTime.length > 8){
                var fHours = formattedTime.substr(0,1);
                var fMinutes = formattedTime.substr(2,2);
                var fSeconds = formattedTime.substr(4,2);                
                jumpToTime = ((fHours*60*60)+(fMinutes*60)+fSeconds);
            } else {
                var fMinutes = formattedTime.substr(0,1);
                var fSeconds = formattedTime.substr(2,2);
                jumpToTime = ((fMinutes*60)+fSeconds);
            }
            
            var video = document.getElementById("video");
            video.currentTime = jumpToTime;
        };
        imageElement.src = this.dataURL;
        caption.innerHTML = this.getTimeFormatted();

        frameContainer.appendChild(imageElement);
        frameContainer.appendChild(caption);

        return frameContainer;
    },
    getTimeFormatted: function () {
        var hours = Math.floor(this.time / 60 / 60);
        var minutes = Math.floor(this.time / 60 - hours * 60 * 60);
        var secondsRaw = this.time - hours * 60 * 60 - minutes * 60;
        var seconds = Math.floor(secondsRaw);
        var milliseconds = Math.floor((secondsRaw - Math.floor(secondsRaw)) * 1000);

        var timeString = '';
        if(hours > 0) {
            timeString += hours + ':';
        }
        timeString += minutes + ':';
        timeString += seconds.toString().length == 1 ? '0' + seconds : seconds;
        timeString += '.' + milliseconds;

        return timeString;
    }
};