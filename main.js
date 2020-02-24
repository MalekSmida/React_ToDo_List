const { app, BrowserWindow, desktopCapturer } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    }
  });

  /*   win.loadFile('index.html')
   */
  win.loadURL("http://localhost:3000/");
  win.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("closed", () => {
  win = null;
  app.exit(0);
});

//ipc test
const ipc = require("electron").ipcMain;
/* ipc.on('synMessage', (event, args) => {
 console.log(args);
 event.returnValue = 'Main said I received your Sync message';
}) */

ipc.on("aSynMessage", (event, args) => {
  console.log(args);
  event.sender.send("aSynReply", "Main said: Async message received");
  //capturer();
});

//DESKTOPCapturer
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

/* function capturer() {
  let capture = desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async sources => {
      for (const source of sources) {
        if (source.name === "Electron") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: source.id,
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
    const video = document.querySelector("video");
    video.srcObject = stream;
    video.onloadedmetadata = e => video.play();
  }

  function handleError(e) {
    console.log(e);
  }

  return capture;
} */
