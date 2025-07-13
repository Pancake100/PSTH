// teacher_assignments.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('assignmentForm');
    const log = document.getElementById('log');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const subject = document.getElementById('subject').value;
      const title = document.getElementById('title').value;
      const desc = document.getElementById('desc').value;
      const due = document.getElementById('due').value;
  
      if (!subject || !title) {
        alert("Please fill in subject and title.");
        return;
      }
  
      const entry = document.createElement("div");
      entry.className = "assignment-entry";
      entry.innerHTML = `
        <strong>${subject}</strong> - ${title} 
        <span style="font-size: 0.9em">(Due: ${due || 'No due date'})</span><br>
        <em>${desc || ''}</em>
      `;
      log.appendChild(entry);
      form.reset();
    });
  });
  