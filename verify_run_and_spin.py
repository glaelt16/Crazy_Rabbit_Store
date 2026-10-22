import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto("http://localhost:8080/")

        # Wait a little to ensure everything renders
        await page.wait_for_timeout(2000)

        # Take a screenshot to verify layout (even though it's mid-animation)
        await page.screenshot(path="/home/jules/verification/run-and-spin.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
