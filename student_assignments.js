// student_assignments.js

document.addEventListener("DOMContentLoaded", () => {
    const assignments = {
      Maths: ["Assignment 1", "Assignment 2", "Assignment 3"],
      English: ["Essay 1", "Grammar Practice"],
      Science: ["Lab Report"],
      Biology: ["Worksheet A"],
      Chemistry: ["Experiment Writeup"],
      History: ["Read Chapter 3"]
    };
  
    const subjectsContainer = document.getElementById("subjects");
    const assignmentContainer = document.getElementById("assignment-container");
  
    // 渲染科目按钮
    function renderSubjects() {
      Object.keys(assignments).forEach(subject => {
        const div = document.createElement("div");
        div.className = `subject-box ${subject}`;
        div.innerText = subject;
        div.addEventListener("click", () => showAssignments(subject));
        subjectsContainer.appendChild(div);
      });
    }
  
    // 显示对应科目的作业和复选框
    function showAssignments(subject) {
      const items = assignments[subject].map((a, i) =>
        `<li><label><input type="checkbox" id="${subject}-${i}"> ${a}</label></li>`
      ).join('');
      assignmentContainer.innerHTML = `<h3>${subject} Assignments</h3><ul>${items}</ul>`;
    }
  
    renderSubjects();
  });
  