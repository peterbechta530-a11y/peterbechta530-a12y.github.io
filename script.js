const PASSWORD = "0029";
const adminBtn = document.getElementById("admin-btn");
const saveBtn = document.getElementById("save-btn");
const rows = document.querySelectorAll("#leaderboard tbody tr");

function loadData() {
  const saved = JSON.parse(localStorage.getItem("leaderboardData")) || [];
  saved.forEach((entry, i) => {
    if (rows[i]) {
      rows[i].querySelector(".name").textContent = entry.name || "";
      rows[i].querySelector(".points").textContent = entry.points || "";
    }
  });
}

function saveData() {
  const data = Array.from(rows).map(row => ({
    name: row.querySelector(".name").textContent.trim(),
    points: row.querySelector(".points").textContent.trim()
  }));
  localStorage.setItem("leaderboardData", JSON.stringify(data));
  alert("Leaderboard saved!");
}

adminBtn.addEventListener("click", () => {
  const pass = prompt("Enter admin passcode:");
  if (pass === PASSWORD) {
    enableEditing();
  } else if (pass) {
    alert("Wrong password!");
  }
});

function enableEditing() {
  rows.forEach(row => {
    const nameCell = row.querySelector(".name");
    const pointsCell = row.querySelector(".points");

    const nameInput = document.createElement("input");
    nameInput.value = nameCell.textContent;
    nameInput.classList.add("editable");

    const pointsInput = document.createElement("input");
    pointsInput.value = pointsCell.textContent;
    pointsInput.classList.add("editable");

    nameCell.textContent = "";
    pointsCell.textContent = "";

    nameCell.appendChild(nameInput);
    pointsCell.appendChild(pointsInput);
  });

  saveBtn.style.display = "inline-block";
  adminBtn.disabled = true;
}

saveBtn.addEventListener("click", () => {
  rows.forEach(row => {
    const nameInput = row.querySelector(".name input");
    const pointsInput = row.querySelector(".points input");
    row.querySelector(".name").textContent = nameInput.value;
    row.querySelector(".points").textContent = pointsInput.value;
  });

  saveData();
  saveBtn.style.display = "none";
  adminBtn.disabled = false;
});

loadData();
