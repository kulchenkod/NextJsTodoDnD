import { useStaticRendering } from 'mobx-react';

import ColumnStore from './ColumnStore';
import TaskStore from './TaskStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store: any = null;

export default function initializeStore() {
  if (isServer) {
    return {
      columnStore: new ColumnStore(),
      taskStore: new TaskStore()
    };
  }
  if (store === null) {
    store = {
      columnStore: new ColumnStore(),
      taskStore: new TaskStore()
    };
  }

  return store;
}