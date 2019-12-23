import React from "react";
import App from "next/app";
import { Provider } from "mobx-react";

import initializeStore from "../stores/stores";

class CustomApp extends App {
  static async getInitialProps(appContext: any) {
    const mobxStore: any = initializeStore();
    appContext.ctx.mobxStore = mobxStore;
    const appProps = await App.getInitialProps(appContext);
    return {
      ...appProps,
      initialMobxState: mobxStore
    };
  }

  mobxStore: any = null

  constructor(props: any) {
    super(props);
    const isServer = typeof window === "undefined";
    this.mobxStore = isServer
      ? props.initialMobxState
      : initializeStore();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider {...this.mobxStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default CustomApp;
