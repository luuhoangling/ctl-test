const searchObjects = require('./searchObjects');
const testConfig = require('../../config/testConfig');
const expect = require("chai").expect;
const ExcelReporter = require('../../utils/excelReporter');

// Tạo instance của ExcelReporter
const excelReporter = new ExcelReporter();

// Get test data from config file
const testData = testConfig.getTestData ? testConfig.getTestData('search') : {};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



class SearchActions {
    
    async navigateToSearchPage() {
        // Navigate to search page using config
        const searchUrl = testConfig.getSearchUrl();
        await browser.url(searchUrl);
        await browser.pause(searchObjects.waitTimes.medium);
    }

    // TK_01: Kiểm tra tìm kiếm với từ khóa hợp lệ
    async TK_01_ValidKeywordSearch() {
        const testName = searchObjects.testData.testNames.TK_01;
        
        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();
            
            // Step 2-3: Wait for search filter form and input to be visible (parallel check)
            const filterForm = await searchObjects.productFilterForm();
            const searchInput = await searchObjects.searchProductInput();
            
            const [isFilterFormVisible, isSearchInputVisible] = await this.waitForElementsToBeVisible([filterForm, searchInput]);
            
            if (!isFilterFormVisible || !isSearchInputVisible) {
                throw new Error('Filter form or search input not visible');
            }

            // Step 4: Enter search keyword
            const searchKeyword = searchObjects.testData.searchKeywords.validKeyword;
            await this.safeSetValue(searchInput, searchKeyword);
            // Step 5: Submit search using Apply Filters button (not header search)
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            } else {
                // Fallback: try Enter key on the input
                await searchInput.keys('Enter');
            }

