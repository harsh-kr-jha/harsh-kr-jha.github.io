# harsh-kr-jha.github.io
 2020 in a nutshell

Harsh kumar jha



## Site analytics

PostHog is installed on the portfolio, Headwig, and the older subpages through `assets/js/posthog-analytics.js`. Its public project key and US ingest host are configured there. The Web analytics dashboard shows unique visitors, page views, entry pages, referrers, UTM campaigns, countries, browsers, and devices. The Headwig page also sends `headwig_demo_played`, `headwig_demo_completed`, `headwig_waitlist_opened` (with button placement), and `headwig_waitlist_joined` (only after the Sheet confirms saving). The portfolio tracks `headwig_link_clicked`.

The integration does not send waitlist field values to PostHog. Click autocapture and session replay are disabled. Analytics is skipped on localhost and `127.0.0.1` to avoid development traffic. Use PostHog's **Live events** view to confirm collection after deployment; browser privacy blockers can prevent tracking.

To exclude your own browser from analytics, open the published site once with `?analytics=off` (for example, `https://harsh-kr-jha.github.io/?analytics=off`). The preference is stored in that browser for the whole site; no PostHog script loads there on later visits. Open `?analytics=on` to reverse it. Repeat for each browser or device you use. Private browsing or clearing site storage removes the preference. This excludes future traffic only; it does not delete events already collected.
