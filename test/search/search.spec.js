const searchActions = require('./searchActions');

describe('Tìm kiếm và Lọc sản phẩm', () => {    // TK_01: Kiểm tra tìm kiếm với từ khóa hợp lệ
    it("TK_01: Kiểm tra tìm kiếm với từ khóa hợp lệ", async () => {
        await searchActions.TK_01_ValidKeywordSearch();
    });

    // TK_02: Kiểm tra tìm kiếm với từ khóa không có kết quả
    it("TK_02: Tìm kiếm với từ khóa không có kết quả → Hiển thị 0 sản phẩm", async () => {
        await searchActions.TK_02_EmptyKeywordSearch();
    });    // TK_03: Kiểm tra tìm kiếm với từ khóa có dấu hoặc không dấu
    it("TK_03: Tìm kiếm với từ khóa có dấu và không dấu → Kết quả giống nhau", async () => {
        await searchActions.TK_03_AccentKeywordSearch();
    });    // TK_04: Kiểm tra tìm kiếm với từ khóa rỗng
    it("TK_04: Tìm kiếm với từ khóa rỗng → Hiển thị tất cả sản phẩm", async () => {
        await searchActions.TK_04_EmptyKeywordSearch();
    });    // TK_05: Kiểm tra lọc theo danh mục cụ thể
    it("TK_05: Lọc theo danh mục cụ thể → Chỉ hiển thị sản phẩm trong danh mục đó", async () => {
        await searchActions.TK_05_CategoryFilter();
    });

    // TK_06: Nhập khoảng giá tối thiểu và tối đa hợp lệ
    it("TK_06: Nhập khoảng giá tối thiểu và tối đa hợp lệ → Hiển thị sản phẩm nằm trong khoảng", async () => {
        await searchActions.TK_06_PriceRangeFilter();
    });    // TK_07: Nhập giá tối thiểu lớn hơn giá tối đa → Kiểm tra hiển thị thông báo "Giá tối thiểu không thể lớn hơn giá tối đa"
    it('TK_07: Nhập giá tối thiểu lớn hơn giá tối đa → Kiểm tra hiển thị thông báo "Giá tối thiểu không thể lớn hơn giá tối đa"', async () => {
        await searchActions.TK_07_InvalidPriceRange();
    });

    // TK_08: Nhập chữ vào ô giá → Set ô giá về 0 (nó tự động làm rỗng giá trị của ô nếu nhập chữ)
    it("TK_08: Nhập chữ vào ô giá → Set ô giá về 0 (nó tự động làm rỗng giá trị của ô nếu nhập chữ)", async () => {
        await searchActions.TK_08_InvalidTextInPriceInput();
    });

    // TK_09: Sắp xếp theo giá tăng dần → Sản phẩm hiển thị từ giá thấp đến cao
    it("TK_09: Sắp xếp theo giá tăng dần → Sản phẩm hiển thị từ giá thấp đến cao", async () => {
        await searchActions.TK_09_SortByPriceAscending();
    });

    // TK_10: Sắp xếp theo giá giảm dần → Sản phẩm hiển thị từ giá cao đến thấp
    it("TK_10: Sắp xếp theo giá giảm dần → Sản phẩm hiển thị từ giá cao đến thấp", async () => {
        await searchActions.TK_10_SortByPriceDescending();
    });

    // TK_11: Kết hợp tìm kiếm + danh mục + giá → Kết quả chính xác theo tất cả điều kiện
    it('TK_11: Kết hợp tìm kiếm + danh mục + giá → Kết quả chính xác theo tất cả điều kiện ("sơ mi", danh mục áo, sắp xếp từ cao xuống thấp)', async () => {
        await searchActions.TK_11_CombinedSearch();
    });

    // TK_12: Nhấn "Xóa Bộ Lọc" sau khi lọc → Trả về trạng thái mặc định, hiển thị toàn bộ sản phẩm
    it('TK_12: Nhấn "Xóa Bộ Lọc" sau khi lọc → Trả về trạng thái mặc định, hiển thị toàn bộ sản phẩm', async () => {
        await searchActions.TK_12_ClearFilters();
    });

    // Xuất kết quả ra Excel sau khi chạy xong tất cả test
    after(async () => {
        const filePath = await searchActions.exportTestResults();
        if (filePath) {
            console.log(`✅ Đã xuất kết quả search tests thành công: ${filePath}`);
        } else {
            console.log('❌ Không thể xuất kết quả search tests ra Excel');
        }
    });

});
