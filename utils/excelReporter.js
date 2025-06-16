const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelReporter {
    constructor() {
        this.testResults = [];
        this.resultsDir = path.join(__dirname, '..', 'results');

        // Đảm bảo thư mục results tồn tại
        if (!fs.existsSync(this.resultsDir)) {
            fs.mkdirSync(this.resultsDir, { recursive: true });
        }
    }    // Thêm kết quả test
    addTestResult(testData) {
        const result = {
            'STT': this.testResults.length + 1,
            'Tên Test Case': testData.testName || 'N/A',
            'Mô tả': testData.description || 'N/A',
            'Kết quả': testData.status || 'N/A',
            'Dữ liệu đầu vào': testData.inputData || '',
            'Kết quả mong đợi': testData.expectedResult || '',
            'Kết quả thực tế': testData.actualResult || ''
        };

        this.testResults.push(result);
    }
    // Xuất kết quả ra file Excel
    exportToExcel(fileName) {
        try {
            if (this.testResults.length === 0) {
                console.log('⚠️ Không có kết quả test nào để xuất');
                return null;
            }

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(this.testResults);

            this.formatTestResultsWorksheet(worksheet);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Results');

            if (!fileName) {
                const timestamp = new Date().toISOString()
                    .replace(/[:.]/g, '-')
                    .replace('T', '_')
                    .split('.')[0];
                fileName = `test-results_${timestamp}.xlsx`;
            }

            if (!fileName.endsWith('.xlsx')) {
                fileName += '.xlsx';
            }

            const filePath = path.join(this.resultsDir, fileName);
            XLSX.writeFile(workbook, filePath);

            console.log(`✅ Đã xuất kết quả: ${filePath} (${this.testResults.length} test cases)`);
            return filePath;
        } catch (error) {
            console.error('❌ Lỗi khi xuất file Excel:', error.message);
            return null;
        }
    }

    // Định dạng worksheet Test Results
    formatTestResultsWorksheet(worksheet) {
        const range = XLSX.utils.decode_range(worksheet['!ref']);

        // Tự động điều chỉnh độ rộng cột
        const colWidths = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxWidth = 10; // Độ rộng tối thiểu

            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell && cell.v) {
                    const cellValue = cell.v.toString();
                    maxWidth = Math.max(maxWidth, cellValue.length + 2);
                }
            }

            // Giới hạn độ rộng tối đa
            colWidths[C] = { wch: Math.min(maxWidth, 50) };
        }
        worksheet['!cols'] = colWidths;

        // Định dạng header row
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (headerCell) {
                headerCell.s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4472C4" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
        }

        // Định dạng data rows
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell) {
                    // Màu nền xen kẽ cho các hàng
                    const bgColor = R % 2 === 0 ? "F2F2F2" : "FFFFFF";

                    // Màu chữ dựa trên trạng thái (cột Kết quả)
                    let fontColor = "000000";
                    if (C === 3 && cell.v) { // Cột "Kết quả"
                        if (cell.v === 'PASSED') fontColor = "008000";
                        else if (cell.v === 'FAILED') fontColor = "FF0000";
                        else if (cell.v === 'SKIPPED') fontColor = "FFA500";
                    }

                    cell.s = {
                        font: { color: { rgb: fontColor } },
                        fill: { fgColor: { rgb: bgColor } },
                        alignment: {
                            horizontal: C === 0 ? "center" : "left",
                            vertical: "center",
                            wrapText: true
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "CCCCCC" } },
                            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                            left: { style: "thin", color: { rgb: "CCCCCC" } },
                            right: { style: "thin", color: { rgb: "CCCCCC" } }
                        }
                    };
                }
            }        }
    }

    // Log test result - method mới để tương thích với profile actions
    async logTestResult(testName, status, description) {
        const testData = {
            testName: testName,
            description: description,
            status: status,
            timestamp: new Date().toISOString(),
            duration: 'N/A'
        };
        
        this.addTestResult(testData);
        
        // Log to console
        console.log(`[${status}] ${testName}: ${description}`);
    }

    // Reset dữ liệu
    reset() {
        this.testResults = [];
    }

    // Lấy tất cả kết quả
    getAllResults() {
        return this.testResults;
    }
}

module.exports = ExcelReporter;
