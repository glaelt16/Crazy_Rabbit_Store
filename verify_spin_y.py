from playwright.sync_api import sync_playwright

def verify_spin():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080")

        page.wait_for_selector(".hero-logo")
        page.screenshot(path="/home/jules/verification/landing-spin-y-anim.png")
        print("Screenshot taken.")
        browser.close()

if __name__ == "__main__":
    verify_spin()
