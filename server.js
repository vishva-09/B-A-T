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

// API to download Excel file (Admin only)
app.get('/download', (req, res) => {
    res.download(filePath, "BalajiAutoData.xlsx");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
