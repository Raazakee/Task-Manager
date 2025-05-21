import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  jest.spyOn(Storage.prototype, "setItem");
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "token") return "mock-token";
    if (key === "userId") return "3";
    return null;
  });
  jest.spyOn(Storage.prototype, "removeItem");

  global.fetch = jest.fn((url, options) => {
    console.log("Mock fetch called:", url, options);

    if (url.includes("/tasks")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, title: "Task 1", completed: false },
            { id: 2, title: "Task 2", completed: true },
          ]),
      });
    }

    if (url.includes("/login")) {
      return Promise.resolve({
        json: () => Promise.resolve({ token: "mock-token", userId: "3" }),
        ok: true,
      });
    }

    if (url.includes("/register")) {
      return Promise.resolve({ ok: true });
    }

    if (url.includes("/tasks") && options.method === "POST") {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 3, title: "New Task", completed: false }),
      });
    }

    if (url.includes("/tasks") && options.method === "PUT") {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, title: "Updated Task", completed: false }),
      });
    }

    if (url.includes("/tasks") && options.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }

    return Promise.reject(new Error("Unknown API call"));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("App Component", () => {
  test("renders login form initially", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("logs in user and fetches tasks", async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
      expect(localStorage.setItem).toHaveBeenCalledWith("userId", "3");
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  test("registers a new user", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Register/i));

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
    });
  });

  test("fetches and displays tasks", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  test("adds a new task", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Add Task/i));
    const taskInput = screen.getByPlaceholderText("New Task");
    fireEvent.change(taskInput, { target: { value: "New Task" } });
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  test("updates a task", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Edit/i));
    const taskInput = screen.getByPlaceholderText("Edit Task");
    fireEvent.change(taskInput, { target: { value: "Updated Task" } });
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText("Updated Task")).toBeInTheDocument();
    });
  });

  test("deletes a task", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  test("toggles task completion", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Complete/i));

    await waitFor(() => {
      expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    });
  });

  test("logs out the user", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Logout/i));

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("userId");
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });
});
