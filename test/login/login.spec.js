const loginActions = require('./loginActions');

describe('Đăng nhập', () => {

    // Không tk, mk
    it("Không tài khoản, không mật khẩu", async () => {
        await loginActions.loginWithEmptyLoginCredentials();
    })    
    // Sai tk, đúng mk
    it("Sai tài khoản, đúng mật khẩu", async () => {
        await loginActions.loginWithWrongUsernameValidPass();
    })
    // Đúng tk, sai mk
    it("Đúng tài khoản, sai mật khẩu", async () => {
        await loginActions.loginWithValidUsernameInvalidPass();
    })
    // Đúng tk, mk
    it("Đúng tài khoản và mật khẩu", async () => {
        await loginActions.loginWithValidCredentials();
    })

    // Xuất kết quả ra Excel sau khi chạy xong tất cả test
    after(async () => {
        const filePath = await loginActions.exportTestResults();
        if (filePath) {
            console.log(`Đã xuất kết quả thành công: ${filePath}`);
        } else {
            console.log('Không thể xuất kết quả ra Excel');
        }
    });

});