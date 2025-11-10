const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

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

// AI-Optimized Driver Configuration
const buildDriver = function() {
  return new Builder()
    .usingServer('http://127.0.0.1:4723/wd/hub')
    .build();
};

describe('AI-Enhanced Clarien Mobile Banking Login Test', () => {
  let driver;

  // Screenshot helper function
  const takeScreenshot = async (driver, stepName) => {
    try {
      const screenshot = await driver.takeScreenshot();
      console.log(`📸 Screenshot taken: ${stepName}`);
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
    console.log('🚀 Initializing driver...');
    driver = buildDriver();
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
        console.log('✅ Driver cleanup completed');
      } catch (cleanupError) {
        console.log('⚠️ Driver cleanup warning:', cleanupError.message);
      }
    }
  });

  it('should perform Clarien mobile banking login validation', async () => {
    console.log('🏦 Starting Clarien mobile banking login test');
    
    try {
      // Step 1: Wait for app to load
      console.log('📱 Step 1: Waiting for app to load...');
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'App launch screen');
      
      // Handle permission dialogs if they appear
      try {
        const allowButton = await driver.findElement(By.xpath(clarienElements.allowButton));
        if (await allowButton.isDisplayed()) {
          await allowButton.click();
          console.log('✅ Permission dialog handled');
          await takeScreenshot(driver, 'After allowing permissions');
        }
      } catch (e) {
        console.log('ℹ️ No permission dialog found, continuing...');
      }
      
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'Ready for login');

      // Step 2: Enter username
      console.log(`👤 Step 2: Entering username: ${testData.credentials.username}`);
      const usernameField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.usernameField)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'Username field located');
      await usernameField.clear();
      await usernameField.sendKeys(testData.credentials.username);
      await takeScreenshot(driver, 'Username entered');

      // Step 3: Enter password
      console.log('🔐 Step 3: Entering password...');
      const passwordField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.passwordField)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'Password field located');
      await passwordField.clear();
      await passwordField.sendKeys(testData.credentials.password);
      await takeScreenshot(driver, 'Password entered');

      // Step 4: Click login button
      console.log('🔑 Step 4: Clicking login button...');
      const loginButton = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.loginButton)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'Before clicking login button');
      await loginButton.click();
      await takeScreenshot(driver, 'After clicking login button');

      // Step 5: Wait for login processing and verify success
      console.log('⏳ Step 5: Waiting for login processing...');
      await driver.sleep(testData.timeout.login);
      await takeScreenshot(driver, 'After login processing');
      
      // Check for successful login indicators
      try {
        const welcomeMessage = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.welcomeMessage)), 
          testData.timeout.element
        );
        
        const isWelcomeDisplayed = await welcomeMessage.isDisplayed();
        assert(isWelcomeDisplayed, 'Welcome message should be displayed after successful login');
        
        console.log('✅ Login successful! Dashboard loaded');
        await takeScreenshot(driver, 'Login successful - Dashboard loaded');
        
      } catch (welcomeError) {
        // Check for error messages if login failed
        try {
          const errorMessage = await driver.findElement(By.xpath(clarienElements.errorMessage));
          const errorText = await errorMessage.getText();
          await takeScreenshot(driver, 'Login error message');
          
          console.log('❌ Login failed with error:', errorText);
          throw new Error(`Login failed with error: ${errorText}`);
          
        } catch (noErrorElement) {
          await takeScreenshot(driver, 'Unknown login state');
          throw new Error('Login result unclear - no welcome message or error message found');
        }
      }

      // Success reporting to BrowserStack
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "✅ Clarien mobile banking login successful"}}'
      );

      console.log('🎉 Test completed successfully!');

    } catch (error) {
      console.error('❌ Clarien login test failed:', error.message);
      await takeScreenshot(driver, 'Login test failure screenshot');
      
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "❌ Clarien login test failed: ' + error.message + '"}}'
      );
      
      throw error;
    }
  });

  it('should handle invalid login credentials gracefully', async () => {
    console.log('🔒 Starting invalid login credentials test');
    
    try {
      // Step 1: Wait for app to load
      console.log('📱 Step 1: Waiting for app to load...');
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'App ready for invalid login test');

      // Step 2: Enter invalid username
      console.log('👤 Step 2: Entering invalid username...');
      const usernameField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.usernameField)), 
        testData.timeout.element
      );
      await usernameField.clear();
      await usernameField.sendKeys('invaliduser');
      await takeScreenshot(driver, 'Invalid username entered');

      // Step 3: Enter invalid password
      console.log('🔐 Step 3: Entering invalid password...');
      const passwordField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.passwordField)), 
        testData.timeout.element
      );
      await passwordField.clear();
      await passwordField.sendKeys('wrongpassword');
      await takeScreenshot(driver, 'Invalid password entered');

      // Step 4: Click login button
      console.log('🔑 Step 4: Clicking login button...');
      const loginButton = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.loginButton)), 
        testData.timeout.element
      );
      await loginButton.click();
      await takeScreenshot(driver, 'Invalid login submitted');

      // Step 5: Verify error message appears
      console.log('⏳ Step 5: Checking for error message...');
      await driver.sleep(testData.timeout.wait);
      
      try {
        const errorMessage = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.errorMessage)), 
          testData.timeout.element
        );
        
        const errorText = await errorMessage.getText();
        const isErrorDisplayed = await errorMessage.isDisplayed();
        
        assert(isErrorDisplayed, 'Error message should be displayed for invalid credentials');
        console.log('✅ Error message displayed correctly:', errorText);
        
        await takeScreenshot(driver, 'Error message for invalid login');
        
      } catch (noErrorMessage) {
        await takeScreenshot(driver, 'No error message found');
        throw new Error('Expected error message for invalid credentials but none was found');
      }

      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "✅ Invalid login error handling verified"}}'
      );

      console.log('🎉 Invalid login test completed successfully!');

    } catch (error) {
      console.error('❌ Invalid login test failed:', error.message);
      await takeScreenshot(driver, 'Invalid login test failure');
      
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "❌ Invalid login test failed: ' + error.message + '"}}'
      );
      
      throw error;
    }
  });
});
