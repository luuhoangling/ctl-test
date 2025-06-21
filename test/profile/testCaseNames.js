const TEST_CASE_NAMES = {
    TT_01: 'TT_01: Kiểm tra thay đổi thông tin khi bỏ trống họ và tên, email',
    TT_02: 'TT_02: Kiểm tra thay đổi thông tin khi bỏ trống họ và tên',
    TT_03: 'TT_03: Kiểm tra thay đổi thông tin khi bỏ trống email',
    TT_04: 'TT_04: Kiểm tra thay đổi thông tin khi nhập đầy đủ thông tin nhưng mật khẩu cũ không chính xác',
    TT_05: 'TT_05: Kiểm tra thay đổi thông tin khi nhập mật khẩu mới, bỏ trống xác nhận mật khẩu',
    TT_06: 'TT_06: Kiểm tra thay đổi thông tin khi nhập mật khẩu mới và xác nhận mật khẩu không khớp',
    TT_07: 'TT_07: Kiểm tra thay đổi thông tin khi nhập mật khẩu mới ít hơn 6 ký tự',
    TT_08: 'TT_08: Kiểm tra thay đổi thông tin khi nhập email không đúng định dạng',
    TT_09: 'TT_09: Kiểm tra thay đổi thông tin khi nhập email đã tồn tại trong hệ thống',
    TT_10: 'TT_10: Kiểm tra thay đổi thông tin khi nhập đầy đủ họ tên và email hợp lệ, không đổi mật khẩu',
    TT_11: 'TT_11: Kiểm tra thay đổi thông tin khi nhập đầy đủ họ tên và email hợp lệ, đổi mật khẩu'
};

module.exports = { TEST_CASE_NAMES };
