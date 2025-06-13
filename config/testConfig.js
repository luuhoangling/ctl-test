require('dotenv').config();

module.exports = {
    // Base URL for the CTL web application - from environment variable
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1/ctl-web/',

    // Login page path - from environment variable
    loginPath: process.env.LOGIN_PATH || '/login',

    // Test environment
    testEnv: process.env.TEST_ENV || 'local',

    // Common timeouts - from environment variables
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 10000,
    loginTimeout: parseInt(process.env.LOGIN_TIMEOUT) || 15000,

    // Browser settings
    browser: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS === 'true',

    // Debug settings
    debugMode: process.env.DEBUG_MODE === 'true',
    takeScreenshots: process.env.TAKE_SCREENSHOTS !== 'false',

    // Test data - from environment variables with fallback
    testUsers: {
        validUser: {
            email: process.env.VALID_EMAIL,
            password: process.env.VALID_PASSWORD
        },
        invalidUser: {
            email: process.env.INVALID_EMAIL,
            password: process.env.INVALID_PASSWORD
        }
    },

    // Common selectors that might be used across your PHP web app
    commonSelectors: {
        // Login form selectors
        loginForm: 'form[name="login"]',
        usernameInput: 'input[name="username"]',
        emailInput: 'input[name="email"]',
        passwordInput: 'input[name="password"]',
        loginSubmitButton: 'button[type="submit"]',

        // Error message selectors
        errorMessage: '.error-message',
        alertDanger: '.alert-danger',
        invalidFeedback: '.invalid-feedback',

        // Success indicators
        dashboard: '.dashboard',
        mainContent: '.main-content',
        logoutButton: 'a[href*="logout"]'
    },

    // Error messages in Vietnamese and English
    errorMessages: {
        emptyUsername: [
            'Vui lòng nhập tên đăng nhập',
            'Vui lòng nhập email',
            'Please enter username',
            'Please enter email',
            'Email is required',
            'Username is required'
        ],
        emptyPassword: [
            'Vui lòng nhập mật khẩu',
            'Please enter password',
            'Password is required',
            'Mật khẩu không được để trống'
        ],
        invalidCredentials: [
            'Tên đăng nhập hoặc mật khẩu không hợp lệ',
            'Sai tên đăng nhập hoặc mật khẩu',
            'Invalid username or password',
            'Invalid credentials',
            'Login failed',
            'Đăng nhập thất bại'
        ]
    },
    // Helper method to get full login URL
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

    // Helper method to get environment info
    getEnvironmentInfo() {
        return {
            environment: this.testEnv,
            baseUrl: this.baseUrl,
            browser: this.browser,
            headless: this.headless,
            debugMode: this.debugMode
        };
    }
};
