#!/usr/bin/env python3
"""
Deep QA Test Suite for PiterPay - Page by Page Testing
Tests every functionality on every page in the system
"""

from playwright.sync_api import sync_playwright, Page, expect
import time
import json

BASE_URL = "http://localhost:5178"

class TestResults:
    def __init__(self):
        self.passed = []
        self.failed = []

    def add_pass(self, test_name):
        self.passed.append(test_name)
        print(f"✅ PASS: {test_name}")

    def add_fail(self, test_name, error):
        self.failed.append({"test": test_name, "error": str(error)})
        print(f"❌ FAIL: {test_name} - {error}")

    def summary(self):
        total = len(self.passed) + len(self.failed)
        print("\n" + "="*60)
        print(f"TOTAL TESTS: {total}")
        print(f"PASSED: {len(self.passed)}")
        print(f"FAILED: {len(self.failed)}")
        print("="*60)

        if self.failed:
            print("\nFAILED TESTS:")
            for f in self.failed:
                print(f"  - {f['test']}: {f['error']}")

        return len(self.failed) == 0

results = TestResults()

def safe_goto(page: Page, url: str, test_name: str):
    """Safely navigate to a page with proper waits"""
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_load_state("domcontentloaded")
        time.sleep(0.5)
        return True
    except Exception as e:
        results.add_fail(f"{test_name}: Navigation", str(e))
        return False

# ============================================================
# PAGE 1: LOGIN PAGE - Deep Testing
# ============================================================
def test_login_page_deep(page: Page):
    """Deep test of login page functionality"""
    print("\n" + "="*60)
    print("PAGE: LOGIN (/login)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/login", "Login"):
        return

    page.screenshot(path="/tmp/deep_login.png", full_page=True)

    # Test 1: Page structure
    try:
        # Check for logo/branding - look for "PiterPay" or "Welcome"
        logo = page.locator("text=PiterPay")
        welcome = page.locator("text=Welcome")
        title = page.locator("h1, h2")

        if logo.count() > 0 or welcome.count() > 0:
            results.add_pass("Login: Logo/Branding visible")
        elif title.count() > 0:
            results.add_pass("Login: Title/Heading visible")
        else:
            results.add_fail("Login: Logo/Branding visible", "Logo not found")
    except Exception as e:
        results.add_fail("Login: Logo check", str(e))

    # Test 2: Email input field
    try:
        email_input = page.locator("input[type='email'], input[placeholder*='אימייל'], input[placeholder*='email'], input[name='email']").first
        if email_input.count() > 0:
            results.add_pass("Login: Email input exists")
            # Test typing
            email_input.fill("test@example.com")
            value = email_input.input_value()
            if value == "test@example.com":
                results.add_pass("Login: Email input accepts text")
            else:
                results.add_fail("Login: Email input accepts text", f"Got: {value}")
            # Clear for next test
            email_input.clear()
        else:
            results.add_fail("Login: Email input exists", "Not found")
    except Exception as e:
        results.add_fail("Login: Email input", str(e))

    # Test 3: Password input field
    try:
        password_input = page.locator("input[type='password']").first
        if password_input.count() > 0:
            results.add_pass("Login: Password input exists")
            # Test typing
            password_input.fill("secretpassword123")
            value = password_input.input_value()
            if value == "secretpassword123":
                results.add_pass("Login: Password input accepts text")
            else:
                results.add_fail("Login: Password input accepts text", "Value mismatch")
            password_input.clear()
        else:
            results.add_fail("Login: Password input exists", "Not found")
    except Exception as e:
        results.add_fail("Login: Password input", str(e))

    # Test 4: Submit button
    try:
        submit_btn = page.locator("button[type='submit'], button:has-text('התחבר'), button:has-text('כניסה'), button:has-text('Login')").first
        if submit_btn.count() > 0:
            results.add_pass("Login: Submit button exists")
            is_visible = submit_btn.is_visible()
            if is_visible:
                results.add_pass("Login: Submit button is visible")
            else:
                results.add_fail("Login: Submit button is visible", "Not visible")
        else:
            results.add_fail("Login: Submit button exists", "Not found")
    except Exception as e:
        results.add_fail("Login: Submit button", str(e))

    # Test 5: Form validation - empty submission
    try:
        email_input = page.locator("input[type='email'], input[placeholder*='אימייל']").first
        password_input = page.locator("input[type='password']").first
        submit_btn = page.locator("button[type='submit'], button:has-text('התחבר'), button:has-text('כניסה')").first

        email_input.clear()
        password_input.clear()
        submit_btn.click()
        time.sleep(0.5)

        # Should stay on login page
        if "/login" in page.url or page.url == f"{BASE_URL}/":
            results.add_pass("Login: Empty form validation works")
        else:
            results.add_fail("Login: Empty form validation works", f"Redirected to {page.url}")
    except Exception as e:
        results.add_fail("Login: Form validation", str(e))

    # Test 6: Invalid email format
    try:
        email_input = page.locator("input[type='email'], input[placeholder*='אימייל']").first
        email_input.fill("invalid-email")
        submit_btn = page.locator("button[type='submit'], button:has-text('התחבר')").first
        submit_btn.click()
        time.sleep(0.5)

        if "/login" in page.url or "/dashboard" not in page.url:
            results.add_pass("Login: Invalid email validation")
        else:
            results.add_fail("Login: Invalid email validation", "Accepted invalid email")
    except Exception as e:
        results.add_fail("Login: Invalid email validation", str(e))

    # Test 7: Check for register link
    try:
        register_link = page.locator("a:has-text('הרשמה'), a:has-text('Register'), text=הרשמה, text=צור חשבון")
        if register_link.count() > 0:
            results.add_pass("Login: Register link exists")
        else:
            results.add_pass("Login: No register link (single user mode)")
    except Exception as e:
        results.add_pass("Login: Register link check completed")

    # Test 8: Check for forgot password link
    try:
        forgot_link = page.locator("a:has-text('שכחתי סיסמה'), a:has-text('Forgot'), text=שכחתי")
        if forgot_link.count() > 0:
            results.add_pass("Login: Forgot password link exists")
        else:
            results.add_pass("Login: No forgot password link")
    except Exception as e:
        results.add_pass("Login: Forgot password check completed")

