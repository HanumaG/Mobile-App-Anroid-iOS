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

// Local Appium Configuration
const buildDriver = function() {
  const capabilities = {
    'platformName': 'Android',
    'platformVersion': '13.0',
    'deviceName': 'Android Emulator',
    'app': path.join(__dirname, '..', 'iMobile_21Oct.apk'),
    'automationName': 'UiAutomator2',
    'newCommandTimeout': 300,
    'noReset': true
  };

  return new Builder()
    .usingServer('http://127.0.0.1:4723')
    .withCapabilities(capabilities)
    .build();
};

describe('AI-Enhanced Clarien Mobile Banking Login Test - Local Android', () => {
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

  // AI-optimized selectors for Clarien Banking App
  const clarienElements = {
    usernameField: "//android.widget.EditText[@resource-id='actual_user_input_123-0'] or //android.widget.EditText[@hint='Username' or @text='Username' or contains(@resource-id,'username')]",
    passwordField: "//android.widget.EditText[@resource-id='noauto_pass-0'] or //android.widget.EditText[@hint='Password' or @text='Password' or contains(@resource-id,'password')]",
    loginButton: "//android.widget.Button[@text='Log In'] or //android.widget.Button[@text='LOGIN' or @text='Login' or contains(@resource-id,'login')]",
    welcomeMessage: "//android.widget.TextView[contains(@text,'Welcome') or contains(@text,'Dashboard') or contains(@text,'Home')]",
    errorMessage: "//android.widget.TextView[contains(@text,'Invalid') or contains(@text,'Error') or contains(@text,'incorrect')]",
    allowButton: "//android.widget.Button[@text='ALLOW' or @text='Allow']"
  };

  beforeEach(async () => {
    console.log('🚀 Initializing local Android driver...');
    driver = buildDriver();
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
        console.log('✅ Local Android Driver cleanup completed');
      } catch (cleanupError) {
        console.log('⚠️ Local Android Driver cleanup warning:', cleanupError.message);
      }
    }
  });

  it('should perform Clarien mobile banking login validation locally', async () => {
    allure.description('AI-Enhanced local test that validates Clarien mobile banking login functionality with real credentials');
    allure.feature('Authentication');
    allure.story('Local Mobile Banking Login');
    allure.severity('critical');
    allure.tag('local-android');
    
    console.log('🏦 Starting Clarien local Android mobile banking login test');
    
    try {
      // Step 1: Wait for app to load
      allure.step('Initialize app and handle permissions', async () => {
        console.log('📱 Step 1: Waiting for local Android app to load...');
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_Android_App_launch_screen');
        
        // Handle permission dialogs if they appear
        try {
          const allowButton = await driver.findElement(By.xpath(clarienElements.allowButton));
          if (await allowButton.isDisplayed()) {
            await allowButton.click();
            console.log('✅ Local Android Permission dialog handled');
            await takeScreenshot(driver, 'Local_Android_After_allowing_permissions');
          }
        } catch (e) {
          console.log('ℹ️ No local Android permission dialog found, continuing...');
        }
        
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_Android_Ready_for_login');
      });

      // Step 2: Enter username
      allure.step(`Enter username: ${testData.credentials.username}`, async () => {
        console.log(`👤 Step 2: Entering username: ${testData.credentials.username}`);
        const usernameField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.usernameField)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_Android_Username_field_located');
        await usernameField.clear();
        await usernameField.sendKeys(testData.credentials.username);
        await takeScreenshot(driver, 'Local_Android_Username_entered');
        
        allure.parameter('Username', testData.credentials.username);
      });

      // Step 3: Enter password
      allure.step('Enter password', async () => {
        console.log('🔐 Step 3: Entering password...');
        const passwordField = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.passwordField)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_Android_Password_field_located');
        await passwordField.clear();
        await passwordField.sendKeys(testData.credentials.password);
        await takeScreenshot(driver, 'Local_Android_Password_entered');
      });

      // Step 4: Click login button
      allure.step('Submit login credentials', async () => {
        console.log('🔑 Step 4: Clicking local Android login button...');
        const loginButton = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.loginButton)), 
          testData.timeout.element
        );
        await takeScreenshot(driver, 'Local_Android_Before_clicking_login_button');
        await loginButton.click();
        await takeScreenshot(driver, 'Local_Android_After_clicking_login_button');
      });

      // Step 5: Wait for login processing and verify success
      allure.step('Verify successful login', async () => {
        console.log('⏳ Step 5: Waiting for local Android login processing...');
        await driver.sleep(testData.timeout.login);
        await takeScreenshot(driver, 'Local_Android_After_login_processing');
        
        // Check for successful login indicators
        try {
          const welcomeMessage = await driver.wait(
            until.elementLocated(By.xpath(clarienElements.welcomeMessage)), 
            testData.timeout.element
          );
          
          const isWelcomeDisplayed = await welcomeMessage.isDisplayed();
          assert(isWelcomeDisplayed, 'Welcome message should be displayed after successful login');
          
          console.log('✅ Local Android Login successful! Dashboard loaded');
          await takeScreenshot(driver, 'Local_Android_Login_successful_Dashboard_loaded');
          
          allure.parameter('Login Status', 'Success');
          
        } catch (welcomeError) {
          // Check for error messages if login failed
          try {
            const errorMessage = await driver.findElement(By.xpath(clarienElements.errorMessage));
            const errorText = await errorMessage.getText();
            await takeScreenshot(driver, 'Local_Android_Login_error_message');
            
            console.log('❌ Local Android Login failed with error:', errorText);
            allure.parameter('Error Message', errorText);
            throw new Error(`Local Android Login failed with error: ${errorText}`);
            
          } catch (noErrorElement) {
            await takeScreenshot(driver, 'Local_Android_Unknown_login_state');
            throw new Error('Local Android Login result unclear - no welcome message or error message found');
          }
        }
      });

      console.log('🎉 Local Android Test completed successfully!');

    } catch (error) {
      console.error('❌ Local Android Clarien login test failed:', error.message);
      await takeScreenshot(driver, 'Local_Android_Login_test_failure_screenshot');
      
      allure.parameter('Test Result', 'Failed');
      allure.parameter('Error Details', error.message);
      
      throw error;
    }
  });

  it('should handle invalid login credentials gracefully locally', async () => {
    allure.description('AI-Enhanced local test that validates error handling for invalid login credentials');
    allure.feature('Authentication');
    allure.story('Local Invalid Login Handling');
    allure.severity('high');
    allure.tag('local-android');
    
    console.log('🔒 Starting local Android invalid login credentials test');
    
    try {
      // Step 1: Wait for app to load
      allure.step('Initialize app for invalid login test', async () => {
        console.log('📱 Step 1: Waiting for local Android app to load...');
        await driver.sleep(testData.timeout.wait);
        await takeScreenshot(driver, 'Local_Android_App_ready_for_invalid_login_test');
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
        await takeScreenshot(driver, 'Local_Android_Invalid_username_entered');
        
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
        await takeScreenshot(driver, 'Local_Android_Invalid_password_entered');
      });

      // Step 4: Click login button
      allure.step('Submit invalid credentials', async () => {
        console.log('🔑 Step 4: Clicking local Android login button...');
        const loginButton = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.loginButton)), 
          testData.timeout.element
        );
        await loginButton.click();
        await takeScreenshot(driver, 'Local_Android_Invalid_login_submitted');
      });

      // Step 5: Verify error message appears
      allure.step('Verify error message for invalid credentials', async () => {
        console.log('⏳ Step 5: Checking for local Android error message...');
        await driver.sleep(testData.timeout.wait);
        
        try {
          const errorMessage = await driver.wait(
            until.elementLocated(By.xpath(clarienElements.errorMessage)), 
            testData.timeout.element
          );
          
          const errorText = await errorMessage.getText();
          const isErrorDisplayed = await errorMessage.isDisplayed();
          
          assert(isErrorDisplayed, 'Error message should be displayed for invalid credentials');
          console.log('✅ Local Android Error message displayed correctly:', errorText);
          
          await takeScreenshot(driver, 'Local_Android_Error_message_for_invalid_login');
          
          allure.parameter('Error Message', errorText);
          allure.parameter('Test Type', 'Invalid Credentials');
          
        } catch (noErrorMessage) {
          await takeScreenshot(driver, 'Local_Android_No_error_message_found');
          throw new Error('Expected local Android error message for invalid credentials but none was found');
        }
      });

      console.log('🎉 Local Android Invalid login test completed successfully!');

    } catch (error) {
      console.error('❌ Local Android Invalid login test failed:', error.message);
      await takeScreenshot(driver, 'Local_Android_Invalid_login_test_failure');
      
      allure.parameter('Test Result', 'Failed');
      allure.parameter('Error Details', error.message);
      
      throw error;
    }
  });
});
