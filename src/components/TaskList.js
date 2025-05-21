import React, { useState } from "react";

const TaskList = ({ tasks, toggleTaskCompletion, updateTask, deleteTask }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
    });
  };

  const handleSaveClick = () => {
    if (!editValues.title || !editValues.description || !editValues.deadline) {
      alert("Please fill out all fields.");
      return;
    }

    const updatedTask = {
      id: editingTaskId,
      ...editValues,
    };

    updateTask(updatedTask);
    setEditingTaskId(null);
    setEditValues({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ margin: "20px" }}>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th style={{ padding: "10px" }}>Title</th>
            <th style={{ padding: "10px" }}>Description</th>
            <th style={{ padding: "10px" }}>Priority</th>
            <th style={{ padding: "10px" }}>Deadline</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                {editingTaskId === task.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="title"
                        value={editValues.title}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={editValues.description}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        name="priority"
                        value={editValues.priority}
                        onChange={handleInputChange}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="deadline"
                        value={editValues.deadline}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td>
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.priority}</td>
                    <td>{task.deadline}</td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td>
                      <button onClick={() => handleEditClick(task)}>Edit</button>
                      <button onClick={() => toggleTaskCompletion(task.id)}>
                        {task.completed ? "Undo Completion" : "Mark as Completed"}
                      </button>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;

// import React, { useState } from "react";

// const TaskList = ({ tasks, toggleTaskCompletion, updateTask }) => {
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     title: "",
//     description: "",
//     priority: "medium",
//     deadline: "",
//   });

//   const handleEditClick = (task) => {
//     setEditingTaskId(task.id);
//     setEditValues({
//       title: task.title,
//       description: task.description,
//       priority: task.priority,
//       deadline: task.deadline,
//     });
//   };

  // const handleSaveClick = () => {
  //   if (!editValues.title || !editValues.description || !editValues.deadline) {
  //     alert("Please fill out all fields.");
  //     return;
  //   }

  //   const updatedTask = {
  //     id: editingTaskId,
  //     ...editValues,
  //   };

  //   updateTask(updatedTask);
  //   setEditingTaskId(null);
  //   setEditValues({
  //     title: "",
  //     description: "",
  //     priority: "medium",
  //     deadline: "",
  //   });
  // };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditValues((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div style={{ margin: "20px" }}>
//       <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#f4f4f4" }}>
//             <th style={{ padding: "10px" }}>Title</th>
//             <th style={{ padding: "10px" }}>Description</th>
//             <th style={{ padding: "10px" }}>Priority</th>
//             <th style={{ padding: "10px" }}>Deadline</th>
//             <th style={{ padding: "10px" }}>Status</th>
//             <th style={{ padding: "10px" }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.length > 0 ? (
//             tasks.map((task) => (
//               <tr key={task.id}>
//                 {editingTaskId === task.id ? (
//                   <>
//                     <td>
//                       <input
//                         type="text"
//                         name="title"
//                         value={editValues.title}
//                         onChange={handleInputChange}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         name="description"
//                         value={editValues.description}
//                         onChange={handleInputChange}
//                       />
//                     </td>
//                     <td>
//                       <select
//                         name="priority"
//                         value={editValues.priority}
//                         onChange={handleInputChange}
//                       >
//                         <option value="high">High</option>
//                         <option value="medium">Medium</option>
//                         <option value="low">Low</option>
//                       </select>
//                     </td>
//                     <td>
//                       <input
//                         type="date"
//                         name="deadline"
//                         value={editValues.deadline}
//                         onChange={handleInputChange}
//                       />
//                     </td>
//                     <td>{task.completed ? "Completed" : "Pending"}</td>
//                     <td>
//                       <button onClick={handleSaveClick}>Save</button>
//                       <button onClick={() => setEditingTaskId(null)}>Cancel</button>
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     <td>{task.title}</td>
//                     <td>{task.description}</td>
//                     <td>{task.priority}</td>
//                     <td>{task.deadline}</td>
//                     <td>{task.completed ? "Completed" : "Pending"}</td>
//                     <td>
//                       <button onClick={() => handleEditClick(task)}>Edit</button>
//                       <button onClick={() => toggleTaskCompletion(task.id)}>
//                         {task.completed ? "Undo Completion" : "Mark as Completed"}
//                       </button>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>
//                 No tasks available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TaskList;





// import React from "react";
// import TaskItem from "./TaskItem";
// const TaskList = ({ tasks, toggleTaskCompletion }) => {
//  return (
// <div style={{ margin: "20px" }}>
// <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
// <thead>
// <tr style={{ backgroundColor: "#f4f4f4" }}>
// <th style={{ padding: "10px" }}>Title</th>
// <th style={{ padding: "10px" }}>Description</th>
// <th style={{ padding: "10px" }}>Priority</th>
// <th style={{ padding: "10px" }}>Deadline</th>
// <th style={{ padding: "10px" }}>Status</th>
// <th style={{ padding: "10px" }}>Actions</th>
// </tr>
// </thead>
// <tbody>
//          {tasks.length > 0 ? (
//            tasks.map((task) => (
// <tr key={task.id}>
// <td style={{ padding: "10px" }}>{task.title}</td>
// <td style={{ padding: "10px" }}>{task.description}</td>
// <td style={{ padding: "10px" }}>{task.priority}</td>
// <td style={{ padding: "10px" }}>{task.deadline}</td>
// <td style={{ padding: "10px" }}>{task.completed ? "Completed" : "Pending"}</td>
// <td style={{ padding: "10px" }}>
// isEditing={editingTaskId === task.id}
//                 setEditingTaskId={setEditingTaskId}
//                 updateTask={updateTask}
// <button onClick={() => toggleTaskCompletion(task.id)}>
//                    {task.completed ? "Undo Completion" : "Mark as Completed"}
// </button>

// </td>
// </tr>
//            ))
//          ) : (
// <tr>
// <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
//                No tasks available
// </td>
// </tr>
//          )}
// </tbody>
// </table>
// </div>
//  );
// };
// export default TaskList

// import React from "react";
// import TaskItem from "./TaskItem";

// const TaskList = ({ tasks, toggleTaskCompletion, updateTask, editingTask, setEditingTask }) => {
//   return (
//     <div style={{ margin: "20px" }}>
//       <table
//         border="1"
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           textAlign: "left",
//         }}
//       >
//         <thead>
//           <tr style={{ backgroundColor: "#f4f4f4" }}>
//             <th style={{ padding: "10px" }}>Title</th>
//             <th style={{ padding: "10px" }}>Description</th>
//             <th style={{ padding: "10px" }}>Priority</th>
//             <th style={{ padding: "10px" }}>Deadline</th>
//             <th style={{ padding: "10px" }}>Status</th>
//             <th style={{ padding: "10px" }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.length > 0 ? (
//             tasks.map((task) => (
//               <TaskItem
//                 key={task.id}
//                 task={task}
//                 toggleTaskCompletion={toggleTaskCompletion}
//                 updateTask={updateTask}
//                 editingTask={editingTask}
//                 setEditingTask={setEditingTask}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ padding: "10px", textAlign: "center" }}>
//                 No tasks available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TaskList;

// import React from "react";
// const TaskList = ({ tasks, toggleTaskCompletion }) => {
//  return (
// <div style={{ margin: "20px" }}>
// <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
// <thead>
// <tr style={{ backgroundColor: "#f4f4f4" }}>
// <th style={{ padding: "10px" }}>Title</th>
// <th style={{ padding: "10px" }}>Description</th>
// <th style={{ padding: "10px" }}>Priority</th>
// <th style={{ padding: "10px" }}>Deadline</th>
// <th style={{ padding: "10px" }}>Status</th>
// <th style={{ padding: "10px" }}>Actions</th>
// </tr>
// </thead>
// <tbody>
//          {tasks.length > 0 ? (
//            tasks.map((task) => (
// <tr key={task.id}>
// <td style={{ padding: "10px" }}>{task.title}</td>
// <td style={{ padding: "10px" }}>{task.description}</td>
// <td style={{ padding: "10px" }}>{task.priority}</td>
// <td style={{ padding: "10px" }}>{task.deadline}</td>
// <td style={{ padding: "10px" }}>{task.completed ? "Completed" : "Pending"}</td>
// <td style={{ padding: "10px" }}>
// <button onClick={() => toggleTaskCompletion(task._id)}>
//                    {task.completed ? "Undo Completion" : "Mark as Completed"}
// </button>
// </td>
// </tr>
//            ))
//          ) : (
// <tr>
// <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
//                No tasks available
// </td>
// </tr>
//          )}
// </tbody>
// </table>
// </div>
//  );
// };
// export default TaskList



// import React from "react";
// const TaskList = ({ tasks, toggleTaskCompletion }) => {
//  return (
// <div style={{ margin: "20px" }}>
// <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
// <thead>
// <tr style={{ backgroundColor: "#f4f4f4" }}>
// <th style={{ padding: "10px" }}>Title</th>
// <th style={{ padding: "10px" }}>Description</th>
// <th style={{ padding: "10px" }}>Priority</th>
// <th style={{ padding: "10px" }}>Deadline</th>
// <th style={{ padding: "10px" }}>Status</th>
// <th style={{ padding: "10px" }}>Actions</th>
// </tr>
// </thead>
// <tbody>
//          {tasks.length > 0 ? (
//            tasks.map((task) => (
// <tr key={task.id}>
// <td style={{ padding: "10px" }}>{task.title}</td>
// <td style={{ padding: "10px" }}>{task.description}</td>
// <td style={{ padding: "10px" }}>{task.priority}</td>
// <td style={{ padding: "10px" }}>{task.deadline}</td>
// <td style={{ padding: "10px" }}>{task.completed ? "Completed" : "Pending"}</td>
// <td style={{ padding: "10px" }}>
/* <button onClick={() => toggleTaskCompletion(task.id)}>
                   {task.completed ? "Undo Completion" : "Mark as Completed"}
</button> */
// </td>
// </tr>
//            ))
//          ) : (
// <tr>
// <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
//                No tasks available
// </td>
// </tr>
//          )}
// </tbody>
// </table>
// </div>
//  );
// };
// export default TaskList

