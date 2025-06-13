const testConfig = require('../config/testConfig');

class TestHelper {
    
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static async waitForElement(element, timeout = testConfig.defaultTimeout) {
        try {
            await element.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            console.log(`Element not found within ${timeout}ms:`, error.message);
            return false;
        }
    }
    
    static async waitForElementClickable(element, timeout = testConfig.defaultTimeout) {
        try {
            await element.waitForClickable({ timeout });
            return true;
        } catch (error) {
            console.log(`Element not clickable within ${timeout}ms:`, error.message);
            return false;
        }
    }
    
    static async safeClick(element, timeout = testConfig.defaultTimeout) {
        try {
            await element.waitForClickable({ timeout });
            await element.click();
            return true;
        } catch (error) {
            console.log('Safe click failed:', error.message);
            return false;
        }
    }
    
    static async safeSetValue(element, value, timeout = testConfig.defaultTimeout) {
        try {
            await element.waitForDisplayed({ timeout });
            await element.clearValue();
            await element.setValue(value);
            return true;
        } catch (error) {
            console.log('Safe set value failed:', error.message);
            return false;
        }
    }
    
    static async getTextSafely(element, timeout = testConfig.defaultTimeout) {
        try {
            await element.waitForDisplayed({ timeout });
            return await element.getText();
        } catch (error) {
            console.log('Get text safely failed:', error.message);
            return '';
        }
    }
    
    static async takeScreenshot(name = 'screenshot') {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${name}-${timestamp}.png`;
            await browser.saveScreenshot(`./screenshots/${filename}`);
            console.log(`Screenshot saved: ${filename}`);
        } catch (error) {
            console.log('Screenshot failed:', error.message);
        }
    }
    
    static async isElementDisplayed(element, timeout = 3000) {
        try {
            await element.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            return false;
        }
    }
    
    static async getCurrentUrl() {
        try {
            return await browser.getUrl();
        } catch (error) {
            console.log('Get current URL failed:', error.message);
            return '';
        }
    }
    
    static async navigateToUrl(url) {
        try {
            await browser.url(url);
            await this.sleep(2000);
            return true;
        } catch (error) {
            console.log('Navigation failed:', error.message);
            return false;
        }
    }
    
    static checkTextInMessages(actualText, expectedMessages) {
        if (!actualText || !expectedMessages || !Array.isArray(expectedMessages)) {
            return false;
        }
        
        const actualLower = actualText.toLowerCase();
        return expectedMessages.some(expectedMsg => 
            actualLower.includes(expectedMsg.toLowerCase())
        );
    }
    
    static async refreshPage() {
        try {
            await browser.refresh();
            await this.sleep(2000);
            return true;
        } catch (error) {
            console.log('Page refresh failed:', error.message);
            return false;
        }
    }
}

module.exports = TestHelper;
