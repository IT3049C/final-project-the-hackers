import { test, expect } from '@playwright/test';

// Helper function to enter the player name and access the lobby before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  
  // Wait for the name capture screen
  await expect(page.locator('h1')).toHaveText('Welcome to GameHub');
  
  // Fill in the player name and enter the hub
  await page.fill('input[placeholder="Your name..."]', 'TestPlayer');
  await page.click('button:has-text("Enter Hub")');
  
  // Verify we are in the lobby
  await expect(page.locator('.player-badge')).toContainText('Playing as: TestPlayer');
  await expect(page.locator('h1').filter({ hasText: 'GameHub' })).toBeVisible();
});

test.describe('Tic Tac Toe Tests', () => {
  test('should allow playing a full game to a win', async ({ page }) => {
    await page.click('button:has-text("Play Tic Tac Toe")');
    await expect(page.locator('h1:has-text("Tic Tac Toe")')).toBeVisible();

    const cells = page.locator('.ttt-cell');
    await expect(cells).toHaveCount(9);

    // Player X clicks cell 0
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    // Player O clicks cell 1
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText('O');

    // Player X clicks cell 3
    await cells.nth(3).click();
    
    // Player O clicks cell 4
    await cells.nth(4).click();

    // Player X clicks cell 6 and wins
    await cells.nth(6).click();

    await expect(page.locator('h2')).toContainText('Winner: X');
  });

  test('should reset the board', async ({ page }) => {
    await page.click('button:has-text("Play Tic Tac Toe")');
    
    const cells = page.locator('.ttt-cell');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText('X');

    await page.click('.ttt-reset');
    await expect(cells.nth(0)).toHaveText('');
    await expect(page.locator('h2')).toHaveText('Turn: X');
  });
});

test.describe('Hangman Tests', () => {
  test('should render the game and allow letter guesses', async ({ page }) => {
    await page.click('button:has-text("Play Hangman")');
    await expect(page.locator('h1:has-text("HANGMAN")')).toBeVisible();

    const letterSlots = page.locator('.letter-slot');
    // Ensure the word display is rendered (length depends on the random word)
    await expect(letterSlots.first()).toBeVisible();

    // Guess the letter 'A'
    const buttonA = page.locator('.key-btn', { hasText: 'A' });
    await buttonA.click();
    
    // The button should be disabled after guessing
    await expect(buttonA).toBeDisabled();
  });

  test('should allow exiting back to the lobby', async ({ page }) => {
    await page.click('button:has-text("Play Hangman")');
    await expect(page.locator('h1:has-text("HANGMAN")')).toBeVisible();

    await page.click('button.exit-btn');
    await expect(page.locator('h1').filter({ hasText: 'GameHub' })).toBeVisible();
  });
});

test.describe('Wordle Tests', () => {
  test('should allow typing a word and submitting a guess', async ({ page }) => {
    await page.click('button:has-text("Play Wordle")');
    await expect(page.locator('h1:has-text("Wordle Clone")')).toBeVisible();

    // Type a 5-letter word
    await page.keyboard.type('apple');
    
    // Verify the tiles show the letters
    const tiles = page.locator('.tile');
    await expect(tiles.nth(0)).toHaveText('A');
    await expect(tiles.nth(1)).toHaveText('P');
    await expect(tiles.nth(2)).toHaveText('P');
    await expect(tiles.nth(3)).toHaveText('L');
    await expect(tiles.nth(4)).toHaveText('E');

    // Submit the guess
    await page.keyboard.press('Enter');

    // After enter, the tiles should get color classes (like 'green', 'yellow', or 'gray')
    // Wait a moment for the state update
    await page.waitForTimeout(500); 
    
    // 'APPLE' is the hardcoded correct answer in wordle.jsx
    await expect(page.locator('.message')).toContainText('You win!');
  });
});

test.describe('Rock Paper Scissors Tests', () => {
  test('should render multiplayer lobby and allow creating a room', async ({ page }) => {
    await page.click('button:has-text("Play Rock Paper Scissors")');
    await expect(page.locator('h2:has-text("Multiplayer RPS")')).toBeVisible();

    // The mock network request handles the external API
    // We'll intercept the fetch request to simulate the API response
    await page.route('**/api/rooms', async route => {
      const json = { roomId: 'TEST-ROOM' };
      await route.fulfill({ json });
    });

    await page.click('button:has-text("Create New Room")');
    
    // Should transition to the waiting screen
    await expect(page.locator('.waiting-screen')).toBeVisible();
    await expect(page.locator('.waiting-screen h3')).toContainText('TEST-ROOM');
  });
});