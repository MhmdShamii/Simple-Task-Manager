import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedFilter, setSelectedFileter] = useState("all");

  function addTask(newTask) {
    const id = Math.max(0, ...tasks.map((task) => task.id)) + 1;
    setTasks([...tasks, { id, ...newTask }]);
  }

  function handleSelectedTask(task) {
    setSelected(task);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function updateTask(updatedTask) {
    setTasks(
      tasks.map((task) =>
        task.id === selected.id ? { ...task, ...updatedTask } : task
      )
    );
    setSelected(null);
  }

  const filterdTasks =
    selectedFilter === "all"
      ? tasks
      : tasks.filter((task) => task.level === selectedFilter);
  return (
    <div className="App">
      <Form onSubmit={addTask}>add</Form>
      <Filter
        selected={selectedFilter}
        setSelectedFileter={setSelectedFileter}
      />
      <TasksList
        TaskList={filterdTasks}
        onDelete={deleteTask}
        onSelectTask={handleSelectedTask}
        filter={selectedFilter}
      />
      {selected && (
        <div className={selected != null ? `edit` : `edit hiden`}>
          <Form
            onSubmit={updateTask}
            currInput={selected.task}
            currLevel={selected.level}
          >
            Edit
          </Form>
          <button onClick={() => setSelected(null)}> cancle</button>
        </div>
      )}
    </div>
  );
}

function Form({ onSubmit, children, currInput = "", currLevel = "easy" }) {
  const [input, setInput] = useState(currInput);
  const [select, setSelect] = useState(currLevel);

  function handleSubmit(e) {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    const task = {
      task: input.trim(),
      level: select,
    };

    onSubmit(task);

    setInput("");
    setSelect("easy");
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={select} onChange={(e) => setSelect(e.target.value)}>
        <option value={"easy"}>Easy</option>
        <option value={"mid"}>Mid</option>
        <option value={"hard"}>Hard</option>
      </select>
      <input
        placeholder="Task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <button>{children}</button>
    </form>
  );
}

function TasksList({ TaskList, onDelete, onSelectTask }) {
  return TaskList.length > 0 ? (
    <ul>
      {TaskList.map((task) => (
        <Task
          task={task}
          key={task.id}
          onDelete={onDelete}
          onSelectTask={onSelectTask}
        />
      ))}
    </ul>
  ) : (
    <p className="empty">There is no tasks</p>
  );
}

function Task({ task, onDelete, onSelectTask }) {
  function deleteTask() {
    const prompt = window.prompt(
      "Are you sure you want to delete if yes type confirm "
    );
    if (prompt.trim().toLowerCase() === "confirm") onDelete(task.id);
  }

  return (
    <li>
      <span
        className={
          task.level === "easy"
            ? "easy"
            : task.level === "mid"
            ? "mid"
            : task.level === "hard"
            ? "hard"
            : ""
        }
      ></span>
      <p>{task.task}</p>
      <button onClick={() => onSelectTask(task)}>Edit</button>
      <button onClick={deleteTask}>Delete</button>
    </li>
  );
}

function Filter({ setSelectedFileter, selectedFilter }) {
  return (
    <select
      value={selectedFilter}
      onChange={(e) => setSelectedFileter(e.target.value)}
      className="select"
    >
      <option value={"all"}>All</option>
      <option value={"easy"}>Easy</option>
      <option value={"mid"}>Mid</option>
      <option value={"hard"}>Hard</option>
    </select>
  );
}

export default App;
