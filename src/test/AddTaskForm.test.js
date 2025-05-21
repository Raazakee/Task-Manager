import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTaskForm from "../components/AddTaskForm";

describe("AddTaskForm Component", () => {
  const mockAddTask = jest.fn();

  beforeEach(() => {
    mockAddTask.mockClear();
  });

  test("renders form inputs correctly", () => {
    render(<AddTaskForm addTask={mockAddTask} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
  });

  test("displays an alert if form is submitted with empty fields", () => {
    window.alert = jest.fn(); // Mock alert
    render(<AddTaskForm addTask={mockAddTask} />);

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    expect(window.alert).toHaveBeenCalledWith("Please fill out all fields!");
  });

  test("calls addTask with correct task data", () => {
    render(<AddTaskForm addTask={mockAddTask} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "This is a test description" },
    });
    fireEvent.change(screen.getByLabelText(/deadline/i), {
      target: { value: "2024-12-25" },
    });
    fireEvent.change(screen.getByLabelText(/priority/i), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith({
      id: expect.any(Number),
      title: "Test Task",
      description: "This is a test description",
      priority: "high",
      deadline: "2024-12-25",
      completed: false,
    });
  });

  test("clears the form after a successful submission", () => {
    render(<AddTaskForm addTask={mockAddTask} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "This is a test description" },
    });
    fireEvent.change(screen.getByLabelText(/deadline/i), {
      target: { value: "2024-12-25" },
    });
    fireEvent.change(screen.getByLabelText(/priority/i), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/priority/i)).toHaveValue("low");
    expect(screen.getByLabelText(/deadline/i)).toHaveValue("");
  });
});
