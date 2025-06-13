module.exports = {
    // Wait times in milliseconds
    waitTimes: {
        defaultWait: 500,        // 0.5 seconds for standard actions
        submitAwait: 1000,       // 1 second for form submission
        afterLoginWait: 2000,    // 2 seconds after successful login
    },

    // Login form elements - using ID selectors
    loginUsernameInputField: () => $('#username'),
    loginPasswordInputField: () => $('#password'),
    loginButton: () => $('#loginForm button[type="submit"]'),
    loginForm: () => $('#loginForm'),

    // Error message selectors - using ID selectors
    loginFormErrorMsg: () => $('#username-error:visible, #password-error:visible'),

    // Specific error message selectors targeting exact validation messages
    loginUsernameErrorMsg: () => $('#username-error'),
    loginPasswordErrorMsg: () => $('#password-error'),

    // Success login indicators
    dashboardElement: () => $('.container'),

    // Additional selectors
    usernameField: () => $('#username'),
    passwordField: () => $('#password'),
    registerLink: () => $('#register-link a')
};