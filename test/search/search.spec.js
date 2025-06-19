const searchActions = require('./searchActions');
const { TEST_CASE_NAMES } = require('./testCaseNames');

describe('TESTCASE - TÌM KIẾM VÀ LỌC SẢN PHẨM', () => {

    it(TEST_CASE_NAMES.TK_01, async () => {
        await searchActions.TK_01_ValidKeywordSearch();
    });

    it(TEST_CASE_NAMES.TK_02, async () => {
        await searchActions.TK_02_EmptyKeywordSearch();
    });

    it(TEST_CASE_NAMES.TK_03, async () => {
        await searchActions.TK_03_AccentKeywordSearch();
    });

    it(TEST_CASE_NAMES.TK_04, async () => {
        await searchActions.TK_04_EmptyKeywordSearch();
    });

    it(TEST_CASE_NAMES.TK_05, async () => {
        await searchActions.TK_05_CategoryFilter();
    });

    it(TEST_CASE_NAMES.TK_06, async () => {
        await searchActions.TK_06_PriceRangeFilter();
    });

    it(TEST_CASE_NAMES.TK_07, async () => {
        await searchActions.TK_07_InvalidPriceRange();
    });

    it(TEST_CASE_NAMES.TK_08, async () => {
        await searchActions.TK_08_InvalidTextInPriceInput();
    });

    it(TEST_CASE_NAMES.TK_09, async () => {
        await searchActions.TK_09_SortByPriceAscending();
    });

    it(TEST_CASE_NAMES.TK_10, async () => {
        await searchActions.TK_10_SortByPriceDescending();
    });

    it(TEST_CASE_NAMES.TK_11, async () => {
        await searchActions.TK_11_CombinedSearch();
    });

    it(TEST_CASE_NAMES.TK_12, async () => {
        await searchActions.TK_12_ClearFilters();
    });

    // Xuất kết quả ra Excel sau khi chạy xong tất cả test
    after(async () => {
        const filePath = await searchActions.exportTestResults();
        if (filePath) {
            console.log(`Đã xuất kết quả search tests thành công: ${filePath}`);
        } else {
            console.log('Không thể xuất kết quả search tests ra Excel');
        }
    });

});
