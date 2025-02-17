import React, { useEffect, useState } from "react";
import "./style.css";

// Get Data From Local Storage
const getLocalData = () => {
  const lists = localStorage.getItem("todoList");
  if (lists) {
    return JSON.parse(lists);
  } else return [];
};

function Todo() {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [toggleButton, setToggleButton] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [filteredItems, setFilteredItems] = useState("All");
  const [mode, setMode] = useState("dark");

  const addItem = () => {
    if (inputData && toggleButton) {
      setItems(
        items.map((curElem) => {
          if (curElem.id === editTask) {
            return { ...curElem, name: inputData };
          }
          return curElem;
        })
      );
      setInputData("");
      setToggleButton(false);
      setEditTask(null);
    } else if (inputData) {
      const newInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
        completed: false,
      };
      setItems([...items, newInputData]);
      setInputData("");
      document.querySelector("#text-input").focus();
    }
  };
  const addItemOnKeyPress = (e) => {
    if (e.key === "Enter" && inputData && toggleButton) {
      setItems(
        items.map((curElem) => {
          if (curElem.id === editTask) {
            return { ...curElem, name: inputData };
          }
          return curElem;
        })
      );
      setInputData("");
      setToggleButton(false);
      setEditTask(null);
    } else if (e.key === "Enter" && inputData) {
      const newInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
        completed: false,
      };
      setItems([...items, newInputData]);
      setInputData("");
    }
  };

  // Edit Items
  const editItems = (id) => {
    const taskToEdit = items.find((curElem) => {
      return curElem.id === id;
    });
    setInputData(taskToEdit.name);
    setToggleButton(true);
    setEditTask(id);
    document.querySelector("#text-input").focus();
  };
  // Delete items
  const deleteItems = (id) => {
    const updatedItems = items.filter((curElem) => {
      return curElem.id !== id;
    });
    setItems(updatedItems);
  };
  // Adding Data To Local Storage
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(items));
  }, [items]);

  //Sharing list
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get("data");

    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setItems(decodedData);
      } catch (error) {
        console.error("Invalid Data:", error);
      }
    }
  }, []);

  //Sharing list
  const shareTodoList = (todoList) => {
    const data = encodeURIComponent(JSON.stringify(todoList));
    const url = `${window.location.origin}/todo?data=${data}`;

    // Share via WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className={`main-div ${mode === "light" ? "light-mode-main" : ""}`}>
        <label className="switch">
          <input
            type="checkbox"
            onChange={() =>
              mode === "light" ? setMode("dark") : setMode("light")
            }
          />
          <span className="slider round"> </span>
        </label>

        <div className="todo-container">
          <div className="todo-logo">
            <figure>
              <img src="./images/todo-logo.png" alt="ToDo Logo" />
              {/* <figcaption>Add your list here📝</figcaption> */}
            </figure>
          </div>

          <select
            className={mode === "light" ? "light-mode-select" : ""}
            onChange={(e) => setFilteredItems(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incompleted">Incompleted</option>
          </select>

          <div
            className={`input-text ${
              mode === "light" ? "light-mode-input" : ""
            }`}
          >
            <input
              id="text-input"
              type="text"
              placeholder="✍️Add Text"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              onKeyDown={addItemOnKeyPress}
            />
            {toggleButton === true ? (
              <i className="far fa-edit" onClick={addItem}></i>
            ) : (
              <i className="fa fa-plus" onClick={addItem}></i>
            )}
          </div>

          <div className="todo-tasks-container">
            {items.map((curElem) => {
              return (
                <div
                  className={`todo-tasks ${
                    curElem.completed === true ? "checked-opacity" : ""
                  }
                    ${mode === "light" ? "light-mode-tasks" : ""}
                    ${
                      filteredItems === "Completed" &&
                      curElem.completed === false
                        ? "hidden"
                        : ""
                    } ${
                    filteredItems === "Incompleted" &&
                    curElem.completed === true
                      ? "hidden"
                      : ""
                  }
                    `}
                  key={curElem.id}
                >
                  <p
                    className={curElem.completed === true ? "checked-line" : ""}
                  >
                    {curElem.name}
                  </p>
                  <i
                    className="fa fa-check i3"
                    onClick={() => {
                      curElem.completed === false
                        ? (curElem.completed = true)
                        : (curElem.completed = false);
                      setItems(
                        items.map((curElem1) => {
                          return curElem1;
                        })
                      );
                    }}
                  ></i>
                  <i
                    className="far fa-edit i1"
                    onClick={() => {
                      editItems(curElem.id);
                    }}
                  ></i>
                  <i
                    className="far fa-trash-alt i2"
                    onClick={() => {
                      deleteItems(curElem.id);
                    }}
                  ></i>
                </div>
              );
            })}
          </div>

          <div
            className={`clear-all ${
              mode === "light" ? "light-mode-clear" : ""
            }`}
            onClick={() => setItems([])}
          >
            <span>Clear All</span>
          </div>
          <button
            className={`share-button ${
              mode === "light" ? "light-mode-share" : ""
            }`}
            onClick={() => shareTodoList(items)}
          >
            Share List
          </button>
        </div>
      </div>
    </>
  );
}

export default Todo;
