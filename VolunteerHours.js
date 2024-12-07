const volunteerForm = document.getElementById("volunteerForm");
const hoursTableBody = document.querySelector("#hoursTable tbody");
const totalHoursElement = document.getElementById("totalHours");

// Event Listener: Form Submission
volunteerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  handleFormSubmission();
});

// Load data from localStorage when the page loads
window.addEventListener("load", loadVolunteerData);

function handleFormSubmission() {
  const charityName = getInputValue("charityName");
  const hoursVolunteered = getInputValue("hoursVolunteered");
  const volunteerDate = getInputValue("volunteerDate");
  const experienceRating = getInputValue("experienceRating");

  const validation = validateInputs(charityName, hoursVolunteered, volunteerDate, experienceRating);

  if (!validation.isValid) {
    alert(validation.errorMessage);
    return;
  }

  const volunteerData = createVolunteerData(charityName, hoursVolunteered, volunteerDate, experienceRating);

  addDataToTable(volunteerData); // Add to table
  saveDataToLocalStorage(volunteerData); // Save to localStorage
  updateTotalHours(); // Update total hours

  volunteerForm.reset();
}

function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

function validateInputs(charityName, hoursVolunteered, volunteerDate, experienceRating) {
  let isValid = true;
  let errorMessage = "";

  if (!charityName) {
    isValid = false;
    errorMessage += "Charity name is required.\n";
  }

  if (!hoursVolunteered || isNaN(hoursVolunteered) || Number(hoursVolunteered) <= 0) {
    isValid = false;
    errorMessage += "Hours volunteered must be a positive number.\n";
  }

  if (!volunteerDate) {
    isValid = false;
    errorMessage += "Date is required.\n";
  }

  if (!experienceRating || isNaN(experienceRating) || Number(experienceRating) < 1 || Number(experienceRating) > 5) {
    isValid = false;
    errorMessage += "Experience rating must be a number between 1 and 5.\n";
  }

  return { isValid, errorMessage };
}

function createVolunteerData(charityName, hoursVolunteered, volunteerDate, experienceRating) {
  return {
    charityName: charityName,
    hoursVolunteered: Number(hoursVolunteered),
    volunteerDate: volunteerDate,
    experienceRating: Number(experienceRating),
  };
}

function addDataToTable(data) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${data.charityName}</td>
    <td>${data.hoursVolunteered}</td>
    <td>${data.volunteerDate}</td>
    <td>${data.experienceRating}</td>
    <td><button class="deleteButton">Delete</button></td>
  `;

  // Add event listener for delete button
  row.querySelector(".deleteButton").addEventListener("click", function () {
    deleteRow(row, data);
  });

  hoursTableBody.appendChild(row);
}

function saveDataToLocalStorage(data) {
  const storedData = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  storedData.push(data);
  localStorage.setItem("volunteerLogs", JSON.stringify(storedData));
}

function loadVolunteerData() {
  const storedData = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  storedData.forEach((data) => addDataToTable(data));
  updateTotalHours();
}

function deleteRow(row, data) {
  row.remove(); // Remove row from the table

  const storedData = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const updatedData = storedData.filter(
    (log) =>
      log.charityName !== data.charityName ||
      log.hoursVolunteered !== data.hoursVolunteered ||
      log.volunteerDate !== data.volunteerDate ||
      log.experienceRating !== data.experienceRating
  );

  localStorage.setItem("volunteerLogs", JSON.stringify(updatedData)); // Update localStorage
  updateTotalHours();
}

function updateTotalHours() {
  const storedData = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const totalHours = storedData.reduce((sum, log) => sum + log.hoursVolunteered, 0);
  totalHoursElement.textContent = totalHours;
}
