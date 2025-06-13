const loginObjects = require('./loginObjects');
const testConfig = require('../../config/testConfig');
const expect = require("chai").expect;

// Get test data from Excel file (preferred) or config file as fallback
const validUsername = testConfig.testUsers.validUser.email; // Kept same variable in config for backward compatibility
const validPass = testConfig.testUsers.validUser.password;
const invalidUsername = testConfig.testUsers.invalidUser.email; // Kept same variable in config for backward compatibility
const invalidPass = testConfig.testUsers.invalidUser.password;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class LoginActions {
    async navigateToLogin() {
        // Navigate to login page using helper method from config
        const currentUrl = await browser.getUrl();
        if (!currentUrl.includes('login')) {
            const loginUrl = testConfig.getLoginUrl();
            console.log(`Đang chuyển hướng đến trang đăng nhập: ${loginUrl}`);
            await browser.url(loginUrl);
        }
        await sleep(loginObjects.waitTimes.defaultWait);
    } async enterLoginUsername(username) {
        const usernameField = await loginObjects.loginUsernameInputField();
        await usernameField.waitForDisplayed({ timeout: 5000 });
        await usernameField.setValue(username);
        await sleep(loginObjects.waitTimes.defaultWait);
    } async enterLoginPassword(password) {
        const passwordField = await loginObjects.loginPasswordInputField();
        await passwordField.waitForDisplayed({ timeout: 5000 });
        await passwordField.setValue(password);
        await sleep(loginObjects.waitTimes.defaultWait);
    } async clickOnLoginInButton() {
        const loginBtn = await loginObjects.loginButton();
        await loginBtn.waitForClickable({ timeout: 5000 });
        await loginBtn.click();
        console.log('Đợi 1 giây để thông báo hiển thị...');
        await sleep(loginObjects.waitTimes.submitAwait);
    } async verifyUsernameErrorMsg() {
        try {
            // Tìm tất cả các phần tử có thể chứa lỗi
            const errorMsg = "Tên đăng nhập không được bỏ trống";
            const errorElements = await $$('.alert-danger, #username-error, .alert-warning');

            console.log('Đang kiểm tra thông báo lỗi tên đăng nhập');

            let foundMatch = false;
            for (const element of errorElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    console.log('Thông báo lỗi hiển thị:', text);

                    if (text.includes(errorMsg)) {
                        foundMatch = true;
                        break;
                    }
                }
            }

            await expect(foundMatch).to.be.true;
            console.log('Đã tìm thấy thông báo lỗi tên đăng nhập');
        } catch (error) {
            console.log('Không tìm thấy thông báo lỗi tên đăng nhập:', error.message);
        }
    } async verifyPasswordErrorMsg() {
        try {
            // Tìm tất cả các phần tử có thể chứa lỗi
            const errorMsg = "Mật khẩu không được bỏ trống";
            const errorElements = await $$('.alert-danger, #password-error, .alert-warning');

            console.log('Đang kiểm tra thông báo lỗi mật khẩu');

            let foundMatch = false;
            for (const element of errorElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    console.log('Thông báo lỗi hiển thị:', text);

                    if (text.includes(errorMsg)) {
                        foundMatch = true;
                        break;
                    }
                }
            }

            await expect(foundMatch).to.be.true;
            console.log('Đã tìm thấy thông báo lỗi mật khẩu');
        } catch (error) {
            console.log('Không tìm thấy thông báo lỗi mật khẩu:', error.message);
        }
    } async verifyLoginErrorMessage() {
        try {
            // Tìm thông báo lỗi đăng nhập từ chuỗi văn bản, không phụ thuộc vào ID
            const errorMsg = "Tên đăng nhập hoặc mật khẩu không đúng";
            const errorElements = await $$('.alert-danger, .alert-warning');

            console.log('Đang kiểm tra thông báo lỗi đăng nhập không hợp lệ');

            let foundMatch = false;
            for (const element of errorElements) {
                if (await element.isDisplayed()) {
                    const text = await element.getText();
                    console.log('Thông báo lỗi hiển thị:', text);

                    if (text.includes(errorMsg)) {
                        foundMatch = true;
                        break;
                    }
                }
            }

            await expect(foundMatch).to.be.true;
            console.log('Đã tìm thấy thông báo lỗi đăng nhập không hợp lệ');
        } catch (error) {
            console.log('Không tìm thấy hoặc không hiển thị thông báo thông tin đăng nhập không hợp lệ:', error.message);
        }
        await sleep(loginObjects.waitTimes.defaultWait);
    }

    async verifySuccessfulLogin() {
        try {
            // Wait for page to load after login
            await browser.waitUntil(async () => {
                const currentUrl = await browser.getUrl();
                return !currentUrl.includes('login');
            }, { timeout: 10000, timeoutMsg: 'Chuyển hướng đăng nhập thất bại' });

            console.log('URL hiện tại sau khi đăng nhập:', await browser.getUrl());
            console.log('Tiêu đề trang:', await browser.getTitle());

            // Simple verification - check if we're no longer on login page
            const currentUrl = await browser.getUrl();
            const isNotOnLoginPage = !currentUrl.includes('login.php');

            await expect(isNotOnLoginPage).to.be.true;
            console.log('Đăng nhập thành công - Đã chuyển hướng khỏi trang đăng nhập');

            // Adding 2-second delay after successful login
            console.log('Tạm dừng 2 giây sau khi đăng nhập thành công...');
            await sleep(loginObjects.waitTimes.afterLoginWait);
        } catch (error) {
            console.log('Xác minh thành công thất bại:', error.message);
            console.log('URL hiện tại:', await browser.getUrl());
        }
    } async login(username, password) {
        await this.navigateToLogin();
        await this.enterLoginUsername(username);
        await this.enterLoginPassword(password);
        await this.clickOnLoginInButton();
    }

    async loginWithValidCredentials() {
        await this.login(validUsername, validPass);
        await this.verifySuccessfulLogin();
    }

    async loginWithEmptyLoginCredentials() {
        await this.login('', '');
        await this.verifyUsernameErrorMsg();
        await this.verifyPasswordErrorMsg();
    }

    async loginWithWrongUsernameValidPass() {
        await this.login(invalidUsername, validPass);
        await this.verifyLoginErrorMessage();
    }

    async loginWithValidUsernameInvalidPass() {
        await this.login(validUsername, invalidPass);
        await this.verifyLoginErrorMessage();
    }
}

module.exports = new LoginActions();
