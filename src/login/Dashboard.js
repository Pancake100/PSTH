import React from "react";

export default function Dashboard({ role }) {
  return (
    <div style={{ padding: "20px", fontSize: "20px" }}>
      Welcome to the {role === "teacher" ? "Teacher" : "Student"} Dashboard
    </div>
  );
}