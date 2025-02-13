document.getElementById('entryForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let formData = {
        customerName: document.getElementById('customerName').value.trim(),
        address: document.getElementById('address').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        vehicleName: document.getElementById('vehicleName').value.trim(),
        vehicleNumber: document.getElementById('vehicleNumber').value.trim(),
        kilometers: document.getElementById('kilometers').value.trim(),
        remarks: document.getElementById('remarks').value.trim()
    };

    // Check if any field is empty
    for (let key in formData) {
        if (formData[key] === "") {
            alert("Please fill in all fields before submitting.");
            return;
        }
    }

    let response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    let result = await response.json();

    if (result.success) {
        alert("Thank you! Your data has been saved.");
        this.reset(); // Reset the form for a new entry
    } else {
        alert("Error saving data. Please try again.");
    }
});
