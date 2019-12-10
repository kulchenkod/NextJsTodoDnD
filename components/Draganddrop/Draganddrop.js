import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { inject, observer } from "mobx-react";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

@inject(
  ({
    columnStore: {
      columns,
      addColumn,
      deleteColumn,
      setLocaleStorageToStoreColumn
    },
    taskStore: {
      tasksList,
      deleteTask,
      changeCurrentTask,
      createNewTask,
      deleteTaskAtColumn,
      setLocalStorageToStoreTask
    }
  }) => ({
    columns,
    addColumn,
    deleteColumn,
    tasksList,
    changeCurrentTask,
    createNewTask,
    deleteTaskAtColumn,
    deleteTask,
    setLocaleStorageToStoreColumn,
    setLocalStorageToStoreTask
  })
)
@observer
class Draganddrop extends Component {
  onDragEnd = this.onDragEnd.bind(this);
  getList = this.getList.bind(this);
  deleteColumnAndTask = this.deleteColumnAndTask.bind(this);

  componentDidMount() {
    const {
      setLocaleStorageToStoreColumn,
      setLocalStorageToStoreTask
    } = this.props;
    const dataColumns = localStorage.getItem("columns");
    const dataTasks = localStorage.getItem("tasks");
    if (dataColumns) {
      setLocaleStorageToStoreColumn(dataColumns);
      if (dataTasks) {
        setLocalStorageToStoreTask(dataTasks);
      }
      return;
    }
  }

  componentDidUpdate() {
    const { columns, tasksList } = this.props;
    localStorage.setItem("columns", JSON.stringify(columns));
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  }

  getList(id) {
    return this.props.tasksList.find(itemId => itemId.columnId === id).task;
  }

  onDragEnd(result) {
    const { source, destination } = result;
    const { changeCurrentTask, createNewTask, tasksList } = this.props;

    if (!destination) {
      return;
    }

    const checkDestinationCopy = tasksList
      .map(checkedItem => checkedItem.columnId)
      .includes(destination.droppableId);

    if (
      source.droppableId !== destination.droppableId &&
      !checkDestinationCopy
    ) {
      createNewTask(destination.droppableId);
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      changeCurrentTask(items, source.droppableId);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      changeCurrentTask(
        result[destination.droppableId],
        destination.droppableId
      );
      changeCurrentTask(result[source.droppableId], source.droppableId);
    }
  }

  deleteColumnAndTask(columnId) {
    const { deleteTaskAtColumn, deleteColumn } = this.props;
    deleteTaskAtColumn(columnId);
    deleteColumn(columnId);
  }

  render() {
    const { columns = [], tasksList = [], deleteTask } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {columns.map((column, index) => {
          return (
            <Droppable key={`droppable-${index}`} droppableId={column.id}>
              {provided => {
                return (
                  <>
                    <div className="column">
                      <div className="column__title">
                        {column.title}{" "}
                        <button
                          className="column__title-deleted"
                          type="button"
                          onClick={this.deleteColumnAndTask.bind(
                            null,
                            column.id
                          )}
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </div>
                      <div ref={provided.innerRef} className="column__section">
                        {tasksList.find(
                          currentColumn => currentColumn.columnId === column.id
                        ) &&
                          tasksList
                            .find(
                              currentColumn =>
                                currentColumn.columnId === column.id
                            )
                            .task.map((item, index2) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index2}
                              >
                                {provided => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="task"
                                  >
                                    {item.content}
                                    <button
                                      type="button"
                                      className='task__deleted'
                                      onClick={deleteTask.bind(
                                        null,
                                        column.id,
                                        item.id
                                      )}
                                    >
                                      <i className="fas fa-minus-circle"></i>
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </>
                );
              }}
            </Droppable>
          );
        })}
        <style jsx>{`
          .column {
            width: calc(100% / ${columns.length});
            max-width: 350px;
            margin-right: 15px;
            &__title {
              color: #aeb5c2;
              font-weight: 500;
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              &-deleted {
                background-color: transparent;
                border: 0;
                font-size: 16px;
                cursor: pointer;
                color: #aeb5c2;
              }
            }
            &__section {
              border-radius: 10px;
              padding: 20px;
              background-color: #f1f6fb;
              height: calc(100% - 100px);
              overflow: auto;
            }
          }
          .task {
            border-radius: 5px;
            background-color: white;
            padding: 10px;
            min-height: 50px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &__deleted {
              background-color: transparent;
              border: 0;
              font-size: 16px;
              cursor: pointer;
              color: black;
            }
          }
        `}</style>
      </DragDropContext>
    );
  }
}

export default Draganddrop;