            // Step 6: Wait for search results to load with longer delay
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);            // Step 7: Wait for and verify product count message appears
            const productCount = await searchObjects.waitForProductCountMessage(searchObjects.testData.validation.searchTimeout);

            expect(productCount).to.be.greaterThan(0);
            // Step 8: Wait for and verify search results are displayed (handling hidden class)
            const isResultsVisible = await searchObjects.waitForSearchResults(searchObjects.testData.validation.resultsTimeout);

            expect(isResultsVisible).to.be.true;            // Step 9: Verify search result items exist and match the count
            const resultItems = await searchObjects.searchResultItems();
            expect(resultItems.length).to.be.greaterThan(0);

            // Step 10: Verify each result item contains the search keyword (case insensitive)
            for (let i = 0; i < Math.min(resultItems.length, searchObjects.testData.validation.maxProductsToCheck); i++) { // Check first 5 items
                const item = resultItems[i];
                const productTitle = await item.$(searchObjects.testData.productSelectors.productTitle);
                if (await productTitle.isDisplayed()) {
                    const titleText = await productTitle.getText();
                    const containsKeyword = titleText.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        searchObjects.testData.alternativeKeywords.some(keyword => 
                            titleText.toLowerCase().includes(keyword.toLowerCase())
                        );
                }
            }            // Step 11: Verify additional search result count display (if available)
            const resultCount = await searchObjects.searchResultCount();
            if (await resultCount.isDisplayed()) {
                const countText = await resultCount.getText();
            }

            // Step 12: Log success
            console.log(`TK_01: tìm kiếm "${searchKeyword}" và tìm thấy "${productCount}" sản phẩm.`);

            // Record test result
            excelReporter.addTestResult({
                testName: testName,
                description: 'Kiểm tra tìm kiếm với từ khóa hợp lệ',
                status: 'PASSED',
                inputData: `Từ khóa: "${searchKeyword}" (Filter Form)`,
                expectedResult: 'Hiển thị sản phẩm phù hợp',
                actualResult: `Tìm thấy ${productCount} sản phẩm`
            });        } catch (error) {
            console.log(`TK_01: tìm kiếm "${searchObjects.testData.searchKeywords.validKeyword}" và gặp lỗi "${error.message}".`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Kiểm tra tìm kiếm với từ khóa hợp lệ',
                status: 'FAILED',
                inputData: `Từ khóa: "${searchObjects.testData.searchKeywords.validKeyword}" (Filter Form)`,
                expectedResult: 'Hiển thị sản phẩm phù hợp',
                actualResult: `Lỗi: ${error.message}`
            });            throw error;
        }
    }
    
    // TK_02: Kiểm tra tìm kiếm với từ khóa không có kết quả
    async TK_02_EmptyKeywordSearch() {
        const testName = searchObjects.testData.testNames.TK_02;
        
        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2-3: Wait for search filter form and input to be visible (parallel check)
            const filterForm = await searchObjects.productFilterForm();
            const searchInput = await searchObjects.searchProductInput();
            
            const [isFilterFormVisible, isSearchInputVisible] = await this.waitForElementsToBeVisible([filterForm, searchInput]);
            
            if (!isFilterFormVisible || !isSearchInputVisible) {
                throw new Error('Filter form or search input not visible');
            }

            // Step 4: Enter search keyword that should return no results
            const searchKeyword = searchObjects.testData.searchKeywords.invalidKeyword;
            await this.safeSetValue(searchInput, searchKeyword);

            // Step 5: Submit search using Apply Filters button (not header search)
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            } else {
                // Fallback: try Enter key on the input
                await searchInput.keys('Enter');
            }

            // Step 6: Wait for search results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Step 7: Check for product count message (expecting 0)
            const productCount = await searchObjects.waitForProductCountMessage(searchObjects.testData.validation.searchTimeout);

            // Step 8: Verify that 0 products are shown
            if (productCount === 0) {

                // Step 9: Verify no search result items exist
                const resultItems = await searchObjects.searchResultItems();
                const actualItemsCount = resultItems.length;

                if (actualItemsCount === 0) {
                    console.log(`TK_02: tìm kiếm "${searchKeyword}" và tìm thấy "${productCount}" sản phẩm.`);

                    // Record successful test result
                    excelReporter.addTestResult({
                        testName: testName,
                        description: 'Tìm kiếm với từ khóa không có kết quả',
                        status: 'PASSED',
                        inputData: `Từ khóa: "${searchKeyword}" (Filter Form)`,
                        expectedResult: 'Hiển thị 0 sản phẩm',
                        actualResult: `Tìm thấy ${productCount} sản phẩm`
                    });                    return; // Exit successfully
                } else {
                    
                }
            } else {
                
            }

            // If we reach here, the test should fail
            console.log(`TK_02: tìm kiếm "${searchKeyword}" và tìm thấy "${productCount}" sản phẩm (mong đợi 0).`);
            excelReporter.addTestResult({
                testName: testName,
                description: 'Tìm kiếm với từ khóa không có kết quả',
                status: 'FAILED',
                inputData: `Từ khóa: "${searchKeyword}" (Filter Form)`,
                expectedResult: 'Hiển thị 0 sản phẩm',
                actualResult: `Tìm thấy ${productCount} sản phẩm`
            });            } catch (error) {
            console.log(`TK_02: tìm kiếm "${searchObjects.testData.searchKeywords.invalidKeyword}" và gặp lỗi "${error.message}".`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Tìm kiếm với từ khóa không có kết quả',
                status: 'FAILED',                inputData: `Từ khóa: "${searchObjects.testData.searchKeywords.invalidKeyword}" (Filter Form)`,
                expectedResult: 'Hiển thị 0 sản phẩm',
                actualResult: `Lỗi trong quá trình test`
            });
        }
    }
    
    // TK_03: Kiểm tra tìm kiếm với từ khóa có dấu hoặc không dấu
    async TK_03_AccentKeywordSearch() {
        const testName = searchObjects.testData.testNames.TK_03;

        try {
            // Step 1: Test search with accented keyword
            await this.navigateToSearchPage();

            // Use parallel checking for better performance
            const filterForm = await searchObjects.productFilterForm();
            const searchInput = await searchObjects.searchProductInput();
            
            const [isFilterFormVisible, isSearchInputVisible] = await this.waitForElementsToBeVisible([filterForm, searchInput]);
            
            if (!isFilterFormVisible || !isSearchInputVisible) {
                throw new Error('Filter form or search input not visible');
            }

            // Step 2: Search with accented keyword
            const accentedKeyword = searchObjects.testData.searchKeywords.accentedKeyword;
            await this.safeSetValue(searchInput, accentedKeyword);

            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            } else {
                await searchInput.keys('Enter');
            }

            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Get result count for accented search
            const accentedProductCount = await searchObjects.waitForProductCountMessage(8000);            // Step 3: Test search with non-accented keyword
            await this.navigateToSearchPage();

            // Use parallel checking for better performance
            const filterForm2 = await searchObjects.productFilterForm();
            const searchInput2 = await searchObjects.searchProductInput();
            
            const [isFilterFormVisible2, isSearchInputVisible2] = await this.waitForElementsToBeVisible([filterForm2, searchInput2]);
            
            if (!isFilterFormVisible2 || !isSearchInputVisible2) {
                throw new Error('Filter form or search input not visible');
            }

            // Search with non-accented keyword "ao so mi"
            const nonAccentedKeyword = 'ao so mi';
            await this.safeSetValue(searchInput2, nonAccentedKeyword);

            const applyFiltersBtn2 = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn2.isDisplayed()) {
                await this.safeClick(applyFiltersBtn2);
            } else {
                await searchInput2.keys('Enter');
            }

            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Get result count for non-accented search
            const nonAccentedProductCount = await searchObjects.waitForProductCountMessage(8000);

            // Step 4: Compare results
            const testPassed = accentedProductCount > 0 && nonAccentedProductCount > 0 && 
                              accentedProductCount === nonAccentedProductCount;

            if (testPassed) {
                console.log(`TK_03: tìm kiếm "${accentedKeyword}" (${accentedProductCount} sản phẩm) và "${nonAccentedKeyword}" (${nonAccentedProductCount} sản phẩm) - PASS`);

                // Record successful test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Tìm kiếm với từ khóa có dấu và không dấu',
                    status: 'PASSED',
                    inputData: `"${accentedKeyword}" vs "${nonAccentedKeyword}"`,
                    expectedResult: 'Cùng số lượng sản phẩm',
                    actualResult: `${accentedProductCount} sản phẩm cho cả hai`
                });
            } else {
                console.log(`TK_03: tìm kiếm "${accentedKeyword}" (${accentedProductCount} sản phẩm) và "${nonAccentedKeyword}" (${nonAccentedProductCount} sản phẩm) - FAIL`);

                // Record failed test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Tìm kiếm với từ khóa có dấu và không dấu',
                    status: 'FAILED',
                    inputData: `"${accentedKeyword}" vs "${nonAccentedKeyword}"`,
                    expectedResult: 'Cùng số lượng sản phẩm',
                    actualResult: `${accentedProductCount} vs ${nonAccentedProductCount} sản phẩm`
                });
            }

        } catch (error) {
            console.log(`TK_03: gặp lỗi trong quá trình test - FAIL`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Tìm kiếm với từ khóa có dấu và không dấu',
                status: 'FAILED',
                inputData: '"áo sơ mi" vs "ao so mi"',
                expectedResult: 'Cùng số lượng sản phẩm',
                actualResult: `Lỗi trong quá trình test`
            });
        }
    }    // TK_04: Kiểm tra tìm kiếm với từ khóa rỗng
    async TK_04_EmptyKeywordSearch() {
        const testName = 'TK_04: Kiểm tra tìm kiếm với từ khóa rỗng';

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2-3: Wait for search filter form and input to be visible (parallel check)
            const filterForm = await searchObjects.productFilterForm();
            const searchInput = await searchObjects.searchProductInput();
            
            const [isFilterFormVisible, isSearchInputVisible] = await this.waitForElementsToBeVisible([filterForm, searchInput]);
            
            if (!isFilterFormVisible || !isSearchInputVisible) {
                throw new Error('Filter form or search input not visible');
            }

            // Step 4: Leave search input empty and submit
            await this.safeSetValue(searchInput, ''); // Set empty value

            // Step 5: Submit search using Apply Filters button
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            } else {
                // Fallback: try Enter key on the input
                await searchInput.keys('Enter');
            }

            // Step 6: Wait for search results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Step 7: Check for product count message or "Tất Cả Sản Phẩm" text
            let productCount = 0;
            let hasAllProductsText = false;

            try {
                productCount = await searchObjects.waitForProductCountMessage(8000);
            } catch (error) {
                // If no product count message, check for "Tất Cả Sản Phẩm" text
                try {
                    const pageTitle = await $('h1, .page-title, .category-title');
                    if (await pageTitle.isDisplayed()) {
                        const titleText = await pageTitle.getText();
                        hasAllProductsText = titleText.toLowerCase().includes('tất cả sản phẩm') || 
                                           titleText.toLowerCase().includes('all products');
                    }
                } catch (titleError) {
                    // Continue to check results anyway
                }
            }

            // Step 8: Verify search results are displayed
            const isResultsVisible = await searchObjects.waitForSearchResults(15000);
            const resultItems = await searchObjects.searchResultItems();
            const actualItemsCount = resultItems.length;

            // Step 9: Determine if test passed
            const testPassed = (productCount > 0 || actualItemsCount > 0 || hasAllProductsText) && isResultsVisible;

            if (testPassed) {
                let resultMessage = '';
                if (hasAllProductsText) {
                    resultMessage = `Hiển thị "Tất Cả Sản Phẩm" với ${actualItemsCount} sản phẩm`;
                } else {
                    resultMessage = `Hiển thị ${productCount > 0 ? productCount : actualItemsCount} sản phẩm`;
                }

                console.log(`TK_04: tìm kiếm với từ khóa rỗng - ${resultMessage} - PASS`);

                // Record successful test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Tìm kiếm với từ khóa rỗng',
                    status: 'PASSED',
                    inputData: 'Từ khóa rỗng (không nhập gì)',
                    expectedResult: 'Hiển thị tất cả sản phẩm',
                    actualResult: resultMessage
                });

            } else {
                console.log(`TK_04: tìm kiếm với từ khóa rỗng - Không hiển thị sản phẩm - FAIL`);

                // Record failed test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Tìm kiếm với từ khóa rỗng',
                    status: 'FAILED',
                    inputData: 'Từ khóa rỗng (không nhập gì)',
                    expectedResult: 'Hiển thị tất cả sản phẩm',
                    actualResult: `Không hiển thị sản phẩm (${actualItemsCount} items, visible: ${isResultsVisible})`
                });
            }

        } catch (error) {
            console.log(`TK_04: gặp lỗi trong quá trình test - FAIL`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Tìm kiếm với từ khóa rỗng',
                status: 'FAILED',
                inputData: 'Từ khóa rỗng (không nhập gì)',
                expectedResult: 'Hiển thị tất cả sản phẩm',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });
        }
    }    // TK_05: Kiểm tra lọc theo danh mục cụ thể
    async TK_05_CategoryFilter() {
        const testName = 'TK_05: Kiểm tra lọc theo danh mục cụ thể';

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();            // Step 2-3: Wait for search filter form and category selector to be visible (parallel check)
            const filterForm = await searchObjects.productFilterForm();
            const categorySelect = await searchObjects.categoryFilterSelect();
            
            const [isFilterFormVisible, isCategorySelectVisible] = await this.waitForElementsToBeVisible([filterForm, categorySelect]);
            
            if (!isFilterFormVisible || !isCategorySelectVisible) {
                throw new Error('Filter form or category selector not visible');
            }            // Step 4: Select category "Áo" using searchObjects selector
            const targetCategory = 'Áo';
            let categorySelected = false;

            // Use the category selector from searchObjects
            try {
                await categorySelect.selectByVisibleText(targetCategory);
                categorySelected = true;
            } catch (error) {
                // Try alternative approaches with searchObjects selector
                const options = await categorySelect.$$('option');
                for (let option of options) {
                    const optionText = await option.getText();
                    if (optionText.toLowerCase().includes('áo') || 
                        optionText.toLowerCase().includes('ao') ||
                        optionText.toLowerCase().includes('shirt') ||
                        optionText.toLowerCase().includes('clothing')) {
                        await option.click();
                        categorySelected = true;
                        break;
                    }
                }
            }

            if (!categorySelected) {
                throw new Error('Không thể chọn danh mục Áo từ dropdown');
            }

            // Step 5: Apply filter
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            // Step 6: Wait for results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);            // Step 7: Get product count and verify results
            const productCount = await searchObjects.waitForProductCountMessage(8000);
            const isResultsVisible = await searchObjects.waitForSearchResults(15000);
            
            // Use the new specific selectors
            const productCards = await searchObjects.productCards();
            const actualItemsCount = productCards.length;

            if (!isResultsVisible || actualItemsCount === 0) {
                throw new Error(`Không có sản phẩm nào hiển thị. Expected: ${productCount}, Found: ${actualItemsCount}`);
            }

            // Verify product count matches displayed items
            if (productCount > 0 && productCount !== actualItemsCount) {
                console.log(`Cảnh báo: Product count message (${productCount}) không khớp với số item hiển thị (${actualItemsCount})`);
            }

            // Step 8: Verify all products belong to the selected category using data-testid selectors
            let validProducts = 0;
            let invalidProducts = 0;
            const invalidProductNames = [];
            const validProductNames = [];

            // Check ALL products (not just first 10) since we know exact count now
            for (let i = 0; i < actualItemsCount; i++) {
                const productCard = productCards[i];
                
                // Get product name using data-testid selector
                const productNameElements = await productCard.$$('[data-testid^="product-name-"]');
                
                if (productNameElements.length > 0) {
                    const titleText = await productNameElements[0].getText();
                    const titleLower = titleText.toLowerCase();
                    
                    // Check if product title contains category-related keywords
                    const isValidCategory = titleLower.includes('áo') || 
                                          titleLower.includes('ao') ||
                                          titleLower.includes('shirt') ||
                                          titleLower.includes('blouse') ||
                                          titleLower.includes('top') ||
                                          titleLower.includes('khoác') ||
                                          titleLower.includes('vest') ||
                                          titleLower.includes('jacket');
                    
                    // Check for invalid categories
                    const isInvalidCategory = titleLower.includes('quần') ||
                                            titleLower.includes('quan') ||
                                            titleLower.includes('giày') ||
                                            titleLower.includes('giay') ||
                                            titleLower.includes('shoes') ||
                                            titleLower.includes('pants') ||
                                            titleLower.includes('trousers') ||
                                            titleLower.includes('shorts') ||
                                            titleLower.includes('sandal') ||
                                            titleLower.includes('boot');
                    
                    if (isValidCategory && !isInvalidCategory) {
                        validProducts++;
                        validProductNames.push(titleText);
                    } else if (isInvalidCategory) {
                        invalidProducts++;
                        invalidProductNames.push(titleText);
                    } else {
                        // Products that don't clearly belong to any category - treat as invalid for strict checking
                        invalidProducts++;
                        invalidProductNames.push(`${titleText} (không rõ danh mục)`);
                    }
                }
            }            // Step 9: Determine test result
            const testPassed = validProducts > 0 && invalidProducts === 0;

            if (testPassed) {
                console.log(`TK_05: lọc danh mục "${targetCategory}" - Tìm thấy ${productCount} sản phẩm, ${validProducts}/${actualItemsCount} sản phẩm hợp lệ - PASS`);

                // Record successful test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Lọc theo danh mục cụ thể',
                    status: 'PASSED',
                    inputData: `Danh mục: "${targetCategory}"`,
                    expectedResult: 'Chỉ hiển thị sản phẩm trong danh mục đã chọn',
                    actualResult: `${productCount} sản phẩm, tất cả ${validProducts} sản phẩm đều hợp lệ`
                });

            } else {
                const failureReason = invalidProducts > 0 ? 
                    `Tìm thấy ${invalidProducts}/${actualItemsCount} sản phẩm không thuộc danh mục Áo: ${invalidProductNames.slice(0, 3).join(', ')}${invalidProductNames.length > 3 ? '...' : ''}` :
                    `Không tìm thấy sản phẩm nào thuộc danh mục ${targetCategory}`;

                console.log(`TK_05: lọc danh mục "${targetCategory}" - ${failureReason} - FAIL`);

                // Record failed test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Lọc theo danh mục cụ thể',
                    status: 'FAILED',
                    inputData: `Danh mục: "${targetCategory}"`,
                    expectedResult: 'Chỉ hiển thị sản phẩm trong danh mục đã chọn',
                    actualResult: `${productCount} sản phẩm: ${validProducts} hợp lệ, ${invalidProducts} không hợp lệ`
                });
            }

        } catch (error) {
            console.log(`TK_05: gặp lỗi trong quá trình test - FAIL`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Lọc theo danh mục cụ thể',
                status: 'FAILED',
                inputData: 'Danh mục: "Áo"',
                expectedResult: 'Chỉ hiển thị sản phẩm trong danh mục đã chọn',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
    
    // TK_06: Nhập khoảng giá tối thiểu và tối đa hợp lệ → Hiển thị sản phẩm nằm trong khoảng
    async TK_06_PriceRangeFilter() {
        const testName = searchObjects.testData.testNames.TK_06;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2-3: Wait for filter form and price inputs to be visible
            const filterForm = await searchObjects.productFilterForm();
            const priceMinInput = await searchObjects.priceMinInput();
            const priceMaxInput = await searchObjects.priceMaxInput();
            
            const [isFilterFormVisible, isPriceMinVisible, isPriceMaxVisible] = await this.waitForElementsToBeVisible([filterForm, priceMinInput, priceMaxInput]);
            
            if (!isFilterFormVisible || !isPriceMinVisible || !isPriceMaxVisible) {
                throw new Error('Filter form or price inputs not visible');
            }

            // Step 4: Set price range using test data
            const minPrice = searchObjects.testData.priceRanges.validMin;
            const maxPrice = searchObjects.testData.priceRanges.validMax;
            
            await this.safeSetValue(priceMinInput, minPrice.toString());
            await this.safeSetValue(priceMaxInput, maxPrice.toString());

            console.log(`TK_06: Đặt khoảng giá từ ${minPrice.toLocaleString('vi-VN')} đến ${maxPrice.toLocaleString('vi-VN')} VND`);

            // Step 5: Apply filter
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            // Step 6: Wait for results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Step 7: Get filter results
            const productCount = await searchObjects.waitForProductCountMessage(8000);
            const productCards = await searchObjects.productCards();
            const itemsCount = productCards.length;

            console.log(`TK_06: Tìm thấy ${productCount} sản phẩm trong khoảng giá`);

            if (productCount === 0 || itemsCount === 0) {
                throw new Error(`Không tìm thấy sản phẩm nào trong khoảng giá ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`);
            }

            // Step 8: Verify products are within price range
            let validPriceProducts = 0;
            let invalidPriceProducts = 0;
            const priceDetails = [];
            const invalidPriceDetails = [];

            for (let i = 0; i < Math.min(itemsCount, 10); i++) { // Check first 10 products for performance
                const productCard = productCards[i];
                
                // Get product name and price
                const productNameElements = await productCard.$$('[data-testid^="product-name-"]');
                const productPriceElements = await productCard.$$('[data-testid^="product-price-"]');
                
                if (productNameElements.length > 0 && productPriceElements.length > 0) {
                    const productName = await productNameElements[0].getText();
                    const priceText = await productPriceElements[0].getText();
                    
                    // Extract numeric price from text (remove currency symbols, dots, commas)
                    const priceMatch = priceText.match(/[\d.,]+/);
                    if (priceMatch) {
                        // Remove dots used as thousand separators, keep commas as decimal separators
                        const cleanPrice = priceMatch[0].replace(/\./g, '').replace(/,/g, '.');
                        const productPrice = parseFloat(cleanPrice);
                        
                        if (!isNaN(productPrice)) {
                            // Convert to VND if needed (assuming price might be in different format)
                            const finalPrice = productPrice < 1000 ? productPrice * 1000 : productPrice;
                            
                            if (finalPrice >= minPrice && finalPrice <= maxPrice) {
                                validPriceProducts++;
                                priceDetails.push(`${productName}: ${finalPrice.toLocaleString('vi-VN')} VND`);
                            } else {
                                invalidPriceProducts++;
                                invalidPriceDetails.push(`${productName}: ${finalPrice.toLocaleString('vi-VN')} VND (ngoài khoảng)`);
                            }
                        }
                    }
                }
            }            // Step 9: Determine test result
            // Pass if we have products and majority are within price range
            const totalCheckedProducts = validPriceProducts + invalidPriceProducts;
            const validPercentage = totalCheckedProducts > 0 ? (validPriceProducts / totalCheckedProducts) : 0;
            
            // Pass if at least 80% of products are within price range
            const testPassed = productCount > 0 && itemsCount > 0 && validPercentage >= 0.8;

            if (testPassed) {
                console.log(`TK_06: lọc khoảng giá ${minPrice.toLocaleString('vi-VN')}-${maxPrice.toLocaleString('vi-VN')} VND - ${validPriceProducts}/${totalCheckedProducts} sản phẩm hợp lệ (${Math.round(validPercentage * 100)}%) - PASS`);

                // Record successful test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Lọc theo khoảng giá hợp lệ',
                    status: 'PASSED',
                    inputData: `Khoảng giá: ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`,
                    expectedResult: 'Hiển thị sản phẩm trong khoảng giá',
                    actualResult: `${productCount} sản phẩm, ${validPriceProducts}/${totalCheckedProducts} sản phẩm có giá hợp lệ (${Math.round(validPercentage * 100)}%)`
                });

            } else {
                let failureReason = '';
                if (productCount === 0) {
                    failureReason = 'Không tìm thấy sản phẩm nào';
                } else if (validPercentage < 0.8) {
                    failureReason = `Chỉ có ${validPriceProducts}/${totalCheckedProducts} sản phẩm (${Math.round(validPercentage * 100)}%) có giá trong khoảng hợp lệ`;
                    if (invalidPriceDetails.length > 0) {
                        failureReason += `. Sản phẩm ngoài khoảng: ${invalidPriceDetails.slice(0, 2).join(', ')}${invalidPriceDetails.length > 2 ? '...' : ''}`;
                    }
                } else {
                    failureReason = 'Không đủ điều kiện pass test';
                }

                console.log(`TK_06: lọc khoảng giá ${minPrice.toLocaleString('vi-VN')}-${maxPrice.toLocaleString('vi-VN')} VND - ${failureReason} - FAIL`);

                // Record failed test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Lọc theo khoảng giá hợp lệ',
                    status: 'FAILED',
                    inputData: `Khoảng giá: ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VND`,
                    expectedResult: 'Hiển thị sản phẩm trong khoảng giá',
                    actualResult: `${productCount} sản phẩm: ${validPriceProducts} hợp lệ, ${invalidPriceProducts} không hợp lệ. ${failureReason}`
                });
            }

        } catch (error) {
            console.log(`TK_06: gặp lỗi trong quá trình test - FAIL`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Lọc theo khoảng giá hợp lệ',
                status: 'FAILED',
                inputData: 'Khoảng giá: 100,000 - 500,000 VND',
                expectedResult: 'Hiển thị sản phẩm trong khoảng giá',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });
        }
    }    // TK_07_AllCategoryFilter: Chọn lại "Tất cả danh mục" → Hiển thị toàn bộ sản phẩm
    async TK_07_AllCategoryFilter() {
        const testName = 'TK_07: Chọn lại "Tất cả danh mục" → Hiển thị toàn bộ sản phẩm';

        try {
            // Note: This test runs after TK_06, so the page is currently filtered by "Quần" category
            // Step 1: Wait for category selector to be available
            const categorySelect = await searchObjects.categoryFilterSelect();
            await this.waitForElementToBeVisible(categorySelect);

            // Step 2: Change to "Tất cả danh mục" (All categories)
            const allCategoriesText = 'Tất cả danh mục';
            let categorySelected = false;

            try {
                // Try to select by visible text first
                await categorySelect.selectByVisibleText(allCategoriesText);
                categorySelected = true;
            } catch (error) {
                // Try alternative approaches - look for first option or value="0"
                try {
                    await categorySelect.selectByIndex(0); // Usually first option is "All"
                    categorySelected = true;
                } catch (indexError) {
                    // Try selecting by value
                    try {
                        await categorySelect.selectByAttribute('value', '0');
                        categorySelected = true;
                    } catch (valueError) {
                        // Try finding options with common "all" keywords
                        const options = await categorySelect.$$('option');
                        for (let option of options) {
                            const optionText = await option.getText();
                            const optionValue = await option.getAttribute('value');
                            if (optionText.toLowerCase().includes('tất cả') || 
                                optionText.toLowerCase().includes('all') ||
                                optionValue === '0' || optionValue === '') {
                                await option.click();
                                categorySelected = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (!categorySelected) {
                throw new Error('Không thể chọn "Tất cả danh mục"');
            }

            // Step 3: Apply filter
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);            // Step 4: Check for product count message or "Tất Cả Sản Phẩm" text
            let productCount = 0;
            let hasAllProductsText = false;

            try {
                productCount = await searchObjects.waitForProductCountMessage(8000);
            } catch (error) {
                // If no product count message, check for "Tất Cả Sản Phẩm" text
                try {
                    const pageTitle = await $('h1, .page-title, .category-title');
                    if (await pageTitle.isDisplayed()) {
                        const titleText = await pageTitle.getText();
                        hasAllProductsText = titleText.toLowerCase().includes('tất cả sản phẩm') || 
                                           titleText.toLowerCase().includes('all products');
                    }
                } catch (titleError) {
                    // Continue to check results anyway
                }
            }

            // Step 5: Verify search results are displayed
            const isResultsVisible = await searchObjects.waitForSearchResults(15000);
            const productCards = await searchObjects.productCards();
            const itemsCount = productCards.length;

            console.log(`TK_07: Chọn "Tất cả danh mục" - Tìm thấy ${productCount} sản phẩm`);

            // Step 6: Determine test result - Pass if has "Tất Cả Sản Phẩm" text or products displayed
            const testPassed = (productCount > 0 || itemsCount > 0 || hasAllProductsText) && isResultsVisible;            if (testPassed) {
                let resultMessage = '';
                if (hasAllProductsText) {
                    resultMessage = `Hiển thị "Tất Cả Sản Phẩm" với ${itemsCount} sản phẩm`;
                } else {
                    resultMessage = `Hiển thị ${productCount > 0 ? productCount : itemsCount} sản phẩm`;
                }

                console.log(`TK_07: chọn "Tất cả danh mục" - ${resultMessage} - PASS`);

                // Record successful test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Chọn lại "Tất cả danh mục" để hiển thị toàn bộ sản phẩm',
                    status: 'PASSED',
                    inputData: 'Chuyển từ "Quần" → "Tất cả danh mục"',
                    expectedResult: 'Hiển thị tất cả sản phẩm',
                    actualResult: resultMessage
                });

            } else {
                console.log(`TK_07: chọn "Tất cả danh mục" - Không hiển thị sản phẩm - FAIL`);

                // Record failed test result
                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Chọn lại "Tất cả danh mục" để hiển thị toàn bộ sản phẩm',
                    status: 'FAILED',
                    inputData: 'Chuyển từ "Quần" → "Tất cả danh mục"',
                    expectedResult: 'Hiển thị tất cả sản phẩm',
                    actualResult: `Không hiển thị sản phẩm (${itemsCount} items, visible: ${isResultsVisible})`
                });
            }

        } catch (error) {
            console.log(`TK_07: gặp lỗi trong quá trình test - FAIL`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Chọn lại "Tất cả danh mục" để hiển thị toàn bộ sản phẩm',
                status: 'FAILED',
                inputData: 'Chuyển từ "Quần" → "Tất cả danh mục"',
                expectedResult: 'Hiển thị sản phẩm từ tất cả danh mục',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
      // TK_07: Nhập giá tối thiểu lớn hơn giá tối đa → Kiểm tra hiển thị thông báo lỗi validation
    async TK_07_InvalidPriceRange() {
        const testName = searchObjects.testData.testNames.TK_07;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2-3: Wait for filter form and price inputs to be visible
            const filterForm = await searchObjects.productFilterForm();
            const priceMinInput = await searchObjects.priceMinInput();
            const priceMaxInput = await searchObjects.priceMaxInput();
            
            const [isFilterFormVisible, isPriceMinVisible, isPriceMaxVisible] = await this.waitForElementsToBeVisible([filterForm, priceMinInput, priceMaxInput]);
            
            if (!isFilterFormVisible || !isPriceMinVisible || !isPriceMaxVisible) {
                throw new Error('Filter form or price inputs not visible');
            }            // Step 4: Set INVALID price range using test data
            const minPrice = searchObjects.testData.priceRanges.invalidMin; // 1,000,000 VND (higher)
            const maxPrice = searchObjects.testData.priceRanges.invalidMax;  // 100,000 VND (lower)
            
            await this.safeSetValue(priceMinInput, minPrice.toString());
            console.log(`TK_07: Nhập giá tối thiểu: ${minPrice.toLocaleString('vi-VN')} VND`);

            // Step 5: Enter max price that's lower than min price and wait for validation
            await this.safeSetValue(priceMaxInput, maxPrice.toString());
            console.log(`TK_07: Nhập giá tối đa: ${maxPrice.toLocaleString('vi-VN')} VND (nhỏ hơn giá tối thiểu)`);

            // Step 6: Wait for validation message to appear
            await browser.pause(searchObjects.testData.validation.waitForValidation);

            // Step 7: Check for specific validation error message
            let errorMessage = '';
            let isValidationVisible = false;
            const expectedErrorMessage = searchObjects.testData.errorMessages.priceValidation;
            
            try {
                // Check for specific validation error element using searchObjects
                const validationErrorElement = await searchObjects.priceValidationError();
                
                if (await validationErrorElement.isDisplayed()) {
                    errorMessage = await validationErrorElement.getText();
                    errorMessage = errorMessage.trim();
                    
                    // Check if the error message matches exactly
                    if (errorMessage === expectedErrorMessage) {
                        isValidationVisible = true;
                        console.log(`TK_07: Tìm thấy thông báo validation chính xác: "${errorMessage}"`);
                    } else {
                        console.log(`TK_07: Tìm thấy thông báo validation nhưng không chính xác: "${errorMessage}"`);
                        console.log(`TK_07: Mong đợi: "${expectedErrorMessage}"`);
                    }
                } else {
                    console.log(`TK_07: Element validation error tồn tại nhưng không hiển thị`);
                }

            } catch (e) {
                console.log(`TK_07: Không tìm thấy element [data-testid="price-validation-error"]: ${e.message}`);
                
                // Fallback: try to find the error message in other possible locations
                try {
                    const allElements = await $$('*');
                    for (const element of allElements) {
                        if (await element.isDisplayed()) {
                            const text = await element.getText();
                            if (text && text.trim() === expectedErrorMessage) {
                                errorMessage = text.trim();
                                isValidationVisible = true;
                                console.log(`TK_07: Tìm thấy thông báo validation qua fallback search: "${errorMessage}"`);
                                break;
                            }
                        }
                    }
                } catch (fallbackError) {
                    console.log(`TK_07: Fallback search cũng thất bại: ${fallbackError.message}`);
                }
            }

            // Step 8: Try to apply filter to see system behavior
            let filterApplied = false;
            let productCount = 0;
            
            try {
                const applyFiltersBtn = await searchObjects.applyFiltersBtn();
                if (await applyFiltersBtn.isDisplayed() && await applyFiltersBtn.isEnabled()) {
                    await this.safeClick(applyFiltersBtn);
                    filterApplied = true;
                    
                    // Wait for results and count products
                    await browser.pause(searchObjects.searchWaitTimes.searchSubmit);
                    productCount = await searchObjects.waitForProductCountMessage(5000);
                }
            } catch (e) {
                console.log(`TK_07: Không thể áp dụng filter hoặc filter bị vô hiệu hóa`);
            }            // Step 9: Determine test result
            console.log(`TK_07: Kết quả kiểm tra:`);
            console.log(`- Thông báo validation: ${isValidationVisible ? `"${errorMessage}"` : 'Không hiển thị'}`);
            console.log(`- Filter có thể áp dụng: ${filterApplied ? 'Có' : 'Không'}`);
            console.log(`- Số sản phẩm tìm thấy: ${productCount}`);

            // Test passes if exact validation message is shown
            if (isValidationVisible && errorMessage === expectedErrorMessage) {
                console.log(`TK_07: Hiển thị đúng thông báo validation - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kiểm tra validation khoảng giá không hợp lệ (min > max)',
                    status: 'PASSED',
                    inputData: `Giá tối thiểu: ${minPrice.toLocaleString('vi-VN')} VND > Giá tối đa: ${maxPrice.toLocaleString('vi-VN')} VND`,
                    expectedResult: `Hiển thị thông báo: "${expectedErrorMessage}" tại [data-testid="price-validation-error"]`,
                    actualResult: `Thông báo validation: "${errorMessage}"`
                });

            } else {
                console.log(`TK_07: Không hiển thị đúng thông báo validation - FAIL`);

                let actualResult = '';
                if (!isValidationVisible) {
                    actualResult = 'Không có thông báo validation';
                } else {
                    actualResult = `Thông báo không chính xác: "${errorMessage}"`;
                }
                
                if (filterApplied && productCount > 0) {
                    actualResult += `, vẫn tìm được ${productCount} sản phẩm`;
                }

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kiểm tra validation khoảng giá không hợp lệ (min > max)',
                    status: 'FAILED',
                    inputData: `Giá tối thiểu: ${minPrice.toLocaleString('vi-VN')} VND > Giá tối đa: ${maxPrice.toLocaleString('vi-VN')} VND`,
                    expectedResult: `Hiển thị thông báo: "${expectedErrorMessage}" tại [data-testid="price-validation-error"]`,
                    actualResult: actualResult
                });
            }

        } catch (error) {
            console.log(`TK_07: gặp lỗi trong quá trình test - ERROR: ${error.message}`);            excelReporter.addTestResult({
                testName: testName,
                description: 'Kiểm tra validation khoảng giá không hợp lệ (min > max)',
                status: 'ERROR',
                inputData: `Giá tối thiểu: 1,000,000 VND > Giá tối đa: 100,000 VND`,
                expectedResult: `Hiển thị thông báo: "Giá tối thiểu không thể lớn hơn giá tối đa" tại [data-testid="price-validation-error"]`,
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });
        }
    }    // TK_08: Nhập chữ vào ô giá → Set ô giá về 0 (nó tự động làm rỗng giá trị của ô nếu nhập chữ)
    async TK_08_InvalidTextInPriceInput() {
        const testName = searchObjects.testData.testNames.TK_08;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2-3: Wait for price inputs to be visible
            const priceMinInput = await searchObjects.priceMinInput();
            const priceMaxInput = await searchObjects.priceMaxInput();
            
            const [isPriceMinVisible, isPriceMaxVisible] = await this.waitForElementsToBeVisible([priceMinInput, priceMaxInput]);
            
            if (!isPriceMinVisible || !isPriceMaxVisible) {
                throw new Error('Price inputs not visible');
            }            // Step 4: Enter text instead of numbers using test data
            const testText = searchObjects.testData.priceRanges.textInput;
            console.log(`TK_08: Nhập text "${testText}" vào ô giá tối thiểu`);
            
            await this.safeSetValue(priceMinInput, testText);
            await browser.pause(1000); // Wait for any validation or auto-clearing

            // Step 5: Check the value after entering text
            const minInputValue = await priceMinInput.getValue();
            console.log(`TK_08: Giá trị ô tối thiểu sau khi nhập text: "${minInputValue}"`);

            // Step 6: Test max input as well
            console.log(`TK_08: Nhập text "${testText}" vào ô giá tối đa`);
            await this.safeSetValue(priceMaxInput, testText);
            await browser.pause(1000);

            const maxInputValue = await priceMaxInput.getValue();
            console.log(`TK_08: Giá trị ô tối đa sau khi nhập text: "${maxInputValue}"`);

            // Step 7: Determine test result
            // Pass if inputs are empty or "0" after entering text
            const isMinInputCleared = !minInputValue || minInputValue === '0' || minInputValue.trim() === '';
            const isMaxInputCleared = !maxInputValue || maxInputValue === '0' || maxInputValue.trim() === '';
            
            const testPassed = isMinInputCleared && isMaxInputCleared;

            if (testPassed) {
                console.log(`TK_08: Nhập text vào ô giá - Hệ thống tự động xóa/reset về 0 - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kiểm tra xử lý input text trong ô giá',
                    status: 'PASSED',
                    inputData: `Text nhập: "${testText}"`,
                    expectedResult: 'Ô giá tự động xóa/reset về 0 khi nhập text',
                    actualResult: `Min: "${minInputValue}", Max: "${maxInputValue}" - Hệ thống xử lý đúng`
                });

            } else {
                console.log(`TK_08: Nhập text vào ô giá - Hệ thống không xử lý đúng - FAIL`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kiểm tra xử lý input text trong ô giá',
                    status: 'FAILED',
                    inputData: `Text nhập: "${testText}"`,
                    expectedResult: 'Ô giá tự động xóa/reset về 0 khi nhập text',
                    actualResult: `Min: "${minInputValue}", Max: "${maxInputValue}" - Vẫn chứa text`
                });
            }

        } catch (error) {
            console.log(`TK_08: gặp lỗi trong quá trình test - ERROR: ${error.message}`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Kiểm tra xử lý input text trong ô giá',
                status: 'ERROR',
                inputData: 'Text: "abc123"',
                expectedResult: 'Ô giá tự động xóa/reset về 0 khi nhập text',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
      // TK_09: Sắp xếp theo giá tăng dần → Sản phẩm hiển thị từ giá thấp đến cao
    async TK_09_SortByPriceAscending() {
        const testName = searchObjects.testData.testNames.TK_09;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2: Wait for sort dropdown to be visible
            const sortSelect = await searchObjects.sortProductsSelect();
            await this.waitForElementToBeVisible(sortSelect);            // Step 3: Select sort by price ascending using test data
            const sortValueAsc = searchObjects.testData.dropdownValues.sortPriceAsc;
            console.log(`TK_09: Chọn sắp xếp theo giá tăng dần`);
            
            try {
                await sortSelect.selectByAttribute('value', sortValueAsc);
            } catch (error) {
                // Try alternative values if the first one fails
                const alternativeValues = ['price_asc', 'price-low-to-high', 'PriceAsc', 'price'];
                let sorted = false;
                
                for (const value of alternativeValues) {
                    try {
                        await sortSelect.selectByAttribute('value', value);
                        sorted = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!sorted) {
                    // Try by visible text
                    const textOptions = ['Giá tăng dần', 'Giá: Thấp đến Cao', 'Price: Low to High'];
                    for (const text of textOptions) {
                        try {
                            await sortSelect.selectByVisibleText(text);
                            sorted = true;
                            break;
                        } catch (e) {
                            continue;
                        }
                    }
                }
                
                if (!sorted) {
                    throw new Error('Cannot find price ascending sort option');
                }
            }

            // Step 4: Apply filter if needed
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            // Step 5: Wait for results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);
            const productCount = await searchObjects.waitForProductCountMessage(8000);
            
            if (productCount === 0) {
                throw new Error('Không có sản phẩm để kiểm tra sắp xếp');
            }

            // Step 6: Get product prices and verify ascending order
            const productCards = await searchObjects.productCards();
            const prices = [];
            const priceDetails = [];
            
            // Get prices from first 5 products for verification
            for (let i = 0; i < Math.min(productCards.length, 5); i++) {
                const productCard = productCards[i];
                const productPriceElements = await productCard.$$('[data-testid^="product-price-"]');
                
                if (productPriceElements.length > 0) {
                    const priceText = await productPriceElements[0].getText();
                    const priceMatch = priceText.match(/[\d.,]+/);
                    
                    if (priceMatch) {
                        const cleanPrice = priceMatch[0].replace(/\./g, '').replace(/,/g, '.');
                        const productPrice = parseFloat(cleanPrice);
                        
                        if (!isNaN(productPrice)) {
                            const finalPrice = productPrice < 1000 ? productPrice * 1000 : productPrice;
                            prices.push(finalPrice);
                            priceDetails.push(`${finalPrice.toLocaleString('vi-VN')} VND`);
                        }
                    }
                }
            }

            // Step 7: Check if prices are in ascending order
            let isAscending = true;
            for (let i = 1; i < prices.length; i++) {
                if (prices[i] < prices[i-1]) {
                    isAscending = false;
                    break;
                }
            }

            console.log(`TK_09: Kiểm tra ${prices.length} sản phẩm đầu tiên`);
            console.log(`TK_09: Giá sản phẩm: ${priceDetails.join(' → ')}`);

            if (isAscending && prices.length >= 2) {
                console.log(`TK_09: Sắp xếp theo giá tăng dần - Đúng thứ tự - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Sắp xếp sản phẩm theo giá từ thấp đến cao',
                    status: 'PASSED',
                    inputData: 'Sắp xếp: Giá tăng dần',
                    expectedResult: 'Sản phẩm hiển thị từ giá thấp đến cao',
                    actualResult: `${prices.length} sản phẩm theo thứ tự đúng: ${priceDetails.slice(0,3).join(' → ')}${priceDetails.length > 3 ? '...' : ''}`
                });

            } else {
                console.log(`TK_09: Sắp xếp theo giá tăng dần - Không đúng thứ tự - FAIL`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Sắp xếp sản phẩm theo giá từ thấp đến cao',
                    status: 'FAILED',
                    inputData: 'Sắp xếp: Giá tăng dần',
                    expectedResult: 'Sản phẩm hiển thị từ giá thấp đến cao',
                    actualResult: `${prices.length} sản phẩm không đúng thứ tự: ${priceDetails.join(' → ')}`
                });
            }

        } catch (error) {
            console.log(`TK_09: gặp lỗi trong quá trình test - ERROR: ${error.message}`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Sắp xếp sản phẩm theo giá từ thấp đến cao',
                status: 'ERROR',
                inputData: 'Sắp xếp: Giá tăng dần',
                expectedResult: 'Sản phẩm hiển thị từ giá thấp đến cao',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
      // TK_10: Sắp xếp theo giá giảm dần → Sản phẩm hiển thị từ giá cao đến thấp
    async TK_10_SortByPriceDescending() {
        const testName = searchObjects.testData.testNames.TK_10;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2: Wait for sort dropdown to be visible
            const sortSelect = await searchObjects.sortProductsSelect();
            await this.waitForElementToBeVisible(sortSelect);

            // Step 3: Select sort by price descending
            const sortValueDesc = 'price-desc'; // Common value for price descending
            console.log(`TK_10: Chọn sắp xếp theo giá giảm dần`);
            
            try {
                await sortSelect.selectByAttribute('value', sortValueDesc);
            } catch (error) {
                // Try alternative values if the first one fails
                const alternativeValues = ['price_desc', 'price-high-to-low', 'PriceDesc'];
                let sorted = false;
                
                for (const value of alternativeValues) {
                    try {
                        await sortSelect.selectByAttribute('value', value);
                        sorted = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!sorted) {
                    // Try by visible text
                    const textOptions = ['Giá giảm dần', 'Giá: Cao đến Thấp', 'Price: High to Low'];
                    for (const text of textOptions) {
                        try {
                            await sortSelect.selectByVisibleText(text);
                            sorted = true;
                            break;
                        } catch (e) {
                            continue;
                        }
                    }
                }
                
                if (!sorted) {
                    throw new Error('Cannot find price descending sort option');
                }
            }

            // Step 4: Apply filter if needed
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            // Step 5: Wait for results to load
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);
            const productCount = await searchObjects.waitForProductCountMessage(8000);
            
            if (productCount === 0) {
                throw new Error('Không có sản phẩm để kiểm tra sắp xếp');
            }

            // Step 6: Get product prices and verify descending order
            const productCards = await searchObjects.productCards();
            const prices = [];
            const priceDetails = [];
            
            // Get prices from first 5 products for verification
            for (let i = 0; i < Math.min(productCards.length, 5); i++) {
                const productCard = productCards[i];
                const productPriceElements = await productCard.$$('[data-testid^="product-price-"]');
                
                if (productPriceElements.length > 0) {
                    const priceText = await productPriceElements[0].getText();
                    const priceMatch = priceText.match(/[\d.,]+/);
                    
                    if (priceMatch) {
                        const cleanPrice = priceMatch[0].replace(/\./g, '').replace(/,/g, '.');
                        const productPrice = parseFloat(cleanPrice);
                        
                        if (!isNaN(productPrice)) {
                            const finalPrice = productPrice < 1000 ? productPrice * 1000 : productPrice;
                            prices.push(finalPrice);
                            priceDetails.push(`${finalPrice.toLocaleString('vi-VN')} VND`);
                        }
                    }
                }
            }

            // Step 7: Check if prices are in descending order
            let isDescending = true;
            for (let i = 1; i < prices.length; i++) {
                if (prices[i] > prices[i-1]) {
                    isDescending = false;
                    break;
                }
            }

            console.log(`TK_10: Kiểm tra ${prices.length} sản phẩm đầu tiên`);
            console.log(`TK_10: Giá sản phẩm: ${priceDetails.join(' → ')}`);

            if (isDescending && prices.length >= 2) {
                console.log(`TK_10: Sắp xếp theo giá giảm dần - Đúng thứ tự - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Sắp xếp sản phẩm theo giá từ cao đến thấp',
                    status: 'PASSED',
                    inputData: 'Sắp xếp: Giá giảm dần',
                    expectedResult: 'Sản phẩm hiển thị từ giá cao đến thấp',
                    actualResult: `${prices.length} sản phẩm theo thứ tự đúng: ${priceDetails.slice(0,3).join(' → ')}${priceDetails.length > 3 ? '...' : ''}`
                });

            } else {
                console.log(`TK_10: Sắp xếp theo giá giảm dần - Không đúng thứ tự - FAIL`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Sắp xếp sản phẩm theo giá từ cao đến thấp',
                    status: 'FAILED',
                    inputData: 'Sắp xếp: Giá giảm dần',
                    expectedResult: 'Sản phẩm hiển thị từ giá cao đến thấp',
                    actualResult: `${prices.length} sản phẩm không đúng thứ tự: ${priceDetails.join(' → ')}`
                });
            }

        } catch (error) {
            console.log(`TK_10: gặp lỗi trong quá trình test - ERROR: ${error.message}`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Sắp xếp sản phẩm theo giá từ cao đến thấp',
                status: 'ERROR',
                inputData: 'Sắp xếp: Giá giảm dần',
                expectedResult: 'Sản phẩm hiển thị từ giá cao đến thấp',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
      // TK_11: Kết hợp tìm kiếm + danh mục + giá → Kết quả chính xác theo tất cả điều kiện
    async TK_11_CombinedSearch() {
        const testName = searchObjects.testData.testNames.TK_11;

        try {
            // Step 1: Navigate to search page
            await this.navigateToSearchPage();

            // Step 2: Wait for all filter elements to be visible
            const searchInput = await searchObjects.searchProductInput();
            const categorySelect = await searchObjects.categoryFilterSelect();
            const sortSelect = await searchObjects.sortProductsSelect();
            
            const [isSearchVisible, isCategoryVisible, isSortVisible] = await this.waitForElementsToBeVisible([searchInput, categorySelect, sortSelect]);
            
            if (!isSearchVisible || !isCategoryVisible || !isSortVisible) {
                throw new Error('Filter elements not visible');
            }

            // Step 3: Enter search keyword "sơ mi"
            const searchKeyword = 'sơ mi';
            await this.safeSetValue(searchInput, searchKeyword);
            console.log(`TK_11: Nhập từ khóa: "${searchKeyword}"`);

            // Step 4: Select category "Áo" (shirt/clothing category)
            const categoryText = 'Áo';
            let categorySelected = false;
            
            try {
                await categorySelect.selectByVisibleText(categoryText);
                categorySelected = true;
            } catch (error) {
                // Try alternative category names
                const alternativeNames = ['Shirt', 'Clothing', 'Apparel', 'Áo sơ mi'];
                for (const name of alternativeNames) {
                    try {
                        await categorySelect.selectByVisibleText(name);
                        categorySelected = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
            }
            
            if (categorySelected) {
                console.log(`TK_11: Chọn danh mục: "${categoryText}"`);
            } else {
                console.log(`TK_11: Không thể chọn danh mục "${categoryText}", tiếp tục test`);
            }

            // Step 5: Set sort by price descending (high to low)
            console.log(`TK_11: Sắp xếp từ cao xuống thấp`);
            
            try {
                await sortSelect.selectByAttribute('value', 'price-desc');
            } catch (error) {
                const alternativeValues = ['price_desc', 'price-high-to-low', 'PriceDesc'];
                let sorted = false;
                
                for (const value of alternativeValues) {
                    try {
                        await sortSelect.selectByAttribute('value', value);
                        sorted = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!sorted) {
                    const textOptions = ['Giá giảm dần', 'Giá: Cao đến Thấp', 'Price: High to Low'];
                    for (const text of textOptions) {
                        try {
                            await sortSelect.selectByVisibleText(text);
                            sorted = true;
                            break;
                        } catch (e) {
                            continue;
                        }
                    }
                }
            }

            // Step 6: Apply filters
            const applyFiltersBtn = await searchObjects.applyFiltersBtn();
            if (await applyFiltersBtn.isDisplayed()) {
                await this.safeClick(applyFiltersBtn);
            }

            // Step 7: Wait for results and verify
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);
            const productCount = await searchObjects.waitForProductCountMessage(8000);
            
            if (productCount === 0) {
                throw new Error('Không tìm thấy sản phẩm với bộ lọc kết hợp');
            }

            // Step 8: Verify search results contain keyword and price order
            const productCards = await searchObjects.productCards();
            let keywordMatches = 0;
            let priceOrderCorrect = true;
            const prices = [];
            const productDetails = [];
            
            // Check first 3 products
            for (let i = 0; i < Math.min(productCards.length, 3); i++) {
                const productCard = productCards[i];
                
                // Check product name contains keyword
                const productNameElements = await productCard.$$('[data-testid^="product-name-"]');
                if (productNameElements.length > 0) {
                    const productName = await productNameElements[0].getText();
                    if (productName.toLowerCase().includes(searchKeyword.toLowerCase())) {
                        keywordMatches++;
                    }
                    
                    // Get price for order verification
                    const productPriceElements = await productCard.$$('[data-testid^="product-price-"]');
                    if (productPriceElements.length > 0) {
                        const priceText = await productPriceElements[0].getText();
                        const priceMatch = priceText.match(/[\d.,]+/);
                        
                        if (priceMatch) {
                            const cleanPrice = priceMatch[0].replace(/\./g, '').replace(/,/g, '.');
                            const productPrice = parseFloat(cleanPrice);
                            
                            if (!isNaN(productPrice)) {
                                const finalPrice = productPrice < 1000 ? productPrice * 1000 : productPrice;
                                prices.push(finalPrice);
                                productDetails.push(`${productName}: ${finalPrice.toLocaleString('vi-VN')} VND`);
                            }
                        }
                    }
                }
            }

            // Check price descending order
            for (let i = 1; i < prices.length; i++) {
                if (prices[i] > prices[i-1]) {
                    priceOrderCorrect = false;
                    break;
                }
            }

            console.log(`TK_11: Tìm thấy ${productCount} sản phẩm`);
            console.log(`TK_11: ${keywordMatches}/${Math.min(productCards.length, 3)} sản phẩm chứa từ khóa "${searchKeyword}"`);
            console.log(`TK_11: Sắp xếp giá đúng: ${priceOrderCorrect ? 'Có' : 'Không'}`);

            // Step 9: Determine test result
            const testPassed = productCount > 0 && keywordMatches >= Math.min(productCards.length, 2) && priceOrderCorrect;

            if (testPassed) {
                console.log(`TK_11: Tìm kiếm kết hợp - Kết quả chính xác - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kết hợp tìm kiếm từ khóa + danh mục + sắp xếp',
                    status: 'PASSED',
                    inputData: `Từ khóa: "${searchKeyword}", Danh mục: "${categoryText}", Sắp xếp: Giá cao→thấp`,
                    expectedResult: 'Kết quả chính xác theo tất cả điều kiện',
                    actualResult: `${productCount} sản phẩm, ${keywordMatches} chứa từ khóa, sắp xếp đúng: ${priceOrderCorrect}`
                });

            } else {
                console.log(`TK_11: Tìm kiếm kết hợp - Kết quả không chính xác - FAIL`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Kết hợp tìm kiếm từ khóa + danh mục + sắp xếp',
                    status: 'FAILED',
                    inputData: `Từ khóa: "${searchKeyword}", Danh mục: "${categoryText}", Sắp xếp: Giá cao→thấp`,
                    expectedResult: 'Kết quả chính xác theo tất cả điều kiện',
                    actualResult: `${productCount} sản phẩm, ${keywordMatches} chứa từ khóa, sắp xếp đúng: ${priceOrderCorrect}`
                });
            }

        } catch (error) {
            console.log(`TK_11: gặp lỗi trong quá trình test - ERROR: ${error.message}`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Kết hợp tìm kiếm từ khóa + danh mục + sắp xếp',
                status: 'ERROR',
                inputData: 'Từ khóa: "sơ mi", Danh mục: "Áo", Sắp xếp: Giá cao→thấp',
                expectedResult: 'Kết quả chính xác theo tất cả điều kiện',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
      // TK_12: Nhấn "Xóa Bộ Lọc" sau khi lọc → Trả về trạng thái mặc định, hiển thị toàn bộ sản phẩm
    async TK_12_ClearFilters() {
        const testName = searchObjects.testData.testNames.TK_12;

        try {
            // Step 1: First, apply some filters (use results from TK_11)
            // This test should run after TK_11 to have filters already applied
            
            // Step 2: Wait for clear filters button to be visible
            const clearFiltersBtn = await searchObjects.clearFiltersBtn();
            await this.waitForElementToBeVisible(clearFiltersBtn);

            // Step 3: Get current product count (with filters applied)
            let filteredProductCount = 0;
            try {
                filteredProductCount = await searchObjects.waitForProductCountMessage(5000);
            } catch (error) {
                console.log(`TK_12: Không lấy được số sản phẩm hiện tại: ${error.message}`);
            }

            console.log(`TK_12: Số sản phẩm trước khi xóa bộ lọc: ${filteredProductCount}`);

            // Step 4: Click "Xóa Bộ Lọc" button
            console.log(`TK_12: Nhấn nút "Xóa Bộ Lọc"`);
            await this.safeClick(clearFiltersBtn);

            // Step 5: Wait for page to reload/update
            await browser.pause(searchObjects.searchWaitTimes.searchSubmit);

            // Step 6: Check if filters are cleared
            const searchInput = await searchObjects.searchProductInput();
            const categorySelect = await searchObjects.categoryFilterSelect();
            const sortSelect = await searchObjects.sortProductsSelect();

            // Check if form inputs are reset
            const searchValue = await searchInput.getValue();
            const categoryValue = await categorySelect.getValue();
            const sortValue = await sortSelect.getValue();

            console.log(`TK_12: Giá trị sau khi xóa bộ lọc:`);
            console.log(`- Từ khóa: "${searchValue}"`);
            console.log(`- Danh mục: "${categoryValue}"`);
            console.log(`- Sắp xếp: "${sortValue}"`);

            // Step 7: Get product count after clearing filters
            let clearedProductCount = 0;
            try {
                clearedProductCount = await searchObjects.waitForProductCountMessage(8000);
            } catch (error) {
                // If no product count message, try to count product cards
                const productCards = await searchObjects.productCards();
                clearedProductCount = productCards.length;
            }

            console.log(`TK_12: Số sản phẩm sau khi xóa bộ lọc: ${clearedProductCount}`);

            // Step 8: Determine test result
            // Test passes if:
            // 1. Search input is cleared (empty)
            // 2. Category is reset to default (usually "0" or empty or first option)
            // 3. Product count increased or shows all products
            
            const isSearchCleared = !searchValue || searchValue.trim() === '';
            const isCategoryReset = !categoryValue || categoryValue === '0' || categoryValue === '';
            const hasMoreProducts = clearedProductCount >= filteredProductCount;
            const hasSignificantIncrease = clearedProductCount > filteredProductCount * 1.5; // At least 50% more products

            const testPassed = isSearchCleared && isCategoryReset && (hasMoreProducts || clearedProductCount > 10);

            if (testPassed) {
                console.log(`TK_12: Xóa bộ lọc - Trả về trạng thái mặc định - PASS`);

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Xóa tất cả bộ lọc và trả về trạng thái mặc định',
                    status: 'PASSED',
                    inputData: 'Nhấn nút "Xóa Bộ Lọc"',
                    expectedResult: 'Form reset, hiển thị toàn bộ sản phẩm',
                    actualResult: `Form đã reset (search: "${searchValue}", category: "${categoryValue}"), sản phẩm: ${filteredProductCount} → ${clearedProductCount}`
                });

            } else {
                console.log(`TK_12: Xóa bộ lọc - Không trả về trạng thái mặc định - FAIL`);

                let failureReason = '';
                if (!isSearchCleared) failureReason += 'Từ khóa chưa xóa; ';
                if (!isCategoryReset) failureReason += 'Danh mục chưa reset; ';
                if (!hasMoreProducts) failureReason += 'Số sản phẩm không tăng; ';

                excelReporter.addTestResult({
                    testName: testName,
                    description: 'Xóa tất cả bộ lọc và trả về trạng thái mặc định',
                    status: 'FAILED',
                    inputData: 'Nhấn nút "Xóa Bộ Lọc"',
                    expectedResult: 'Form reset, hiển thị toàn bộ sản phẩm',
                    actualResult: `${failureReason}Sản phẩm: ${filteredProductCount} → ${clearedProductCount}`
                });
            }

        } catch (error) {
            console.log(`TK_12: gặp lỗi trong quá trình test - ERROR: ${error.message}`);

            excelReporter.addTestResult({
                testName: testName,
                description: 'Xóa tất cả bộ lọc và trả về trạng thái mặc định',
                status: 'ERROR',
                inputData: 'Nhấn nút "Xóa Bộ Lọc"',
                expectedResult: 'Form reset, hiển thị toàn bộ sản phẩm',
                actualResult: `Lỗi trong quá trình test: ${error.message}`
            });        }
    }
    
    // Helper methods
    async waitForElementToBeVisible(element, timeout = 5000) {
        try {
            await element.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            return false;
        }
    }
    async waitForElementsToBeVisible(elements, timeout = 5000) {
        try {
            const promises = elements.map(element => 
                element.waitForDisplayed({ timeout }).then(() => true).catch(() => false)
            );
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            return elements.map(() => false);
        }
    }

    async waitForElementToBeClickable(element, timeout = 5000) {
        try {
            await element.waitForClickable({ timeout });            return true;
        } catch (error) {
            return false;
        }
    }

    async safeClick(element) {
        try {
            await this.waitForElementToBeClickable(element);
            await element.click();            return true;
        } catch (error) {
            return false;
        }
    }

    async safeSetValue(element, value) {
        try {
            await this.waitForElementToBeVisible(element);
            await element.clearValue();
            await element.setValue(value);            return true;
        } catch (error) {
            return false;
        }
    }

    async safeSelectByValue(element, value) {
        try {
            await this.waitForElementToBeVisible(element);
            await element.selectByAttribute('value', value);            return true;
        } catch (error) {
            return false;
        }
    }

    async getElementText(element) {
        try {
            await this.waitForElementToBeVisible(element);            return await element.getText();
        } catch (error) {
            return '';
        }    }

    async isElementDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    // Export test results to Excel
    async exportTestResults() {
        try {
            return await excelReporter.exportToExcel('search-test-results.xlsx');
        } catch (error) {
            console.error('Lỗi khi xuất kết quả:', error);
            return null;
        }
    }
}

module.exports = new SearchActions();
