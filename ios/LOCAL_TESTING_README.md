# Local iOS Testing Setup for Clarien Mobile Banking

## 🎯 Overview
This setup allows you to run Clarien mobile banking login tests locally on iOS devices/simulators with comprehensive Allure reporting.

## 📋 Prerequisites

### 1. iOS Development Environment
- **Xcode** installed (latest version recommended)
- **iOS Simulator** or physical iOS device
- **Xcode Command Line Tools**: `xcode-select --install`

### 2. Appium Setup
```bash
# Install Appium globally
npm install -g appium

# Install XCUITest driver for iOS
appium driver install xcuitest

# Verify installation
appium doctor --ios
```

### 3. Device/Simulator Setup
**For iOS Simulator:**
```bash
# List available simulators
xcrun simctl list devices

# Boot simulator (optional - Appium can do this)
xcrun simctl boot "iPhone 15"
```

**For Physical Device:**
- Enable **Developer Mode** in iOS Settings
- Trust the computer in device settings
- Install **ios-deploy**: `npm install -g ios-deploy`
- Get device UDID: `idevice_id -l` or from Xcode

## 🚀 Quick Start

### 1. Start Appium Server
```bash
cd ios
appium --config appium-config.json
```

### 2. Update Test Configuration
Edit `test/clarien_local_test.js` capabilities:
```javascript
const capabilities = {
  'platformName': 'iOS',
  'platformVersion': '17.0',        // Your iOS version
  'deviceName': 'iPhone 15',        // Your device/simulator
  'app': path.join(__dirname, '..', 'LocalSample.ipa'),
  'automationName': 'XCUITest',
  'udid': 'auto',                   // Or specific device UDID
  'bundleId': 'com.clarien.imobile' // Actual Clarien app bundle ID
};
```

### 3. Run Local Tests
```bash
# Clean previous reports
npm run clean-reports

# Run local iOS tests with Allure
npm run local-test

# Generate Allure report
npm run allure-generate

# Serve Allure report in browser
npm run allure-serve
```

## 📊 Available Commands

```bash
# Test Execution
npm run local-test          # Run local iOS tests with Allure
npm run sample-test          # Run BrowserStack tests

# Report Management
npm run clean-reports        # Clean previous test results
npm run allure-generate      # Generate HTML report from results
npm run allure-serve         # Generate and serve report in browser
npm run allure-open          # Open existing report
```

## 🔧 Configuration Files

### `appium-config.json`
- Appium server configuration
- iOS-specific settings
- Logging and security options

### `test/clarien_local_test.js`
- Local test execution file
- iOS capabilities configuration
- Clarien app-specific test logic
- Allure reporting integration

## 📱 iOS-Specific Features

### Element Selectors
```javascript
// iOS uses XCUIElementType selectors
usernameField: "//XCUIElementTypeTextField[@name='actual_user_input_123-0']"
passwordField: "//XCUIElementTypeSecureTextField[@name='noauto_pass-0']"
loginButton: "//XCUIElementTypeButton[@name='Log In']"
```

### iOS Alert Handling
```javascript
// Handle iOS native alerts
const alertOKButton = await driver.findElement(By.xpath("//XCUIElementTypeButton[@name='OK']"));
await alertOKButton.click();
```

### Screenshot Capture
- Automatic screenshot capture at each test step
- Screenshots saved to `screenshots/` directory
- Integrated with Allure reports for visual evidence

## 🧪 Test Structure

### Authentication Tests
- ✅ **Valid Login**: Tests successful login with `Clarientest`/`Clarien@123`
- ✅ **Invalid Login**: Tests error handling for wrong credentials
- ✅ **Permission Handling**: Manages iOS app permissions
- ✅ **Alert Management**: Handles iOS native alerts

### Allure Integration
- 📊 **Detailed Steps**: Each test step documented
- 📸 **Screenshots**: Visual evidence at each stage  
- 📈 **Parameters**: Test data and results tracked
- 🏷️ **Tags**: Test categorization and filtering
- 📋 **Descriptions**: Comprehensive test documentation

## 🔍 Troubleshooting

### Common Issues

**1. Appium Server Connection**
```bash
# Check if Appium is running
curl http://127.0.0.1:4723/status
```

**2. iOS Simulator Issues**
```bash
# Reset simulator
xcrun simctl erase "iPhone 15"
xcrun simctl boot "iPhone 15"
```

**3. Physical Device Issues**
- Verify device is trusted and in developer mode
- Check UDID is correct: `idevice_id -l`
- Ensure Xcode can deploy to device

**4. App Installation Issues**
- Verify `.ipa` file path is correct
- Check app is signed properly for device
- Ensure bundle ID matches actual app

### Debug Mode
Enable verbose logging in `appium-config.json`:
```json
{
  "server": {
    "log-level": "debug",
    "log": "./appium-debug.log"
  }
}
```

## 📁 Generated Artifacts

### Test Results
- `allure-results/` - Raw JSON test results
- `allure-report/` - Generated HTML report
- `screenshots/` - Test execution screenshots
- `appium.log` - Appium server logs

### Report Features
- 📊 Test execution timeline
- 📈 Success/failure statistics  
- 🖼️ Step-by-step screenshots
- 📋 Detailed test documentation
- 🏷️ Test categorization and filtering

## 🎯 Next Steps

1. **Configure Real App**: Replace `LocalSample.ipa` with actual Clarien banking app
2. **Update Bundle ID**: Set correct `bundleId` in capabilities
3. **Refine Selectors**: Adjust element selectors based on actual app elements
4. **Add More Tests**: Expand test coverage for banking features
5. **CI/CD Integration**: Integrate with build pipelines

## 📞 Support

For issues with:
- **Appium**: Check [Appium Documentation](https://appium.io/docs/)
- **iOS Setup**: Review [iOS Real Device Setup](https://appium.io/docs/en/drivers/ios-xcuitest-real-devices/)
- **Allure Reports**: See [Allure Framework](https://allurereport.org/)

---

**Happy Testing!** 🚀📱✨
