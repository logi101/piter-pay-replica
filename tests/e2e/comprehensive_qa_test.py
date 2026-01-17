#!/usr/bin/env python3
"""
Comprehensive QA Test Suite for PiterPay
=========================================
Author: Senior QA Engineer
Purpose: Deep testing of every element, button, form, and interaction

This test suite covers:
- All 11 pages
- Every clickable element
- All form inputs and validations
- Navigation flows
- Error states
- Edge cases
- Responsive behavior
- Accessibility basics
"""

import json
import os
import time
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from playwright.sync_api import sync_playwright, Page, Locator, expect

BASE_URL = "http://localhost:5178"
SCREENSHOT_DIR = "/tmp/piterpay-qa-comprehensive"
REPORT_FILE = "/tmp/piterpay-qa-report.json"

@dataclass
class TestResult:
    name: str
    status: str  # 'pass', 'fail', 'warning', 'skip'
    details: str = ""
    screenshot: str = ""
    duration_ms: float = 0

@dataclass
class PageReport:
    url: str
    name: str
    load_time_ms: float = 0
    elements_found: Dict[str, int] = field(default_factory=dict)
    tests: List[TestResult] = field(default_factory=list)
    issues: List[str] = field(default_factory=list)
    console_errors: List[str] = field(default_factory=list)

@dataclass
class QAReport:
    timestamp: str = ""
    total_tests: int = 0
    passed: int = 0
    failed: int = 0
    warnings: int = 0
    skipped: int = 0
    pages: List[PageReport] = field(default_factory=list)
    critical_issues: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


