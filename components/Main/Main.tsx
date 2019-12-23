import React, { Component } from "react";

import Header from "../Header/Header";
import Draganddrop from "../Draganddrop/Draganddrop";

class Main extends Component<any> {
  render() {
    return (
      <>
        <Header />
        <div className="main">
          <Draganddrop />
        </div>
        <style jsx>{`
          .main {
            border-radius: 5px;
            padding: 10px;
            display: flex;
            height: calc(100vh - 100px);
            align-items: stretch;
            justify-content: center;
          }
        `}</style>
      </>
    );
  }
}

export default Main;
