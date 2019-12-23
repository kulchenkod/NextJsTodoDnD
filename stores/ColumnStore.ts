import { observable, action } from "mobx";
import uuid from "uuid";

export interface IColumnItem {
  title: string;
  id: string;
}

class ColumnStore {
  @observable columns: IColumnItem[] = [];

  @action.bound addColumn(title: string): void {
    const upperText: string = title.toUpperCase();

    const columnItem: IColumnItem = {
      title: upperText,
      id: uuid()
    };
    this.columns.push(columnItem);
  }

  @action.bound clearColumnsList(): void {
    this.columns.length = 0;
  }

  @action.bound deleteColumn(id: string): void {
    const index = this.columns.findIndex(
      currentColumn => currentColumn.id === id
    );
    if (index < 0) {
      return;
    }
    this.columns.splice(index, 1);
  }

  @action.bound setLocaleStorageToStoreColumn(data: string): void {
    const saveColumns = JSON.parse(data);
    this.columns = saveColumns;
  }
}

export default ColumnStore;
