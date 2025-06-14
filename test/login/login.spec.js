const loginActions = require('./loginActions');

describe('Đăng nhập - Test Cases', () => {

    // DN_01: Kiểm tra đăng nhập khi bỏ trống cả tài khoản và mật khẩu
    it("DN_01: Kiểm tra đăng nhập khi bỏ trống cả tài khoản và mật khẩu", async () => {
        await loginActions.DN_01_EmptyUsernameAndPassword();
    });

    // DN_02: Kiểm tra đăng nhập khi bỏ trống tài khoản, chỉ nhập mật khẩu
    it("DN_02: Kiểm tra đăng nhập khi bỏ trống tài khoản, chỉ nhập mật khẩu", async () => {
        await loginActions.DN_02_EmptyUsernameOnlyPassword();
    });

    // DN_03: Kiểm tra đăng nhập khi bỏ trống mật khẩu, chỉ nhập tài khoản
    it("DN_03: Kiểm tra đăng nhập khi bỏ trống mật khẩu, chỉ nhập tài khoản", async () => {
        await loginActions.DN_03_EmptyPasswordOnlyUsername();
    });

    // DN_04: Kiểm tra đăng nhập với tài khoản chưa đăng ký
    it("DN_04: Kiểm tra đăng nhập với tài khoản chưa đăng ký", async () => {
        await loginActions.DN_04_UnregisteredAccount();
    });

    // DN_05: Kiểm tra đăng nhập với tài khoản đúng nhưng sai mật khẩu 
    it("DN_05: Kiểm tra đăng nhập với tài khoản đúng nhưng sai mật khẩu ", async () => {
        await loginActions.DN_05_WrongPassword();
    });

    // DN_06: Kiểm tra đăng nhập với tài khoản viết in hoa, mật khẩu đúng
    it("DN_06: Kiểm tra đăng nhập với tài khoản viết in hoa, mật khẩu đúng", async () => {
        await loginActions.DN_06_UppercaseUsername();
    });

    // DN_07: Kiểm tra đăng nhập với mật khẩu viết in hoa, tài khoản đúng
    it("DN_07: Kiểm tra đăng nhập với mật khẩu viết in hoa, tài khoản đúng", async () => {
        await loginActions.DN_07_UppercasePassword();
    });

    // DN_08: Kiểm tra đăng nhập với tài khoản chứa 1 ký tự
    it("DN_08: Kiểm tra đăng nhập với tài khoản chứa 1 ký tự", async () => {
        await loginActions.DN_08_InvalidShortUsername();
    });

    // DN_09: Kiểm tra đăng nhập với mật khẩu 1 ký tự
    it("DN_09: Kiểm tra đăng nhập với mật khẩu 1 ký tự", async () => {
        await loginActions.DN_09_InvalidShortPassword();
    });

    // DN_10: Kiểm tra đăng nhập khi tài khoản chứa 100 ký tự a
    it("DN_10: Kiểm tra đăng nhập khi tài khoản chứa 100 ký tự a", async () => {
        await loginActions.DN_10_LongUsername();
    });

    // DN_11: Kiểm tra đăng nhập khi tài khoản chứa ký tự đặc biệt
    it("DN_11: Kiểm tra đăng nhập khi tài khoản chứa ký tự đặc biệt", async () => {
        await loginActions.DN_11_SpecialCharacterUsername();
    });

    // DN_12: Kiểm tra đăng nhập với tài khoản và mật khẩu chính xác
    it("DN_12: Kiểm tra đăng nhập với tài khoản và mật khẩu chính xác", async () => {
        await loginActions.DN_12_ValidLogin();
    });

    // DN_13: Kiểm tra đăng nhập sai quá 5 lần liên tiếp
    it("DN_13: Kiểm tra đăng nhập sai quá 5 lần liên tiếp", async () => {
        await loginActions.DN_13_MultipleFailedLogins();
    });

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
