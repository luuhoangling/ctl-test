const fs = require('fs');
const path = require('path');

class ScreenshotUtils {
    // Track which modules have been cleared in this session
    static clearedModules = new Set();
    static sessionStartTime = Date.now();
    /**
     * Clear all screenshots from a specific folder
     * @param {string} folderPath - Path to the screenshots folder
     */
    static async clearScreenshotsFolder(folderPath) {
        try {
            // Check if folder exists
            if (!fs.existsSync(folderPath)) {
                console.log(`📁 Folder ${folderPath} does not exist, creating it...`);
                fs.mkdirSync(folderPath, { recursive: true });
                return;
            }

            // Read all files in the folder
            const files = fs.readdirSync(folderPath);
            
            if (files.length === 0) {
                console.log(`📁 Folder ${folderPath} is already empty`);
                return;
            }

            // Delete all image files
            let deletedCount = 0;
            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isFile()) {
                    // Check if it's an image file
                    const ext = path.extname(file).toLowerCase();
                    if (['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext)) {
                        fs.unlinkSync(filePath);
                        deletedCount++;
                    }
                }
            });

            console.log(`🗑️ Cleared ${deletedCount} old screenshots from ${folderPath}`);
        } catch (error) {
            console.log(`❌ Error clearing screenshots folder ${folderPath}:`, error.message);
        }
    }

    /**
     * Clear all screenshots from all test modules
     */
    static async clearAllScreenshots() {
        try {
            const screenshotsBasePath = './screenshots';
            const modules = ['login', 'profile', 'search'];

            console.log('🧹 Starting to clear all old screenshots...');

            for (const module of modules) {
                const modulePath = path.join(screenshotsBasePath, module);
                await this.clearScreenshotsFolder(modulePath);
            }

            console.log('✅ All old screenshots cleared successfully!');
        } catch (error) {
            console.log('❌ Error clearing all screenshots:', error.message);
        }
    }    /**
     * Clear screenshots for a specific module (only once per session)
     * @param {string} moduleName - Name of the module (login, profile, search)
     * @param {boolean} force - Force clear even if already cleared in this session
     */
    static async clearModuleScreenshots(moduleName, force = false) {
        try {
            // Check if already cleared in this session
            if (!force && this.clearedModules.has(moduleName)) {
                console.log(`📁 Screenshots for ${moduleName} module already cleared in this session`);
                return;
            }

            const modulePath = path.join('./screenshots', moduleName);
            console.log(`🧹 Clearing screenshots for ${moduleName} module...`);
            await this.clearScreenshotsFolder(modulePath);
            
            // Mark as cleared for this session
            this.clearedModules.add(moduleName);
        } catch (error) {
            console.log(`❌ Error clearing ${moduleName} screenshots:`, error.message);
        }
    }    /**
     * Take a test result screenshot with smart clearing
     * @param {string} moduleName - Module name (login, profile, search)
     * @param {string} testCaseId - Test case ID
     * @param {string} status - Test status (PASSED, FAILED)
     * @param {boolean} clearBeforeFirstShot - Whether to clear old screenshots before first screenshot of the session
     */
    static async takeTestResultScreenshot(moduleName, testCaseId, status = 'PASSED', clearBeforeFirstShot = true) {
        try {
            // Clear old screenshots only once per module per session
            if (clearBeforeFirstShot && !this.clearedModules.has(moduleName)) {
                await this.clearModuleScreenshots(moduleName);
            }

            // Take screenshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = `./screenshots/${moduleName}/${testCaseId}_${status}_${timestamp}.png`;

            // Ensure directory exists
            const dir = path.dirname(screenshotPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            await browser.saveScreenshot(screenshotPath);
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
            return screenshotPath;
        } catch (error) {
            console.log('❌ Error taking screenshot:', error.message);
            return null;
        }
    }

    /**
     * Reset the clearing session (useful for new test runs)
     */
    static resetSession() {
        this.clearedModules.clear();
        this.sessionStartTime = Date.now();
        console.log('🔄 Screenshot clearing session reset');
    }

    /**
     * Check if a module has been cleared in current session
     */
    static isModuleCleared(moduleName) {
        return this.clearedModules.has(moduleName);
    }

    /**
     * Get session info
     */
    static getSessionInfo() {
        return {
            sessionStartTime: this.sessionStartTime,
            clearedModules: Array.from(this.clearedModules),
            sessionDuration: Date.now() - this.sessionStartTime
        };
    }
}

module.exports = ScreenshotUtils;
