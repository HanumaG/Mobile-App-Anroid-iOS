const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const allure = require('allure-mocha/runtime');
const fs = require('fs');
const path = require('path');

// AI-Enhanced Test Data Configuration for Clarien Banking Login
const testData = {
  credentials: {
    username: 'Clarientest',
    password: 'Clarien@123'
  },
  timeout: {
    element: 30000,
    wait: 5000,
    login: 10000
  }
};

// Local Appium Configuration for iOS
const buildDriver = function() {
  const capabilities = {
    'platformName': 'iOS',
    'platformVersion': '17.0',
    'deviceName': 'iPhone 15',
    'app': path.join(__dirname, '..', 'LocalSample.ipa'),
    'automationName': 'XCUITest',
    'newCommandTimeout': 300,
    'noReset': true,
    'udid': 'auto', // Use connected device or simulator
    'bundleId': 'com.clarien.imobile' // Replace with actual Clarien app bundle ID
  };

  return new Builder()
    .usingServer('http://127.0.0.1:4723')
    .withCapabilities(capabilities)
    .build();
};

describe('AI-Enhanced Clarien Mobile Banking Login Test - Local iOS', () => {
  let driver;

  // Screenshot helper function with Allure attachment
  const takeScreenshot = async (driver, stepName) => {
    try {
      const screenshot = await driver.takeScreenshot();
      console.log(`📸 Screenshot taken: ${stepName}`);
      
      // Create screenshots directory if it doesn't exist
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      // Save screenshot file
      const filename = `${stepName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
      const filepath = path.join(screenshotDir, filename);
      fs.writeFileSync(filepath, screenshot, 'base64');
      
      // Attach to Allure report
      allure.attachment(stepName, Buffer.from(screenshot, 'base64'), 'image/png');
    } catch (error) {
      console.log('Screenshot capture failed:', error.message);
    }
  };

  // AI-optimized selectors for Clarien Banking iOS App
  const clarienElements = {
    usernameField: "//XCUIElementTypeTextField[@name='actual_user_input_123-0'] or //XCUIElementTypeTextField[@name='username' or @placeholder='Username' or @value='Username']",
    passwordField: "//XCUIElementTypeSecureTextField[@name='noauto_pass-0'] or //XCUIElementTypeSecureTextField[@name='password' or @placeholder='Password']",
    loginButton: "//XCUIElementTypeButton[@name='Log In'] or //XCUIElementTypeButton[@name='LOGIN' or @name='Login' or @label='Login']",
    welcomeMessage: "//XCUIElementTypeStaticText[contains(@name,'Welcome') or contains(@name,'Dashboard') or contains(@name,'Home')]",
    errorMessage: "//XCUIElementTypeStaticText[contains(@name,'Invalid') or contains(@name,'Error') or contains(@name,'incorrect')]",
    allowButton: "//XCUIElementTypeButton[@name='Allow' or @name='OK']",
    alertOKButton: "//XCUIElementTypeButton[@name='OK']",
    dashboardElement: "//XCUIElementTypeStaticText[contains(@name,'Balance') or contains(@name,'Account') or contains(@name,'Menu')]"
  };

  beforeEach(async () => {
    console.log('🚀 Initializing local iOS driver...');
    driver = buildDriver();
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
        console.log('✅ Local iOS Driver cleanup completed');
      } catch (cleanupError) {
        console.log('⚠️ Local iOS Driver cleanup warning:', cleanupError.message);
      }
    }
  });

  it('should perform Clarien mobile banking login validation locally on iOS', async () => {
    allure.description('AI-Enhanced local iOS test that validates Clarien mobile banking login functionality with real credentials');
    allure.feature('Authentication');
    allure.story('Local iOS Mobile Banking Login');
    allure.severity('critical');
    allure.tag('local-ios');
    
    console.log('🏦 Starting Clarien local iOS mobile banking login test');
    
    try {
      // Step 1: Wait for app to load and handle initial screens
      allure.step('Initialize iOS app and handle permissions', async () => {
        console.log('📱 Step 1: Waiting for local iOS app to load...');
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_iOS_App_launch_screen');
        
        // Handle permission dialogs if they appear
        try {
          const allowButton = await driver.findElement(By.xpath(clarienElements.allowButton));
          if (await allowButton.isDisplayed()) {
            await allowButton.click();
            console.log('✅ Local iOS Permission dialog handled');
            await takeScreenshot(driver, 'Local_iOS_After_allowing_permissions');
          }
        } catch (e) {
          console.log('ℹ️ No local iOS permission dialog found, continuing...');
        }
        
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_iOS_Ready_for_login');
      });

      // Step 2: Enter username
      allure.step(`Enter username: ${testData.credentials.username}`, async () => {
        console.log(`👤 Step 2: Entering username: ${testData.credentials.username}`);
        const usernameField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.usernameField)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_iOS_Username_field_located');
        await usernameField.clear();
        await usernameField.sendKeys(testData.credentials.username);
        await takeScreenshot(driver, 'Local_iOS_Username_entered');
        
        allure.parameter('Username', testData.credentials.username);
      });

      // Step 3: Enter password
      allure.step('Enter password', async () => {
        console.log('🔐 Step 3: Entering password...');
        const passwordField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.passwordField)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_iOS_Password_field_located');
        await passwordField.clear();
        await passwordField.sendKeys(testData.credentials.password);
        await takeScreenshot(driver, 'Local_iOS_Password_entered');
      });

      // Step 4: Click login button
      allure.step('Submit login credentials', async () => {
        console.log('🔑 Step 4: Clicking local iOS login button...');
        const loginButton = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.loginButton)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_iOS_Before_clicking_login_button');
        await loginButton.click();
        await takeScreenshot(driver, 'Local_iOS_After_clicking_login_button');
      });

      // Step 5: Wait for login processing and verify success
      allure.step('Verify successful login', async () => {
        console.log('⏳ Step 5: Waiting for local iOS login processing...');
        await driver.sleep(testData.timeout.login);
        await takeScreenshot(driver, 'Local_iOS_After_login_processing');
        
        // Check for successful login indicators
        try {
          // Try to find welcome message or dashboard elements
          const welcomeMessage = await driver.wait(
            until.elementLocated(By.xpath(clarienElements.welcomeMessage)), 
            testData.timeout.element
          );
          
          const isWelcomeDisplayed = await welcomeMessage.isDisplayed();
          assert(isWelcomeDisplayed, 'Welcome message should be displayed after successful login');
          
          console.log('✅ Local iOS Login successful! Dashboard loaded');
          await takeScreenshot(driver, 'Local_iOS_Login_successful_Dashboard_loaded');
          
          allure.parameter('Login Status', 'Success');
          
        } catch (welcomeError) {
          // Try alternative dashboard elements
          try {
            const dashboardElement = await driver.wait(
              until.elementLocated(By.xpath(clarienElements.dashboardElement)), 
              testData.timeout.element
            );
            
            const isDashboardDisplayed = await dashboardElement.isDisplayed();
            assert(isDashboardDisplayed, 'Dashboard elements should be displayed after successful login');
            
            console.log('✅ Local iOS Login successful! Dashboard elements found');
            await takeScreenshot(driver, 'Local_iOS_Login_successful_Dashboard_elements_found');
            
          } catch (dashboardError) {
            // Check for error messages if login failed
            try {
              const errorMessage = await driver.findElement(By.xpath(clarienElements.errorMessage));
              const errorText = await errorMessage.getText();
              await takeScreenshot(driver, 'Local_iOS_Login_error_message');
              
              console.log('❌ Local iOS Login failed with error:', errorText);
              allure.parameter('Error Message', errorText);
              throw new Error(`Local iOS Login failed with error: ${errorText}`);
              
            } catch (noErrorElement) {
              await takeScreenshot(driver, 'Local_iOS_Unknown_login_state');
              throw new Error('Local iOS Login result unclear - no welcome message, dashboard elements, or error message found');
            }
          }
        }
      });

      console.log('🎉 Local iOS Test completed successfully!');

    } catch (error) {
      console.error('❌ Local iOS Clarien login test failed:', error.message);
      await takeScreenshot(driver, 'Local_iOS_Login_test_failure_screenshot');
      
      allure.parameter('Test Result', 'Failed');
      allure.parameter('Error Details', error.message);
      
      throw error;
    }
  });

  it('should handle invalid login credentials gracefully locally on iOS', async () => {
    allure.description('AI-Enhanced local iOS test that validates error handling for invalid login credentials');
    allure.feature('Authentication');
    allure.story('Local iOS Invalid Login Handling');
    allure.severity('high');
    allure.tag('local-ios');
    
    console.log('🔒 Starting local iOS invalid login credentials test');
    
    try {
      // Step 1: Wait for app to load
      allure.step('Initialize iOS app for invalid login test', async () => {
        console.log('📱 Step 1: Waiting for local iOS app to load...');
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_iOS_App_ready_for_invalid_login_test');
      });

      // Step 2: Enter invalid username
      allure.step('Enter invalid username', async () => {
        console.log('👤 Step 2: Entering invalid username...');
        const usernameField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.usernameField)), 
          testData.timeout.element
        );
        await usernameField.clear();
        await usernameField.sendKeys('invaliduser');
        await takeScreenshot(driver, 'Local_iOS_Invalid_username_entered');
        
        allure.parameter('Invalid Username', 'invaliduser');
      });

      // Step 3: Enter invalid password
      allure.step('Enter invalid password', async () => {
        console.log('🔐 Step 3: Entering invalid password...');
        const passwordField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.passwordField)), 
          testData.timeout.element
        );
        await passwordField.clear();
        await passwordField.sendKeys('wrongpassword');
        await takeScreenshot(driver, 'Local_iOS_Invalid_password_entered');
      });

      // Step 4: Click login button
      allure.step('Submit invalid credentials', async () => {
        console.log('🔑 Step 4: Clicking local iOS login button...');
        const loginButton = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.loginButton)), 
          testData.timeout.element
        );
        await loginButton.click();
        await takeScreenshot(driver, 'Local_iOS_Invalid_login_submitted');
      });

      // Step 5: Verify error message appears
      allure.step('Verify error message for invalid credentials', async () => {
        console.log('⏳ Step 5: Checking for local iOS error message...');
        await driver.sleep(testData.timeout.wait);
        
        try {
          const errorMessage = await driver.wait(
            until.elementLocated(By.xpath(clarienElements.errorMessage)), 
            testData.timeout.element
          );
          
          const errorText = await errorMessage.getText();
          const isErrorDisplayed = await errorMessage.isDisplayed();
          
          assert(isErrorDisplayed, 'Error message should be displayed for invalid credentials');
          console.log('✅ Local iOS Error message displayed correctly:', errorText);
          
          await takeScreenshot(driver, 'Local_iOS_Error_message_for_invalid_login');
          
          allure.parameter('Error Message', errorText);
          allure.parameter('Test Type', 'Invalid Credentials');
          allure.parameter('Platform', 'iOS');
          
        } catch (noErrorMessage) {
          // Check for alert dialogs on iOS
          try {
            const alertOKButton = await driver.findElement(By.xpath(clarienElements.alertOKButton));
            if (await alertOKButton.isDisplayed()) {
              await takeScreenshot(driver, 'Local_iOS_Alert_for_invalid_login');
              await alertOKButton.click();
              console.log('✅ Local iOS Alert dismissed for invalid credentials');
            }
          } catch (noAlert) {
            await takeScreenshot(driver, 'Local_iOS_No_error_message_or_alert_found');
            throw new Error('Expected local iOS error message or alert for invalid credentials but none was found');
          }
        }
      });

      console.log('🎉 Local iOS Invalid login test completed successfully!');

    } catch (error) {
      console.error('❌ Local iOS Invalid login test failed:', error.message);
      await takeScreenshot(driver, 'Local_iOS_Invalid_login_test_failure');
      
      allure.parameter('Test Result', 'Failed');
      allure.parameter('Error Details', error.message);
      
      throw error;
    }
  });
});
