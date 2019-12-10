import { observable, action } from "mobx";
import uuid from "uuid";

class TaskStore {
  @observable tasksList = [];

  @action.bound addTaskList(name, columnId) {
    if (this.tasksList.length === 0) {
      this.tasksList = [
        {
          id: uuid(),
          task: [
            {
              id: uuid(),
              content: name
            }
          ],
          columnId
        }
      ];
      return;
    } else {
      const index = this.tasksList.findIndex(
        currentTask => currentTask.columnId === columnId
      );
      const copyTask = { ...this.tasksList[index] };
      this.tasksList.splice(index, 1);

      copyTask.task.push({
        id: uuid(),
        content: name
      });

      this.tasksList = [...this.tasksList, copyTask];
    }
  }

  @action.bound createNewTask(featureColumnId) {
    this.tasksList.push({
      id: uuid(),
      task: [],
      columnId: featureColumnId
    });
  }

  @action.bound changeCurrentTask(tasks, currentList) {
    const index = this.tasksList.findIndex(
      currentTask => currentTask.columnId === currentList
    );
    const copyTask = { ...this.tasksList[index] };
    copyTask.task = tasks;
    this.tasksList.splice(index, 1);
    this.tasksList = [...this.tasksList, copyTask];
  }

  @action.bound clearTasksList() {
    this.tasksList.length = 0;
  }

  @action.bound deleteTaskAtColumn(columnId) {
    const index = this.tasksList.findIndex(task => task.columnId === columnId);
    if (index < 0) {
      return;
    }
    this.tasksList.splice(index, 1);
  }

  @action.bound deleteTask(columnId, taskId) {
    const indexTaskListItem = this.tasksList.findIndex(
      taskListItem => taskListItem.columnId === columnId
    );
    const indexTaskItem = this.tasksList[indexTaskListItem].task.findIndex(
      task => task.id === taskId
    );
    const cloneTask = { ...this.tasksList[indexTaskListItem] };
    cloneTask.task.splice(indexTaskItem, 1);
    this.tasksList.splice(indexTaskListItem, 1);
    this.tasksList = [...this.tasksList, cloneTask];
  }

  @action.bound setLocalStorageToStoreTask(data) {
    const storageData = JSON.parse(data);
    this.tasksList = storageData;
  }
}

export default TaskStore;
