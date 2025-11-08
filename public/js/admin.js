// admin.js
const admin = localStorage.getItem("username");
if (!admin) window.location.href = "../login.html";
document.getElementById("adminName").textContent = admin;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "../login.html";
});

async function fetchUsers() {
  const res = await fetch("/api/users");
  const data = await res.json();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td>
        <button class="delUser" data-username="${u.username}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".delUser").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const username = e.target.dataset.username;
      if (!confirm(`Delete user ${username}?`)) return;
      const resp = await fetch(`/api/users/${encodeURIComponent(username)}`, { method: "DELETE" });
      if (resp.ok) fetchUsers();
      else alert("Failed to delete user");
    });
  });
}

async function fetchAllResults() {
  const res = await fetch("/api/results");
  const data = await res.json();
  const tbody = document.querySelector("#allResultsTable tbody");
  tbody.innerHTML = "";
  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.username}</td>
      <td>${r.course}</td>
      <td>${r.score}</td>
      <td>${r.grade}</td>
      <td>${r.teacher || ""}</td>
      <td><button class="delResult" data-id="${r.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".delResult").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this result?")) return;
      const resp = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (resp.ok) fetchAllResults();
      else alert("Failed to delete result");
    });
  });
}

fetchUsers();
fetchAllResults();

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const studentId = document.getElementById("studentId").value.trim();

  const res = await fetch(`/getResults/${studentId}`);
  const data = await res.json();

  if (data.success && data.results.length > 0) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("School of Excellence", 70, 15);
    doc.setFontSize(12);
    doc.text(`Student Report Card — ID: ${studentId}`, 60, 25);
    doc.line(10, 30, 200, 30);

    doc.autoTable({
      head: [['Subject', 'Score', 'Grade', 'Semester']],
      body: data.results.map(r => [r.Subject, r.Score, r.Grade, r.Semester]),
      startY: 40
    });

    const avg = data.results.reduce((sum, r) => sum + parseFloat(r.Score), 0) / data.results.length;
    doc.text(`Average Score: ${avg.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`ReportCard_${studentId}.pdf`);
  } else {
    document.getElementById("reportMessage").textContent = "No results found for this student.";
  }
});
