const ProfileActions = require('./profileActions');

describe('Thay đổi thông tin người dùng', () => {
    let profileActions;

    // Login một lần duy nhất cho toàn bộ test suite
    before(async () => {
        profileActions = new ProfileActions();
    });

    // Export test results sau mỗi test
    afterEach(async () => {
        try {
            await profileActions.exportTestResults();
        } catch (error) {
            console.error('Error exporting test results:', error);
        }
    }); it('TT_01: Bỏ trống tất cả các trường bắt buộc → Hiển thị lỗi yêu cầu nhập đầy đủ', async () => {
        await profileActions.TT_01_EmptyRequiredFields();
    });

    it('TT_02: Bỏ trống họ và tên → Hiển thị lỗi yêu cầu nhập họ tên', async () => {
        await profileActions.TT_02_EmptyFullnameOnly();
    });

    it('TT_03: Bỏ trống email → Hiển thị lỗi yêu cầu nhập email', async () => {
        await profileActions.TT_03_EmptyEmailOnly();
    });

    it('TT_04: Nhập mật khẩu cũ không chính xác → Thông báo mật khẩu hiện tại không đúng', async () => {
        await profileActions.TT_04_WrongCurrentPassword();
    });

    it('TT_05: Nhập mật khẩu mới, bỏ trống xác nhận mật khẩu → Hiển thị lỗi yêu cầu xác nhận mật khẩu', async () => {
        await profileActions.TT_05_EmptyConfirmPassword();
    });

    it('TT_06: Nhập mật khẩu mới và xác nhận mật khẩu không khớp → Hiển thị lỗi mật khẩu không khớp', async () => {
        await profileActions.TT_06_PasswordMismatch();
    }); it('TT_07: Nhập mật khẩu mới ít hơn 6 ký tự → Hiển thị lỗi mật khẩu phải có ít nhất 6 ký tự', async () => {
        await profileActions.TT_07_ShortPassword();
    }); it('TT_08: Nhập email không đúng định dạng → Hiển thị lỗi "Email không hợp lệ"', async () => {
        await profileActions.TT_08_InvalidEmailFormat();
    });

    it('TT_09: Nhập email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"', async () => {
        await profileActions.TT_09_ExistingEmail();
    });

    it('TT_10: Nhập đầy đủ họ tên và email hợp lệ, không đổi mật khẩu → Cập nhật thành công', async () => {
        await profileActions.TT_10_UpdateValidInfoWithoutPassword();
    });

    it('TT_11: Cập nhật họ tên + đổi mật khẩu thành công (đúng tất cả điều kiện) → Thông báo cập nhật thành công', async () => {
        await profileActions.TT_11_UpdateInfoWithPassword();
    });
});
