// const mysqlDate = "2025-09-09 14:45:30";

// console.log(formatDate(mysqlDate)); // "2025-09-09"
// console.log(formatDateDMY(mysqlDate)); // "09/09/2025"
// console.log(formatFull(mysqlDate)); // "Tuesday, September 9, 2025, 02:45 PM"
// console.log(formatTime(mysqlDate)); // "14:45"
// console.log(formatMonthDayYear(mysqlDate));  // "May 6, 2025"

export function parseMySQLDate(mysqlDate) {
  return new Date(mysqlDate.replace(" ", "T"));
}

export function formatDate(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d?.toISOString().split("T")[0]; // "2025-09-09"
}

export function formatDateDMY(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d.toLocaleDateString("en-GB"); // "09/09/2025"
}

export function formatDateMDY(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d?.toLocaleDateString("en-US"); // "09/09/2025"
}

export function formatDateFull(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d?.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date) {
  const d = typeof date === "string" ? parseMySQLDate(date) : date;
  return d?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function addDays(startDate, days = 5) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);

  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
