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
            invalidEmail: 'invalid-email',
            usedEmail: "dm.phuong@hehe.con",
            wrongCurrentPassword: 'wrongpassword',
            shortNewPassword: '123',
            mismatchConfirmPassword: 'differentpassword'
        },        
        // Thông báo lỗi mong đợi - Expected error messages
        errorMessages: {
            wrongCurrentPassword: 'Mật khẩu hiện tại không đúng.',
            shortPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            passwordMismatch: 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
            updateSuccess: 'Cập nhật thông tin thành công',
            passwordUpdateSuccess: 'Đổi mật khẩu thành công',
            invalidEmailFormat: 'Email không hợp lệ',
            existingEmail: 'Email này đã được sử dụng bởi tài khoản khác.'
        }
    },

    // Form Container - Thẻ form chính
    profileForm: () => $('[data-testid="profile-form"]'),    // Form Fields - Các trường nhập liệu
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
    cancelButton: () => $('[data-testid="cancel-button"]'),

    // Nút Cập Nhật
    submitButton: () => $('[data-testid="submit-button"]'),

    // Message Elements - Các phần tử thông báo    // Server error message (PHP)
    errorMessage: () => $('[data-testid="error-message"]'),

    // Server success message (PHP)
    successMessage: () => $('[data-testid="success-message"]'),

    // Dynamic Error Messages (JavaScript Generated) - Thông báo lỗi động
    // Lỗi họ và tên
    fullnameError: () => $('[data-testid="full_name-error"]'),    // Lỗi email
    emailError: () => $('[data-testid="email-error"]'),

    // Lỗi mật khẩu hiện tại
    currentPasswordError: () => $('[data-testid="current_password-error"]'),

    // Lỗi mật khẩu mới
    newPasswordError: () => $('[data-testid="new_password-error"]'),

    // Lỗi xác nhận mật khẩu
    confirmPasswordError: () => $('[data-testid="confirm_password-error"]'),// Helper methods - Các phương thức hỗ trợ

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

    // Kiểm tra xem có thông báo validation nào hiển thị không
    async hasValidationErrors() {
        try {
            const errorSelectors = [
                this.fullnameError,
                this.emailError,
                this.currentPasswordError,
                this.confirmPasswordError
            ];

            for (const errorSelector of errorSelectors) {
                const errorElement = await errorSelector();
                if (await errorElement.isDisplayed()) {
                    return true;
                }
            }
            return false;
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
