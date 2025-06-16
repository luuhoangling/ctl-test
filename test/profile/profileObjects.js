const testConfig = require('../../config/testConfig');

module.exports = {
    waitTimes: testConfig.waitTimes,
    
    // Specific wait times for profile operations
    profileWaitTimes: {
        formLoad: 2000,              // Wait for profile form to load
        updateSubmit: 3000,          // Wait after submitting update
        validationMessage: 2000,     // Wait for validation messages to appear
        successMessage: 2500,        // Wait for success message
        passwordUpdate: 3000,        // Wait for password update operation
    },

    // Test data constants - Dữ liệu test cố định
    testData: {
        // Thông tin người dùng hợp lệ - Valid user information
        validUserInfo: {
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            currentPassword: 'password123',
            newPassword: 'newpassword123',
            confirmPassword: 'newpassword123'
        },

        // Thông tin người dùng không hợp lệ - Invalid user information
        invalidUserInfo: {
            emptyFullname: '',
            invalidEmail: 'invalid-email',
            emptyEmail: '',
            wrongCurrentPassword: 'wrongpassword',
            shortNewPassword: '123',
            mismatchConfirmPassword: 'differentpassword',
            specialCharacters: '<script>alert("test")</script>',
            longText: 'A'.repeat(256) // Text quá dài
        },

        // Thông báo lỗi mong đợi - Expected error messages
        errorMessages: {
            emptyFullname: 'Họ và tên không được để trống',
            invalidEmail: 'Email không đúng định dạng',
            emptyEmail: 'Email không được để trống',
            wrongCurrentPassword: 'Mật khẩu hiện tại không đúng',
            shortPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
            passwordMismatch: 'Xác nhận mật khẩu không khớp',
            updateSuccess: 'Cập nhật thông tin thành công',
            passwordUpdateSuccess: 'Đổi mật khẩu thành công'
        },

        // Validation rules - Quy tắc validation
        validation: {
            minPasswordLength: 6,
            maxFieldLength: 255,
            emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            waitForValidation: 1000,
            formTimeout: 10000
        },

        // Tên test cases - Test case names
        testNames: {
            PROFILE_01: 'PROFILE_01: Kiểm tra cập nhật thông tin với dữ liệu hợp lệ',
            PROFILE_02: 'PROFILE_02: Kiểm tra cập nhật với họ tên để trống',
            PROFILE_03: 'PROFILE_03: Kiểm tra cập nhật với email không hợp lệ',
            PROFILE_04: 'PROFILE_04: Kiểm tra cập nhật với email để trống',
            PROFILE_05: 'PROFILE_05: Kiểm tra đổi mật khẩu với mật khẩu hiện tại sai',
            PROFILE_06: 'PROFILE_06: Kiểm tra đổi mật khẩu với mật khẩu mới quá ngắn',
            PROFILE_07: 'PROFILE_07: Kiểm tra đổi mật khẩu với xác nhận mật khẩu không khớp',
            PROFILE_08: 'PROFILE_08: Kiểm tra hủy bỏ thay đổi thông tin',
            PROFILE_09: 'PROFILE_09: Kiểm tra validation client-side',
            PROFILE_10: 'PROFILE_10: Kiểm tra bảo mật XSS với ký tự đặc biệt'
        }
    },

    // Form Container - Thẻ form chính
    profileForm: () => $('[data-testid="profile-form"]'),

    // Form Fields - Các trường nhập liệu
    // Tên đăng nhập (disabled field)
    usernameField: () => $('[data-testid="username-field"]'),

    // Họ và tên (required)
    fullnameField: () => $('[data-testid="fullname-field"]'),

    // Email (required)
    emailField: () => $('[data-testid="email-field"]'),

    // Mật khẩu hiện tại
    currentPasswordField: () => $('[data-testid="current-password-field"]'),

    // Mật khẩu mới
    newPasswordField: () => $('[data-testid="new-password-field"]'),

    // Xác nhận mật khẩu mới
    confirmPasswordField: () => $('[data-testid="confirm-password-field"]'),

    // Buttons - Các nút bấm
    // Nút Hủy
    cancelButton: () => $('[data-testid="cancel-button"]'),

    // Nút Cập Nhật
    submitButton: () => $('[data-testid="submit-button"]'),

    // Message Elements - Các phần tử thông báo
    // Validation summary container
    validationSummary: () => $('[data-testid="validation-summary"]'),

    // Validation errors list
    validationErrors: () => $('[data-testid="validation-errors"]'),

    // Server error message (PHP)
    errorMessage: () => $('[data-testid="error-message"]'),

    // Server success message (PHP)
    successMessage: () => $('[data-testid="success-message"]'),

    // Dynamic Error Messages (JavaScript Generated) - Thông báo lỗi động
    // Lỗi họ và tên
    fullnameError: () => $('[data-testid="full_name-error"]'),

    // Lỗi email
    emailError: () => $('[data-testid="email-error"]'),

    // Lỗi mật khẩu hiện tại
    currentPasswordError: () => $('[data-testid="current_password-error"]'),

    // Lỗi mật khẩu mới
    newPasswordError: () => $('[data-testid="new_password-error"]'),

    // Lỗi xác nhận mật khẩu
    confirmPasswordError: () => $('[data-testid="confirm_password-error"]'),

    // Helper methods - Các phương thức hỗ trợ
    
    // Kiểm tra xem form có được hiển thị không
    async isFormDisplayed() {
        try {
            const form = await this.profileForm();
            return await form.isDisplayed();
        } catch (error) {
            return false;
        }
    },

    // Lấy text của thông báo lỗi
    async getErrorMessage(errorSelector) {
        try {
            const errorElement = await errorSelector();
            if (await errorElement.isDisplayed()) {
                return await errorElement.getText();
            }
            return '';
        } catch (error) {
            return '';
        }
    },

    // Lấy text của thông báo thành công
    async getSuccessMessage() {
        try {
            const successElement = await this.successMessage();
            if (await successElement.isDisplayed()) {
                return await successElement.getText();
            }
            return '';
        } catch (error) {
            return '';
        }
    },

    // Kiểm tra xem field có bị disable không
    async isFieldDisabled(fieldSelector) {
        try {
            const field = await fieldSelector();
            return await field.getAttribute('disabled') !== null;
        } catch (error) {
            return false;
        }
    },

    // Lấy giá trị của field
    async getFieldValue(fieldSelector) {
        try {
            const field = await fieldSelector();
            return await field.getValue();
        } catch (error) {
            return '';
        }
    },

    // Kiểm tra xem có thông báo validation nào hiển thị không
    async hasValidationErrors() {
        try {
            const validationSummary = await this.validationSummary();
            return await validationSummary.isDisplayed();
        } catch (error) {
            return false;
        }
    },

    // Lấy tất cả thông báo lỗi validation
    async getAllValidationErrors() {
        try {
            const errors = [];
            const errorSelectors = [
                this.fullnameError,
                this.emailError,
                this.currentPasswordError,
                this.newPasswordError,
                this.confirmPasswordError
            ];

            for (const errorSelector of errorSelectors) {
                const errorText = await this.getErrorMessage(errorSelector);
                if (errorText) {
                    errors.push(errorText);
                }
            }
            return errors;
        } catch (error) {
            return [];
        }
    },

    // Clear tất cả các trường input
    async clearAllFields() {
        try {
            const fields = [
                this.fullnameField,
                this.emailField,
                this.currentPasswordField,
                this.newPasswordField,
                this.confirmPasswordField
            ];

            for (const fieldSelector of fields) {
                const field = await fieldSelector();
                if (await field.isEnabled()) {
                    await field.clearValue();
                }
            }
        } catch (error) {
            console.log('Error clearing fields:', error.message);
        }
    }
};
