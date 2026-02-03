# Yavuli SEO Manual Action Plan

You have implemented the best-in-class technical SEO on your website. To get ranked for "Kishlaya Mishra" and "Yavuli", you must complete these manual steps. Search engines need to "trust" your site, and that requires verification and data.

## 1. Google Search Console (CRITICAL)
This is how you tell Google "I own this site, please index it".
1.  Go to [Google Search Console](https://search.google.com/search-console).
2.  Add Property: `https://yavuli.app`.
3.  **Verification**: Since you are on Netlify, the easiest way is usually adding a standard HTML tag or verifying via DNS if you have a custom domain.
4.  **Submit Sitemap**:
    *   Go to "Sitemaps" on the left menu.
    *   Enter `sitemap.xml` and submit.
    *   Google will now crawl your pages.

## 2. Google Analytics (GA4)
To track who visits your site.
1.  Go to [Google Analytics](https://analytics.google.com/).
2.  Create a property for Yavuli.
3.  Get the **Measurement ID** (starts with `G-`).
4.  **Action**: **DONE**. I have added the GA script (`G-2BPS429V7M`) to your `index.html`. Data should start appearing in your dashboard within 24-48 hours.

## 3. Claim Social Profiles
To reinforce the "Organization" and "Person" schema we added.
1.  **LinkedIn**: specific URL for "Kishlaya Mishra" and "Yavuli".
2.  **Twitter/X**: `@yavuli` (we added this to metadata, make sure it exists).
3.  **Crunchbase**: If possible, create a profile for Yavuli and yourself. This is HUGE for "Founder/CEO" rankings.

## 4. Content Strategy (The "Kishlaya Mishra" Ranking)
To rank for your name specifically:
*   **About Page**: Ensure the `Welcome` page or a dedicated `About` section clearly states "Founded by Kishlaya Mishra". (We added this to the meta tags, but visible text is also important).
*   **LinkedIn**: Update your LinkedIn headline to "Founder & CEO @ Yavuli".
*   **Backlinks**: Try to get a mention on your college website or student newspaper linking to Yavuli. .edu backlinks are gold for SEO.

## 5. Metadata Verification
We have added:
*   **Title Tags**: Optimized for "Student Marketplace" and "Kishlaya Mishra".
*   **JSON-LD Schema**:
    *   **Organization**: Defines Yavuli.
    *   **Person**: Defines Kishlaya Mishra as Founder.
    *   **Product**: Defines listings for Shopping tabs.

## 6. Next Steps
*   Deploy these changes to production.
*   Wait 3-7 days after submitting to Search Console.
*   Search `site:yavuli.app` on Google to see if pages are indexed.
