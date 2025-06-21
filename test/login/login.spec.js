const loginActions = require('./loginActions');
const { TEST_CASE_NAMES } = require('./testCaseNames');

describe('TESTCASE - ĐĂNG NHẬP', () => {

    it(TEST_CASE_NAMES.DN_01, async () => {
        await loginActions.DN_01_EmptyUsernameAndPassword();
    });

    it(TEST_CASE_NAMES.DN_02, async () => {
        await loginActions.DN_02_EmptyUsernameOnlyPassword();
    });

    it(TEST_CASE_NAMES.DN_03, async () => {
        await loginActions.DN_03_EmptyPasswordOnlyUsername();
    });

    it(TEST_CASE_NAMES.DN_04, async () => {
        await loginActions.DN_04_UnregisteredAccount();
    });

    it(TEST_CASE_NAMES.DN_05, async () => {
        await loginActions.DN_05_WrongPassword();
    });

    it(TEST_CASE_NAMES.DN_06, async () => {
        await loginActions.DN_06_UppercaseUsername();
    });

    it(TEST_CASE_NAMES.DN_07, async () => {
        await loginActions.DN_07_UppercasePassword();
    });

    it(TEST_CASE_NAMES.DN_08, async () => {
        await loginActions.DN_08_InvalidShortUsername();
    });

    it(TEST_CASE_NAMES.DN_09, async () => {
        await loginActions.DN_09_InvalidShortPassword();
    });

    it(TEST_CASE_NAMES.DN_10, async () => {
        await loginActions.DN_10_LongUsername();
    });

    it(TEST_CASE_NAMES.DN_11, async () => {
        await loginActions.DN_11_SpecialCharacterUsername();
    });

    it(TEST_CASE_NAMES.DN_12, async () => {
        await loginActions.DN_12_ValidLogin();
    });    
    it(TEST_CASE_NAMES.DN_13, async () => {
        await loginActions.DN_13_MultipleFailedLogins();
    });

    after(async () => {
        const filePath = await loginActions.exportTestResults();
        if (filePath) {
            console.log(`Đã xuất kết quả thành công: ${filePath}`);
        } else {
            console.log('Không thể xuất kết quả ra Excel');
        }
    });

});
