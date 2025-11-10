// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBobcrvyF5xZQW5eE07NVg0jJ4U9yDL5ag",
  authDomain: "minecraft-leaderboard-21efa.firebaseapp.com",
  databaseURL: "https://minecraft-leaderboard-21efa-default-rtdb.firebaseio.com",
  projectId: "minecraft-leaderboard-21efa",
  storageBucket: "minecraft-leaderboard-21efa.firebasestorage.app",
  messagingSenderId: "353684610418",
  appId: "1:353684610418:web:d621eeb152ec52f4b211eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PASSWORD = "0029";
const adminBtn = document.getElementById("admin-btn");
const saveBtn = document.getElementById("save-btn");
const rows = document.querySelectorAll("#leaderboard tbody tr");

// Load leaderboard from Firebase
async function loadData() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "leaderboard"));
  if (snapshot.exists()) {
    const data = snapshot.val();
    data.forEach((entry, i) => {
      if (rows[i]) {
        rows[i].querySelector(".name").textContent = entry.name || "";
        rows[i].querySelector(".points").textContent = entry.points || "";
      }
    });
  } else {
    console.log("No data found");
  }
}

// Save leaderboard to Firebase
async function saveData() {
  const data = Array.from(rows).map(row => ({
    name: row.querySelector(".name").textContent.trim(),
    points: row.querySelector(".points").textContent.trim()
  }));

  await set(ref(db, "leaderboard"), data);
  alert("Leaderboard saved to Firebase!");
}

adminBtn.addEventListener("click", () => {
  const pass = prompt("Enter admin passcode:");
  if (pass === PASSWORD) enableEditing();
  else if (pass) alert("Wrong password!");
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

saveBtn.addEventListener("click", async () => {
  rows.forEach(row => {
    const nameInput = row.querySelector(".name input");
    const pointsInput = row.querySelector(".points input");
    row.querySelector(".name").textContent = nameInput.value;
    row.querySelector(".points").textContent = pointsInput.value;
  });

  await saveData();
  saveBtn.style.display = "none";
  adminBtn.disabled = false;
});

loadData();
