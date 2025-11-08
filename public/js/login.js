document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem("username", username);
    localStorage.setItem("role", data.role);
    if (data.role === "student") window.location.href = "dashboards/student.html";
    else if (data.role === "teacher") window.location.href = "dashboards/teacher.html";
    else window.location.href = "dashboards/admin.html";
  } else {
    document.getElementById("loginError").textContent = data.error;
  }
});