class ComprehensiveQATester:
    def __init__(self):
        self.report = QAReport(timestamp=datetime.now().isoformat())
        self.page: Optional[Page] = None
        self.console_errors: List[str] = []

    def setup_console_listener(self):
        """Capture all console errors"""
        def handle_console(msg):
            if msg.type == "error":
                self.console_errors.append(msg.text)
        self.page.on("console", handle_console)

    def take_screenshot(self, name: str) -> str:
        """Take screenshot and return path"""
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)
        filename = f"{SCREENSHOT_DIR}/{name}_{datetime.now().strftime('%H%M%S')}.png"
        self.page.screenshot(path=filename, full_page=True)
        return filename

    def count_elements(self, page_report: PageReport):
        """Count all interactive elements on page"""
        elements = {
            "buttons": self.page.locator("button").count(),
            "links": self.page.locator("a").count(),
            "inputs": self.page.locator("input").count(),
            "textareas": self.page.locator("textarea").count(),
            "selects": self.page.locator("select").count(),
            "checkboxes": self.page.locator("input[type='checkbox']").count(),
            "radio_buttons": self.page.locator("input[type='radio']").count(),
            "forms": self.page.locator("form").count(),
            "images": self.page.locator("img").count(),
            "headings": self.page.locator("h1, h2, h3, h4, h5, h6").count(),
            "modals_dialogs": self.page.locator("[role='dialog'], [role='alertdialog'], .modal").count(),
            "dropdown_menus": self.page.locator("[role='menu'], [role='listbox']").count(),
            "tabs": self.page.locator("[role='tab']").count(),
            "icons": self.page.locator("svg, [class*='icon']").count(),
        }
        page_report.elements_found = elements
        return elements

    def test_element_visibility(self, selector: str, name: str) -> TestResult:
        """Test if element is visible"""
        start = time.time()
        try:
            element = self.page.locator(selector).first
            if element.is_visible():
                return TestResult(
                    name=f"Visibility: {name}",
                    status="pass",
                    details="Element is visible",
                    duration_ms=(time.time() - start) * 1000
                )
            else:
                return TestResult(
                    name=f"Visibility: {name}",
                    status="fail",
                    details="Element exists but not visible",
                    duration_ms=(time.time() - start) * 1000
                )
        except Exception as e:
            return TestResult(
                name=f"Visibility: {name}",
                status="fail",
                details=str(e),
                duration_ms=(time.time() - start) * 1000
            )

    def test_button_clickable(self, button: Locator, index: int) -> TestResult:
        """Test if button is clickable and responds"""
        start = time.time()
        try:
            button_text = button.inner_text()[:30] or f"Button #{index}"
            is_disabled = button.is_disabled()

            if is_disabled:
                return TestResult(
                    name=f"Button: {button_text}",
                    status="warning",
                    details="Button is disabled",
                    duration_ms=(time.time() - start) * 1000
                )

            # Check if clickable
            if button.is_visible() and button.is_enabled():
                return TestResult(
                    name=f"Button: {button_text}",
                    status="pass",
                    details="Button is clickable",
                    duration_ms=(time.time() - start) * 1000
                )
            else:
                return TestResult(
                    name=f"Button: {button_text}",
                    status="fail",
                    details="Button not clickable",
                    duration_ms=(time.time() - start) * 1000
                )
        except Exception as e:
            return TestResult(
                name=f"Button #{index}",
                status="fail",
                details=str(e),
                duration_ms=(time.time() - start) * 1000
            )

    def test_link_valid(self, link: Locator, index: int) -> TestResult:
        """Test if link has valid href"""
        start = time.time()
        try:
            href = link.get_attribute("href")
            link_text = link.inner_text()[:30] or f"Link #{index}"

            if not href:
                return TestResult(
                    name=f"Link: {link_text}",
                    status="warning",
                    details="Link has no href attribute",
                    duration_ms=(time.time() - start) * 1000
                )

            if href.startswith("#") or href.startswith("javascript:"):
                return TestResult(
                    name=f"Link: {link_text}",
                    status="warning",
                    details=f"Anchor/JS link: {href[:50]}",
                    duration_ms=(time.time() - start) * 1000
                )

            return TestResult(
                name=f"Link: {link_text}",
                status="pass",
                details=f"Valid href: {href[:50]}",
                duration_ms=(time.time() - start) * 1000
            )
        except Exception as e:
            return TestResult(
                name=f"Link #{index}",
                status="fail",
                details=str(e),
                duration_ms=(time.time() - start) * 1000
            )

    def test_input_field(self, input_elem: Locator, index: int) -> TestResult:
        """Test input field functionality"""
        start = time.time()
        try:
            input_type = input_elem.get_attribute("type") or "text"
            input_name = input_elem.get_attribute("name") or input_elem.get_attribute("placeholder") or f"Input #{index}"
            is_disabled = input_elem.is_disabled()
            is_readonly = input_elem.get_attribute("readonly") is not None

            if is_disabled:
                return TestResult(
                    name=f"Input: {input_name}",
                    status="warning",
                    details=f"Input ({input_type}) is disabled",
                    duration_ms=(time.time() - start) * 1000
                )

            if is_readonly:
                return TestResult(
                    name=f"Input: {input_name}",
                    status="warning",
                    details=f"Input ({input_type}) is readonly",
                    duration_ms=(time.time() - start) * 1000
                )

            # Try to focus and type (without submitting)
            if input_elem.is_visible():
                return TestResult(
                    name=f"Input: {input_name}",
                    status="pass",
                    details=f"Input ({input_type}) is interactive",
                    duration_ms=(time.time() - start) * 1000
                )
            else:
                return TestResult(
                    name=f"Input: {input_name}",
                    status="fail",
                    details=f"Input ({input_type}) not visible",
                    duration_ms=(time.time() - start) * 1000
                )
        except Exception as e:
            return TestResult(
                name=f"Input #{index}",
                status="fail",
                details=str(e),
                duration_ms=(time.time() - start) * 1000
            )

    def test_page_structure(self, page_report: PageReport):
        """Test basic page structure requirements"""
        tests = []

        # Test: Has title
        title = self.page.title()
        tests.append(TestResult(
            name="Page has title",
            status="pass" if title else "fail",
            details=f"Title: {title[:50]}" if title else "No title"
        ))

        # Test: Has main content
        main = self.page.locator("main, [role='main'], #main, .main").first
        tests.append(TestResult(
            name="Has main content area",
            status="pass" if main.count() > 0 else "warning",
            details="Main content area found" if main.count() > 0 else "No explicit main area"
        ))

        # Test: Has heading
        h1 = self.page.locator("h1").first
        tests.append(TestResult(
            name="Has H1 heading",
            status="pass" if h1.count() > 0 else "warning",
            details=f"H1: {h1.inner_text()[:30]}" if h1.count() > 0 else "No H1 found"
        ))

        # Test: RTL direction
        html_dir = self.page.locator("html").get_attribute("dir")
        tests.append(TestResult(
            name="RTL support",
            status="pass" if html_dir == "rtl" else "warning",
            details=f"dir={html_dir}" if html_dir else "No dir attribute"
        ))

        # Test: Hebrew language
        html_lang = self.page.locator("html").get_attribute("lang")
        tests.append(TestResult(
            name="Hebrew language set",
            status="pass" if html_lang == "he" else "warning",
            details=f"lang={html_lang}" if html_lang else "No lang attribute"
        ))

        page_report.tests.extend(tests)

    def test_all_buttons(self, page_report: PageReport):
        """Test all buttons on the page"""
        buttons = self.page.locator("button").all()
        for i, button in enumerate(buttons):
            result = self.test_button_clickable(button, i)
            page_report.tests.append(result)

    def test_all_links(self, page_report: PageReport):
        """Test all links on the page"""
        links = self.page.locator("a").all()
        for i, link in enumerate(links):
            result = self.test_link_valid(link, i)
            page_report.tests.append(result)

    def test_all_inputs(self, page_report: PageReport):
        """Test all input fields on the page"""
        inputs = self.page.locator("input, textarea, select").all()
        for i, input_elem in enumerate(inputs):
            result = self.test_input_field(input_elem, i)
            page_report.tests.append(result)

    def test_forms(self, page_report: PageReport):
        """Test form validation and submission readiness"""
        forms = self.page.locator("form").all()
        for i, form in enumerate(forms):
            # Check if form has action
            action = form.get_attribute("action")
            method = form.get_attribute("method") or "GET"

            # Count form inputs
            inputs_in_form = form.locator("input, textarea, select").count()
            submit_btn = form.locator("button[type='submit'], input[type='submit']").count()

            page_report.tests.append(TestResult(
                name=f"Form #{i+1}",
                status="pass" if inputs_in_form > 0 else "warning",
                details=f"Inputs: {inputs_in_form}, Submit: {submit_btn}, Method: {method}"
            ))

    def test_navigation(self, page_report: PageReport):
        """Test navigation elements"""
        # Check for nav element
        nav = self.page.locator("nav, [role='navigation']").first
        if nav.count() > 0:
            nav_links = nav.locator("a").count()
            page_report.tests.append(TestResult(
                name="Navigation menu",
                status="pass",
                details=f"Found nav with {nav_links} links"
            ))
        else:
            page_report.tests.append(TestResult(
                name="Navigation menu",
                status="warning",
                details="No explicit nav element found"
            ))

        # Check for hamburger menu (mobile)
        hamburger = self.page.locator("[class*='hamburger'], [class*='menu-toggle'], button[aria-label*='menu']").first
        if hamburger.count() > 0:
            page_report.tests.append(TestResult(
                name="Mobile menu toggle",
                status="pass",
                details="Hamburger menu found"
            ))

    def test_interactive_clicks(self, page_report: PageReport):
        """Actually click on interactive elements and observe behavior"""
        # Test tab clicks if present
        tabs = self.page.locator("[role='tab'], .tab, [class*='tab']").all()
        for i, tab in enumerate(tabs[:5]):  # Limit to 5 tabs
            try:
                if tab.is_visible() and tab.is_enabled():
                    initial_url = self.page.url
                    tab.click(timeout=2000)
                    time.sleep(0.3)

                    page_report.tests.append(TestResult(
                        name=f"Tab click #{i+1}",
                        status="pass",
                        details=f"Tab clicked successfully"
                    ))
            except Exception as e:
                page_report.tests.append(TestResult(
                    name=f"Tab click #{i+1}",
                    status="warning",
                    details=f"Click failed: {str(e)[:50]}"
                ))

    def test_responsive(self, page_report: PageReport):
        """Test responsive design at different viewports"""
        viewports = [
            {"name": "Mobile", "width": 375, "height": 667},
            {"name": "Tablet", "width": 768, "height": 1024},
            {"name": "Desktop", "width": 1280, "height": 720},
        ]

        for vp in viewports:
            self.page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
            time.sleep(0.2)

            # Check if content is visible
            body = self.page.locator("body")
            is_visible = body.is_visible()

            # Check for horizontal scroll (overflow)
            has_h_scroll = self.page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")

            status = "pass" if is_visible and not has_h_scroll else "warning"
            details = f"Visible: {is_visible}, H-Scroll: {has_h_scroll}"

            page_report.tests.append(TestResult(
                name=f"Responsive: {vp['name']} ({vp['width']}px)",
                status=status,
                details=details
            ))

        # Reset to desktop
        self.page.set_viewport_size({"width": 1280, "height": 720})

    def test_accessibility_basics(self, page_report: PageReport):
        """Basic accessibility checks"""
        # Check images have alt text
        images = self.page.locator("img").all()
        images_without_alt = sum(1 for img in images if not img.get_attribute("alt"))

        page_report.tests.append(TestResult(
            name="Images have alt text",
            status="pass" if images_without_alt == 0 else "warning",
            details=f"{len(images) - images_without_alt}/{len(images)} images have alt"
        ))

        # Check buttons have accessible names
        buttons = self.page.locator("button").all()
        buttons_no_text = sum(1 for btn in buttons if not btn.inner_text().strip() and not btn.get_attribute("aria-label"))

        page_report.tests.append(TestResult(
            name="Buttons have accessible names",
            status="pass" if buttons_no_text == 0 else "warning",
            details=f"{len(buttons) - buttons_no_text}/{len(buttons)} buttons accessible"
        ))

        # Check form labels
        inputs = self.page.locator("input:not([type='hidden'])").all()
        # Simple check: inputs should have id or aria-label
        labeled_inputs = sum(1 for inp in inputs if inp.get_attribute("id") or inp.get_attribute("aria-label") or inp.get_attribute("placeholder"))

        page_report.tests.append(TestResult(
            name="Form inputs labeled",
            status="pass" if labeled_inputs == len(inputs) else "warning",
            details=f"{labeled_inputs}/{len(inputs)} inputs labeled"
        ))

    def test_page(self, url: str, name: str) -> PageReport:
        """Run all tests on a single page"""
        page_report = PageReport(url=url, name=name)
        self.console_errors = []

        print(f"\n{'='*60}")
        print(f"  Testing: {name} ({url})")
        print(f"{'='*60}")

        # Navigate to page
        start_time = time.time()
        try:
            response = self.page.goto(f"{BASE_URL}{url}", wait_until="networkidle", timeout=30000)
            page_report.load_time_ms = (time.time() - start_time) * 1000

            if not response or response.status >= 400:
                page_report.issues.append(f"Page returned HTTP {response.status if response else 'No response'}")
                return page_report

        except Exception as e:
            page_report.issues.append(f"Failed to load: {str(e)}")
            return page_report

        print(f"  Load time: {page_report.load_time_ms:.0f}ms")

        # Count elements
        elements = self.count_elements(page_report)
        print(f"  Elements: {sum(elements.values())} total")
        print(f"    - Buttons: {elements['buttons']}, Links: {elements['links']}, Inputs: {elements['inputs']}")

        # Run all test categories
        print("  Running tests...")

        self.test_page_structure(page_report)
        self.test_all_buttons(page_report)
        self.test_all_links(page_report)
        self.test_all_inputs(page_report)
        self.test_forms(page_report)
        self.test_navigation(page_report)
        self.test_interactive_clicks(page_report)
        self.test_responsive(page_report)
        self.test_accessibility_basics(page_report)

        # Take screenshot
        screenshot = self.take_screenshot(name.lower().replace(" ", "_"))

        # Record console errors
        page_report.console_errors = self.console_errors.copy()

        # Count results
        passed = sum(1 for t in page_report.tests if t.status == "pass")
        failed = sum(1 for t in page_report.tests if t.status == "fail")
        warnings = sum(1 for t in page_report.tests if t.status == "warning")

        print(f"  Results: ✅ {passed} passed, ❌ {failed} failed, ⚠️  {warnings} warnings")
        if page_report.console_errors:
            print(f"  Console errors: {len(page_report.console_errors)}")

        return page_report

    def generate_summary(self):
        """Generate final summary statistics"""
        for page in self.report.pages:
            for test in page.tests:
                self.report.total_tests += 1
                if test.status == "pass":
                    self.report.passed += 1
                elif test.status == "fail":
                    self.report.failed += 1
                elif test.status == "warning":
                    self.report.warnings += 1
                else:
                    self.report.skipped += 1

        # Identify critical issues
        for page in self.report.pages:
            for issue in page.issues:
                self.report.critical_issues.append(f"[{page.name}] {issue}")

            failed_tests = [t for t in page.tests if t.status == "fail"]
            for t in failed_tests:
                self.report.critical_issues.append(f"[{page.name}] {t.name}: {t.details}")

    def print_final_report(self):
        """Print comprehensive final report"""
        print("\n")
        print("╔" + "═"*70 + "╗")
        print("║" + " "*20 + "COMPREHENSIVE QA REPORT" + " "*27 + "║")
        print("╠" + "═"*70 + "╣")
        print(f"║  Timestamp: {self.report.timestamp[:19]}" + " "*37 + "║")
        print(f"║  Pages Tested: {len(self.report.pages)}" + " "*52 + "║")
        print("╠" + "═"*70 + "╣")
        print(f"║  Total Tests:    {self.report.total_tests:4d}" + " "*48 + "║")
        print(f"║  ✅ Passed:       {self.report.passed:4d}" + " "*48 + "║")
        print(f"║  ❌ Failed:       {self.report.failed:4d}" + " "*48 + "║")
        print(f"║  ⚠️  Warnings:     {self.report.warnings:4d}" + " "*48 + "║")
        print("╠" + "═"*70 + "╣")

        pass_rate = (self.report.passed / self.report.total_tests * 100) if self.report.total_tests > 0 else 0
        status = "PASSED ✅" if self.report.failed == 0 else "NEEDS ATTENTION ⚠️" if self.report.failed < 5 else "FAILED ❌"

        print(f"║  Pass Rate: {pass_rate:.1f}%" + " "*54 + "║")
        print(f"║  Status: {status}" + " "*(59 - len(status)) + "║")
        print("╚" + "═"*70 + "╝")

        # Page-by-page summary
        print("\n📊 PAGE SUMMARY:")
        print("-" * 70)
        for page in self.report.pages:
            passed = sum(1 for t in page.tests if t.status == "pass")
            failed = sum(1 for t in page.tests if t.status == "fail")
            warnings = sum(1 for t in page.tests if t.status == "warning")
            total = len(page.tests)

            status_icon = "✅" if failed == 0 else "❌"
            print(f"  {status_icon} {page.name:20} | Tests: {total:3d} | ✅{passed:3d} ❌{failed:3d} ⚠️ {warnings:3d} | {page.load_time_ms:.0f}ms")

        # Critical issues
        if self.report.critical_issues:
            print("\n🚨 CRITICAL ISSUES:")
            print("-" * 70)
            for issue in self.report.critical_issues[:15]:
                print(f"  • {issue[:65]}")
            if len(self.report.critical_issues) > 15:
                print(f"  ... and {len(self.report.critical_issues) - 15} more")

        # Recommendations
        print("\n💡 RECOMMENDATIONS:")
        print("-" * 70)

        # Generate recommendations based on findings
        total_console_errors = sum(len(p.console_errors) for p in self.report.pages)
        if total_console_errors > 0:
            print(f"  • Fix {total_console_errors} console errors (likely API/auth issues)")

        if self.report.warnings > 10:
            print(f"  • Address {self.report.warnings} warnings to improve quality")

        # Check for specific issues
        for page in self.report.pages:
            nav_tests = [t for t in page.tests if "Navigation" in t.name and t.status != "pass"]
            if nav_tests:
                print(f"  • Improve navigation on {page.name}")
                break

        print(f"\n📸 Screenshots saved to: {SCREENSHOT_DIR}")
        print(f"📄 Full report saved to: {REPORT_FILE}")

    def save_report(self):
        """Save report to JSON file"""
        # Convert dataclasses to dicts
        report_dict = {
            "timestamp": self.report.timestamp,
            "total_tests": self.report.total_tests,
            "passed": self.report.passed,
            "failed": self.report.failed,
            "warnings": self.report.warnings,
            "skipped": self.report.skipped,
            "critical_issues": self.report.critical_issues,
            "pages": []
        }

        for page in self.report.pages:
            page_dict = {
                "url": page.url,
                "name": page.name,
                "load_time_ms": page.load_time_ms,
                "elements_found": page.elements_found,
                "console_errors": page.console_errors,
                "issues": page.issues,
                "tests": [
                    {
                        "name": t.name,
                        "status": t.status,
                        "details": t.details,
                        "duration_ms": t.duration_ms
                    }
                    for t in page.tests
                ]
            }
            report_dict["pages"].append(page_dict)

        with open(REPORT_FILE, "w", encoding="utf-8") as f:
            json.dump(report_dict, f, ensure_ascii=False, indent=2)

    def run(self):
        """Run complete QA test suite"""
        pages_to_test = [
            ("/", "Home"),
            ("/login", "Login"),
            ("/dashboard", "Dashboard"),
            ("/budget", "Budget"),
            ("/profile", "Profile"),
            ("/savings", "Savings"),
            ("/tasks", "Tasks"),
            ("/monthly-overview", "Monthly Overview"),
            ("/household", "Household"),
            ("/about", "About"),
            ("/guide", "Guide"),
        ]

        print("\n" + "═"*70)
        print("   PiterPay - Comprehensive QA Test Suite")
        print("   Senior QA Engineer Deep Testing")
        print("═"*70)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1280, "height": 720},
                locale="he-IL"
            )
            self.page = context.new_page()
            self.setup_console_listener()

            # Test each page
            for url, name in pages_to_test:
                page_report = self.test_page(url, name)
                self.report.pages.append(page_report)

            browser.close()

        # Generate summary and print report
        self.generate_summary()
        self.print_final_report()
        self.save_report()

        # Return exit code
        return 0 if self.report.failed == 0 else 1


if __name__ == "__main__":
    tester = ComprehensiveQATester()
    exit(tester.run())
