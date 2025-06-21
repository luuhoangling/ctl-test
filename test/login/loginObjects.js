const testConfig = require('../../config/testConfig');

module.exports = {
    // Account credentials - All account information in one place
    credentials: {
        valid: {
            username: 'phuong123',
            password: 'phuong123'
        },
        invalid: {
            username: 'phuong1993',
            password: 'matkhausai'
        }
    },// Login-specific wait times object - All timing configurations in one place
    waitTimes: {
        defaultWait: 250,                      // Default wait time
        submitWait: 1000,                      // Wait after form submission
        elementWait: 20000,                     // Wait for element to appear
    }, 
    loginUsernameInputField: () => $('#username'),
    loginPasswordInputField: () => $('#password'),
    loginButton: () => $('#loginBtn'),

    dashboardElement: () => $('.container'),
    allErrorMessages: () => $$('.alert-danger, .error-message, #login-fail, #server-error, #username-empty, #username-invalid, #username-error, #password-empty, #password-short, #password-error'),
    expectedErrorMessages: {
        emptyUsername: [
            'Tên đăng nhập không được để trống',
        ],
        emptyPassword: [
            'Mật khẩu không được để trống',
        ],
        invalidCredentials: [
            'Tên đăng nhập hoặc mật khẩu không đúng.',
        ],
        invalidUsername: [
            'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (3-50 ký tự)'
        ], invalidPassword: [
            'Mật khẩu phải có ít nhất 6 ký tự'
        ],
        accountLocked: [
            'Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau 15 phút.'
        ]
    }
};
