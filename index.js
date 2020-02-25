console.log("Renderer is here!");

const { desktopCapturer } = require("electron");

const mediaSource = new MediaSource();
mediaSource.addEventListener("sourceopen", handleSourceOpen, false);

let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

let video;
let stream;

const recordedVideo = document.querySelector("video#recorded");
const recordButton = document.querySelector("button#record");
const startButton = document.querySelector("button#start");

startButton.addEventListener("click", () => {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async sources => {
      for (const source of sources) {
        if (true) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: false /* {
                mandatory: {
                  chromeMediaSource: "desktop"
                }
              } */,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: source.id,
                  /* minWidth: 500,
                  maxWidth: 500,
                  minHeight: 300,
                  maxHeight: 300 */
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720
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
    video = document.querySelector("video#streaming");
    console.log("Video => ", video);
    video.srcObject = stream; //handle streams

    video.onloadedmetadata = e => video.play();
  }

  function handleError(e) {
    console.log(e);
  }
});

recordButton.addEventListener("click", () => {
  if (recordButton.textContent === "Start Recording") {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = "Start Recording";
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});

const playButton = document.querySelector("button#play");
playButton.addEventListener("click", () => {
  const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

const downloadButton = document.querySelector("button#download");
downloadButton.addEventListener("click", () => {
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "test.webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleSourceOpen(event) {
  console.log("MediaSource opened");
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log("Source buffer: ", sourceBuffer);
}

function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = { mimeType: "video/webm;codecs=vp9" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`);
    errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
    options = { mimeType: "video/webm;codecs=vp8" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
      options = { mimeType: "video/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = { mimeType: "" };
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(stream, options);
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
      e
    )}`;
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder, "with options", options);
  recordButton.textContent = "Stop Recording";
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = event => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log("getUserMedia() got stream:", stream);
  window.stream = stream;

  const gumVideo = document.querySelector("video#gum");
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error("navigator.getUserMedia error:", e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

/* document.querySelector("button#start").addEventListener("click", async () => {
  const hasEchoCancellation = document.querySelector("#echoCancellation")
    .checked;
  const constraints = {
    audio: {
      echoCancellation: { exact: hasEchoCancellation }
    },
    video: {
      width: 1280,
      height: 720
    }
  };
  console.log("Using media constraints:", constraints);
  await init(constraints);
}); */

/* 
let blobs = [];
let fs = require("fs");
let video;
let stream;

desktopCapturer
  .getSources({ types: ["window", "screen"] })
  .then(async sources => {
    for (const source of sources) {
      if (true) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: "desktop"
              }
            },
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
                minWidth: 500,
                maxWidth: 500,
                minHeight: 300,
                maxHeight: 300
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
  console.log("Video => ", video);
  video.srcObject = stream; //handle streams

  blobs = [];

  video.ondataavailable = function(event) {
    blobs.push(event.data);
    console.log("blobs : ", blobs);
  };

  video.onloadedmetadata = e => video.play();

  setTimeout(function() {
    stopRecording();
    if (stream) {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }, 7000);
}

function handleError(e) {
  console.log(e);
}

function stopRecording() {
  video.pause();
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
} */
