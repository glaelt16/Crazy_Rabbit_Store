from playwright.sync_api import sync_playwright, Page, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop view
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        page.goto("http://localhost:4200")
        page.wait_for_selector('app-navbar', timeout=10000)
        page.screenshot(path="jules-scratch/verification/desktop_navbar.png")

        # Mobile view
        page.set_viewport_size({'width': 375, 'height': 667})

        # Open the menu
        menu_toggle = page.locator('.menu-toggle')
        menu_toggle.click()

        # Wait for the menu to open
        nav_links = page.locator('.nav-links.open')
        expect(nav_links).to_be_visible()
        page.wait_for_timeout(500) # wait for animation

        page.screenshot(path="jules-scratch/verification/mobile_navbar_open.png")

        browser.close()

if __name__ == "__main__":
    run()
