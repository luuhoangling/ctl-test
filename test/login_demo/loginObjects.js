const testConfig = require('../../config/testConfig');

module.exports = {
    waitTimes: testConfig.waitTimes,

    loginUsernameInputField: () => $('#username'),
    loginPasswordInputField: () => $('#password'),
    loginButton: () => $('#loginBtn'),
    loginForm: () => $('#loginForm'),
    loginFormErrorMsg: () => $('#login-fail:visible'),

    loginUsernameErrorMsg: () => $('#username-empty, #username-invalid, #username-error'),
    loginPasswordErrorMsg: () => $('#password-empty, #password-short, #password-error'),

    loginFailMessage: () => $('#login-fail'),

    dashboardElement: () => $('.container'),
    usernameField: () => $('#username'),
    passwordField: () => $('#password'),
    registerLink: () => $('a[href="register.php"]'),
    rememberMeCheckbox: () => $('#remember_me'),
    allErrorMessages: () => $$('.alert-danger, .error-message, #login-fail, #server-error, #username-empty, #username-invalid, #username-error, #password-empty, #password-short, #password-error'),
    generalErrorMessage: () => $('#login-fail, #server-error'),
    expectedErrorMessages: {
        emptyUsername: [
            'Tên tài khoản không được để trống',
        ],
        emptyPassword: [
            'Mật khẩu không được để trống',
        ],
        invalidCredentials: [
            'Tên đăng nhập hoặc mật khẩu không đúng.',
        ],
        invalidUsername: [
            'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (3-50 ký tự)'
        ],
        invalidPassword: [
            'Mật khẩu phải có ít nhất 6 ký tự'
        ]
    }
};