const NAV_TOGGLE = document.querySelector("[data-nav-toggle]");
const NAV_LINKS = document.querySelector("[data-nav-links]");

if (NAV_TOGGLE && NAV_LINKS) {
  NAV_TOGGLE.addEventListener("click", () => {
    NAV_LINKS.classList.toggle("show");
  });
}

const page = document.body.dataset.page;

const sampleData = {
  students: [
    {
      id: "ST001",
      name: "Aanya Sharma",
      grade: "10-A",
      guardian: "Mr. Sharma",
      contact: "+91 99999 88888",
    },
    {
      id: "ST002",
      name: "Kabir Rao",
      grade: "10-A",
      guardian: "Mrs. Rao",
      contact: "+91 99887 77665",
    },
    {
      id: "ST003",
      name: "Meera Das",
      grade: "9-B",
      guardian: "Mr. Das",
      contact: "+91 98765 43210",
    },
  ],
  attendance: [
    { date: "2024-09-10", status: "Present", class: "10-A" },
    { date: "2024-09-11", status: "Present", class: "10-A" },
    { date: "2024-09-12", status: "Absent", class: "10-A" },
  ],
  results: [
    { subject: "Mathematics", marks: 88, grade: "A" },
    { subject: "Science", marks: 92, grade: "A+" },
    { subject: "English", marks: 79, grade: "B+" },
  ],
};

const renderTable = (tableId, rows) => {
  const table = document.querySelector(tableId);
  if (!table) {
    return;
  }
  table.innerHTML = rows;
};

if (page === "students") {
  const rows = sampleData.students
    .map(
      (student) => `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.grade}</td>
        <td>${student.guardian}</td>
        <td>${student.contact}</td>
      </tr>`
    )
    .join("");
  renderTable("#students-table tbody", rows);
}

if (page === "attendance") {
  const rows = sampleData.attendance
    .map(
      (item) => `
      <tr>
        <td>${item.date}</td>
        <td>${item.class}</td>
        <td>${item.status}</td>
      </tr>`
    )
    .join("");
  renderTable("#attendance-table tbody", rows);
}

if (page === "results") {
  const rows = sampleData.results
    .map(
      (result) => `
      <tr>
        <td>${result.subject}</td>
        <td>${result.marks}</td>
        <td>${result.grade}</td>
      </tr>`
    )
    .join("");
  renderTable("#results-table tbody", rows);
}

const loginForm = document.querySelector("[data-login-form]");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginForm.querySelector("#email");
    const password = loginForm.querySelector("#password");
    const role = loginForm.querySelector("#role");
    const feedback = loginForm.querySelector("[data-feedback]");

    if (!email.value.trim() || !password.value.trim() || !role.value) {
      feedback.textContent = "Please fill in all fields to continue.";
      feedback.className = "alert error";
      return;
    }

    feedback.textContent = `Signed in as ${role.value}. Redirecting to dashboard...`;
    feedback.className = "alert success";
  });
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = contactForm.querySelector("[data-feedback]");
    feedback.textContent = "Thank you! Our team will respond within 24 hours.";
    feedback.className = "alert success";
  });
}
