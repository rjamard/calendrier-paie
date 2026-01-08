const now = new Date();
let currentDate =
  now.getFullYear() === 2026
    ? new Date(2026, now.getMonth())
    : new Date(2026, 0);


function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");

  calendar.innerHTML = "";
  monthYear.textContent = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric"
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
cell.className = "day";
cell.textContent = day;

const today = new Date();
if (
  day === today.getDate() &&
  month === today.getMonth() &&
  year === today.getFullYear()
) {
  cell.classList.add("today");
}


    const payday = payrollData.find(p => p.date === dateStr);
    if (payday) {
      cell.classList.add("payday");
      cell.onclick = () => showDetails(dateStr, payday.facture);
    }

    calendar.appendChild(cell);
  }
}

function changeMonth(delta) {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + delta);

  if (newDate.getFullYear() !== 2026) return;

  currentDate = newDate;
  renderCalendar();
}


function initNotifications() {
  if (!("Notification" in window)) return;

  if (localStorage.getItem("notificationsSet")) return;

  Notification.requestPermission().then(permission => {
    if (permission !== "granted") return;

    payrollData.forEach(p => {
      const payday = new Date(p.date);

      // 🔔 Notification le jour même (8h)
      scheduleNotification(
        new Date(payday.setHours(8, 0, 0)),
        `Jour de paie 💰`,
        `Facture ${p.facture}`
      );

      // 🔔 Notification le dimanche précédent (18h)
      const sunday = new Date(p.date);
      sunday.setDate(sunday.getDate() - sunday.getDay());
      sunday.setHours(18, 0, 0);

      scheduleNotification(
        sunday,
        `Rappel paie ⏰`,
        `Demain : facture ${p.facture}`
      );
    });

    localStorage.setItem("notificationsSet", "true");
  });
}


function scheduleNotification(date, title, body) {
  const delay = date.getTime() - Date.now();

  if (delay <= 0) return;

  setTimeout(() => {
    new Notification(title, { body });
  }, delay);
}


function showDetails(date, facture) {
  const details = document.getElementById("details");
  details.innerHTML = `
    <h2>📅 Jour de paie</h2>
    <p><strong>Date :</strong> ${date}</p>
    <p><strong>Facture :</strong> ${facture}</p>
    <button onclick="closeDetails()">Fermer</button>
  `;
  details.classList.remove("hidden");
}

function closeDetails() {
  document.getElementById("details").classList.add("hidden");
}



renderCalendar();
initNotifications();

window.onload = () => {
  document.body.classList.remove("app-loading");
  document.body.classList.add("app-ready");
};

