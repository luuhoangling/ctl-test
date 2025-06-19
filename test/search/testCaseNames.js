// Object chứa tất cả tên testcase cho module search
// Đảm bảo đồng bộ giữa file spec và actions
const TEST_CASE_NAMES = {
    TK_01: 'TK_01: Kiểm tra tìm kiếm với từ khóa hợp lệ',
    TK_02: 'TK_02: Tìm kiếm với từ khóa không có kết quả',
    TK_03: 'TK_03: Tìm kiếm với từ khóa có dấu và không dấu',
    TK_04: 'TK_04: Tìm kiếm với từ khóa rỗng',
    TK_05: 'TK_05: Lọc theo danh mục cụ thể (Áo)',
    TK_06: 'TK_06: Nhập khoảng giá tối thiểu và tối đa hợp lệ',
    TK_07: 'TK_07: Nhập giá tối thiểu lớn hơn giá tối đa',
    TK_08: 'TK_08: Nhập chữ vào ô giá',
    TK_09: 'TK_09: Sắp xếp theo giá tăng dần',
    TK_10: 'TK_10: Sắp xếp theo giá giảm dần',
    TK_11: 'TK_11: Kết hợp tìm kiếm + danh mục + giá',
    TK_12: 'TK_12: Nhấn "Xóa Bộ Lọc" sau khi lọc'
};

module.exports = { TEST_CASE_NAMES };
