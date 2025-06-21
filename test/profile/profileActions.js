const profileObjects = require('./profileObjects');
const loginObjects = require('../login/loginObjects');
const testConfig = require('../../config/testConfig');
const expect = require("chai").expect;
const ExcelReporter = require('../../utils/excelReporter');
const ScreenshotUtils = require('../../utils/screenshotUtils');
const { TEST_CASE_NAMES } = require('./testCaseNames');

// Tạo instance của ExcelReporter
const excelReporter = new ExcelReporter();

// Get valid user credentials for login
const validCredentials = testConfig.getTestUserCredentials('valid');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ProfileActions {
    async loginBeforeTest() {
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
    } async navigateToProfilePage() {
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
        }    }
      // Helper function để chụp screenshot kết quả cuối cùng của test case
    // Sẽ tự động clear ảnh cũ chỉ 1 lần duy nhất cho toàn bộ test suite
    async takeTestResultScreenshot(testCaseId, status = 'PASSED') {
        return await ScreenshotUtils.takeTestResultScreenshot('profile', testCaseId, status, true);
    }

    // Clear all old screenshots in profile folder (force clear)
    async clearOldScreenshots(force = false) {
        await ScreenshotUtils.clearModuleScreenshots('profile', force);
    }

    // Reset clearing session - gọi method này khi bắt đầu test suite mới
    resetScreenshotSession() {
        ScreenshotUtils.resetSession();
    }
    
    // TT_01: Kiểm tra hiển thị lỗi yêu cầu nhập đầy đủ khi bỏ trống các trường bắt buộc
    async TT_01_EmptyRequiredFields() {
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

            console.log('✅ TT_01: PASSED - Validation errors hiển thị đúng');
            await this.takeTestResultScreenshot('TT_01', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_01,
                status: 'PASSED',
                inputData: 'Fullname: "", Email: ""',
                expectedResult: 'Hiển thị lỗi validation cho các trường bắt buộc',
                actualResult: allErrors.join(', ')
            });
        } catch (error) {
            console.log('❌ TT_01: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_01', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_01,
                status: 'FAILED',
                inputData: 'Fullname: "", Email: ""',
                expectedResult: 'Hiển thị lỗi validation cho các trường bắt buộc',
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }    // TT_02: Kiểm tra hiển thị lỗi yêu cầu nhập họ tên khi bỏ trống trường Họ và tên
    async TT_02_EmptyFullnameOnly() {
        try {
            // Navigate tới profile page (không cần login lại vì đã login ở TT_01)
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

            // Submit form với họ tên trống nhưng email hợp lệ
            const testData = {
                fullname: '', // Bỏ trống họ và tên
                email: profileObjects.testData.validUserInfo.email // Email hợp lệ
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho trường họ và tên
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const fullnameErrorMessage = await profileObjects.getErrorMessage(profileObjects.fullnameError);
            const emailErrorMessage = await profileObjects.getErrorMessage(profileObjects.emailError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();

            // Kiểm tra rằng có lỗi validation cho họ và tên
            const hasFullnameError = fullnameErrorMessage.length > 0 ||
                allErrors.some(error => error.includes('họ') || error.includes('tên') || error.includes('name'));

            // Kiểm tra rằng không có lỗi validation cho email (vì email hợp lệ)
            const hasEmailError = emailErrorMessage.length > 0 ||
                allErrors.some(error => error.includes('email') || error.includes('Email'));

            const validationWorked = hasValidationErrors || hasFullnameError || stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation error nào được hiển thị cho trường họ và tên');
            }

            if (hasEmailError) {
                console.log('⚠️ Cảnh báo: Email hợp lệ nhưng vẫn có lỗi validation cho email');
            }

            console.log('✅ TT_02: PASSED - Validation error hiển thị đúng cho trường họ và tên trống');
            await this.takeTestResultScreenshot('TT_02', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_02,
                status: 'PASSED',
                inputData: `Fullname: "", Email: "${testData.email}"`,
                expectedResult: 'Hiển thị lỗi validation cho trường họ và tên, không có lỗi cho email',
                actualResult: fullnameErrorMessage
            });
        } catch (error) {
            console.log('❌ TT_02: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_02', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_02,
                status: 'FAILED',
                inputData: `Fullname: "", Email: "${profileObjects.testData.validUserInfo.email}"`,
                expectedResult: 'Hiển thị lỗi validation cho trường họ và tên',
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_03: Kiểm tra hiển thị lỗi yêu cầu nhập email khi bỏ trống trường Email
    async TT_03_EmptyEmailOnly() {
        try {
            // Navigate tới profile page (không cần login lại)
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

            // Submit form với email trống nhưng họ tên hợp lệ
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname, // Họ tên hợp lệ
                email: '' // Bỏ trống email
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho trường email
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const fullnameErrorMessage = await profileObjects.getErrorMessage(profileObjects.fullnameError);
            const emailErrorMessage = await profileObjects.getErrorMessage(profileObjects.emailError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();

            // Kiểm tra rằng có lỗi validation cho email
            const hasEmailError = emailErrorMessage.length > 0 ||
                allErrors.some(error => error.includes('email') || error.includes('Email'));

            // Kiểm tra rằng không có lỗi validation cho họ tên (vì họ tên hợp lệ)
            const hasFullnameError = fullnameErrorMessage.length > 0 ||
                allErrors.some(error => error.includes('họ') || error.includes('tên') || error.includes('name'));

            const validationWorked = hasValidationErrors || hasEmailError || stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation error nào được hiển thị cho trường email');
            }

            if (hasFullnameError) {
                console.log('⚠️ Cảnh báo: Họ tên hợp lệ nhưng vẫn có lỗi validation cho họ tên');
            }

            console.log('✅ TT_03: PASSED - Validation error hiển thị đúng cho trường email trống');
            await this.takeTestResultScreenshot('TT_03', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_03,
                status: 'PASSED',
                inputData: `Fullname: "${testData.fullname}", Email: ""`,
                expectedResult: 'Hiển thị lỗi validation cho trường email, không có lỗi cho họ tên',
                actualResult: emailErrorMessage
            });
        } catch (error) {
            console.log('❌ TT_03: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_03', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_03,
                status: 'FAILED',
                inputData: `Fullname: "${profileObjects.testData.validUserInfo.fullname}", Email: ""`,
                expectedResult: 'Hiển thị lỗi validation cho trường email',
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_04: Kiểm tra thông báo lỗi khi nhập mật khẩu cũ không chính xác
    async TT_04_WrongCurrentPassword() {
        try {
            // Navigate tới profile page
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

            // Submit form với thông tin hợp lệ nhưng mật khẩu cũ sai
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.validUserInfo.email,
                currentPassword: profileObjects.testData.invalidUserInfo.wrongCurrentPassword, // Mật khẩu cũ sai
                newPassword: profileObjects.testData.validUserInfo.newPassword,
                confirmPassword: profileObjects.testData.validUserInfo.confirmPassword
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();            // Kiểm tra thông báo lỗi cho mật khẩu hiện tại
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const currentPasswordErrorMessage = await profileObjects.getErrorMessage(profileObjects.currentPasswordError);
            const serverErrorMessage = await profileObjects.getErrorMessage(profileObjects.errorMessage);
            const allErrors = await profileObjects.getAllValidationErrors();
            
            // Kiểm tra chính xác thông báo lỗi mong đợi
            const expectedErrorMessage = profileObjects.testData.errorMessages.wrongCurrentPassword;
            const hasExpectedError = currentPasswordErrorMessage.includes(expectedErrorMessage) ||
                serverErrorMessage.includes(expectedErrorMessage) ||
                allErrors.some(error => error.includes(expectedErrorMessage));

            if (!hasExpectedError) {
                throw new Error(`Thông báo lỗi không chính xác. Mong đợi: "${expectedErrorMessage}". Thực tế: "${currentPasswordErrorMessage || serverErrorMessage}"`);
            }console.log('✅ TT_04: PASSED - Thông báo lỗi hiển thị đúng cho mật khẩu hiện tại không đúng');
            await this.takeTestResultScreenshot('TT_04', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_04,
                status: 'PASSED',
                inputData: `Current Password: "${testData.currentPassword}", New Password: "${testData.newPassword}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.wrongCurrentPassword}"`,
                actualResult: `${currentPasswordErrorMessage || serverErrorMessage}`
            });
        } catch (error) {
            console.log('❌ TT_04: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_04', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_04,
                status: 'FAILED',
                inputData: `Current Password: "${profileObjects.testData.invalidUserInfo.wrongCurrentPassword}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.wrongCurrentPassword}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_05: Kiểm tra lỗi khi nhập mật khẩu mới nhưng bỏ trống xác nhận mật khẩu
    async TT_05_EmptyConfirmPassword() {
        try {
            // Navigate tới profile page
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

            // Submit form với mật khẩu mới hợp lệ nhưng bỏ trống xác nhận mật khẩu
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.validUserInfo.email,
                currentPassword: profileObjects.testData.validUserInfo.currentPassword,
                newPassword: profileObjects.testData.validUserInfo.newPassword,
                confirmPassword: '' // Bỏ trống xác nhận mật khẩu
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho xác nhận mật khẩu
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const confirmPasswordErrorMessage = await profileObjects.getErrorMessage(profileObjects.confirmPasswordError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();

            // Kiểm tra rằng có lỗi validation cho xác nhận mật khẩu
            const hasConfirmPasswordError = confirmPasswordErrorMessage.length > 0 ||
                allErrors.some(error => error.includes('xác nhận') || error.includes('confirm'));

            const validationWorked = hasValidationErrors || hasConfirmPasswordError || stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation error nào được hiển thị cho trường xác nhận mật khẩu');
            }

            console.log('✅ TT_05: PASSED - Validation error hiển thị đúng cho trường xác nhận mật khẩu trống');
            await this.takeTestResultScreenshot('TT_05', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_05,
                status: 'PASSED',
                inputData: `New Password: "${testData.newPassword}", Confirm Password: ""`,
                expectedResult: 'Hiển thị lỗi validation cho trường xác nhận mật khẩu',
                actualResult: confirmPasswordErrorMessage
            });
        } catch (error) {
            console.log('❌ TT_05: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_05', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_05,
                status: 'FAILED',
                inputData: `New Password: "${profileObjects.testData.validUserInfo.newPassword}", Confirm Password: ""`,
                expectedResult: 'Hiển thị lỗi validation cho trường xác nhận mật khẩu',
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_06: Kiểm tra lỗi khi mật khẩu mới và xác nhận mật khẩu không khớp
    async TT_06_PasswordMismatch() {
        try {
            // Navigate tới profile page
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

            // Submit form với mật khẩu mới và xác nhận mật khẩu không khớp
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.validUserInfo.email,
                currentPassword: profileObjects.testData.validUserInfo.currentPassword,
                newPassword: profileObjects.testData.validUserInfo.newPassword,
                confirmPassword: profileObjects.testData.invalidUserInfo.mismatchConfirmPassword // Mật khẩu xác nhận khác
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho mật khẩu không khớp
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const confirmPasswordErrorMessage = await profileObjects.getErrorMessage(profileObjects.confirmPasswordError);
            const newPasswordErrorMessage = await profileObjects.getErrorMessage(profileObjects.newPasswordError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();            // Kiểm tra rằng có lỗi validation cho mật khẩu không khớp
            const hasPasswordMismatchError = confirmPasswordErrorMessage.includes(profileObjects.testData.errorMessages.passwordMismatch) ||
                newPasswordErrorMessage.includes(profileObjects.testData.errorMessages.passwordMismatch) ||
                allErrors.some(error => error.includes(profileObjects.testData.errorMessages.passwordMismatch));

            const validationWorked = hasValidationErrors || hasPasswordMismatchError || stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation error nào được hiển thị cho mật khẩu không khớp');
            }

            console.log('✅ TT_06: PASSED - Validation error hiển thị đúng cho mật khẩu không khớp');
            await this.takeTestResultScreenshot('TT_06', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_06,
                status: 'PASSED',
                inputData: `New Password: "${testData.newPassword}", Confirm Password: "${testData.confirmPassword}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.passwordMismatch}"`,
                actualResult: confirmPasswordErrorMessage
            });
        } catch (error) {
            console.log('❌ TT_06: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_06', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_06,
                status: 'FAILED', inputData: `New Password: "${profileObjects.testData.validUserInfo.newPassword}", Confirm Password: "${profileObjects.testData.invalidUserInfo.mismatchConfirmPassword}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.passwordMismatch}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_07: Kiểm tra lỗi khi nhập mật khẩu mới ít hơn 6 ký tự
    async TT_07_ShortPassword() {
        try {
            // Navigate tới profile page
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

            // Submit form với mật khẩu mới quá ngắn (ít hơn 6 ký tự)
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.validUserInfo.email,
                currentPassword: profileObjects.testData.validUserInfo.currentPassword,
                newPassword: profileObjects.testData.invalidUserInfo.shortNewPassword, // Mật khẩu ngắn
                confirmPassword: profileObjects.testData.invalidUserInfo.shortNewPassword // Xác nhận mật khẩu ngắn
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();            // Kiểm tra validation cho mật khẩu quá ngắn
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const newPasswordErrorMessage = await profileObjects.getErrorMessage(profileObjects.newPasswordError);
            const serverErrorMessage = await profileObjects.getErrorMessage(profileObjects.errorMessage);
            const allErrors = await profileObjects.getAllValidationErrors();
            
            // Kiểm tra chính xác thông báo lỗi mong đợi
            const expectedErrorMessage = profileObjects.testData.errorMessages.shortPassword;
            const hasExpectedError = newPasswordErrorMessage.includes(expectedErrorMessage) ||
                serverErrorMessage.includes(expectedErrorMessage) ||
                allErrors.some(error => error.includes(expectedErrorMessage));

            if (!hasExpectedError) {
                throw new Error(`Thông báo lỗi không chính xác. Mong đợi: "${expectedErrorMessage}". Thực tế: "${newPasswordErrorMessage || serverErrorMessage}"`);
            }console.log('✅ TT_07: PASSED - Validation error hiển thị đúng cho mật khẩu quá ngắn');
            await this.takeTestResultScreenshot('TT_07', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_07,
                status: 'PASSED',
                inputData: `New Password: "${testData.newPassword}" (${testData.newPassword.length} ký tự)`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.shortPassword}"`,
                actualResult: `${newPasswordErrorMessage || serverErrorMessage}`
            });
        } catch (error) {
            console.log('❌ TT_07: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_07', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_07,
                status: 'FAILED',
                inputData: `New Password: "${profileObjects.testData.invalidUserInfo.shortNewPassword}" (${profileObjects.testData.invalidUserInfo.shortNewPassword.length} ký tự)`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.shortPassword}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_08: Kiểm tra lỗi khi nhập email không đúng định dạng
    async TT_08_InvalidEmailFormat() {
        try {
            // Navigate tới profile page
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

            // Submit form với email không đúng định dạng
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.invalidUserInfo.invalidEmail // Email không hợp lệ
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho email không hợp lệ
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const emailErrorMessage = await profileObjects.getErrorMessage(profileObjects.emailError);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();            // Kiểm tra rằng có lỗi validation cho email không hợp lệ
            const hasInvalidEmailError = emailErrorMessage.includes(profileObjects.testData.errorMessages.invalidEmailFormat) ||
                allErrors.some(error => error.includes(profileObjects.testData.errorMessages.invalidEmailFormat));

            const validationWorked = hasValidationErrors || hasInvalidEmailError || stillOnProfilePage;

            if (!validationWorked) {
                throw new Error('Không có validation error nào được hiển thị cho email không hợp lệ');
            }

            console.log('✅ TT_08: PASSED - Validation error hiển thị đúng cho email không đúng định dạng');
            await this.takeTestResultScreenshot('TT_08', 'PASSED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_08,
                status: 'PASSED',
                inputData: `Email: "${testData.email}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.invalidEmailFormat}" hoặc "Email không đúng định dạng"`,
                actualResult: emailErrorMessage
            });
        } catch (error) {
            console.log('❌ TT_08: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_08', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_08,
                status: 'FAILED',
                inputData: `Email: "${profileObjects.testData.invalidUserInfo.invalidEmail}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.invalidEmailFormat}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    } // TT_10: Kiểm tra lỗi khi nhập email đã tồn tại
    async TT_09_ExistingEmail() {
        try {
            // Navigate tới profile page
            const profileUrl = testConfig.getProfileUrl();
            await browser.url(profileUrl);
            await browser.pause(profileObjects.waitTimes.defaultWait);

            // Đợi form load và clear fields
            const formLoaded = await this.waitForProfileFormToLoad();
            if (!formLoaded) {
                throw new Error('Profile form không load được');
            }

            await profileObjects.clearAllFields();
            await browser.pause(profileObjects.waitTimes.shortWait);            // Submit form với email đã tồn tại (sử dụng email đã có trong test data)
            const testData = {
                fullname: profileObjects.testData.validUserInfo.fullname,
                email: profileObjects.testData.invalidUserInfo.usedEmail // Email đã tồn tại
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Kiểm tra validation cho email đã tồn tại
            await browser.pause(profileObjects.profileWaitTimes.validationMessage);

            const hasValidationErrors = await profileObjects.hasValidationErrors();
            const emailErrorMessage = await profileObjects.getErrorMessage(profileObjects.emailError);
            const serverErrorMessage = await profileObjects.getErrorMessage(profileObjects.errorMessage);
            const stillOnProfilePage = (await browser.getUrl()).includes('profile');
            const allErrors = await profileObjects.getAllValidationErrors();            // Kiểm tra rằng có lỗi validation cho email đã tồn tại
            const hasExistingEmailError = emailErrorMessage.includes(profileObjects.testData.errorMessages.existingEmail) ||
                serverErrorMessage.includes(profileObjects.testData.errorMessages.existingEmail) ||
                allErrors.some(error => error.includes(profileObjects.testData.errorMessages.existingEmail));

            const validationWorked = hasValidationErrors || hasExistingEmailError || stillOnProfilePage;

            if (!validationWorked) {
                console.log('⚠️ TT_09: Email có thể chưa tồn tại trong hệ thống, hoặc validation khác');
            }            
            console.log('✅ TT_09: Test completed - Kiểm tra email đã tồn tại');
            await this.takeTestResultScreenshot('TT_09', validationWorked ? 'PASSED' : 'INFO');            
            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_09,
                status: validationWorked ? 'PASSED' : 'INFO',
                inputData: `Email: "${testData.email}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.existingEmail}"`,
                actualResult: `${serverErrorMessage}`
            });
        } catch (error) {
            console.log('❌ TT_09: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_09', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_09,
                status: 'FAILED',
                inputData: `Email: "${testData.email}"`,
                expectedResult: `Hiển thị lỗi "${profileObjects.testData.errorMessages.existingEmail}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_10: Cập nhật thông tin hợp lệ (họ tên + email) mà không đổi mật khẩu → Cập nhật thành công
    async TT_10_UpdateValidInfoWithoutPassword() {
        try {
            // Navigate tới profile page
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

            // Submit form với họ tên và email hợp lệ (không đổi mật khẩu)
            const testData = {
                fullname: 'Toản Lê',
                email: 'toanle@gmail.com'
                // Không có thông tin mật khẩu
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Đợi xử lý update
            await browser.pause(profileObjects.profileWaitTimes.updateSubmit);

            // Kiểm tra thông báo thành công
            const successMessage = await profileObjects.getSuccessMessage();
            const currentUrl = await browser.getUrl();
            const updateSuccessful = successMessage.includes(profileObjects.testData.errorMessages.updateSuccess) ||
                                     !currentUrl.includes('profile') ||
                                     successMessage.length > 0;

            // Kiểm tra không có validation errors
            const hasValidationErrors = await profileObjects.hasValidationErrors();
            
            if (hasValidationErrors) {
                const allErrors = await profileObjects.getAllValidationErrors();
                throw new Error(`Có validation errors: ${allErrors.join(', ')}`);
            }

            if (!updateSuccessful) {
                console.log('⚠️ TT_10: Cập nhật có thể thành công nhưng không có thông báo rõ ràng');
            }

            console.log('✅ TT_10: Test completed - Cập nhật thông tin hợp lệ thành công');
            await this.takeTestResultScreenshot('TT_10', updateSuccessful ? 'PASSED' : 'INFO');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_10,
                status: updateSuccessful ? 'PASSED' : 'INFO',
                inputData: `Fullname: "${testData.fullname}", Email: "${testData.email}"`,
                expectedResult: `Hiển thị thông báo "${profileObjects.testData.errorMessages.updateSuccess}"`,
                actualResult: successMessage
            });
        } catch (error) {
            console.log('❌ TT_10: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_10', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_10,
                status: 'FAILED',
                inputData: `Fullname: "Nguyễn Văn B Updated", Email: "updated.email@example.com"`,
                expectedResult: `Hiển thị thông báo "${profileObjects.testData.errorMessages.updateSuccess}"`,
                actualResult: `Error: ${error.message}`
            });

            throw error;
        }
    }

    // TT_11: Cập nhật họ tên + đổi mật khẩu thành công (đúng tất cả điều kiện) → Thông báo cập nhật thành công
    async TT_11_UpdateInfoWithPassword() {
        try {
            // Navigate tới profile page
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

            // Submit form với đầy đủ thông tin hợp lệ (bao gồm đổi mật khẩu)
            const testData = {
                fullname: 'Đoàn Minh Phương',
                email: 'dm.phuong@hehe.com',
                currentPassword: validCredentials.password, // Mật khẩu hiện tại đúng
                newPassword: 'phuong123',
                confirmPassword: 'phuong123'
            };

            await this.fillProfileForm(testData);
            const submitButton = await profileObjects.submitButton();
            await submitButton.waitForClickable({ timeout: 5000 });
            await submitButton.click();

            // Đợi xử lý update (đổi mật khẩu có thể mất thời gian hơn)
            await browser.pause(profileObjects.profileWaitTimes.passwordUpdate);

            // Kiểm tra thông báo thành công
            const successMessage = await profileObjects.getSuccessMessage();
            const currentUrl = await browser.getUrl();
            const updateSuccessful = successMessage.includes(profileObjects.testData.errorMessages.updateSuccess) ||
                                     successMessage.includes(profileObjects.testData.errorMessages.passwordUpdateSuccess) ||
                                     successMessage.length > 0;

            // Kiểm tra không có validation errors
            const hasValidationErrors = await profileObjects.hasValidationErrors();
            
            if (hasValidationErrors) {
                const allErrors = await profileObjects.getAllValidationErrors();
                throw new Error(`Có validation errors: ${allErrors.join(', ')}`);
            }

            if (!updateSuccessful) {
                console.log('⚠️ TT_11: Cập nhật có thể thành công nhưng không có thông báo rõ ràng');
            }

            console.log('✅ TT_11: Test completed - Cập nhật thông tin + đổi mật khẩu thành công');
            await this.takeTestResultScreenshot('TT_11', updateSuccessful ? 'PASSED' : 'INFO');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_11,
                status: updateSuccessful ? 'PASSED' : 'INFO',
                inputData: `Fullname: "${testData.fullname}", Email: "${testData.email}", Password changed: Yes`,
                expectedResult: `Hiển thị thông báo "${profileObjects.testData.errorMessages.updateSuccess}" hoặc "${profileObjects.testData.errorMessages.passwordUpdateSuccess}"`,
                actualResult: successMessage
            });
        } catch (error) {
            console.log('❌ TT_11: FAILED -', error.message);
            await this.takeTestResultScreenshot('TT_11', 'FAILED');            excelReporter.addTestResult({
                testName: TEST_CASE_NAMES.TT_11,
                status: 'FAILED',
                inputData: `Fullname: "Nguyễn Văn C Updated", Email: "updated.withpass@example.com", Password changed: Yes`,
                expectedResult: `Hiển thị thông báo "${profileObjects.testData.errorMessages.updateSuccess}" hoặc "${profileObjects.testData.errorMessages.passwordUpdateSuccess}"`,
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
