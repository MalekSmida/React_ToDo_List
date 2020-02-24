console.log("Renderer is here!");

const { desktopCapturer } = require("electron");

let blobs = [];
let fs = require("fs");
let video;

desktopCapturer
  .getSources({ types: ["window", "screen"] })
  .then(async sources => {
    for (const source of sources) {
      if (true /* source.name === "Electron" */) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
                /* minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720 */
                minWidth: 456,
                maxWidth: 456,
                minHeight: 305,
                maxHeight: 305
              }
            }
          });
          handleStream(stream);
        } catch (e) {
          handleError(e);
        }
        return;
      }
    }
  });

function handleStream(stream) {
  video = document.querySelector(".video");
  video.srcObject = stream;

  video.ondataavailable = function(event) {
    blobs.push(event.data);
  };

  /* video.onloadedmetadata = e =>  */ video.play();
}

function handleError(e) {
  console.log(e);
}

function stopRecording() {
  video.pause();
  console.log("Video => ", video);
  console.log("recorder stopped, data available");
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

function toArrayBuffer(blob, cb) {
  let fileReader = new FileReader();
  fileReader.onload = function() {
    let arrayBuffer = this.result;
    cb(arrayBuffer);
  };
  fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
  let buffer = new Buffer(ab.byteLength); //Buffer handling streams of binary data
  let arr = new Uint8Array(ab);
  for (let i = 0; i < arr.byteLength; i++) {
    buffer[i] = arr[i];
  }
  return buffer;
}

// Record for 7 seconds and save to disk
setTimeout(function() {
  stopRecording();
}, 7000);

///////////////////////////////////////////////////////////

/* const { desktopCapturer } = require("electron");

let SECRET_KEY = "Magnemite";
let recorder;
let blobs = [];

function startRecording() {
  var title = document.title;
  document.title = SECRET_KEY;

  desktopCapturer.getSources({ types: ["window", "screen"] }, function(
    error,
    sources
  ) {
    if (error) throw error;
    for (let i = 0; i < sources.length; i++) {
      let src = sources[i];
      if (src.name === SECRET_KEY) {
        document.title = title;

        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: src.id,
                minWidth: 800,
                maxWidth: 1280,
                minHeight: 600,
                maxHeight: 720
              }
            }
          },
          handleStream,
          handleUserMediaError
        );
        return;
      }
    }
  });
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
  console.log("recorder stopped, data available");
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
startRecording();
setTimeout(function() {
  stopRecording();
}, 7000);
 */
