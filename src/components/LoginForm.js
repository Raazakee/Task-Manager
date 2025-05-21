

import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Login failed.");
                return;
            }

            const data = await response.json();

            // Store the token in localStorage (or sessionStorage)
            localStorage.setItem("token", data.token);

            // Pass the token to parent component if needed
            if (onLogin) {
                onLogin(data.token);
            }

            // Optionally redirect or show a success message
            console.log("Login successful! Token:", data.token);
        } catch (err) {
            console.error("Error during login:", err); // Log full error
            setError("An unexpected error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;

// import React, { useState } from "react";

// const LoginForm = ({ onLogin }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch("http://localhost:5000/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 setError(errorData.error || "Login failed.");
//                 return;
//             }

//             const data = await response.json();
//             onLogin(data.token); // Pass the token to parent component
//         } catch (err) {
//             console.error("Error during login:", err);
//             setError("An unexpected error occurred.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Login</h2>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//             />
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default LoginForm;
