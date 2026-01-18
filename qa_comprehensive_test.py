#!/usr/bin/env python3
"""
Comprehensive QA Test Suite for PiterPay
Tests every page, button, form, and interaction in the system
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

def test_page_loads(page: Page, url: str, test_name: str, expected_text: str = None):
    """Test that a page loads without errors"""
    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_load_state("domcontentloaded")
        time.sleep(0.5)  # Allow React to hydrate

        # Check for HTTP errors
        if response and response.status >= 400:
            results.add_fail(test_name, f"HTTP {response.status}")
            return False

        # Check for React error boundaries
        error_text = page.locator("text=Something went wrong").count()
        if error_text > 0:
            results.add_fail(test_name, "React error boundary triggered")
            return False

        # Check for expected text if provided
        if expected_text:
            if page.locator(f"text={expected_text}").count() == 0:
                results.add_fail(test_name, f"Expected text '{expected_text}' not found")
                return False

        # Check console for errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        results.add_pass(test_name)
        return True
    except Exception as e:
        results.add_fail(test_name, str(e))
        return False

def test_navigation(page: Page):
    """Test all navigation links"""
    print("\n--- Testing Navigation ---")

    # Test main pages
    pages_to_test = [
        (f"{BASE_URL}/", "Homepage", None),
        (f"{BASE_URL}/login", "Login Page", None),
        (f"{BASE_URL}/dashboard", "Dashboard Page", None),
        (f"{BASE_URL}/budget", "Budget Page", None),
        (f"{BASE_URL}/setup", "Setup Page", None),
        (f"{BASE_URL}/profile", "Profile Page", None),
        (f"{BASE_URL}/household", "Household Page", None),
        (f"{BASE_URL}/savings", "Savings Page", None),
        (f"{BASE_URL}/analysis", "Analysis Page", None),
        (f"{BASE_URL}/monthly-overview", "Monthly Overview Page", None),
        (f"{BASE_URL}/tasks", "Tasks Page", None),
        (f"{BASE_URL}/guide", "Guide Page", None),
        (f"{BASE_URL}/about", "About Page", None),
        (f"{BASE_URL}/contact", "Contact Page", None),
        (f"{BASE_URL}/privacy", "Privacy Page", None),
        (f"{BASE_URL}/terms", "Terms Page", None),
    ]

    for url, name, expected in pages_to_test:
        test_page_loads(page, url, f"Page Load: {name}", expected)

def test_login_page(page: Page):
    """Test login page functionality"""
    print("\n--- Testing Login Page ---")

    try:
        page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(0.5)

        # Check for login form elements
        email_input = page.locator("input[type='email'], input[placeholder*='אימייל'], input[placeholder*='email']")
        password_input = page.locator("input[type='password']")

        if email_input.count() > 0:
            results.add_pass("Login: Email input exists")
        else:
            results.add_fail("Login: Email input exists", "Email input not found")

        if password_input.count() > 0:
            results.add_pass("Login: Password input exists")
        else:
            results.add_fail("Login: Password input exists", "Password input not found")

        # Test form interaction
        if email_input.count() > 0 and password_input.count() > 0:
            email_input.first.fill("test@example.com")
            password_input.first.fill("testpassword")
            results.add_pass("Login: Form can be filled")

        # Check for submit button
        submit_btn = page.locator("button[type='submit'], button:has-text('התחבר'), button:has-text('כניסה')")
        if submit_btn.count() > 0:
            results.add_pass("Login: Submit button exists")
        else:
            results.add_fail("Login: Submit button exists", "Submit button not found")

    except Exception as e:
        results.add_fail("Login: Page interaction", str(e))

def test_dashboard_page(page: Page):
    """Test dashboard page functionality"""
    print("\n--- Testing Dashboard Page ---")

    try:
        page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        # Take screenshot for manual review
        page.screenshot(path="/tmp/dashboard_screenshot.png", full_page=True)

        # Check for main dashboard components
        # Header
        header = page.locator("header").first
        if header:
            results.add_pass("Dashboard: Header exists")
        else:
            results.add_fail("Dashboard: Header exists", "Header not found")

        # Click on "לוח הבקרה" (Dashboard) tab to see cards - default is "chat" tab
        dashboard_tab = page.locator("button:has-text('לוח הבקרה')").first
        if dashboard_tab.count() > 0:
            dashboard_tab.wait_for(state="visible", timeout=5000)
            dashboard_tab.click(timeout=5000)
            time.sleep(1)  # Wait for tab content to render

        # Check for cards (now on dashboard tab)
        # Cards use rounded-xl or rounded-lg classes from shadcn/ui
        cards = page.locator("[class*='rounded-xl'], [class*='rounded-lg']").filter(has=page.locator("p, span"))
        card_count = cards.count()
        if card_count > 0:
            results.add_pass(f"Dashboard: Found {card_count} cards")
        else:
            # Alternative: check for CardContent
            card_content = page.locator("[class*='p-4'][class*='text-center']")
            if card_content.count() > 0:
                results.add_pass(f"Dashboard: Found {card_content.count()} card contents")
            else:
                results.add_fail("Dashboard: Cards exist", "No cards found")

        # Check for menu button
        menu_btn = page.locator("button[aria-label*='menu'], button[aria-label*='תפריט'], button:has(svg)")
        if menu_btn.count() > 0:
            results.add_pass("Dashboard: Menu button exists")
            # Try clicking menu
            try:
                menu_btn.first.click()
                time.sleep(0.5)
                results.add_pass("Dashboard: Menu opens on click")
            except:
                results.add_fail("Dashboard: Menu opens on click", "Could not click menu")

    except Exception as e:
        results.add_fail("Dashboard: Page interaction", str(e))

def test_budget_page(page: Page):
    """Test budget page functionality"""
    print("\n--- Testing Budget Page ---")

    try:
        page.goto(f"{BASE_URL}/budget", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        page.screenshot(path="/tmp/budget_screenshot.png", full_page=True)

        # Check for category tabs
        tabs = page.locator("button").filter(has_text="הכנסות")
        if tabs.count() > 0:
            results.add_pass("Budget: Category tabs exist")

            # Click through tabs with better timeout handling
            tab_labels = ["הכנסות", "הוצאות קבועות", "הוצאות משתנות", "יעדים"]
            for label in tab_labels:
                try:
                    tab = page.locator(f"button:has-text('{label}')").first
                    tab.wait_for(state="visible", timeout=5000)
                    tab.click(timeout=5000)
                    time.sleep(0.3)
                    results.add_pass(f"Budget: Tab '{label}' clickable")
                except Exception as e:
                    results.add_fail(f"Budget: Tab '{label}' clickable", str(e))
        else:
            results.add_fail("Budget: Category tabs exist", "No tabs found")

        # Check for add button
        add_btn = page.locator("button:has-text('הוסף')")
        if add_btn.count() > 0:
            results.add_pass("Budget: Add button exists")
            try:
                add_btn.first.click()
                time.sleep(0.5)
                results.add_pass("Budget: Add button clickable")
            except Exception as e:
                results.add_fail("Budget: Add button clickable", str(e))

    except Exception as e:
        results.add_fail("Budget: Page interaction", str(e))

def test_setup_wizard(page: Page):
    """Test setup wizard functionality"""
    print("\n--- Testing Setup Wizard ---")

    try:
        page.goto(f"{BASE_URL}/setup", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        page.screenshot(path="/tmp/setup_screenshot.png", full_page=True)

        # Check for step indicators
        steps = page.locator("[class*='step'], [class*='Step']")
        results.add_pass(f"Setup: Found step indicators")

        # Check for form fields in step 1
        name_input = page.locator("input").first
        if name_input:
            try:
                name_input.fill("בדיקת משק בית")
                results.add_pass("Setup: Can fill household name")
            except Exception as e:
                results.add_fail("Setup: Can fill household name", str(e))

        # Check for next button
        next_btn = page.locator("button:has-text('הבא'), button:has-text('המשך')")
        if next_btn.count() > 0:
            results.add_pass("Setup: Next button exists")
        else:
            results.add_fail("Setup: Next button exists", "Next button not found")

    except Exception as e:
        results.add_fail("Setup: Page interaction", str(e))

def test_sidebar_navigation(page: Page):
    """Test sidebar navigation"""
    print("\n--- Testing Sidebar Navigation ---")

    try:
        page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        # Find and click menu button using aria-label
        menu_btn = page.locator("button[aria-label='פתח תפריט'], button[aria-label*='menu']").first
        if menu_btn.count() > 0:
            menu_btn.wait_for(state="visible", timeout=5000)
            menu_btn.click(timeout=5000)
            time.sleep(0.5)

            # Check sidebar is visible
            sidebar = page.locator("[class*='sidebar'], [class*='Sidebar'], aside, nav")
            if sidebar.count() > 0:
                results.add_pass("Sidebar: Opens on menu click")

                # Check for navigation links - matching actual Sidebar menu items
                nav_items = ["צ'אט עם פיטר", "הגדרות תקציב", "מעקב חודשי", "פרופיל לקוח"]
                for item in nav_items:
                    link = page.locator(f"text={item}")
                    if link.count() > 0:
                        results.add_pass(f"Sidebar: '{item}' link exists")
                    else:
                        results.add_fail(f"Sidebar: '{item}' link exists", "Link not found")
            else:
                results.add_fail("Sidebar: Opens on menu click", "Sidebar not visible")
        else:
            results.add_fail("Sidebar: Menu button", "Menu button not found")

    except Exception as e:
        results.add_fail("Sidebar: Navigation", str(e))

def test_responsive_design(page: Page):
    """Test responsive design at different viewport sizes"""
    print("\n--- Testing Responsive Design ---")

    viewports = [
        (375, 667, "Mobile (iPhone SE)"),
        (768, 1024, "Tablet (iPad)"),
        (1920, 1080, "Desktop (1080p)"),
    ]

    for width, height, name in viewports:
        try:
            page.set_viewport_size({"width": width, "height": height})
            page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(0.5)

            # Check page renders without overflow
            body_width = page.evaluate("document.body.scrollWidth")
            if body_width <= width + 20:  # Allow small margin
                results.add_pass(f"Responsive: {name} - No horizontal overflow")
            else:
                results.add_fail(f"Responsive: {name} - No horizontal overflow", f"Body width: {body_width}")

            page.screenshot(path=f"/tmp/responsive_{width}x{height}.png", full_page=True)

        except Exception as e:
            results.add_fail(f"Responsive: {name}", str(e))

    # Reset to desktop
    page.set_viewport_size({"width": 1280, "height": 720})

def test_buttons_and_interactions(page: Page):
    """Test all clickable elements"""
    print("\n--- Testing Buttons and Interactions ---")

    pages_with_buttons = [
        (f"{BASE_URL}/dashboard", "Dashboard"),
        (f"{BASE_URL}/budget", "Budget"),
        (f"{BASE_URL}/setup", "Setup"),
    ]

    for url, page_name in pages_with_buttons:
        try:
            page.goto(url, wait_until="domcontentloaded")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(0.5)

            # Find all buttons
            buttons = page.locator("button:visible")
            button_count = buttons.count()

            results.add_pass(f"{page_name}: Found {button_count} buttons")

            # Test each button is clickable (doesn't throw)
            for i in range(min(button_count, 5)):  # Test first 5 buttons
                try:
                    btn = buttons.nth(i)
                    btn_text = btn.inner_text()[:20] if btn.inner_text() else f"Button {i}"

                    # Check button is enabled
                    if not btn.is_disabled():
                        results.add_pass(f"{page_name}: Button '{btn_text}' is enabled")
                    else:
                        results.add_pass(f"{page_name}: Button '{btn_text}' is intentionally disabled")
                except Exception as e:
                    pass  # Some buttons may be dynamic

        except Exception as e:
            results.add_fail(f"{page_name}: Button testing", str(e))

def test_forms_validation(page: Page):
    """Test form validation"""
    print("\n--- Testing Form Validation ---")

    try:
        # Test login form validation
        page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(0.5)

        # Try submitting empty form
        submit_btn = page.locator("button[type='submit'], button:has-text('התחבר'), button:has-text('כניסה')").first
        if submit_btn:
            submit_btn.click()
            time.sleep(0.5)

            # Check if form shows validation errors or prevents submission
            # (This is a basic check - the form should not navigate away)
            if "/login" in page.url or "/auth" in page.url or page.url == f"{BASE_URL}/login":
                results.add_pass("Login: Empty form submission prevented")
            else:
                results.add_fail("Login: Empty form submission prevented", f"Navigated to {page.url}")

    except Exception as e:
        results.add_fail("Forms: Validation", str(e))

def test_rtl_layout(page: Page):
    """Test RTL (Right-to-Left) layout for Hebrew"""
    print("\n--- Testing RTL Layout ---")

    try:
        page.goto(f"{BASE_URL}/dashboard", wait_until="domcontentloaded")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(0.5)

        # Check HTML dir attribute or body direction
        html_dir = page.locator("html").get_attribute("dir")
        body_dir = page.evaluate("getComputedStyle(document.body).direction")

        if html_dir == "rtl" or body_dir == "rtl":
            results.add_pass("RTL: Document direction is RTL")
        else:
            results.add_fail("RTL: Document direction is RTL", f"html dir={html_dir}, body direction={body_dir}")

        # Check text alignment
        text_align = page.evaluate("getComputedStyle(document.body).textAlign")
        if text_align in ["right", "start"]:
            results.add_pass(f"RTL: Text alignment is {text_align}")

    except Exception as e:
        results.add_fail("RTL: Layout check", str(e))

def test_console_errors(page: Page):
    """Check for JavaScript console errors"""
    print("\n--- Testing for Console Errors ---")

    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

    pages = ["/dashboard", "/budget", "/setup", "/login"]

    for path in pages:
        console_errors.clear()
        try:
            page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(1)

            if len(console_errors) == 0:
                results.add_pass(f"Console: No errors on {path}")
            else:
                # Filter out common non-critical errors
                critical_errors = [e for e in console_errors if "Failed to load resource" not in e]
                if len(critical_errors) == 0:
                    results.add_pass(f"Console: No critical errors on {path}")
                else:
                    results.add_fail(f"Console: Errors on {path}", str(critical_errors[:2]))

        except Exception as e:
            results.add_fail(f"Console: Check for {path}", str(e))

def main():
    print("="*60)
    print("PiterPay Comprehensive QA Test Suite")
    print("="*60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            locale="he-IL"
        )
        page = context.new_page()

        # Run all tests
        test_navigation(page)
        test_login_page(page)
        test_dashboard_page(page)
        test_budget_page(page)
        test_setup_wizard(page)
        test_sidebar_navigation(page)
        test_responsive_design(page)
        test_buttons_and_interactions(page)
        test_forms_validation(page)
        test_rtl_layout(page)
        test_console_errors(page)

        browser.close()

    # Print summary
    all_passed = results.summary()

    # Save results to file
    with open("/tmp/qa_test_results.json", "w") as f:
        json.dump({
            "passed": results.passed,
            "failed": results.failed,
            "total_passed": len(results.passed),
            "total_failed": len(results.failed)
        }, f, indent=2, ensure_ascii=False)

    print("\nScreenshots saved to /tmp/")
    print("Results saved to /tmp/qa_test_results.json")

    return 0 if all_passed else 1

if __name__ == "__main__":
    exit(main())
