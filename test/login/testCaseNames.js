// Object chứa tất cả tên testcase cho module login
// Đảm bảo đồng bộ giữa file spec và actions
const TEST_CASE_NAMES = {
    DN_01: 'DN_01: Kiểm tra đăng nhập khi bỏ trống cả tài khoản và mật khẩu',
    DN_02: 'DN_02: Kiểm tra đăng nhập khi bỏ trống tài khoản, chỉ nhập mật khẩu',
    DN_03: 'DN_03: Kiểm tra đăng nhập khi bỏ trống mật khẩu, chỉ nhập tài khoản',
    DN_04: 'DN_04: Kiểm tra đăng nhập với tài khoản chưa đăng ký',
    DN_05: 'DN_05: Kiểm tra đăng nhập với tài khoản đúng nhưng sai mật khẩu ',
    DN_06: 'DN_06: Kiểm tra đăng nhập với tài khoản viết in hoa, mật khẩu đúng',
    DN_07: 'DN_07: Kiểm tra đăng nhập với mật khẩu viết in hoa, tài khoản đúng',
    DN_08: 'DN_08: Kiểm tra đăng nhập với tài khoản chứa 1 ký tự',
    DN_09: 'DN_09: Kiểm tra đăng nhập với mật khẩu 1 ký tự',
    DN_10: 'DN_10: Kiểm tra đăng nhập khi tài khoản chứa 100 ký tự a',
    DN_11: 'DN_11: Kiểm tra đăng nhập khi tài khoản chứa ký tự đặc biệt',
    DN_12: 'DN_12: Kiểm tra đăng nhập với tài khoản và mật khẩu chính xác',
    DN_13: 'DN_13: Kiểm tra đăng nhập sai quá 5 lần liên tiếp'
};

module.exports = { TEST_CASE_NAMES };
