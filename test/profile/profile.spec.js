const ProfileActions = require('./profileActions');

describe('Profile Tests', () => {
    let profileActions;

    beforeEach(async () => {
        profileActions = new ProfileActions();
    });

    afterEach(async () => {
        // Export test results after each test
        try {
            await profileActions.exportTestResults();
        } catch (error) {
            console.error('Error exporting test results:', error);
        }
    });

    it('DK_01: Bỏ trống tất cả các trường bắt buộc → Hiển thị lỗi yêu cầu nhập đầy đủ', async () => {
        await profileActions.DK_01_EmptyRequiredFields();
    });
});
