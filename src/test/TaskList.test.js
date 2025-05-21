import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import TaskList from "../components/TaskList";

// Mocked functions for testing
const mockToggleTaskCompletion = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

// Sample task data
const tasks = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Test Description 1",
    priority: "medium",
    deadline: "2025-01-01",
    completed: false,
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Test Description 2",
    priority: "high",
    deadline: "2025-02-01",
    completed: true,
  },
];

afterEach(cleanup);

describe("TaskList", () => {
  test("renders tasks correctly", () => {
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Description 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.getByText("Test Description 2")).toBeInTheDocument();
  });

  test("calls deleteTask when delete button is clicked", () => {
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith(1); // The ID of the first task
  });

  test("calls toggleTaskCompletion when Mark as Completed button is clicked", () => {
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );

    const toggleButton = screen.getByText("Mark as Completed");
    fireEvent.click(toggleButton);

    expect(mockToggleTaskCompletion).toHaveBeenCalledWith(1); // The ID of the first task
  });

  test("calls handleEditClick and shows input fields when Edit button is clicked", () => {
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    // Check if input fields are shown for editing
    expect(screen.getByDisplayValue("Test Task 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description 1")).toBeInTheDocument();
  });

  test("calls handleSaveClick when Save button is clicked after editing", () => {
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );

    // Simulate clicking Edit button
    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);

    // Simulate updating task details
    const titleInput = screen.getByDisplayValue("Test Task 1");
    fireEvent.change(titleInput, { target: { value: "Updated Task Title" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Check if updateTask is called with updated values
    expect(mockUpdateTask).toHaveBeenCalledWith({
      id: 1,
      title: "Updated Task Title",
      description: "Test Description 1",
      priority: "medium",
      deadline: "2025-01-01",
    });
  });

  test("does not save if title or description is missing", () => {
    // Mock the window.alert function
    jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={mockToggleTaskCompletion}
        updateTask={mockUpdateTask}
        deleteTask={mockDeleteTask}
      />
    );
  
    // Simulate clicking Edit button
    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);
  
    // Clear title field
    const titleInput = screen.getByDisplayValue("Test Task 1");
    fireEvent.change(titleInput, { target: { value: "" } });
  
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
  
    // Check that the updateTask function was not called
    expect(mockUpdateTask).not.toHaveBeenCalled();
    
    // Check that the alert was called
    expect(window.alert).toHaveBeenCalledWith("Please fill out all fields.");
  
    // Restore the original alert function after the test
    window.alert.mockRestore();
  });
  
});

// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import TaskList from "../components/TaskList";
// describe("TaskList Component", () => {
//  const mockTasks = [
//    {
//      _id: "1",
//      title: "Task 1",
//      description: "Description 1",
//      priority: "High",
//      deadline: "2024-12-31",
//      completed: false,
//    },
//    {
//      _id: "2",
//      title: "Task 2",
//      description: "Description 2",
//      priority: "Low",
//      deadline: "2025-01-15",
//      completed: true,
//    },
//  ];
//  const mockToggleTaskCompletion = jest.fn();
//  test("renders the task list table with correct data", () => {
//    render(
// <TaskList tasks={mockTasks} toggleTaskCompletion={mockToggleTaskCompletion} />
//    );
//    // Check table headers
//    expect(screen.getByText("Title")).toBeInTheDocument();
//    expect(screen.getByText("Description")).toBeInTheDocument();
//    expect(screen.getByText("Priority")).toBeInTheDocument();
//    expect(screen.getByText("Deadline")).toBeInTheDocument();
//    expect(screen.getByText("Status")).toBeInTheDocument();
//    expect(screen.getByText("Actions")).toBeInTheDocument();
//    // Check task rows
//    const task1Row = screen.getByText("Task 1").closest("tr");
//    const task2Row = screen.getByText("Task 2").closest("tr");
//    expect(task1Row).toHaveTextContent("Description 1");
//    expect(task1Row).toHaveTextContent("High");
//    expect(task1Row).toHaveTextContent("2024-12-31");
//    expect(task1Row).toHaveTextContent("Pending");
//    expect(task2Row).toHaveTextContent("Description 2");
//    expect(task2Row).toHaveTextContent("Low");
//    expect(task2Row).toHaveTextContent("2025-01-15");
//    expect(task2Row).toHaveTextContent("Completed");
//  });
//  test("handles task completion toggle correctly", () => {
//    render(
// <TaskList tasks={mockTasks} toggleTaskCompletion={mockToggleTaskCompletion} />
//    );
//    // Click the "Mark as Completed" button for Task 1
//    const task1Button = screen.getByText("Mark as Completed");
//    fireEvent.click(task1Button);
//    expect(mockToggleTaskCompletion).toHaveBeenCalledWith("1");
//    // Click the "Undo Completion" button for Task 2
//    const task2Button = screen.getByText("Undo Completion");
//    fireEvent.click(task2Button);
//    expect(mockToggleTaskCompletion).toHaveBeenCalledWith("2");
//  });
//  test("displays 'No tasks available' when task list is empty", () => {
//    render(<TaskList tasks={[]} toggleTaskCompletion={mockToggleTaskCompletion} />);
//    expect(screen.getByText("No tasks available")).toBeInTheDocument();
//  });
// });


// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import TaskList from "../components/TaskList";
// describe("TaskList Component", () => {
//  const mockTasks = [
//    {
//      id: "1",
//      title: "Task 1",
//      description: "Description 1",
//      priority: "High",
//      deadline: "2024-12-31",
//      completed: false,
//    },
//    {
//      id: "2",
//      title: "Task 2",
//      description: "Description 2",
//      priority: "Low",
//      deadline: "2025-01-15",
//      completed: true,
//    },
//  ];
//  const mockToggleTaskCompletion = jest.fn();
//  test("renders the task list table with correct data", () => {
//    render(
// <TaskList tasks={mockTasks} toggleTaskCompletion={mockToggleTaskCompletion} />
//    );
//    // Check table headers
//    expect(screen.getByText("Title")).toBeInTheDocument();
//    expect(screen.getByText("Description")).toBeInTheDocument();
//    expect(screen.getByText("Priority")).toBeInTheDocument();
//    expect(screen.getByText("Deadline")).toBeInTheDocument();
//    expect(screen.getByText("Status")).toBeInTheDocument();
//    expect(screen.getByText("Actions")).toBeInTheDocument();
//    // Check task rows
//    const task1Row = screen.getByText("Task 1").closest("tr");
//    const task2Row = screen.getByText("Task 2").closest("tr");
//    expect(task1Row).toHaveTextContent("Description 1");
//    expect(task1Row).toHaveTextContent("High");
//    expect(task1Row).toHaveTextContent("2024-12-31");
//    expect(task1Row).toHaveTextContent("Pending");
//    expect(task2Row).toHaveTextContent("Description 2");
//    expect(task2Row).toHaveTextContent("Low");
//    expect(task2Row).toHaveTextContent("2025-01-15");
//    expect(task2Row).toHaveTextContent("Completed");
//  });
//  test("handles task completion toggle correctly", () => {
//    render(
// <TaskList tasks={mockTasks} toggleTaskCompletion={mockToggleTaskCompletion} />
//    );
//    // Click the "Mark as Completed" button for Task 1
//    const task1Button = screen.getByText("Mark as Completed");
//    fireEvent.click(task1Button);
//    expect(mockToggleTaskCompletion).toHaveBeenCalledWith("1");
//    // Click the "Undo Completion" button for Task 2
//    const task2Button = screen.getByText("Undo Completion");
//    fireEvent.click(task2Button);
//    expect(mockToggleTaskCompletion).toHaveBeenCalledWith("2");
//  });
//  test("displays 'No tasks available' when task list is empty", () => {
//    render(<TaskList tasks={[]} toggleTaskCompletion={mockToggleTaskCompletion} />);
//    expect(screen.getByText("No tasks available")).toBeInTheDocument();
//  });
// });













// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import TaskList from "../components/TaskList";

// describe("TaskList Component", () => {
//   const tasks = [
//     {
//       id: 1,
//       title: "Task 1",
//       description: "Description 1",
//       priority: "high",
//       deadline: "2024-12-31",
//       completed: false,
//     },
//     {
//       id: 2,
//       title: "Task 2",
//       description: "Description 2",
//       priority: "medium",
//       deadline: "2022-12-31",
//       completed: false,
//     },
//     {
//       id: 3,
//       title: "Task 3",
//       description: "Description 3",
//       priority: "low",
//       deadline: "2024-12-31",
//       completed: true,
//     },
//   ];

//   test("renders tasks correctly", () => {
//     render(<TaskList tasks={tasks} toggleTaskCompletion={() => {}} />);

//     expect(screen.getByText("Task 1")).toBeInTheDocument();
//     expect(screen.getByText("Description 1")).toBeInTheDocument();
//     expect(screen.getByText("Priority: high")).toBeInTheDocument();

//     expect(screen.getByText("Task 2")).toBeInTheDocument();
//     expect(screen.getByText("Description 2")).toBeInTheDocument();
//     expect(screen.getByText("Priority: medium")).toBeInTheDocument();

//     expect(screen.getByText("Task 3")).toBeInTheDocument();
//     expect(screen.getByText("Description 3")).toBeInTheDocument();
//     expect(screen.getByText("Priority: low")).toBeInTheDocument();
//   });

//   test("applies correct styles for overdue and completed tasks", () => {
//     render(<TaskList tasks={tasks} toggleTaskCompletion={() => {}} />);

//     const overdueTask = screen.getByText("Task 2").closest("li");
//     const completedTask = screen.getByText("Task 3").closest("li");

//     expect(overdueTask).toHaveStyle("background-color: #f8d7da");
//     expect(completedTask).toHaveStyle("background-color: #d4edda");
//   });

//   test("toggles task completion", () => {
//     const toggleTaskCompletionMock = jest.fn();
//     render(
//       <TaskList
//         tasks={[
//           {
//             id: 1,
//             title: "Task 1",
//             description: "Description 1",
//             priority: "high",
//             deadline: "2024-12-31",
//             completed: false,
//           },
//         ]}
//         toggleTaskCompletion={toggleTaskCompletionMock}
//       />
//     );
  
//     // Find the checkbox for the task
//     const taskCheckbox = screen.getByRole("checkbox", { name: "Completed" });
//   });
// });
