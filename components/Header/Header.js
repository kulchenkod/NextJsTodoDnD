import React, { Component } from "react";
import { inject, observer } from "mobx-react";

@inject(
  ({
    columnStore: { addColumn, clearColumnsList, columns },
    taskStore: { addTaskList, tasksList, clearTasksList }
  }) => ({
    addColumn,
    columns,
    clearColumnsList,
    addTaskList,
    tasksList,
    clearTasksList
  })
)
@observer
class Header extends Component {
  state = {
    isAddColumn: false,
    isAddTask: false,
    columnName: "",
    taskName: ""
  };

  onChange = this.onChange.bind(this);
  newColumn = this.newColumn.bind(this);
  addTask = this.addTask.bind(this);
  clearColumnsTasksList = this.clearColumnsTasksList.bind(this);
  closeInput = this.closeInput.bind(this);

  onChange({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }

  clearColumnsTasksList() {
    const { clearColumnsList, clearTasksList } = this.props;
    clearColumnsList();
    clearTasksList();
  }

  newColumn(e) {
    const { isAddColumn, columnName } = this.state;
    const { addColumn } = this.props;

    e.preventDefault();

    if (isAddColumn && columnName.length !== 0) {
      addColumn(columnName);
      this.setState({
        isAddColumn: false,
        columnName: ""
      });
      return;
    }
    this.setState({
      isAddColumn: true,
      isAddTask: false
    });
  }

  addTask(e) {
    const { isAddTask, taskName } = this.state;
    const { addTaskList, columns } = this.props;

    e.preventDefault();

    if (isAddTask && taskName.length !== 0) {
      addTaskList(taskName, columns[0].id);
      this.setState({
        isAddTask: false,
        taskName: ""
      });
      return;
    } else if (columns.length > 0) {
      this.setState({
        isAddTask: true,
        isAddColumn: false
      });
    } else {
      alert("Please first create new column");
    }
  }

  closeInput({ target: { classList} }) {
    const { isAddColumn, isAddTask } = this.state;
    const isHeader = classList.contains('header');
    if(isHeader) {
      if (isAddColumn || isAddTask) {
        this.setState({
          isAddColumn: false,
          isAddTask: false
        });
      }
    }
  }

  render() {
    const { isAddColumn, columnName, isAddTask, taskName } = this.state;
    return (
      <div className="header" onClick={this.closeInput}>
        <div className="header__columns">
          <div className="header__add-column">
            <form onSubmit={this.newColumn}>
              <button className="header__add-item" type="submit">
                Add
              </button>
              {isAddColumn && (
                <input
                  required
                  className="header__input-column"
                  autoFocus
                  name="columnName"
                  value={columnName}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Column name"
                />
              )}
            </form>
          </div>
          <div className="header__clear-column">
            <button
              className="header__clear-item"
              type="button"
              onClick={this.clearColumnsTasksList}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="header__task">
          <form onSubmit={this.addTask}>
            <button className="header__add-task" type="submit">
              New task
            </button>
            {isAddTask && (
              <input
                required
                className="header__input-task"
                autoFocus
                name="taskName"
                value={taskName}
                onChange={this.onChange}
                type="text"
                placeholder="Task name"
              />
            )}
          </form>
        </div>
        <style jsx>{`
          $color: red;
          .header {
            display: flex;
            padding: 10px;
            text-align: right;
            justify-content: space-between;
            &__columns {
              display: flex;
            }
            &__add-column,
            &__task {
              position: relative;
              margin-right: 10px;
            }
            &__input-column,
            &__input-task {
              position: absolute;
              top: 100%;
              margin-top: 5px;
              padding: 10px;
            }
            &__input-column {
              left: 0;
            }
            &__input-task {
              right: 0;
            }
            &__clear-item,
            &__add-item,
            &__add-task {
              padding: 10px 20px;
              font-size: 14px;
              border-radius: 5px;
              color: white;
              font-weight: 500;
              background-color: #1b84ed;
              &:hover {
                cursor: pointer;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Header;
