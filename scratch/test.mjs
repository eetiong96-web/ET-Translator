import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Test Desktop
  console.log("Testing Desktop...");
  let context = await browser.newContext();
  let page = await context.newPage();
  let hasBug = false;
  let bugDetails = [];

  const logError = (type, text) => {
    console.log(`[Desktop] ${type}: ${text}`);
    hasBug = true;
    bugDetails.push(`[Desktop] ${type}: ${text}`);
  };

  page.on('console', msg => {
    if (msg.type() === 'error') logError('PAGE ERROR', msg.text());
  });
  page.on('pageerror', err => logError('UNCAUGHT ERROR', err.message));
  page.on('requestfailed', req => logError('REQUEST FAILED', `${req.url()} - ${req.failure()?.errorText}`));

  try {
    await page.goto('http://localhost:4173');
    await page.waitForLoadState('networkidle');

    // Test 1: Empty translate
    console.log("1. Testing empty Translate submission...");
    await page.click('#translateButton');
    // Wait to see if errorText shows up
    await page.waitForTimeout(1000);
    const errorText = await page.textContent('#errorText');
    if (errorText.trim() === '') {
      // Expected behavior might be showing an error, or just not doing anything. Let's see.
      // If it tries to translate empty text, it might crash or show "Waiting for text".
    }

    // Test 2: Toggle tabs
    console.log("2. Testing tab toggling...");
    await page.click('button[data-mode="ask"]');
    await page.click('button[data-mode="translate"]');
    
    // Test 3: Very long text
    console.log("3. Testing extremely long text (5000+ chars)...");
    await page.fill('#sourceText', 'A'.repeat(5100));
    await page.click('#translateButton');
    await page.waitForTimeout(1000);
    const charCount = await page.textContent('#charCount');
    if (!charCount.includes('5000 / 5000') && !charCount.includes('5100')) {
      // Something might be wrong with char limit
    }
  } catch (err) {
    logError('Test exception', err.message);
  } finally {
    await context.close();
  }

  // Test Mobile
  console.log("\nTesting Mobile (iPhone 13)...");
  context = await browser.newContext({
    ...devices['iPhone 13']
  });
  page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') logError('PAGE ERROR', msg.text());
  });
  page.on('pageerror', err => logError('UNCAUGHT ERROR', err.message));
  page.on('requestfailed', req => logError('REQUEST FAILED', `${req.url()} - ${req.failure()?.errorText}`));

  try {
    await page.goto('http://localhost:4173');
    await page.waitForLoadState('networkidle');

    // Test 4: Clear button on mobile
    await page.fill('#sourceText', 'Test');
    await page.click('#clearButton');
    const sourceText = await page.inputValue('#sourceText');
    if (sourceText !== '') {
      logError('UI Bug', 'Clear button did not clear the source text on mobile');
    }
    
    // Test 5: Switch AI Provider
    await page.click('button[data-provider="gemini"]');
    const activeProvider = await page.locator('button[data-provider="gemini"]').getAttribute('class');
    if (!activeProvider.includes('active')) {
      logError('UI Bug', 'Could not select Gemini provider');
    }
  } catch (err) {
    logError('Test exception', err.message);
  } finally {
    await context.close();
  }

  await browser.close();

  if (hasBug) {
    console.log("\nBUG FOUND!");
    console.log(bugDetails.join('\n'));
    process.exit(1);
  } else {
    console.log("\nNO BUG FOUND");
    process.exit(0);
  }
})();
