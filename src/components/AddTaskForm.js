import React, { useState } from "react";

function AddTaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      alert("Please fill out all fields!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      deadline,
      completed: false,
    };

    addTask(newTask);
    setTitle("");
    setDescription("");
    setPriority("low");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Add a Task</h2>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <label htmlFor="description">Description:</label>
      <input
        id="description"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <label htmlFor="priority">Priority:</label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <label htmlFor="deadline">Deadline:</label>
      <input
        id="deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
