import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import imagel from "./image/image1.webp";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerValues, setRegisterValues] = useState({ email: "", password: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  // Fetch tasks from the backend
  const fetchTasks = useCallback(() => {
    const loggedInUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");  // Make sure token is read from localStorage
    // const token = req.header("Authorization");
    console.log("Received token:", token);  // This will log the token from the request
    
    if (!token) {
      console.error("No token found in localStorage");
      return; // Prevents fetching tasks if no token exists
    }
  // Example of how you might call your backend API
fetch("http://localhost:5000/tasks?userId=3", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => {
    console.log("Fetched tasks:", data);
  })
  .catch(error => {
    console.error("Error fetching tasks:", error);
  });

    fetch(`http://localhost:5000/tasks?userId=${loggedInUserId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Ensure token is correctly sent here
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tasks:", data);
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      });
  }, []);
  

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn, token, fetchTasks]);

  // Add a new task
  const addTask = async (task) => {
    const loggedInUserId = localStorage.getItem("userId");

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, userId: loggedInUserId }),
      });

      const data = await response.json();
      setTasks((prev) => [...prev, { ...task, id: data.id }]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update a task
  const updateTask = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const data = await response.json();
      console.log("Updated Task:", data);

      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? data : task))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    await updateTask(updatedTask);
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      } else {
        console.error("Error deleting task");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleLogin = (userToken, userId) => {
    if (!userToken) {
      console.error("Login failed: No token received.");
      return;
    }
  
    console.log("Login successful, saving token...");
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("userId", userId);
    setIsLoggedIn(true);
    fetchTasks(); // Fetch tasks after login
  };
  
  

  // Handle logout
  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setTasks([]);
  };

  // Handle saving an edited task
  const handleSaveClick = () => {
    if (!editValues.title || !editValues.description || !editValues.deadline) {
      alert("Please fill out all fields.");
      return;
    }

    updateTask({ id: editingTask.id, ...editValues });
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerValues),
      });
  
      if (response.ok) {
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An unexpected error occurred.");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <img src={imagel} alt="Task Manager" className="image1" />
      <Header />
      {!isLoggedIn ? (
        isRegistering ? (
          <div>
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={registerValues.email}
                onChange={(e) => setRegisterValues({ ...registerValues, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerValues.password}
                onChange={(e) => setRegisterValues({ ...registerValues, password: e.target.value })}
                required
              />
              <button type="submit">Register</button>
              <button type="button" onClick={() => setIsRegistering(false)}>
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <div>
            <LoginForm onLogin={handleLogin} />
            <button onClick={() => setIsRegistering(true)}>Register</button>
          </div>
        )
      ) : (
        <>
          <button onClick={handleLogout} style={{ margin: "10px" }}>
            Logout
          </button>

          <AddTaskForm addTask={addTask} />
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            toggleTaskCompletion={toggleTaskCompletion}
            updateTask={updateTask}
            setEditValues={setEditValues}
            handleSaveClick={handleSaveClick}
          />
          <Footer
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            pendingTasks={totalTasks - completedTasks}
          />
        </>
      )}
    </div>
  );
}

export default App;


