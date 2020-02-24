console.log("Renderer is here!");

const { desktopCapturer } = require("electron");

var fs = require("fs");
var recorder;
var blobs = [];

console.log("test 1 :: ", desktopCapturer);


function startRecording() {
  var title = "First of the North";
  console.log(desktopCapturer);
  
}

function handleStream(stream) {
  recorder = new MediaRecorder(stream);
  blobs = [];
  recorder.ondataavailable = function(event) {
    blobs.push(event.data);
  };
  recorder.start();
}

function stopRecording() {
  recorder.stop();
  toArrayBuffer(new Blob(blobs, { type: "video/webm" }), function(ab) {
    var buffer = toBuffer(ab);
    var file = `./videos/example.webm`;
    fs.writeFile(file, buffer, function(err) {
      if (err) {
        console.error("Failed to save video " + err);
      } else {
        console.log("Saved video: " + file);
      }
    });
  });
}

function handleUserMediaError(e) {
  console.error("handleUserMediaError", e);
}

function toArrayBuffer(blob, cb) {
  let fileReader = new FileReader();
  fileReader.onload = function() {
    let arrayBuffer = this.result;
    cb(arrayBuffer);
  };
  fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
  let buffer = new Buffer(ab.byteLength);
  let arr = new Uint8Array(ab);
  for (let i = 0; i < arr.byteLength; i++) {
    buffer[i] = arr[i];
  }
  return buffer;
}

// Record for 7 seconds and save to disk
startRecording.bind(this)();
setTimeout(function() {
  stopRecording();
}, 7000);