import React, { Component } from "react";

//Adding a CSS Modules Stylesheet
import classes from "./index.module.css";

class screenrecorder extends Component {
  state = {
    showMessage: false,
    source: ""
  };

  handleOnClick(e) {
    /* console.log("works! :", e); */

    window.ipcRenderer.send("aSynMessage", "A async message to main");

    window.ipcRenderer.on("aSynReply", (event, args) => {
      this.setState({ showMessage: true }, () => console.log(args));
    });
  }

  stopOnClick(e) {
    this.setState({ showMessage: false }, () => console.log("stopped :)"));
  }

  render() {
    return (
      <div className={classes.MyApp}>
        <div className={classes.record}>
          <p>Record Screen</p>
        </div>
        {!this.state.showMessage && (
          <button
            id="asyncBtn"
            value="Hello Async"
            className={classes.start}
            onClick={e => this.handleOnClick(e)}
          >
            Start
          </button>
        )}
        {this.state.showMessage && (
          <button
            id="asyncBtnStop"
            value="stop Async"
            className={classes.stop}
            onClick={e => this.stopOnClick(e)}
          >
            Stop
          </button>
        )}
        {this.state.showMessage && (
          <div className={classes.message}>
            <p>Start recording ...</p>
          </div>
        )}
      </div>
    );
  }
}

export default screenrecorder;
