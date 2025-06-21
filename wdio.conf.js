require('dotenv').config();
const testConfig = require('./config/testConfig');

const login = './test/login/login.spec.js';
const search = './test/search/search.spec.js';
const profile = './test/profile/profile.spec.js';

exports.config = {
    runner: 'local',
    specs: [
        login,
        search,
        profile
    ],
    exclude: [
    ],
    suites: {
        login: [
            login
        ],
        search: [
            search
        ],
        profile: [
            profile
        ],
        nopCommerce: [
            [
                login,
                search,
                profile
            ]
        ],
        ctlWeb: [
            [
                login,
                search,
                profile
            ]
        ]
    },
    maxInstances: 10,
    capabilities: [{
        browserName: 'MicrosoftEdge'
    }],    logLevel: 'silent',
    bail: 0,
    baseUrl: testConfig.baseUrl,
    waitforTimeout: testConfig.defaultTimeout,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    beforeSuite: async function (suite) {
        await browser.maximizeWindow();
    },
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await browser.takeScreenshot();
        }
    }
}
