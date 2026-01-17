#!/usr/bin/env python3
"""
Comprehensive E2E tests for PiterPay application.
Tests all pages, navigation, UI components, PWA, and console errors.
"""

import json
import os
from datetime import datetime
from playwright.sync_api import sync_playwright, Page, ConsoleMessage

BASE_URL = "http://localhost:5178"
SCREENSHOT_DIR = "/tmp/piterpay-e2e-screenshots"

# All routes to test
ROUTES = [
    {"path": "/", "name": "Home"},
    {"path": "/dashboard", "name": "Dashboard"},
    {"path": "/budget", "name": "Budget"},
    {"path": "/login", "name": "Login"},
    {"path": "/profile", "name": "Profile"},
    {"path": "/savings", "name": "Savings"},
    {"path": "/tasks", "name": "Tasks"},
    {"path": "/monthly-overview", "name": "Monthly Overview"},
    {"path": "/household", "name": "Household"},
    {"path": "/about", "name": "About"},
    {"path": "/guide", "name": "Guide"},
]

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        self.console_errors = []
        self.warnings = []

    def record_pass(self, test_name: str):
        self.passed += 1
        print(f"  ✅ {test_name}")

    def record_fail(self, test_name: str, error: str):
        self.failed += 1
        self.errors.append({"test": test_name, "error": error})
        print(f"  ❌ {test_name}: {error}")

    def record_console_error(self, page: str, message: str):
        self.console_errors.append({"page": page, "message": message})

    def record_warning(self, message: str):
        self.warnings.append(message)
        print(f"  ⚠️  {message}")

    def summary(self) -> str:
        total = self.passed + self.failed
        return f"""
╔══════════════════════════════════════════════════════════════╗
║                    E2E TEST RESULTS                          ║
╠══════════════════════════════════════════════════════════════╣
║  Total Tests:     {total:4d}                                      ║
║  Passed:          {self.passed:4d}  ✅                                  ║
║  Failed:          {self.failed:4d}  {'❌' if self.failed > 0 else '✅'}                                  ║
║  Console Errors:  {len(self.console_errors):4d}  {'⚠️ ' if self.console_errors else '✅'}                                  ║
╠══════════════════════════════════════════════════════════════╣
║  Status: {'PASSED ✅' if self.failed == 0 else 'FAILED ❌'}                                          ║
╚══════════════════════════════════════════════════════════════╝
"""


def setup_console_listener(page: Page, results: TestResults, page_name: str):
    """Set up console message listener to capture errors."""
    def handle_console(msg: ConsoleMessage):
        if msg.type == "error":
            results.record_console_error(page_name, msg.text)
    page.on("console", handle_console)


def test_page_loads(page: Page, route: dict, results: TestResults) -> bool:
    """Test that a page loads successfully."""
    test_name = f"Page loads: {route['name']} ({route['path']})"
    try:
        response = page.goto(f"{BASE_URL}{route['path']}", wait_until="networkidle", timeout=30000)
        if response and response.status < 400:
            results.record_pass(test_name)
            return True
        else:
            results.record_fail(test_name, f"HTTP {response.status if response else 'No response'}")
            return False
    except Exception as e:
        results.record_fail(test_name, str(e))
        return False


def test_page_has_content(page: Page, route: dict, results: TestResults):
    """Test that page has meaningful content (not blank)."""
    test_name = f"Page has content: {route['name']}"
    try:
        body = page.locator("body")
        text_content = body.inner_text()
        if len(text_content.strip()) > 10:
            results.record_pass(test_name)
        else:
            results.record_fail(test_name, "Page appears empty")
    except Exception as e:
        results.record_fail(test_name, str(e))


def test_no_react_errors(page: Page, route: dict, results: TestResults):
    """Check for React error boundaries or error messages."""
    test_name = f"No React errors: {route['name']}"
    try:
        # Check for common React error patterns
        error_selectors = [
            "text=Something went wrong",
            "text=Error:",
            "[data-testid='error']",
            ".error-boundary",
        ]
        has_error = False
        for selector in error_selectors:
            if page.locator(selector).count() > 0:
                has_error = True
                break

        if not has_error:
            results.record_pass(test_name)
        else:
            results.record_fail(test_name, "React error detected on page")
    except Exception as e:
        results.record_fail(test_name, str(e))


def test_pwa_manifest(page: Page, results: TestResults):
    """Test PWA manifest is accessible and valid."""
    test_name = "PWA manifest loads"
    try:
        response = page.goto(f"{BASE_URL}/manifest.json", wait_until="networkidle")
        if response and response.status == 200:
            manifest = response.json()
            if manifest.get("name") and manifest.get("icons"):
                results.record_pass(test_name)

                # Check manifest fields
                if manifest.get("name") == "PiterPay - היועץ התקציבי החכם":
                    results.record_pass("PWA manifest: correct name")
                else:
                    results.record_warning(f"PWA manifest name mismatch: {manifest.get('name')}")

                if manifest.get("display") == "standalone":
                    results.record_pass("PWA manifest: standalone display")
                else:
                    results.record_warning("PWA manifest: not standalone display")

                if len(manifest.get("icons", [])) >= 2:
                    results.record_pass("PWA manifest: has icons")
                else:
                    results.record_fail("PWA manifest: missing icons", "Less than 2 icons defined")
            else:
                results.record_fail(test_name, "Manifest missing required fields")
        else:
            results.record_fail(test_name, f"HTTP {response.status if response else 'No response'}")
    except Exception as e:
        results.record_fail(test_name, str(e))


