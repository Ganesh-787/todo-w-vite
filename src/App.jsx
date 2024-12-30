import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const storedTodosString = localStorage.getItem("todos");
    if (storedTodosString) {
      try {
        const savedTodos = JSON.parse(storedTodosString);
        setTodos(savedTodos); // Only set if it's a valid array
      } catch (error) {
        console.error("Error parsing todos from local storage:", error);
        setTodos([]); // Reset to an empty array if parsing fails
      }
    }
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleAdd = () => {
    const newTodo = { id: uuidv4(), task: todo, isCompleted: false };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos); // Update state first
    setTodo(""); // Clear input field
    saveToLS(updatedTodos); // Save the updated todos to localStorage
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleEdit = (e, id) => {
    const editableTask = todos.filter((i) => i.id === id);
    setTodo(editableTask[0].task);
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const displayedTodo = showCompleted
    ? todos.filter((todo) => todo.isCompleted)
    : todos;

  return (
    <div className="Container flex flex-col gap-5 items-center w-[90vw] min-h-[80vh] bg-violet-300 mx-auto my-10 rounded-lg p-10">
      <h2 className="text-3xl font-bold">Add a Todo</h2>
      <form
        action=""
        onSubmit={handleAdd}
        className="w-full flex my-6 gap-8 justify-center"
      >
        <input
          className="w-1/2 font-semibold text-lg px-2 py-1 rounded-md"
          type="text"
          value={todo}
          onChange={handleChange}
        />
        <button
          className={`bg-violet-600 text-white ${
            todo.length < 3 ? "disabled:bg-violet-900" : ""
          } font-semibold text-lg px-6 py-2 text-center rounded-md`}
          onClick={handleAdd}
          disabled={todo.length < 3 ? true : false}
        >
          <FontAwesomeIcon icon={faFloppyDisk} className="text-2xl" />
        </button>
      </form>

      <h2 className="text-xl font-bold mx-10">Your Todos</h2>

      {todos.length === 0 ? (
        <div className="flex items-center justify-center bg-gray-100 text-gray-700 py-4 px-6 rounded-md shadow-sm">
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 14l-2-2m0 0l2-2m-2 2h6m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">No todos to display</span>
        </div>
      ) : (
        <div className="todos mx-8 w-full ">
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="showCompleted"
              className="w-5 h-5 mr-2"
              checked={showCompleted}
              onChange={handleShowCompleted}
            />
            <label
              htmlFor="showCompleted"
              className="text-lg font-medium text-gray-700"
            >
              Show completed
            </label>
          </div>

          <ul className="flex flex-col gap-3">
            {displayedTodo.map((todo) => (
              <li key={todo.id}>
                <div className="w-1/2 gap-0 flex items-center mx-auto">
                  <div className="flex gap-4  w-full">
                    <input
                      name={todo.id}
                      checked={todo.isCompleted}
                      onChange={handleCheckbox}
                      className="text-lg"
                      type="checkbox"
                    />
                    <span
                      className={`${
                        todo.isCompleted
                          ? "line-through text-gray-500"
                          : "text-black"
                      } text-lg font-medium flex-1`}
                    >
                      {todo.task}
                    </span>
                  </div>
                  <div className="buttons flex gap-2">
                    <button
                      className="bg-violet-700 text-white font-semibold text-lg px-3 rounded-md"
                      onClick={(e) => handleEdit(e, todo.id)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      className="bg-violet-700 text-white font-semibold text-lg px-3 rounded-md"
                      onClick={() => handleDelete(todo.id)}
                      name={todo.id}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {displayedTodo.length === 0 && showCompleted && (
        <div className="no-completed-todos-message text-center text-xl font-medium text-gray-600 bg-gray-200 py-3 px-6 rounded-md shadow-md">
          No completed todos
        </div>
      )}
    </div>
  );
}

export default App;
