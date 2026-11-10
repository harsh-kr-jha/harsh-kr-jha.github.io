# Headwig launch page

Open `/headwig/` on the portfolio site. This is a static page; no build step is required.
The demo (`Headwig_Demo_New.mp4`) is optimized for the web at 1080p/30 fps, encoded with H.264 (CRF 22, slow preset), original AAC audio, and fast-start metadata for streaming.

## Connect the waitlist to Google Sheets

1. Create a blank Google Sheet in the Google account that should own the waitlist. Keep the sheet private.
2. In the Sheet, choose **Extensions → Apps Script**.
3. Replace the editor's code with `integrations/Code.gs` from this folder. Save.
4. Select **setup** from the function dropdown and click **Run**. Authorize the script using your Google account. This stores the sheet ID and creates the `Headwig waitlist` tab.
5. Choose **Deploy → New deployment**. Select the gear icon, then **Web app**.
6. Set **Execute as** to **Me**, and **Who has access** to **Anyone**. Deploy and authorize if prompted. If your organization disables public web apps, use an account that allows them.
7. Copy the **Web app URL** ending in `/exec` (not the editor URL or `/dev` testing URL).
8. Set `window.HEADWIG_WAITLIST_URL` in `config.js` to that URL.
9. Deploy these website changes through the portfolio's usual GitHub Pages workflow. Submit one test entry from the deployed page and verify the row exists in the Sheet and the page shows confirmation.

The public URL can only accept signups; this script does not expose a read endpoint. Never add Google credentials or API keys to the website. Responses are only shown as successful after the server confirms the write. With no endpoint configured, the form says the waitlist is opening soon and does not save submissions. Duplicate emails return success without adding another row. The honeypot discourages basic bots; this is not comprehensive spam protection.

After changing the script, use **Deploy → Manage deployments → Edit → New version** to update the existing deployment and preserve its URL.

## Updating the existing waitlist for Name and Message

In the Google Sheet, choose **Extensions → Apps Script** and replace the script with the latest `integrations/Code.gs`. Run **setup** once: it adds Name and Message columns to the existing tab without changing earlier entries. Then choose **Deploy → Manage deployments → Edit → New version → Deploy**. The existing `/exec` URL stays the same. Do this before publishing the updated form; the previously deployed script does not store the new fields.

Google reference: https://developers.google.com/apps-script/guides/web
