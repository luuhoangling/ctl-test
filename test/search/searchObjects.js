const testConfig = require('../../config/testConfig');

module.exports = {
    waitTimes: testConfig.waitTimes,
    
    // Specific wait times for search operations
    searchWaitTimes: {
        searchSubmit: 1500,        // Wait after submitting search
        resultLoad: 3000,          // Wait for search results to load
        productCountMessage: 2500, // Wait for product count message to appear
        filterApply: 500,         // Wait after applying filters
        pageLoad: 2000             // Wait for page elements to load
    },

    // Test data constants - Dữ liệu test cố định
    testData: {
        // Từ khóa tìm kiếm - Search keywords
        searchKeywords: {
            validKeyword: 'áo sơ mi',              // Từ khóa hợp lệ có kết quả
            invalidKeyword: 'mũ',                  // Từ khóa không có kết quả
            accentedKeyword: 'áo sơ mi',           // Từ khóa có dấu
            nonAccentedKeyword: 'ao so mi',        // Từ khóa không dấu
            emptyKeyword: ''                       // Từ khóa rỗng
        },

        // Khoảng giá - Price ranges
        priceRanges: {
            validMin: 100000,                      // Giá tối thiểu hợp lệ (100,000 VND)
            validMax: 500000,                      // Giá tối đa hợp lệ (500,000 VND)
            invalidMin: 1000000,                   // Giá tối thiểu không hợp lệ (1,000,000 VND)
            invalidMax: 100000,                    // Giá tối đa không hợp lệ (100,000 VND)
            textInput: 'abc123'                    // Text không hợp lệ cho input giá
        },

        // Giá trị dropdown - Dropdown values
        dropdownValues: {
            allCategories: '0',                    // Tất cả danh mục
            sortPriceAsc: 'price-asc',            // Sắp xếp giá tăng dần
            sortPriceDesc: 'price-desc',          // Sắp xếp giá giảm dần
            sortNameAsc: 'name-asc',              // Sắp xếp tên A-Z
            sortNameDesc: 'name-desc'             // Sắp xếp tên Z-A
        },

        // Thông báo lỗi mong đợi - Expected error messages
        errorMessages: {
            priceValidation: 'Giá tối thiểu không thể lớn hơn giá tối đa',  // Thông báo lỗi validation giá
            noResults: 'Không tìm thấy sản phẩm nào'                        // Thông báo không có kết quả
        },

        // Selector cho sản phẩm - Product selectors
        productSelectors: {
            productTitle: '.product-title',        // Selector tiêu đề sản phẩm
            productPrice: '.product-price'         // Selector giá sản phẩm
        },

        // Các giá trị kiểm tra - Test validation values
        validation: {
            maxProductsToCheck: 5,                 // Số lượng sản phẩm tối đa để kiểm tra
            waitForValidation: 1000,               // Thời gian chờ validation (ms)
            searchTimeout: 8000,                   // Timeout cho tìm kiếm (ms)
            resultsTimeout: 15000                  // Timeout cho kết quả (ms)
        },

        // Từ khóa tìm kiếm phụ - Alternative search keywords
        alternativeKeywords: [
            'áo', 'sơ mi', 'shirt', 'clothing', 'apparel'
        ],

        // Tên test cases - Test case names
        testNames: {
            TK_01: 'TK_01: Kiểm tra tìm kiếm với từ khóa hợp lệ',
            TK_02: 'TK_02: Kiểm tra tìm kiếm với từ khóa không có kết quả',
            TK_03: 'TK_03: Kiểm tra tìm kiếm với từ khóa có dấu hoặc không dấu',
            TK_04: 'TK_04: Kiểm tra tìm kiếm với từ khóa rỗng',
            TK_05: 'TK_05: Kiểm tra lọc theo danh mục cụ thể',
            TK_06: 'TK_06: Nhập khoảng giá tối thiểu và tối đa hợp lệ',
            TK_07: 'TK_07: Nhập giá tối thiểu lớn hơn giá tối đa',
            TK_08: 'TK_08: Nhập chữ vào ô giá',
            TK_09: 'TK_09: Sắp xếp theo giá tăng dần',
            TK_10: 'TK_10: Sắp xếp theo giá giảm dần',
            TK_11: 'TK_11: Kết hợp tìm kiếm + danh mục + giá',
            TK_12: 'TK_12: Nhấn "Xóa Bộ Lọc" sau khi lọc'
        }
    },

    // 1. Form lọc - Thẻ <form> lọc sản phẩm
    productFilterForm: () => $('#product-filter-form'),// 6. Ô nhập từ khóa - Input text tìm kiếm sản phẩm
    searchProductInput: () => $('[data-testid="search-input"]'),// 8. Dropdown chọn danh mục - <select> chọn danh mục
    categoryFilterSelect: () => $('[data-testid="category-select"]'),// 10. Ô nhập giá tối thiểu - Input số nhỏ nhất
    priceMinInput: () => $('[data-testid="price-min"]'),

    // 11. Ô nhập giá tối đa - Input số lớn nhất
    priceMaxInput: () => $('[data-testid="price-max"]'),

    // 12.1. Thông báo lỗi validation khoảng giá - "Giá tối thiểu không thể lớn hơn giá tối đa"
    priceValidationError: () => $('[data-testid="price-validation-error"]'),// 17. Dropdown chọn sắp xếp - <select> sắp xếp theo giá, tên,...
    sortProductsSelect: () => $('[data-testid="sort-select"]'),// 19. Nút áp dụng lọc - Nút submit lọc
    applyFiltersBtn: () => $('[data-testid="apply-filters"]'),

    // 20. Nút xóa lọc - Nút clear tất cả bộ lọc
    clearFiltersBtn: () => $('[data-testid="clear-filters"]'),
    searchResultItems: () => $$('.product-item, .product-card, .search-item'),
    searchResultCount: () => $('#search-result-count, .result-count, .products-count'),    // Search results title
    searchResultsTitle: () => $('#search-results-title, [data-testid="search-results-title"]'),    // Product card selectors - for getting all product cards
    productCards: () => $$('[data-testid^="product-card-wrapper-"]'),    // Product count message - "x sản phẩm" - Based on actual HTML structure
    productCountMessage: () => $('#products-count, [data-testid="products-count"]'),

    // Alternative selectors for product count
    productCountMessageAlt: () => $(
        '#search-results-title small, .text-muted, ' +
        '[class*="count"], [id*="count"], [data-testid*="count"], ' +
        'small:contains("sản phẩm"), span:contains("sản phẩm")'
    ),
// Helper method to get product count from message text
    async getProductCountFromMessage() {
        try {
            let countMessage = await this.productCountMessage();
            
            // Try primary selector first
            if (await countMessage.isDisplayed()) {
                const messageText = await countMessage.getText();
                // Extract number from text like "(18 sản phẩm)", "15 sản phẩm", "Có 25 sản phẩm", etc.
                const match = messageText.match(/\(?(\d+)\s*sản phẩm\)?/i);
                return match ? parseInt(match[1]) : 0;
            }
            
            // Try alternative selector if primary fails
            countMessage = await this.productCountMessageAlt();
            if (await countMessage.isDisplayed()) {
                const messageText = await countMessage.getText();
                const match = messageText.match(/\(?(\d+)\s*sản phẩm\)?/i);
                return match ? parseInt(match[1]) : 0;
            }
            
            return 0;
        } catch (error) {
            return 0;
        }
    },

    // Helper method to wait for and validate product count message
    async waitForProductCountMessage(timeout = 5000) {
        try {
            // Try primary selector first
            let countMessage = await this.productCountMessage();
            
            try {
                await countMessage.waitForDisplayed({ timeout: timeout / 2 });
                // Wait additional time for the message to fully load
                await browser.pause(this.searchWaitTimes.productCountMessage);
                return await this.getProductCountFromMessage();
            } catch (error) {
                console.log(`Primary selector failed, trying alternative...`);
                
                // Try alternative selector
                countMessage = await this.productCountMessageAlt();
                await countMessage.waitForDisplayed({ timeout: timeout / 2 });
                await browser.pause(this.searchWaitTimes.productCountMessage);
                return await this.getProductCountFromMessage();
            }
              } catch (error) {
            console.log(`Product count message not found within ${timeout}ms: ${error.message}`);
            return 0;
        }
    },

    // Helper method to check if element is visible (not hidden by class)
    async isElementVisible(element) {
        try {
            if (!(await element.isExisting())) {
                return false;
            }
            
            // Check if element has 'hidden' class
            const classList = await element.getAttribute('class');
            if (classList && classList.includes('hidden')) {
                return false;
            }
            
            // Check if element is displayed
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    },

    // Helper method to wait for element to become visible (not hidden)
    async waitForElementVisible(element, timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (await this.isElementVisible(element)) {
                return true;
            }
            await browser.pause(200); // Check every 200ms
        }
        
        return false;
    },

    // Helper method to wait for search results to appear
    async waitForSearchResults(timeout = 15000) {
        try {
            const searchResultsTitle = await this.searchResultsTitle();
            
            // Wait for the element to exist first
            await searchResultsTitle.waitForExist({ timeout: timeout / 2 });
            
            // Then wait for it to become visible (not hidden)
            const isVisible = await this.waitForElementVisible(searchResultsTitle, timeout / 2);
            
            if (isVisible) {
                // Additional wait for content to load
                await browser.pause(this.searchWaitTimes.resultLoad);
                return true;
            }
            
            return false;
        } catch (error) {
            console.log(`Search results not visible within ${timeout}ms: ${error.message}`);
            return false;
        }
    }
};
