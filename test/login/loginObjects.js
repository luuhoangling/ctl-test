module.exports = {
    // Wait times in milliseconds
    waitTimes: {
        defaultWait: 500,        // 0.5 seconds for standard actions
        submitAwait: 1000,       // 1 second for form submission
        afterLoginWait: 2000,    // 2 seconds after successful login
    },    // Login form elements - cập nhật theo HTML mới
    loginUsernameInputField: () => $('#username'),
    loginPasswordInputField: () => $('#password'),
    loginButton: () => $('#loginBtn'),  // Đổi từ button[type="submit"] thành #loginBtn
    loginForm: () => $('#loginForm'),    // Error message selectors - cập nhật theo HTML mới
    loginFormErrorMsg: () => $('#login-fail:visible'),

    // Specific error message selectors targeting exact validation messages
    loginUsernameErrorMsg: () => $('#username-empty, #username-invalid, #username-error'),
    loginPasswordErrorMsg: () => $('#password-empty, #password-short, #password-error'),

    // General login fail message
    loginFailMessage: () => $('#login-fail'),

    // Success login indicators
    dashboardElement: () => $('.container'),    // Additional selectors - cập nhật theo HTML mới
    usernameField: () => $('#username'),
    passwordField: () => $('#password'),
    registerLink: () => $('a[href="register.php"]'),  // Cập nhật selector cho link đăng ký
    rememberMeCheckbox: () => $('#remember_me'),       // Thêm checkbox ghi nhớ đăng nhập    // Error message selectors - cập nhật cho HTML mới
    allErrorMessages: () => $$('.alert-danger, .error-message, #login-fail, #server-error, #username-empty, #username-invalid, #username-error, #password-empty, #password-short, #password-error'),
    generalErrorMessage: () => $('#login-fail, #server-error'),       // Cập nhật để bao gồm server-error// Expected error messages object - cập nhật theo HTML mới
    expectedErrorMessages: {
        emptyUsername: [
            'Tên tài khoản không được để trống',      // Thông báo chính từ HTML mới
            'Vui lòng nhập tên đăng nhập',
            'Vui lòng nhập tài khoản',
            'Please enter username',
            'Username is required',
            'Tên đăng nhập không được để trống',
            'Tên đăng nhập không được bỏ trống'
        ],
        emptyPassword: [
            'Mật khẩu không được để trống',           // Thông báo chính từ HTML mới
            'Vui lòng nhập mật khẩu',
            'Please enter password',
            'Password is required',
            'Mật khẩu không được bỏ trống'
        ],
        invalidCredentials: [
            'Tài khoản hoặc mật khẩu không chính xác', // Thông báo chính từ HTML mới
            'Tên đăng nhập hoặc mật khẩu không hợp lệ',
            'Sai tên đăng nhập hoặc mật khẩu',
            'Invalid username or password',
            'Invalid credentials',
            'Login failed',
            'Đăng nhập thất bại',
            'Tên đăng nhập hoặc mật khẩu sai',
            'Tên đăng nhập hoặc mật khẩu không đúng.'
        ],
        invalidUsername: [
            'Tên đăng nhập không hợp lệ',
            'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (3-50 ký tự)'
        ],
        invalidPassword: [
            'Mật khẩu không hợp lệ',
            'Mật khẩu phải có ít nhất 6 ký tự'
        ]
    }
};