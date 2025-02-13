const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const xlsx = require('xlsx');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'data', 'BalajiAutoData.xlsx');

// Function to ensure Excel file exists
const initializeExcelFile = () => {
    if (!fs.existsSync(filePath)) {
        console.log("Creating new Excel file...");

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([
            ["Customer Name", "Address", "Contact Number", "Vehicle Name", "Vehicle Number", "Kilometers", "Remarks"]
        ]);

        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        xlsx.writeFile(workbook, filePath);
    }
};

// Initialize the Excel file when the server starts
initializeExcelFile();

// Route to submit data to Excel
app.post('/submit', (req, res) => {
    try {
        const newData = [
            req.body.customerName,
            req.body.address,
            req.body.contactNumber,
            req.body.vehicleName,
            req.body.vehicleNumber,
            req.body.kilometers,
            req.body.remarks
        ];

        // Read existing Excel file
        let workbook = xlsx.readFile(filePath);
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert existing data to JSON
        let data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Append new row
        data.push(newData);

        // Convert back to worksheet
        let newWorksheet = xlsx.utils.aoa_to_sheet(data);
        workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;

        // Write back to file
        xlsx.writeFile(workbook, filePath);

        res.json({ success: true, message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ success: false, message: "Error saving data." });
    }
});

// Admin-only: Download Excel File
app.get('/download', (req, res) => {
    res.download(filePath, "BalajiAutoData.xlsx");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
