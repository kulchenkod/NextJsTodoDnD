import { observable, action } from "mobx";
import uuid from "uuid";

class ColumnStore {
  @observable columns = [];

  @action.bound addColumn(title) {
    const upperText = title.toUpperCase();

    const columnItem = {
      title: upperText,
      id: uuid()
    };
    this.columns.push(columnItem);
  }

  @action.bound clearColumnsList() {
    this.columns.length = 0;
  }

  @action.bound deleteColumn(id) {
    const index = this.columns.findIndex(
      currentColumn => currentColumn.id === id
    );
    if (index < 0) {
      return;
    }
    this.columns.splice(index, 1);
  }

  @action.bound setLocaleStorageToStoreColumn(data) {
    const saveColumns = JSON.parse(data)
    this.columns = saveColumns;
  }
}

export default ColumnStore;