def test_navigation(page: Page, results: TestResults):
    """Test navigation between pages works."""
    test_name = "Navigation works"
    try:
        # Start from home page
        page.goto(f"{BASE_URL}/", wait_until="networkidle")

        # Try to find and click navigation links
        nav_links = page.locator("nav a, [role='navigation'] a, header a").all()

        if len(nav_links) > 0:
            results.record_pass(f"Navigation: found {len(nav_links)} nav links")
        else:
            results.record_warning("No navigation links found in nav/header")

        # Test clicking a link if dashboard exists
        dashboard_link = page.locator("a[href='/dashboard'], a[href*='dashboard']").first
        if dashboard_link.count() > 0:
            dashboard_link.click()
            page.wait_for_load_state("networkidle")
            if "/dashboard" in page.url:
                results.record_pass("Navigation: click to dashboard works")
            else:
                results.record_fail("Navigation: click to dashboard", f"Ended up at {page.url}")

    except Exception as e:
        results.record_fail(test_name, str(e))


def test_rtl_support(page: Page, results: TestResults):
    """Test RTL (Right-to-Left) support for Hebrew."""
    test_name = "RTL support"
    try:
        page.goto(f"{BASE_URL}/", wait_until="networkidle")

        # Check if HTML has dir="rtl" or lang="he"
        html = page.locator("html")
        direction = html.get_attribute("dir")
        lang = html.get_attribute("lang")

        if direction == "rtl" or lang == "he":
            results.record_pass(test_name)
        else:
            results.record_warning(f"RTL may not be configured (dir={direction}, lang={lang})")

    except Exception as e:
        results.record_fail(test_name, str(e))


def test_ui_components(page: Page, results: TestResults):
    """Test that key UI components render."""
    test_name = "UI components render"
    try:
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")

        # Check for common UI elements
        checks = [
            ("Buttons exist", "button"),
            ("Cards/containers exist", "[class*='card'], [class*='Card'], .rounded, .shadow"),
            ("Text content exists", "h1, h2, h3, p"),
        ]

        for check_name, selector in checks:
            count = page.locator(selector).count()
            if count > 0:
                results.record_pass(f"UI: {check_name} ({count} found)")
            else:
                results.record_warning(f"UI: {check_name} - none found")

    except Exception as e:
        results.record_fail(test_name, str(e))


def test_responsive_viewport(page: Page, results: TestResults):
    """Test page renders in mobile viewport."""
    test_name = "Mobile viewport renders"
    try:
        # Set mobile viewport
        page.set_viewport_size({"width": 375, "height": 667})
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")

        # Check page isn't broken
        body = page.locator("body")
        if body.is_visible():
            results.record_pass(test_name)
        else:
            results.record_fail(test_name, "Body not visible in mobile viewport")

        # Reset to desktop
        page.set_viewport_size({"width": 1280, "height": 720})

    except Exception as e:
        results.record_fail(test_name, str(e))


def take_screenshot(page: Page, name: str):
    """Take a screenshot for visual verification."""
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    filename = f"{SCREENSHOT_DIR}/{name}_{datetime.now().strftime('%H%M%S')}.png"
    page.screenshot(path=filename, full_page=True)
    return filename


def run_tests():
    """Run all E2E tests."""
    results = TestResults()

    print("\n" + "="*60)
    print("   PiterPay E2E Tests")
    print("="*60 + "\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            locale="he-IL"
        )
        page = context.new_page()

        # Set up global console listener
        all_console_errors = []
        def handle_console(msg: ConsoleMessage):
            if msg.type == "error":
                all_console_errors.append(msg.text)
        page.on("console", handle_console)

        # Test 1: PWA Manifest
        print("📋 Testing PWA Manifest...")
        test_pwa_manifest(page, results)
        print()

        # Test 2: All pages load
        print("📄 Testing Page Loading...")
        for route in ROUTES:
            setup_console_listener(page, results, route['name'])
            if test_page_loads(page, route, results):
                test_page_has_content(page, route, results)
                test_no_react_errors(page, route, results)
                # Take screenshot of each page
                take_screenshot(page, route['name'].replace(' ', '_').lower())
        print()

        # Test 3: Navigation
        print("🧭 Testing Navigation...")
        test_navigation(page, results)
        print()

        # Test 4: RTL Support
        print("🔄 Testing RTL Support...")
        test_rtl_support(page, results)
        print()

        # Test 5: UI Components
        print("🎨 Testing UI Components...")
        test_ui_components(page, results)
        print()

        # Test 6: Mobile Responsive
        print("📱 Testing Mobile Viewport...")
        test_responsive_viewport(page, results)
        print()

        # Record console errors
        for error in all_console_errors:
            results.record_console_error("global", error)

        browser.close()

    # Print summary
    print(results.summary())

    # Print console errors if any
    if results.console_errors:
        print("\n⚠️  Console Errors Detected:")
        for err in results.console_errors[:10]:  # Limit to first 10
            print(f"  [{err['page']}] {err['message'][:100]}")

    print(f"\n📸 Screenshots saved to: {SCREENSHOT_DIR}")

    # Return exit code
    return 0 if results.failed == 0 else 1


if __name__ == "__main__":
    exit(run_tests())
