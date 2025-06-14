const loginActions = require('./test/login/loginActions');

// Script để xuất kết quả test với tên file tùy chỉnh
async function exportCustomResults() {
    const excelReporter = loginActions.getExcelReporter();
    
    // Tạo tên file với ngày tháng dễ đọc
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN').replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }).replace(/:/g, '-');
    
    const fileName = `KetQua_Test_Login_${dateStr}_${timeStr}`;
    
    console.log('📊 Đang xuất kết quả test với tên file tùy chỉnh...');
    const filePath = await excelReporter.exportToExcel(fileName);
    
    if (filePath) {
        console.log(`✅ Đã xuất kết quả thành công: ${filePath}`);
        
        // Hiển thị tổng kết
        const summary = excelReporter.getSummary();
        console.log('\n📈 Tổng kết kết quả test:');
        summary.forEach(item => {
            console.log(`   ${item['Thông tin']}: ${item['Giá trị']}`);
        });
    } else {
        console.log('❌ Không thể xuất kết quả ra Excel');
    }
}

// Chạy nếu file được gọi trực tiếp
if (require.main === module) {
    exportCustomResults().catch(console.error);
}

module.exports = { exportCustomResults };
