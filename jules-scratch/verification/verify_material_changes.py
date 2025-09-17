from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Home page
        page.goto("http://localhost:8000")
        page.screenshot(path="jules-scratch/verification/home-page.png")

        # Cart page
        page.goto("http://localhost:8000/cart")
        page.screenshot(path="jules-scratch/verification/cart-page.png")

        # Checkout page
        page.goto("http://localhost:8000/checkout")
        page.screenshot(path="jules-scratch/verification/checkout-page.png")

        browser.close()

if __name__ == "__main__":
    run()
