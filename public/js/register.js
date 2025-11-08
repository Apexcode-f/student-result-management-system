document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  });

  const data = await res.json();
  if (data.success) {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    document.getElementById("registerError").textContent = data.error;
  }
});
