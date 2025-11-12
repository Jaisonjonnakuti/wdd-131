// ====== Register.js ======
// Handles participant addition and form submission

// Track how many participants exist
let participantCount = 1;

// -----------------------------
// Template for each participant
// -----------------------------
function participantTemplate(count) {
  return `
    <section class="participant${count}">
      <h3>Participant ${count}</h3>
      <label for="name${count}">Name:</label>
      <input type="text" id="name${count}" required>

      <label for="age${count}">Age:</label>
      <input type="number" id="age${count}" required>

      <label for="fee${count}">Fee ($):</label>
      <input type="number" id="fee${count}" required>
    </section>
  `;
}

// -----------------------------
// Add Participant Button Logic
// -----------------------------
const addButton = document.querySelector("#addParticipant");

addButton.addEventListener("click", () => {
  participantCount++;
  // Insert new participant section before the Add button
  addButton.insertAdjacentHTML("beforebegin", participantTemplate(participantCount));
});

// -----------------------------
// Calculate Total Fees Function
// -----------------------------
function totalFees() {
  // Select all fee inputs whose id starts with "fee"
  let feeElements = document.querySelectorAll("[id^=fee]");
  // Convert NodeList → Array
  feeElements = [...feeElements];

  // Sum all fee values
  const total = feeElements.reduce((sum, el) => {
    const value = Number(el.value) || 0;
    return sum + value;
  }, 0);

  return total;
}

// -----------------------------
// Success Message Template
// -----------------------------
function successTemplate(info) {
  return `
    <h2>Registration Successful!</h2>
    <p>Thank you <strong>${info.name}</strong> for registering.</p>
    <p>You have registered <strong>${info.count}</strong> participant(s).</p>
    <p>Total Fees: <strong>$${info.total}</strong></p>
  `;
}

// -----------------------------
// Form Submit Logic
// -----------------------------
const form = document.querySelector("#registrationForm");
const summary = document.querySelector("#summary");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload

  const total = totalFees();
  const adultName = document.querySelector("#adultName").value;

  // Hide form and show summary
  form.classList.add("hide");
  summary.classList.remove("hide");

  summary.innerHTML = successTemplate({
    name: adultName,
    count: participantCount,
    total: total
  });
});
