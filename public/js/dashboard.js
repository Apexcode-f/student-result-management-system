const user = localStorage.getItem("username");
document.getElementById("username").textContent = user;

fetch(`/api/results/${user}`)
  .then(res => res.json())
  .then(results => {
    const table = document.getElementById("resultsTable");
    results.forEach(r => {
      const row = table.insertRow();
      row.innerHTML = `<td>${r.course}</td><td>${r.score}</td><td>${r.grade}</td>`;
    });
  });
