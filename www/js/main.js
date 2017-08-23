/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH = 50;
var HEIGHT = 200;
var rafID = null;
var startRecord = false;
var controlStopWatch = true;
var time = 30;
var inc = 0;

window.onload = function () {

    $("#ex4").slider({
        reversed: true
    });

    $("#ex5").slider({
        reversed: true
    });

    $("#startbutton").click(function () {
        console.log("Juego iniciado" + $("#ex4").val());
        controlStopWatch = true;
        startRecord = true;
        time = $("#ex5").val() * 10;
        $("#acumuladorJugador").css("width", 0);
        $("#valAcumm").html("0 %");
        inc = 0;
        startTime();
    });

    $("#stopbutton").click(function () {
        console.log("Juego detenido");
        startRecord = false;
        controlStopWatch = false;
    });

    function startTime() {
        if (time < 10)
            $("#tiempo").html("00:0" + time);
        else
            $("#tiempo").html("00:" + time);
        time--;
        if (controlStopWatch == true)
            var t = setTimeout(startTime, 1000);
        if (time == 0){
            startRecord = false;
            controlStopWatch = false;
        }
    }

    var div = document.getElementById('progressBarControl'),
        deg = -90;

    div.style.webkitTransform = 'rotate(' + deg + 'deg)';
    div.style.mozTransform = 'rotate(' + deg + 'deg)';
    div.style.msTransform = 'rotate(' + deg + 'deg)';
    div.style.oTransform = 'rotate(' + deg + 'deg)';
    div.style.transform = 'rotate(' + deg + 'deg)';

    // grab our canvas
    canvasContext = document.getElementById("meter").getContext("2d");

    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, gotStream, didntGetStream);
    } catch (e) {
        alert('Error al cargar navigator.getUserMedia:' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop(time) {
    // clear the background
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    canvasContext.fillStyle = "yellow";

    canvasContext.fillRect(0, HEIGHT - meter.volume * HEIGHT * 1.4, WIDTH, HEIGHT);
    $("#valLevel").html($("#ex4").val() + " %");
    $("#valTime").html($("#ex5").val() * 10 + " Segundos");

    if (startRecord == true) {
        if (meter.volume > 0.01 * $("#ex4").val()) {
            console.log(meter.volume);
            inc++;
            if (inc <= $("#progressBarControl").width()) {
                $("#acumuladorJugador").css("width", inc);
                $("#valAcumm").html(parseFloat((inc * 100) / $("#progressBarControl").width()).toFixed(1) + " %");
            }
        }
    }
    // set up the next visual callback
    rafID = window.requestAnimationFrame(drawLoop);


}

console.log("Cargado los datos.");
