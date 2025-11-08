// teacher.js
const teacher = localStorage.getItem("username");
if (!teacher) {
  window.location.href = "../login.html";
}
document.getElementById("teacherName").textContent = teacher;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "../login.html";
});

async function fetchTeacherResults() {
  // Endpoint to return all results; server should filter by teacher on server-side or we filter here
  const res = await fetch(`/api/results`);
  const data = await res.json();
  const tbody = document.querySelector("#teacherResultsTable tbody");
  tbody.innerHTML = "";
  data
    .filter(r => r.teacher === teacher) // if server stored teacher username as 'teacher'
    .forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.username}</td>
        <td>${r.course}</td>
        <td>${r.score}</td>
        <td>${r.grade}</td>
        <td><button data-id="${r.id}" class="delBtn">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });

  // attach delete handlers
  document.querySelectorAll(".delBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this result?")) return;
      const resp = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (resp.ok) {
        fetchTeacherResults();
      } else {
        alert("Failed to delete result");
      }
    });
  });
}

document.getElementById("addResultForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("studentUsername").value.trim();
  const course = document.getElementById("course").value.trim();
  const score = Number(document.getElementById("score").value);
  let grade = document.getElementById("grade").value.trim();

  // Auto-calc grade if not provided
  if (!grade) {
    if (score >= 90) grade = "A+";
    else if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 60) grade = "C";
    else grade = "F";
  }

  const payload = { username, course, score, grade, teacher };

  const resp = await fetch("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await resp.json();
  if (resp.ok) {
    document.getElementById("addResultMsg").textContent = "Result added.";
    document.getElementById("addResultForm").reset();
    fetchTeacherResults();
  } else {
    document.getElementById("addResultMsg").textContent = data.error || "Error adding result.";
  }
});

// load teacher results initially
fetchTeacherResults();

document.getElementById("editResultForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const score = document.getElementById("score").value.trim();

  const res = await fetch("/updateResult", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, subject, score })
  });

  const data = await res.json();
  const msg = document.getElementById("updateMessage");

  if (data.success) {
    msg.style.color = "green";
    msg.textContent = "✅ Result updated successfully!";
  } else {
    msg.style.color = "red";
    msg.textContent = "❌ Failed to update result. Please check inputs.";
  }
});
