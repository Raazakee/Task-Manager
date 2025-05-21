// import React, { useState } from "react";

// const TaskItem = ({ task, toggleTaskCompletion, updateTask, editingTask, setEditingTask }) => {
//   const [editValues, setEditValues] = useState({
//     title: task.title,
//     description: task.description,
//     priority: task.priority,
//     deadline: task.deadline,
//   });

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveEdit = () => {
//     updateTask({
//       id: task.id,
//       title: editValues.title,
//       description: editValues.description,
//       priority: editValues.priority,
//       deadline: editValues.deadline,
//       completed: task.completed, // Preserve the current completion status
//     });
//   };

//   return (
//     <tr>
//       <td style={{ padding: "10px" }}>
//         {editingTask?.id === task.id ? (
//           <input
//             name="title"
//             value={editValues.title}
//             onChange={handleEditChange}
//           />
//         ) : (
//           task.title
//         )}
//       </td>
//       <td style={{ padding: "10px" }}>
//         {editingTask?.id === task.id ? (
//           <input
//             name="description"
//             value={editValues.description}
//             onChange={handleEditChange}
//           />
//         ) : (
//           task.description
//         )}
//       </td>
//       <td style={{ padding: "10px" }}>
//         {editingTask?.id === task.id ? (
//           <select
//             name="priority"
//             value={editValues.priority}
//             onChange={handleEditChange}
//           >
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         ) : (
//           task.priority
//         )}
//       </td>
//       <td style={{ padding: "10px" }}>
//         {editingTask?.id === task.id ? (
//           <input
//             type="date"
//             name="deadline"
//             value={editValues.deadline.split("T")[0]} // Format date
//             onChange={handleEditChange}
//           />
//         ) : (
//           new Date(task.deadline).toLocaleDateString()
//         )}
//       </td>
//       {/* <td style={{ padding: "10px" }}>
//         <button onClick={() => toggleTaskCompletion(task.id)}>
//           {task.completed ? "Mark as Pending" : "Mark as Completed"}
//         </button>
//       </td> */}
//       <td style={{ padding: "10px" }}>
//         {editingTask?.id === task.id ? (
//           <>
//             <button onClick={saveEdit}>Save</button>
//             <button onClick={() => setEditingTask(null)}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={() => setEditingTask(task)}>Edit</button>
//         )}
//       </td>
//     </tr>
//   );
// };

// export default TaskItem;




// // import React, { useState } from "react";
// // import axios from "axios";

// // const TaskItem = ({ task, onTaskUpdated }) => {
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [updatedTask, setUpdatedTask] = useState({ ...task });

// //   const handleEditClick = () => {
// //     setIsEditing(true);
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setUpdatedTask({ ...updatedTask, [name]: value });
// //   };

// //   const handleSaveClick = async () => {
// //     try {
// //       const response = await axios.patch(`/tasks/${task._id}`, updatedTask);
// //       onTaskUpdated(response.data); // Update task in the parent component
// //       setIsEditing(false);
// //     } catch (err) {
// //       console.error("Error updating task:", err);
// //     }
// //   };

// //   const handleCancelClick = () => {
// //     setIsEditing(false);
// //     setUpdatedTask({ ...task });
// //   };

// //   return (
// //     <div>
// //       {isEditing ? (
// //         <div>
// //           <input
// //             type="text"
// //             name="title"
// //             value={updatedTask.title}
// //             onChange={handleInputChange}
// //           />
// //           <textarea
// //             name="description"
// //             value={updatedTask.description}
// //             onChange={handleInputChange}
// //           />
// //           <button onClick={handleSaveClick}>Save</button>
// //           <button onClick={handleCancelClick}>Cancel</button>
// //         </div>
// //       ) : (
// //         <div>
// //           <h3>{task.title}</h3>
// //           <p>{task.description}</p>
// //           <button onClick={handleEditClick}>Edit</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TaskItem;
