#!/usr/bin/env node

/**
 * Script to clear all old screenshots from the project
 * Usage: node clearScreenshots.js [module_name]
 * 
 * Examples:
 * - node clearScreenshots.js           # Clear all screenshots
 * - node clearScreenshots.js login     # Clear only login screenshots
 * - node clearScreenshots.js profile   # Clear only profile screenshots
 * - node clearScreenshots.js search    # Clear only search screenshots
 */

const ScreenshotUtils = require('./utils/screenshotUtils');

async function main() {
    const args = process.argv.slice(2);
    const moduleName = args[0];

    console.log('🧹 Screenshot Cleaner Tool');
    console.log('========================');

    if (moduleName) {
        // Clear specific module screenshots
        const validModules = ['login', 'profile', 'search'];
        
        if (!validModules.includes(moduleName)) {
            console.log(`❌ Invalid module name: ${moduleName}`);
            console.log(`✅ Valid modules: ${validModules.join(', ')}`);
            process.exit(1);
        }

        console.log(`🎯 Clearing screenshots for ${moduleName} module...`);
        await ScreenshotUtils.clearModuleScreenshots(moduleName);
    } else {
        // Clear all screenshots
        console.log('🎯 Clearing all screenshots...');
        await ScreenshotUtils.clearAllScreenshots();
    }

    console.log('✨ Screenshot cleaning completed!');
}

// Run the script
main().catch(error => {
    console.error('❌ Error running screenshot cleaner:', error);
    process.exit(1);
});
