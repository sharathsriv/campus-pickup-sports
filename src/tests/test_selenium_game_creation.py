import unittest
import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options

# --- CONFIGURATION ---
FRONTEND_URL = "http://localhost:5173"
# User credentials (Assumed to exist)
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123" 

class GameCreationSeleniumTests(unittest.TestCase):

    def setUp(self):
        chrome_options = Options()
        # chrome_options.add_argument("--headless") # Comment out to see the browser
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10) # Implicit wait for elements

    def tearDown(self):
        if self.driver:
            self.driver.quit()

    def test_create_game_flow(self):
        driver = self.driver
        
        # 1. Open App
        driver.get(FRONTEND_URL)
        
        # 2. Login
        # Wait for email input to ensure page loaded
        wait = WebDriverWait(driver, 10)
        email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
        
        # Ensure we are on Login tab (it's default, but good to check or switch if needed)
        # The Login component has tabs. "Log in" is the default active tab.
        
        password_input = driver.find_element(By.NAME, "password")
        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")

        email_input.clear()
        email_input.send_keys(TEST_EMAIL)
        password_input.clear()
        password_input.send_keys(TEST_PASSWORD)
        
        submit_btn.click()
        
        # 3. Wait for Redirection to Games List
        # We look for the "Create Game" button which appears on the Games page
        create_game_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Game')]")))
        
        # 4. Determine Date (Tomorrow)
        tomorrow = datetime.now() + timedelta(days=1)
        date_str = tomorrow.strftime("%m-%d-%Y") # Format for input type=date
        
        # 5. Navigate to Create Game
        create_game_btn.click()
        
        # Wait for Create Game form
        wait.until(EC.presence_of_element_located((By.NAME, "title")))
        
        # 6. Fill Form
        title_input = driver.find_element(By.NAME, "title")
        sport_select = Select(driver.find_element(By.NAME, "sport"))
        location_select = Select(driver.find_element(By.NAME, "location"))
        date_input = driver.find_element(By.NAME, "date")
        start_time_select = Select(driver.find_element(By.NAME, "startTime"))
        end_time_select = Select(driver.find_element(By.NAME, "endTime"))
        
        title_input.send_keys(f"Selenium Test Game {datetime.now().strftime('%H:%M')}")
        sport_select.select_by_visible_text("Soccer")
        
        # Select a location (Value "1" is Sylvan Court 1 as per CreateGame.jsx)
        location_select.select_by_value("1") 
        
        date_input.send_keys(date_str)
        
        # Very early time: 06:00 AM
        start_time_select.select_by_value("06:00")
        end_time_select.select_by_value("07:30")
        
        # 7. Submit
        submit_create_btn = driver.find_element(By.XPATH, "//button[text()='Create Game']")
        submit_create_btn.click()
        
        # 8. Verify Success
        # The component sets a message "Game created!"
        success_msg = wait.until(EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'Game created!')]")))
        self.assertTrue(success_msg.is_displayed(), "Success message not displayed")

        # Optional: Click 'Back to Games' to verify it appears in list?
        # For now, success message is sufficient as per requirements.

if __name__ == "__main__":
    unittest.main()
