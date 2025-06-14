require('dotenv').config();

module.exports = {
    // Base URL for the CTL web application - from environment variable
    baseUrl: process.env.BASE_URL,

    // Login page path - from environment variable
    loginPath: process.env.LOGIN_PATH,

    // Test environment
    testEnv: process.env.TEST_ENV,

    // Common timeouts - from environment variables
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT),
    loginTimeout: parseInt(process.env.LOGIN_TIMEOUT),

    // Browser settings
    browser: process.env.BROWSER,
    headless: process.env.HEADLESS === 'true',

    // Debug settings
    debugMode: process.env.DEBUG_MODE === 'true',    // Wait times for various operations
    waitTimes: {
        defaultWait: parseInt(process.env.DEFAULT_WAIT) || 500,
        submitWait: parseInt(process.env.SUBMIT_WAIT) || 1000,
        afterLoginWait: parseInt(process.env.AFTER_LOGIN_WAIT) || 2000,
        elementWait: parseInt(process.env.ELEMENT_WAIT_TIMEOUT) || 5000,
        redirectWait: parseInt(process.env.REDIRECT_WAIT_TIMEOUT) || 10000
    },

    testUsers: {
        validUser: {
            username: process.env.VALID_USERNAME,
            password: process.env.VALID_PASSWORD
        },
        invalidUser: {
            username: process.env.INVALID_USERNAME,
            password: process.env.INVALID_PASSWORD
        }
    },

    getLoginUrl() {
        let baseUrl = this.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        let loginPath = this.loginPath;
        if (loginPath.startsWith('/')) {
            loginPath = loginPath.substring(1);
        }
        return baseUrl + loginPath;
    },

    getLoginPageIdentifier() {
        return this.loginPath.replace('/', '');
    },

    getTestUserCredentials(userType = 'valid') {
        return userType === 'valid' ? this.testUsers.validUser : this.testUsers.invalidUser;
    },

    isDebugMode() {
        return this.debugMode;
    },

    getBrowserConfig() {
        return {
            browser: this.browser,
            headless: this.headless
        };
    }
};
