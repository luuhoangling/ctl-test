const loginActions = require('./loginActions');

describe('CTL Web login feature Test', () => {

    // Không tk, mk
    it("Login with empty login credentials", async () => {
        await loginActions.loginWithEmptyLoginCredentials();
    })    
    // Sai tk, đúng mk
    it("Login with the wrong username and the correct password", async () => {
        await loginActions.loginWithWrongUsernameValidPass();
    })
    // Đúng tk, sai mk
    it("Login with the correct username and the wrong credentials", async () => {
        await loginActions.loginWithValidUsernameInvalidPass();
    })
    // Đúng tk, mk
    it("Login with the correct login credentials", async () => {
        await loginActions.loginWithValidCredentials();
    })

});