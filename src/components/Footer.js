import React from "react";

function Footer({ totalTasks }) {
  return (
    <footer style={{ textAlign: "center", marginTop: "20px" }}>
      <p>Total Tasks: {totalTasks}</p>
    </footer>
  );
}

export default Footer;
