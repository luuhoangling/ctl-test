// Object chứa tất cả tên testcase cho module profile
// Đảm bảo đồng bộ giữa file spec và actions
const TEST_CASE_NAMES = {
    TT_01: 'TT_01: Bỏ trống tên và email',
    TT_02: 'TT_02: Bỏ trống họ và tên',
    TT_03: 'TT_03: Bỏ trống email',
    TT_04: 'TT_04: Nhập đầy đủ thông tin nhưng mật khẩu cũ không chính xác',
    TT_05: 'TT_05: Nhập mật khẩu mới, bỏ trống xác nhận mật khẩu',
    TT_06: 'TT_06: Nhập mật khẩu mới và xác nhận mật khẩu không khớp',
    TT_07: 'TT_07: Nhập mật khẩu mới ít hơn 6 ký tự',
    TT_08: 'TT_08: Nhập email không đúng định dạng',
    TT_09: 'TT_09: Nhập email đã tồn tại trong hệ thống',
    TT_10: 'TT_10: Nhập đầy đủ họ tên và email hợp lệ, không đổi mật khẩu',
    TT_11: 'TT_11: Nhập đầy đủ họ tên và email hợp lệ, đổi chính xác mật khẩu'
};

module.exports = { TEST_CASE_NAMES };
