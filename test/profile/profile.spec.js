const ProfileActions = require('./profileActions');
const { TEST_CASE_NAMES } = require('./testCaseNames');

describe('TESTCASE - THAY ĐỔI THÔNG TIN NGƯỜI DÙNG', () => {
    let profileActions;

    // Login một lần duy nhất cho toàn bộ test 
    before(async () => {
        profileActions = new ProfileActions();
    });

    it(TEST_CASE_NAMES.TT_01, async () => {
        await profileActions.TT_01_EmptyRequiredFields();
    });

    it(TEST_CASE_NAMES.TT_02, async () => {
        await profileActions.TT_02_EmptyFullnameOnly();
    });

    it(TEST_CASE_NAMES.TT_03, async () => {
        await profileActions.TT_03_EmptyEmailOnly();
    });

    it(TEST_CASE_NAMES.TT_04, async () => {
        await profileActions.TT_04_WrongCurrentPassword();
    });

    it(TEST_CASE_NAMES.TT_05, async () => {
        await profileActions.TT_05_EmptyConfirmPassword();
    });

    it(TEST_CASE_NAMES.TT_06, async () => {
        await profileActions.TT_06_PasswordMismatch();
    });

    it(TEST_CASE_NAMES.TT_07, async () => {
        await profileActions.TT_07_ShortPassword();
    });

    it(TEST_CASE_NAMES.TT_08, async () => {
        await profileActions.TT_08_InvalidEmailFormat();
    });

    it(TEST_CASE_NAMES.TT_09, async () => {
        await profileActions.TT_09_ExistingEmail();
    });

    it(TEST_CASE_NAMES.TT_10, async () => {
        await profileActions.TT_10_UpdateValidInfoWithoutPassword();
    });

    it(TEST_CASE_NAMES.TT_11, async () => {
        await profileActions.TT_11_UpdateInfoWithPassword();
    });

    afterEach(async () => {
        try {
            await profileActions.exportTestResults();
        } catch (error) {
            console.error('Error exporting test results:', error);
        }
    });
});
