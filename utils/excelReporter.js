const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelReporter {
    constructor() {
        this.testResults = [];
        this.startTime = new Date();
        this.resultsDir = path.join(__dirname, '..', 'results');
        
        // Đảm bảo thư mục results tồn tại
        if (!fs.existsSync(this.resultsDir)) {
            fs.mkdirSync(this.resultsDir, { recursive: true });
        }
    }

    // Thêm kết quả test
    addTestResult(testData) {
        const result = {
            'STT': this.testResults.length + 1,
            'Tên Test Case': testData.testName || 'N/A',
            'Mô tả': testData.description || 'N/A',
            'Kết quả': testData.status || 'N/A', // PASSED, FAILED, SKIPPED
            'Thời gian thực hiện (ms)': testData.duration || 0,
            'Thông báo lỗi': testData.errorMessage || '',
            'URL kiểm tra': testData.url || '',
            'Thời gian bắt đầu': testData.startTime || new Date().toISOString(),
            'Thời gian kết thúc': testData.endTime || new Date().toISOString(),
            'Trình duyệt': testData.browser || 'N/A',
            'Dữ liệu đầu vào': testData.inputData || '',
            'Kết quả mong đợi': testData.expectedResult || '',
            'Kết quả thực tế': testData.actualResult || '',
            'Screenshot': testData.screenshot || ''
        };
        
        this.testResults.push(result);
        console.log(`✅ Đã thêm kết quả test: ${result['Tên Test Case']} - ${result['Kết quả']}`);
    }

    // Xuất kết quả ra file Excel
    exportToExcel(fileName) {
        try {
            if (this.testResults.length === 0) {
                console.log('⚠️ Không có kết quả test nào để xuất');
                return null;
            }

            // Tạo workbook mới
            const workbook = XLSX.utils.book_new();
            
            // Tạo worksheet từ dữ liệu
            const worksheet = XLSX.utils.json_to_sheet(this.testResults);
            
            // Thêm worksheet vào workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Results');
            
            // Tạo worksheet tổng kết
            const summary = this.generateSummary();
            const summaryWorksheet = XLSX.utils.json_to_sheet(summary);
            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Tổng kết');
            
            // Tạo tên file với timestamp nếu không được cung cấp
            if (!fileName) {
                const timestamp = new Date().toISOString()
                    .replace(/[:.]/g, '-')
                    .replace('T', '_')
                    .split('.')[0];
                fileName = `test-results_${timestamp}.xlsx`;
            }
            
            // Đảm bảo file có extension .xlsx
            if (!fileName.endsWith('.xlsx')) {
                fileName += '.xlsx';
            }
            
            const filePath = path.join(this.resultsDir, fileName);
            
            // Ghi file
            XLSX.writeFile(workbook, filePath);
            
            console.log(`📊 Đã xuất kết quả test ra file: ${filePath}`);
            console.log(`📈 Tổng số test cases: ${this.testResults.length}`);
            
            return filePath;
        } catch (error) {
            console.error('❌ Lỗi khi xuất file Excel:', error.message);
            return null;
        }
    }

    // Tạo bảng tổng kết
    generateSummary() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r['Kết quả'] === 'PASSED').length;
        const failed = this.testResults.filter(r => r['Kết quả'] === 'FAILED').length;
        const skipped = this.testResults.filter(r => r['Kết quả'] === 'SKIPPED').length;
        
        const totalDuration = this.testResults.reduce((sum, r) => sum + (r['Thời gian thực hiện (ms)'] || 0), 0);
        const endTime = new Date();
        const totalTestTime = endTime - this.startTime;
        
        return [
            { 'Thông tin': 'Tổng số Test Cases', 'Giá trị': total },
            { 'Thông tin': 'Passed', 'Giá trị': passed },
            { 'Thông tin': 'Failed', 'Giá trị': failed },
            { 'Thông tin': 'Skipped', 'Giá trị': skipped },
            { 'Thông tin': 'Tỷ lệ thành công (%)', 'Giá trị': total > 0 ? ((passed / total) * 100).toFixed(2) : 0 },
            { 'Thông tin': 'Thời gian bắt đầu', 'Giá trị': this.startTime.toLocaleString('vi-VN') },
            { 'Thông tin': 'Thời gian kết thúc', 'Giá trị': endTime.toLocaleString('vi-VN') },
            { 'Thông tin': 'Tổng thời gian test (phút)', 'Giá trị': (totalTestTime / 60000).toFixed(2) },
            { 'Thông tin': 'Tổng thời gian thực hiện (ms)', 'Giá trị': totalDuration }
        ];
    }

    // Reset dữ liệu
    reset() {
        this.testResults = [];
        this.startTime = new Date();
        console.log('🔄 Đã reset dữ liệu test results');
    }

    // Lấy tất cả kết quả
    getAllResults() {
        return this.testResults;
    }

    // Lấy tổng kết
    getSummary() {
        return this.generateSummary();
    }
}

module.exports = ExcelReporter;
