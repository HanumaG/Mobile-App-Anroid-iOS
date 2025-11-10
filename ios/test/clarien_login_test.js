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

describe('AI-Enhanced Clarien Mobile Banking Login Test - iOS', () => {
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
    console.log('🚀 Initializing iOS driver...');
    driver = buildDriver();
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
        console.log('✅ iOS Driver cleanup completed');
      } catch (cleanupError) {
        console.log('⚠️ iOS Driver cleanup warning:', cleanupError.message);
      }
    }
  });

  it('should perform Clarien mobile banking login validation on iOS', async () => {
    console.log('🏦 Starting Clarien iOS mobile banking login test');
    
    try {
      // Step 1: Wait for app to load and handle initial screens
      console.log('📱 Step 1: Waiting for iOS app to load...');
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'iOS App launch screen');
      
      // Handle permission dialogs if they appear
      try {
        const allowButton = await driver.findElement(By.xpath(clarienElements.allowButton));
        if (await allowButton.isDisplayed()) {
          await allowButton.click();
          console.log('✅ iOS Permission dialog handled');
          await takeScreenshot(driver, 'After allowing iOS permissions');
        }
      } catch (e) {
        console.log('ℹ️ No iOS permission dialog found, continuing...');
      }
      
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'iOS Ready for login');

      // Step 2: Enter username
      console.log(`👤 Step 2: Entering username: ${testData.credentials.username}`);
      const usernameField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.usernameField)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'iOS Username field located');
      await usernameField.clear();
      await usernameField.sendKeys(testData.credentials.username);
      await takeScreenshot(driver, 'iOS Username entered');

      // Step 3: Enter password
      console.log('🔐 Step 3: Entering password...');
      const passwordField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.passwordField)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'iOS Password field located');
      await passwordField.clear();
      await passwordField.sendKeys(testData.credentials.password);
      await takeScreenshot(driver, 'iOS Password entered');

      // Step 4: Click login button
      console.log('🔑 Step 4: Clicking iOS login button...');
      const loginButton = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.loginButton)), 
        testData.timeout.element
      );
      await takeScreenshot(driver, 'iOS Before clicking login button');
      await loginButton.click();
      await takeScreenshot(driver, 'iOS After clicking login button');

      // Step 5: Wait for login processing and verify success
      console.log('⏳ Step 5: Waiting for iOS login processing...');
      await driver.sleep(testData.timeout.login);
      await takeScreenshot(driver, 'iOS After login processing');
      
      // Check for successful login indicators
      try {
        // Try to find welcome message or dashboard elements
        const welcomeMessage = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.welcomeMessage)), 
          testData.timeout.element
        );
        
        const isWelcomeDisplayed = await welcomeMessage.isDisplayed();
        assert(isWelcomeDisplayed, 'Welcome message should be displayed after successful login');
        
        console.log('✅ iOS Login successful! Dashboard loaded');
        await takeScreenshot(driver, 'iOS Login successful - Dashboard loaded');
        
      } catch (welcomeError) {
        // Try alternative dashboard elements
        try {
          const dashboardElement = await driver.wait(
            until.elementLocated(By.xpath(clarienElements.dashboardElement)), 
            testData.timeout.element
          );
          
          const isDashboardDisplayed = await dashboardElement.isDisplayed();
          assert(isDashboardDisplayed, 'Dashboard elements should be displayed after successful login');
          
          console.log('✅ iOS Login successful! Dashboard elements found');
          await takeScreenshot(driver, 'iOS Login successful - Dashboard elements found');
          
        } catch (dashboardError) {
          // Check for error messages if login failed
          try {
            const errorMessage = await driver.findElement(By.xpath(clarienElements.errorMessage));
            const errorText = await errorMessage.getText();
            await takeScreenshot(driver, 'iOS Login error message');
            
            console.log('❌ iOS Login failed with error:', errorText);
            throw new Error(`iOS Login failed with error: ${errorText}`);
            
          } catch (noErrorElement) {
            await takeScreenshot(driver, 'iOS Unknown login state');
            throw new Error('iOS Login result unclear - no welcome message, dashboard elements, or error message found');
          }
        }
      }

      // Success reporting to BrowserStack
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed", "reason": "✅ iOS Clarien mobile banking login successful"}}'
      );

      console.log('🎉 iOS Test completed successfully!');

    } catch (error) {
      console.error('❌ iOS Clarien login test failed:', error.message);
      await takeScreenshot(driver, 'iOS Login test failure screenshot');
      
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed", "reason": "❌ iOS Clarien login test failed: ' + error.message + '"}}'
      );
      
      throw error;
    }
  });

  it('should handle invalid login credentials gracefully on iOS', async () => {
    console.log('🔒 Starting iOS invalid login credentials test');
    
    try {
      // Step 1: Wait for app to load
      console.log('📱 Step 1: Waiting for iOS app to load...');
      await driver.sleep(testData.timeout.wait);
      await takeScreenshot(driver, 'iOS App ready for invalid login test');

      // Step 2: Enter invalid username
      console.log('👤 Step 2: Entering invalid username...');
      const usernameField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.usernameField)), 
        testData.timeout.element
      );
      await usernameField.clear();
      await usernameField.sendKeys('invaliduser');
      await takeScreenshot(driver, 'iOS Invalid username entered');

      // Step 3: Enter invalid password
      console.log('🔐 Step 3: Entering invalid password...');
      const passwordField = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.passwordField)), 
        testData.timeout.element
      );
      await passwordField.clear();
      await passwordField.sendKeys('wrongpassword');
      await takeScreenshot(driver, 'iOS Invalid password entered');

      // Step 4: Click login button
      console.log('🔑 Step 4: Clicking iOS login button...');
      const loginButton = await driver.wait(
        until.elementLocated(By.xpath(clarienElements.loginButton)), 
        testData.timeout.element
      );
      await loginButton.click();
      await takeScreenshot(driver, 'iOS Invalid login submitted');

      // Step 5: Verify error message appears
      console.log('⏳ Step 5: Checking for iOS error message...');
      await driver.sleep(testData.timeout.wait);
      
      try {
        const errorMessage = await driver.wait(
          until.elementLocated(By.xpath(clarienElements.errorMessage)), 
          testData.timeout.element
        );
        
        const errorText = await errorMessage.getText();
        const isErrorDisplayed = await errorMessage.isDisplayed();
        
        assert(isErrorDisplayed, 'Error message should be displayed for invalid credentials');
        console.log('✅ iOS Error message displayed correctly:', errorText);
        
        await takeScreenshot(driver, 'iOS Error message for invalid login');
        
      } catch (noErrorMessage) {
        // Check for alert dialogs on iOS
        try {
          const alertOKButton = await driver.findElement(By.xpath(clarienElements.alertOKButton));
          if (await alertOKButton.isDisplayed()) {
            await takeScreenshot(driver, 'iOS Alert for invalid login');
            await alertOKButton.click();
            console.log('✅ iOS Alert dismissed for invalid credentials');
          }
        } catch (noAlert) {
          await takeScreenshot(driver, 'iOS No error message or alert found');
          throw new Error('Expected iOS error message or alert for invalid credentials but none was found');
        }
      }

      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed", "reason": "✅ iOS Invalid login error handling verified"}}'
      );

      console.log('🎉 iOS Invalid login test completed successfully!');

    } catch (error) {
      console.error('❌ iOS Invalid login test failed:', error.message);
      await takeScreenshot(driver, 'iOS Invalid login test failure');
      
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed", "reason": "❌ iOS Invalid login test failed: ' + error.message + '"}}'
      );
      
      throw error;
    }
  });
});