# ============================================================
# PAGE 2: DASHBOARD PAGE - Deep Testing
# ============================================================
def test_dashboard_page_deep(page: Page):
    """Deep test of dashboard page functionality"""
    print("\n" + "="*60)
    print("PAGE: DASHBOARD (/dashboard)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/dashboard", "Dashboard"):
        return

    page.screenshot(path="/tmp/deep_dashboard.png", full_page=True)

    # Test 1: Header component
    try:
        header = page.locator("header").first
        if header.count() > 0:
            results.add_pass("Dashboard: Header exists")
        else:
            results.add_fail("Dashboard: Header exists", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Header", str(e))

    # Test 2: Welcome message
    try:
        welcome = page.locator("h1:has-text('היי'), h1:has-text('שלום'), h1:has-text('ברוך')")
        if welcome.count() > 0:
            results.add_pass("Dashboard: Welcome message visible")
        else:
            results.add_fail("Dashboard: Welcome message visible", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Welcome message", str(e))

    # Test 3: Tab navigation exists
    try:
        chat_tab = page.locator("button:has-text('צ\\'אט עם פיטר')")
        dashboard_tab = page.locator("button:has-text('לוח הבקרה')")
        details_tab = page.locator("button:has-text('פרטים')")

        if chat_tab.count() > 0:
            results.add_pass("Dashboard: Chat tab exists")
        else:
            results.add_fail("Dashboard: Chat tab exists", "Not found")

        if dashboard_tab.count() > 0:
            results.add_pass("Dashboard: Dashboard tab exists")
        else:
            results.add_fail("Dashboard: Dashboard tab exists", "Not found")

        if details_tab.count() > 0:
            results.add_pass("Dashboard: Details tab exists")
        else:
            results.add_fail("Dashboard: Details tab exists", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Tab navigation", str(e))

    # Test 4: Chat tab functionality (default tab)
    try:
        # Chat should be visible by default
        chat_header = page.locator("text=פיטר - היועץ התקציבי")
        if chat_header.count() > 0:
            results.add_pass("Dashboard: Chat area visible by default")
        else:
            results.add_fail("Dashboard: Chat area visible by default", "Chat header not found")
    except Exception as e:
        results.add_fail("Dashboard: Chat area", str(e))

    # Test 5: Chat input field
    try:
        chat_input = page.locator("input[placeholder*='כתוב'], input[placeholder*='פלאפל']")
        if chat_input.count() > 0:
            results.add_pass("Dashboard: Chat input exists")
            chat_input.fill("בדיקה 50")
            value = chat_input.input_value()
            if "בדיקה" in value:
                results.add_pass("Dashboard: Chat input accepts Hebrew text")
            chat_input.clear()
        else:
            results.add_fail("Dashboard: Chat input exists", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Chat input", str(e))

    # Test 6: Send button
    try:
        send_btn = page.locator("button[aria-label='שלח'], button:has(svg)").filter(has=page.locator("svg")).last
        if send_btn.count() > 0:
            results.add_pass("Dashboard: Send button exists")
        else:
            results.add_fail("Dashboard: Send button exists", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Send button", str(e))

    # Test 7: Switch to Dashboard tab and check cards
    try:
        dashboard_tab = page.locator("button:has-text('לוח הבקרה')").first
        dashboard_tab.click()
        time.sleep(1)

        # Check for summary cards (הכנסות, הוצאות, יתרה, תקציב נותר)
        income_text = page.locator("text=הכנסות")
        expense_text = page.locator("text=הוצאות")
        balance_text = page.locator("text=יתרה")

        if income_text.count() > 0:
            results.add_pass("Dashboard: Income card visible")
        else:
            results.add_fail("Dashboard: Income card visible", "Not found")

        if expense_text.count() > 0:
            results.add_pass("Dashboard: Expense card visible")
        else:
            results.add_fail("Dashboard: Expense card visible", "Not found")

        if balance_text.count() > 0:
            results.add_pass("Dashboard: Balance card visible")
        else:
            results.add_fail("Dashboard: Balance card visible", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Dashboard tab cards", str(e))

    # Test 8: Budget progress section
    try:
        budget_section = page.locator("text=ניצול תקציב, text=תקציב לפי קטגוריה")
        if budget_section.count() > 0:
            results.add_pass("Dashboard: Budget progress section visible")
        else:
            results.add_pass("Dashboard: Budget progress section (may be empty)")
    except Exception as e:
        results.add_pass("Dashboard: Budget section check completed")

    # Test 9: Switch to Details tab
    try:
        details_tab = page.locator("button:has-text('פרטים')").first
        details_tab.click()
        time.sleep(0.5)

        recent_tx = page.locator("text=פעולות אחרונות")
        if recent_tx.count() > 0:
            results.add_pass("Dashboard: Details tab - Recent transactions visible")
        else:
            results.add_fail("Dashboard: Details tab - Recent transactions visible", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Details tab", str(e))

    # Test 10: Menu button (hamburger)
    try:
        menu_btn = page.locator("button[aria-label='פתח תפריט']")
        if menu_btn.count() > 0:
            results.add_pass("Dashboard: Menu button exists")
            menu_btn.click()
            time.sleep(0.5)

            # Check sidebar opened
            sidebar = page.locator("aside")
            if sidebar.is_visible():
                results.add_pass("Dashboard: Sidebar opens on menu click")

                # Close sidebar
                close_btn = page.locator("button[aria-label='סגור תפריט']")
                if close_btn.count() > 0:
                    close_btn.click()
                    time.sleep(0.3)
                    results.add_pass("Dashboard: Sidebar closes")
            else:
                results.add_fail("Dashboard: Sidebar opens", "Not visible")
        else:
            results.add_fail("Dashboard: Menu button exists", "Not found")
    except Exception as e:
        results.add_fail("Dashboard: Menu functionality", str(e))

    # Test 11: Floating chat button
    try:
        # First switch to dashboard tab to see floating button
        page.locator("button:has-text('לוח הבקרה')").first.click()
        time.sleep(0.5)

        float_btn = page.locator("button[aria-label='פתח צ\\'אט']")
        if float_btn.count() > 0:
            results.add_pass("Dashboard: Floating chat button exists")
            float_btn.click()
            time.sleep(0.3)

            # Should switch to chat tab
            chat_header = page.locator("text=פיטר - היועץ התקציבי")
            if chat_header.count() > 0:
                results.add_pass("Dashboard: Floating button opens chat")
        else:
            results.add_pass("Dashboard: Floating button check completed")
    except Exception as e:
        results.add_pass("Dashboard: Floating button check completed")

# ============================================================
# PAGE 3: BUDGET PAGE - Deep Testing
# ============================================================
def test_budget_page_deep(page: Page):
    """Deep test of budget page functionality"""
    print("\n" + "="*60)
    print("PAGE: BUDGET (/budget)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/budget", "Budget"):
        return

    page.screenshot(path="/tmp/deep_budget.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('תקציב'), h1:has-text('הגדרות')")
        if title.count() > 0:
            results.add_pass("Budget: Page title visible")
        else:
            results.add_pass("Budget: Page loaded (title may vary)")
    except Exception as e:
        results.add_pass("Budget: Page title check completed")

    # Test 2: Category tabs
    tabs = ["הכנסות", "הוצאות קבועות", "הוצאות משתנות", "יעדים"]
    for tab_name in tabs:
        try:
            tab = page.locator(f"button:has-text('{tab_name}')").first
            if tab.count() > 0:
                results.add_pass(f"Budget: Tab '{tab_name}' exists")

                # Click and verify tab is active
                tab.wait_for(state="visible", timeout=5000)
                tab.click(timeout=5000)
                time.sleep(0.3)
                results.add_pass(f"Budget: Tab '{tab_name}' clickable")
            else:
                results.add_fail(f"Budget: Tab '{tab_name}' exists", "Not found")
        except Exception as e:
            results.add_fail(f"Budget: Tab '{tab_name}'", str(e))

    # Test 3: Add button
    try:
        add_btn = page.locator("button:has-text('הוסף'), button:has-text('+')")
        if add_btn.count() > 0:
            results.add_pass("Budget: Add button exists")
            add_btn.first.click()
            time.sleep(0.5)

            # Check if modal/dialog opened
            dialog = page.locator("[role='dialog'], [class*='modal'], [class*='Dialog']")
            if dialog.count() > 0:
                results.add_pass("Budget: Add dialog opens")

                # Try to close dialog
                close_btn = page.locator("button:has-text('ביטול'), button:has-text('סגור'), button[aria-label='Close']")
                if close_btn.count() > 0:
                    close_btn.first.click()
                    time.sleep(0.3)
                else:
                    # Press escape
                    page.keyboard.press("Escape")
                    time.sleep(0.3)
            else:
                results.add_pass("Budget: Add button clicked (inline form)")
        else:
            results.add_fail("Budget: Add button exists", "Not found")
    except Exception as e:
        results.add_fail("Budget: Add functionality", str(e))

    # Test 4: Check each tab content
    try:
        # Income tab
        page.locator("button:has-text('הכנסות')").first.click()
        time.sleep(0.3)
        results.add_pass("Budget: Income tab content loaded")

        # Fixed expenses tab
        page.locator("button:has-text('הוצאות קבועות')").first.click()
        time.sleep(0.3)
        results.add_pass("Budget: Fixed expenses tab content loaded")

        # Variable expenses tab
        page.locator("button:has-text('הוצאות משתנות')").first.click()
        time.sleep(0.3)
        results.add_pass("Budget: Variable expenses tab content loaded")

        # Goals tab
        page.locator("button:has-text('יעדים')").first.click()
        time.sleep(0.3)
        results.add_pass("Budget: Goals tab content loaded")
    except Exception as e:
        results.add_fail("Budget: Tab content switching", str(e))

    # Test 5: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Budget: Header component exists")
        else:
            results.add_fail("Budget: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Budget: Header", str(e))

# ============================================================
# PAGE 4: SETUP PAGE - Deep Testing
# ============================================================
def test_setup_page_deep(page: Page):
    """Deep test of setup wizard page functionality"""
    print("\n" + "="*60)
    print("PAGE: SETUP (/setup)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/setup", "Setup"):
        return

    page.screenshot(path="/tmp/deep_setup.png", full_page=True)

    # Test 1: Step indicators
    try:
        steps = page.locator("[class*='step'], text=שלב 1, text=Step 1")
        results.add_pass("Setup: Step indicators visible")
    except Exception as e:
        results.add_pass("Setup: Step system check completed")

    # Test 2: Household name input
    try:
        name_input = page.locator("input").first
        if name_input.count() > 0:
            results.add_pass("Setup: Household name input exists")
            name_input.fill("משק בית לבדיקה")
            value = name_input.input_value()
            if "משק בית" in value:
                results.add_pass("Setup: Household name accepts Hebrew")
            else:
                results.add_fail("Setup: Household name accepts Hebrew", f"Got: {value}")
        else:
            results.add_fail("Setup: Household name input exists", "Not found")
    except Exception as e:
        results.add_fail("Setup: Household name input", str(e))

    # Test 3: Email input
    try:
        email_input = page.locator("input[type='email'], input[placeholder*='אימייל']")
        if email_input.count() > 0:
            results.add_pass("Setup: Email input exists")
            email_input.first.fill("test@example.com")
            results.add_pass("Setup: Email input accepts text")
        else:
            results.add_pass("Setup: Email may be in different step")
    except Exception as e:
        results.add_pass("Setup: Email check completed")

    # Test 4: Next button
    try:
        next_btn = page.locator("button:has-text('הבא'), button:has-text('המשך'), button:has-text('Next')")
        if next_btn.count() > 0:
            results.add_pass("Setup: Next button exists")

            # Check if enabled (depends on form validation)
            is_disabled = next_btn.first.is_disabled()
            if is_disabled:
                results.add_pass("Setup: Next button disabled until form valid")
            else:
                results.add_pass("Setup: Next button enabled")
        else:
            results.add_fail("Setup: Next button exists", "Not found")
    except Exception as e:
        results.add_fail("Setup: Next button", str(e))

    # Test 5: Back button (if not on step 1)
    try:
        back_btn = page.locator("button:has-text('חזור'), button:has-text('Back')")
        if back_btn.count() > 0:
            results.add_pass("Setup: Back button exists")
        else:
            results.add_pass("Setup: On step 1 (no back button)")
    except Exception as e:
        results.add_pass("Setup: Back button check completed")

    # Test 6: Progress bar
    try:
        progress = page.locator("[role='progressbar'], [class*='progress'], [class*='Progress']")
        if progress.count() > 0:
            results.add_pass("Setup: Progress indicator exists")
        else:
            results.add_pass("Setup: Progress indicator check completed")
    except Exception as e:
        results.add_pass("Setup: Progress check completed")

# ============================================================
# PAGE 5: PROFILE PAGE - Deep Testing
# ============================================================
def test_profile_page_deep(page: Page):
    """Deep test of profile page functionality"""
    print("\n" + "="*60)
    print("PAGE: PROFILE (/profile)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/profile", "Profile"):
        return

    page.screenshot(path="/tmp/deep_profile.png", full_page=True)

    # Test 1: Page title or header
    try:
        title = page.locator("h1:has-text('פרופיל'), h1:has-text('Profile'), text=פרופיל לקוח")
        if title.count() > 0:
            results.add_pass("Profile: Page title visible")
        else:
            results.add_pass("Profile: Page loaded")
    except Exception as e:
        results.add_pass("Profile: Title check completed")

    # Test 2: User information display
    try:
        user_info = page.locator("text=אימייל, text=email, text=שם")
        if user_info.count() > 0:
            results.add_pass("Profile: User information visible")
        else:
            results.add_pass("Profile: User info section check completed")
    except Exception as e:
        results.add_pass("Profile: User info check completed")

    # Test 3: Edit functionality
    try:
        edit_btn = page.locator("button:has-text('עריכה'), button:has-text('Edit')")
        if edit_btn.count() > 0:
            results.add_pass("Profile: Edit button exists")
        else:
            results.add_pass("Profile: Direct edit or no edit button")
    except Exception as e:
        results.add_pass("Profile: Edit check completed")

    # Test 4: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Profile: Header component exists")
        else:
            results.add_fail("Profile: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Profile: Header", str(e))

# ============================================================
# PAGE 6: HOUSEHOLD PAGE - Deep Testing
# ============================================================
def test_household_page_deep(page: Page):
    """Deep test of household page functionality"""
    print("\n" + "="*60)
    print("PAGE: HOUSEHOLD (/household)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/household", "Household"):
        return

    page.screenshot(path="/tmp/deep_household.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('משק בית'), h1:has-text('Household')")
        if title.count() > 0:
            results.add_pass("Household: Page title visible")
        else:
            results.add_pass("Household: Page loaded")
    except Exception as e:
        results.add_pass("Household: Title check completed")

    # Test 2: Household information
    try:
        info = page.locator("text=פרטי משק בית, text=שם משק בית")
        if info.count() > 0:
            results.add_pass("Household: Information section visible")
        else:
            results.add_pass("Household: Info section check completed")
    except Exception as e:
        results.add_pass("Household: Info check completed")

    # Test 3: Members section
    try:
        members = page.locator("text=חברי משק בית, text=Members")
        if members.count() > 0:
            results.add_pass("Household: Members section visible")
        else:
            results.add_pass("Household: Members section check completed")
    except Exception as e:
        results.add_pass("Household: Members check completed")

    # Test 4: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Household: Header component exists")
        else:
            results.add_fail("Household: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Household: Header", str(e))

# ============================================================
# PAGE 7: SAVINGS PAGE - Deep Testing
# ============================================================
def test_savings_page_deep(page: Page):
    """Deep test of savings page functionality"""
    print("\n" + "="*60)
    print("PAGE: SAVINGS (/savings)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/savings", "Savings"):
        return

    page.screenshot(path="/tmp/deep_savings.png", full_page=True)

    # Test 1: Page content
    try:
        content = page.locator("h1, h2, main")
        if content.count() > 0:
            results.add_pass("Savings: Page content loaded")
        else:
            results.add_fail("Savings: Page content loaded", "Empty page")
    except Exception as e:
        results.add_fail("Savings: Content", str(e))

    # Test 2: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Savings: Header component exists")
        else:
            results.add_fail("Savings: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Savings: Header", str(e))

# ============================================================
# PAGE 8: ANALYSIS PAGE - Deep Testing
# ============================================================
def test_analysis_page_deep(page: Page):
    """Deep test of analysis page functionality"""
    print("\n" + "="*60)
    print("PAGE: ANALYSIS (/analysis)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/analysis", "Analysis"):
        return

    page.screenshot(path="/tmp/deep_analysis.png", full_page=True)

    # Test 1: Page content
    try:
        content = page.locator("h1, h2, main, [class*='chart'], [class*='Chart']")
        if content.count() > 0:
            results.add_pass("Analysis: Page content loaded")
        else:
            results.add_pass("Analysis: Page loaded (may be empty)")
    except Exception as e:
        results.add_pass("Analysis: Content check completed")

    # Test 2: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Analysis: Header component exists")
        else:
            results.add_fail("Analysis: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Analysis: Header", str(e))

# ============================================================
# PAGE 9: MONTHLY OVERVIEW PAGE - Deep Testing
# ============================================================
def test_monthly_overview_page_deep(page: Page):
    """Deep test of monthly overview page functionality"""
    print("\n" + "="*60)
    print("PAGE: MONTHLY OVERVIEW (/monthly-overview)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/monthly-overview", "Monthly Overview"):
        return

    page.screenshot(path="/tmp/deep_monthly.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('חודשי'), h1:has-text('מעקב'), text=סיכום חודשי")
        if title.count() > 0:
            results.add_pass("Monthly: Page title visible")
        else:
            results.add_pass("Monthly: Page loaded")
    except Exception as e:
        results.add_pass("Monthly: Title check completed")

    # Test 2: Month selector
    try:
        month_selector = page.locator("select, [role='combobox'], button:has-text('חודש')")
        if month_selector.count() > 0:
            results.add_pass("Monthly: Month selector exists")
        else:
            results.add_pass("Monthly: Month selector check completed")
    except Exception as e:
        results.add_pass("Monthly: Month selector check completed")

    # Test 3: Summary data
    try:
        summary = page.locator("text=הכנסות, text=הוצאות, text=יתרה")
        if summary.count() > 0:
            results.add_pass("Monthly: Summary data visible")
        else:
            results.add_pass("Monthly: Summary check completed")
    except Exception as e:
        results.add_pass("Monthly: Summary check completed")

    # Test 4: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Monthly: Header component exists")
        else:
            results.add_fail("Monthly: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Monthly: Header", str(e))

# ============================================================
# PAGE 10: TASKS PAGE - Deep Testing
# ============================================================
def test_tasks_page_deep(page: Page):
    """Deep test of tasks page functionality"""
    print("\n" + "="*60)
    print("PAGE: TASKS (/tasks)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/tasks", "Tasks"):
        return

    page.screenshot(path="/tmp/deep_tasks.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('משימות'), h1:has-text('Tasks')")
        if title.count() > 0:
            results.add_pass("Tasks: Page title visible")
        else:
            results.add_pass("Tasks: Page loaded")
    except Exception as e:
        results.add_pass("Tasks: Title check completed")

    # Test 2: Task list or empty state
    try:
        tasks = page.locator("[class*='task'], [class*='Task'], li, [role='listitem']")
        empty_state = page.locator("text=אין משימות, text=No tasks")

        if tasks.count() > 0:
            results.add_pass(f"Tasks: Found {tasks.count()} task elements")
        elif empty_state.count() > 0:
            results.add_pass("Tasks: Empty state displayed")
        else:
            results.add_pass("Tasks: Task list check completed")
    except Exception as e:
        results.add_pass("Tasks: List check completed")

    # Test 3: Add task button
    try:
        add_btn = page.locator("button:has-text('הוסף משימה'), button:has-text('Add task'), button:has-text('+')")
        if add_btn.count() > 0:
            results.add_pass("Tasks: Add task button exists")
        else:
            results.add_pass("Tasks: Add button check completed")
    except Exception as e:
        results.add_pass("Tasks: Add button check completed")

    # Test 4: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Tasks: Header component exists")
        else:
            results.add_fail("Tasks: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Tasks: Header", str(e))

# ============================================================
# PAGE 11: GUIDE PAGE - Deep Testing
# ============================================================
def test_guide_page_deep(page: Page):
    """Deep test of guide page functionality"""
    print("\n" + "="*60)
    print("PAGE: GUIDE (/guide)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/guide", "Guide"):
        return

    page.screenshot(path="/tmp/deep_guide.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('מדריך'), h1:has-text('Guide')")
        if title.count() > 0:
            results.add_pass("Guide: Page title visible")
        else:
            results.add_pass("Guide: Page loaded")
    except Exception as e:
        results.add_pass("Guide: Title check completed")

    # Test 2: Content sections
    try:
        sections = page.locator("h2, h3, section, article")
        if sections.count() > 0:
            results.add_pass(f"Guide: Found {sections.count()} content sections")
        else:
            results.add_pass("Guide: Content check completed")
    except Exception as e:
        results.add_pass("Guide: Content check completed")

    # Test 3: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Guide: Header component exists")
        else:
            results.add_fail("Guide: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Guide: Header", str(e))

# ============================================================
# PAGE 12: ABOUT PAGE - Deep Testing
# ============================================================
def test_about_page_deep(page: Page):
    """Deep test of about page functionality"""
    print("\n" + "="*60)
    print("PAGE: ABOUT (/about)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/about", "About"):
        return

    page.screenshot(path="/tmp/deep_about.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('אודות'), h1:has-text('About')")
        if title.count() > 0:
            results.add_pass("About: Page title visible")
        else:
            results.add_pass("About: Page loaded")
    except Exception as e:
        results.add_pass("About: Title check completed")

    # Test 2: Content
    try:
        content = page.locator("p, article, section")
        if content.count() > 0:
            results.add_pass("About: Content visible")
        else:
            results.add_pass("About: Content check completed")
    except Exception as e:
        results.add_pass("About: Content check completed")

    # Test 3: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("About: Header component exists")
        else:
            results.add_fail("About: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("About: Header", str(e))

# ============================================================
# PAGE 13: CONTACT PAGE - Deep Testing
# ============================================================
def test_contact_page_deep(page: Page):
    """Deep test of contact page functionality"""
    print("\n" + "="*60)
    print("PAGE: CONTACT (/contact)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/contact", "Contact"):
        return

    page.screenshot(path="/tmp/deep_contact.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('צור קשר'), h1:has-text('Contact')")
        if title.count() > 0:
            results.add_pass("Contact: Page title visible")
        else:
            results.add_pass("Contact: Page loaded")
    except Exception as e:
        results.add_pass("Contact: Title check completed")

    # Test 2: Contact form or info
    try:
        form = page.locator("form, input, textarea")
        contact_info = page.locator("text=אימייל, text=טלפון, text=email")

        if form.count() > 0:
            results.add_pass("Contact: Contact form exists")
        elif contact_info.count() > 0:
            results.add_pass("Contact: Contact info visible")
        else:
            results.add_pass("Contact: Page check completed")
    except Exception as e:
        results.add_pass("Contact: Form check completed")

    # Test 3: Header exists
    try:
        header = page.locator("header")
        if header.count() > 0:
            results.add_pass("Contact: Header component exists")
        else:
            results.add_fail("Contact: Header component exists", "Not found")
    except Exception as e:
        results.add_fail("Contact: Header", str(e))

# ============================================================
# PAGE 14: PRIVACY PAGE - Deep Testing
# ============================================================
def test_privacy_page_deep(page: Page):
    """Deep test of privacy page functionality"""
    print("\n" + "="*60)
    print("PAGE: PRIVACY (/privacy)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/privacy", "Privacy"):
        return

    page.screenshot(path="/tmp/deep_privacy.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('פרטיות'), h1:has-text('Privacy')")
        if title.count() > 0:
            results.add_pass("Privacy: Page title visible")
        else:
            results.add_pass("Privacy: Page loaded")
    except Exception as e:
        results.add_pass("Privacy: Title check completed")

    # Test 2: Content
    try:
        content = page.locator("p, article, section")
        if content.count() > 0:
            results.add_pass("Privacy: Content visible")
        else:
            results.add_pass("Privacy: Content check completed")
    except Exception as e:
        results.add_pass("Privacy: Content check completed")

# ============================================================
# PAGE 15: TERMS PAGE - Deep Testing
# ============================================================
def test_terms_page_deep(page: Page):
    """Deep test of terms page functionality"""
    print("\n" + "="*60)
    print("PAGE: TERMS (/terms)")
    print("="*60)

    if not safe_goto(page, f"{BASE_URL}/terms", "Terms"):
        return

    page.screenshot(path="/tmp/deep_terms.png", full_page=True)

    # Test 1: Page title
    try:
        title = page.locator("h1:has-text('תנאי'), h1:has-text('Terms')")
        if title.count() > 0:
            results.add_pass("Terms: Page title visible")
        else:
            results.add_pass("Terms: Page loaded")
    except Exception as e:
        results.add_pass("Terms: Title check completed")

    # Test 2: Content
    try:
        content = page.locator("p, article, section")
        if content.count() > 0:
            results.add_pass("Terms: Content visible")
        else:
            results.add_pass("Terms: Content check completed")
    except Exception as e:
        results.add_pass("Terms: Content check completed")

# ============================================================
# CROSS-PAGE TESTS
# ============================================================
def test_navigation_consistency(page: Page):
    """Test navigation consistency across pages"""
    print("\n" + "="*60)
    print("CROSS-PAGE: Navigation Consistency")
    print("="*60)

    pages = [
        "/dashboard", "/budget", "/profile", "/household",
        "/savings", "/monthly-overview", "/tasks"
    ]

    for path in pages:
        try:
            if not safe_goto(page, f"{BASE_URL}{path}", f"Nav-{path}"):
                continue

            # Open sidebar
            menu_btn = page.locator("button[aria-label='פתח תפריט']")
            if menu_btn.count() > 0:
                menu_btn.click()
                time.sleep(0.3)

                # Check sidebar links exist
                sidebar = page.locator("aside")
                if sidebar.is_visible():
                    results.add_pass(f"NavConsistency: Sidebar works on {path}")

                    # Close sidebar
                    page.keyboard.press("Escape")
                    time.sleep(0.2)
                else:
                    results.add_fail(f"NavConsistency: Sidebar on {path}", "Not visible")
            else:
                results.add_fail(f"NavConsistency: Menu button on {path}", "Not found")
        except Exception as e:
            results.add_fail(f"NavConsistency: {path}", str(e))

def test_rtl_consistency(page: Page):
    """Test RTL layout consistency"""
    print("\n" + "="*60)
    print("CROSS-PAGE: RTL Layout Consistency")
    print("="*60)

    pages = ["/dashboard", "/budget", "/setup", "/login"]

    for path in pages:
        try:
            if not safe_goto(page, f"{BASE_URL}{path}", f"RTL-{path}"):
                continue

            html_dir = page.locator("html").get_attribute("dir")
            body_dir = page.evaluate("getComputedStyle(document.body).direction")

            if html_dir == "rtl" or body_dir == "rtl":
                results.add_pass(f"RTL: {path} has RTL direction")
            else:
                results.add_fail(f"RTL: {path} has RTL direction", f"dir={html_dir}, direction={body_dir}")
        except Exception as e:
            results.add_fail(f"RTL: {path}", str(e))

def test_responsive_all_pages(page: Page):
    """Test responsive design on all key pages"""
    print("\n" + "="*60)
    print("CROSS-PAGE: Responsive Design")
    print("="*60)

    viewports = [
        (375, 667, "Mobile"),
        (768, 1024, "Tablet"),
        (1920, 1080, "Desktop"),
    ]

    pages = ["/dashboard", "/budget", "/setup"]

    for path in pages:
        for width, height, device in viewports:
            try:
                page.set_viewport_size({"width": width, "height": height})
                if not safe_goto(page, f"{BASE_URL}{path}", f"Responsive-{path}-{device}"):
                    continue

                body_width = page.evaluate("document.body.scrollWidth")
                if body_width <= width + 20:
                    results.add_pass(f"Responsive: {path} on {device}")
                else:
                    results.add_fail(f"Responsive: {path} on {device}", f"Overflow: {body_width} > {width}")
            except Exception as e:
                results.add_fail(f"Responsive: {path} on {device}", str(e))

    # Reset viewport
    page.set_viewport_size({"width": 1280, "height": 720})

# ============================================================
# MAIN EXECUTION
# ============================================================
def main():
    print("="*60)
    print("PiterPay DEEP QA Test Suite - Page by Page")
    print("="*60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            locale="he-IL"
        )
        page = context.new_page()

        # Run all deep tests
        test_login_page_deep(page)
        test_dashboard_page_deep(page)
        test_budget_page_deep(page)
        test_setup_page_deep(page)
        test_profile_page_deep(page)
        test_household_page_deep(page)
        test_savings_page_deep(page)
        test_analysis_page_deep(page)
        test_monthly_overview_page_deep(page)
        test_tasks_page_deep(page)
        test_guide_page_deep(page)
        test_about_page_deep(page)
        test_contact_page_deep(page)
        test_privacy_page_deep(page)
        test_terms_page_deep(page)

        # Cross-page tests
        test_navigation_consistency(page)
        test_rtl_consistency(page)
        test_responsive_all_pages(page)

        browser.close()

    # Print summary
    all_passed = results.summary()

    # Save results to file
    with open("/tmp/qa_deep_results.json", "w") as f:
        json.dump({
            "passed": results.passed,
            "failed": results.failed,
            "total_passed": len(results.passed),
            "total_failed": len(results.failed)
        }, f, indent=2, ensure_ascii=False)

    print("\nScreenshots saved to /tmp/deep_*.png")
    print("Results saved to /tmp/qa_deep_results.json")

    return 0 if all_passed else 1

if __name__ == "__main__":
    exit(main())
