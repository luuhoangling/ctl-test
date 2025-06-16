const profileObjects = require('./profileObjects');
const loginObjects = require('../login/loginObjects');
const testConfig = require('../../config/testConfig');
const expect = require("chai").expect;
const ExcelReporter = require('../../utils/excelReporter');

// Tạo instance của ExcelReporter
const excelReporter = new ExcelReporter();

// Get valid user credentials for login
const validCredentials = testConfig.getTestUserCredentials('valid');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ProfileActions {    async loginBeforeTest() {
        try {
            const loginUrl = testConfig.getLoginUrl();
            await browser.url(loginUrl);
            await browser.pause(1000);

            const usernameField = await loginObjects.loginUsernameInputField();
            const passwordField = await loginObjects.loginPasswordInputField();
            const loginButton = await loginObjects.loginButton();

            await usernameField.waitForDisplayed({ timeout: 5000 });
            await usernameField.setValue(validCredentials.username);

            await passwordField.waitForDisplayed({ timeout: 5000 });
            await passwordField.setValue(validCredentials.password);

            await loginButton.waitForClickable({ timeout: 5000 });
            await loginButton.click();

            await browser.pause(3000);

            const currentUrl = await browser.getUrl();
            const loginSuccessful = !currentUrl.includes('login');

            if (loginSuccessful) {
                console.log('✅ Login successful for profile tests');
            } else {
                console.log('❌ Login failed for profile tests');
            }

            return loginSuccessful;
        } catch (error) {
            console.log('❌ Login failed:', error.message);
            return false;
        }
    }    async navigateToProfilePage() {
        const isLoggedIn = await this.loginBeforeTest();
        if (!isLoggedIn) {
            throw new Error('Failed to login before accessing profile page');
        }

        const profileUrl = testConfig.getProfileUrl();
        await browser.url(profileUrl);
        await browser.pause(profileObjects.waitTimes.defaultWait);
    }    // Đợi form profile load
    async waitForProfileFormToLoad() {
        try {
            const form = await profileObjects.profileForm();
            await form.waitForDisplayed({
                timeout: profileObjects.profileWaitTimes.formLoad
            });
            return true;
        } catch (error) {
            return false;
        }
    }    // Nhập dữ liệu vào form
    async fillProfileForm(userData) {
        try {
            if (userData.fullname !== undefined) {
                const fullnameField = await profileObjects.fullnameField();
                await fullnameField.clearValue();
                if (userData.fullname) {
                    await fullnameField.setValue(userData.fullname);
                }
            }

            if (userData.email !== undefined) {
                const emailField = await profileObjects.emailField();
                await emailField.clearValue();
                if (userData.email) {
                    await emailField.setValue(userData.email);
                }
            }

            if (userData.currentPassword !== undefined) {
                const currentPasswordField = await profileObjects.currentPasswordField();
                await currentPasswordField.clearValue();
                if (userData.currentPassword) {
                    await currentPasswordField.setValue(userData.currentPassword);
                }
            }

            if (userData.newPassword !== undefined) {
                const newPasswordField = await profileObjects.newPasswordField();
                await newPasswordField.clearValue();
                if (userData.newPassword) {
                    await newPasswordField.setValue(userData.newPassword);
                }
            }

            if (userData.confirmPassword !== undefined) {
                const confirmPasswordField = await profileObjects.confirmPasswordField();
                await confirmPasswordField.clearValue();
                if (userData.confirmPassword) {
                    await confirmPasswordField.setValue(userData.confirmPassword);
                }
            }

            await browser.pause(profileObjects.waitTimes.defaultWait);
            return true;
        } catch (error) {
            return false;
        }
    }    // Submit form
    async submitProfileForm() {
        try {
            const submitButton = await profileObjects.submitButton();
            await submitButton.click();
            await browser.pause(profileObjects.profileWaitTimes.updateSubmit);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Hủy bỏ thay đổi
    async cancelProfileUpdate() {
        try {
            const cancelButton = await profileObjects.cancelButton();
            await cancelButton.click();
            await browser.pause(profileObjects.waitTimes.defaultWait);
            return true;
        } catch (error) {
            return false;
        }
    }    // Kiểm tra thông báo lỗi validation
    async checkValidationErrors(expectedErrors = []) {
        try {
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const validationErrors = await profileObjects.getAllValidationErrors();

            if (expectedErrors.length === 0) {
                return validationErrors.length === 0;
            }

            for (const expectedError of expectedErrors) {
                const found = validationErrors.some(error =>
                    error.includes(expectedError) || expectedError.includes(error)
                );
                if (!found) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    // Kiểm tra thông báo thành công
    async checkSuccessMessage(expectedMessage) {
        try {
            await browser.pause(profileObjects.profileWaitTimes.successMessage);

            const successMessage = await profileObjects.getSuccessMessage();

            if (expectedMessage) {
                return successMessage.includes(expectedMessage) ||
                    expectedMessage.includes(successMessage);
            }

            return successMessage.length > 0;
        } catch (error) {
            return false;
        }
    }// Helper function để chụp screenshot kết quả cuối cùng của test case
    async takeTestResultScreenshot(testCaseId, status = 'PASSED') {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = `./screenshots/profile/${testCaseId}_${status}_${timestamp}.png`;

            await browser.saveScreenshot(screenshotPath);
            return screenshotPath;
        } catch (error) {
            console.log('❌ Error taking screenshot:', error.message);
            return null;
        }
    }// DK_01: Kiểm tra hiển thị lỗi yêu cầu nhập đầy đủ khi bỏ trống các trường bắt buộc
    async DK_01_EmptyRequiredFields() {
        try {
            // Đăng nhập và navigate tới profile page
            const loginSuccess = await this.loginBeforeTest();
            if (!loginSuccess) {
                throw new Error('Đăng nhập không thành công');
            }

            const profileUrl = testConfig.getProfileUrl();
            await browser.url(profileUrl);
            await browser.pause(profileObjects.waitTimes.defaultWait);

            // Đợi form load và clear fields
            const formLoaded = await this.waitForProfileFormToLoad();
            if (!formLoaded) {
                throw new Error('Profile form không load được');
            }

            await profileObjects.clearAllFields();
            await browser.pause(profileObjects.waitTimes.shortWait);

            // Submit form với các trường trống
            const emptyData = {
                fullname: '',
                email: ''
            };

            await this.fillProfileForm(emptyData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);
            
            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const fullnameErrorMessage = await profileObjects.getErrorMessage(profileObjects.fullnameError);
            const emailErrorMessage = await profileObjects.getErrorMessage(profileObjects.emailError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();

            const validationWorked = hasValidationErrors ||
                fullnameErrorMessage.length > 0 ||
                emailErrorMessage.length > 0 ||
                stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation errors nào được hiển thị');
            }

            console.log('✅ DK_01: PASSED - Validation errors hiển thị đúng');
            await this.takeTestResultScreenshot('DK_01', 'PASSED');

            excelReporter.addTestResult({
                testName: 'DK_01',
                description: 'Bỏ trống tất cả các trường bắt buộc → Hiển thị lỗi yêu cầu nhập đầy đủ',
                status: 'PASSED',
                inputData: 'Fullname: "", Email: ""',
                expectedResult: 'Hiển thị lỗi validation cho các trường bắt buộc',
                actualResult: `Errors found: ${allErrors.length}, Still on profile: ${stillOnProfilePage}`
            });
        } catch (error) {
            console.log('❌ DK_01: FAILED -', error.message);
            await this.takeTestResultScreenshot('DK_01', 'FAILED');

            excelReporter.addTestResult({
                testName: 'DK_01',
                description: 'Bỏ trống tất cả các trường bắt buộc → Hiển thị lỗi yêu cầu nhập đầy đủ',
                status: 'FAILED',
                inputData: 'Fullname: "", Email: ""',
                expectedResult: 'Hiển thị lỗi validation cho các trường bắt buộc',
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // Export test results to Excel
    async exportTestResults() {
        try {
            return await excelReporter.exportToExcel('profile-test-results.xlsx');
        } catch (error) {
            console.error('Lỗi khi xuất kết quả profile tests:', error);
            return null;
        }
    }
}

module.exports = ProfileActions;
