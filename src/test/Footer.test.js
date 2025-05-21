import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";


test("renders the Footer with the correct total tasks", () => {
 const totalTasks = 5; // Mock total tasks count
 render(<Footer totalTasks={totalTasks} />);
 // Check if the total tasks count is displayed correctly
 expect(screen.getByText(/total tasks: 5/i)).toBeInTheDocument();
});
test("renders the Footer with zero tasks when no tasks exist", () => {
 const totalTasks = 0; // Mock total tasks count
 render(<Footer totalTasks={totalTasks} />);
 // Check if the total tasks count is displayed as 0
 expect(screen.getByText(/total tasks: 0/i)).toBeInTheDocument();
});