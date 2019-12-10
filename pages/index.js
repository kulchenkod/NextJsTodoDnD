import React, { Component } from "react";
import '@fortawesome/fontawesome-free/js/all';

import Main from "../components/Main/Main";

class Index extends Component {
  render() {
    return (
      <>
        <Main />
        <style jsx global>{`
          .body,
          html {
            height: calc(100% - 10px);
            margin: 0px;
            padding: 0;
            background-color: #e6eff6;
          }
        `}</style>
      </>
    );
  }
}

export default Index;
