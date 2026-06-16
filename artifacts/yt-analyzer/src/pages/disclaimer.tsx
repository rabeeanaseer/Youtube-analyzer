export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
        <p className="text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">No Affiliation with YouTube or Google</h2>
          <p className="leading-relaxed">YT Analyzer is an independent third-party tool and is not affiliated with, endorsed by, sponsored by, or in any way officially connected with YouTube LLC, Google LLC, or any of their subsidiaries or affiliates. The official YouTube website is available at <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">youtube.com</a>. "YouTube" is a registered trademark of Google LLC.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Data Accuracy and Reliability</h2>
          <p className="leading-relaxed">All data displayed in YT Analyzer is retrieved from the YouTube Data API v3 and reflects what YouTube reports at the time of the API call. We do not guarantee the accuracy, completeness, currentness, or reliability of any data. YouTube may delay, throttle, or modify the data returned by its API at any time.</p>
          <p className="leading-relaxed">Metrics such as engagement rate, posting heatmap intensity, and duration performance are computed by our system based on API-returned data and are provided for informational and research purposes only. They should not be treated as definitive measures of channel performance.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Growth Recommendations</h2>
          <p className="leading-relaxed">The "Growth Recommendations" feature provides algorithmic suggestions based on pattern analysis of a channel's public performance data. These suggestions are general strategic observations — not guaranteed outcomes. YouTube's recommendation algorithm is proprietary and changes frequently. Results from implementing any suggestion will vary based on factors entirely outside our analysis, including content quality, audience behavior, external trends, and platform policy changes.</p>
          <p className="leading-relaxed">We make no promise or guarantee that following any recommendation will result in increased views, subscribers, engagement, or revenue.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Not Professional Advice</h2>
          <p className="leading-relaxed">Nothing on YT Analyzer constitutes professional marketing advice, financial advice, legal advice, or investment advice. All content is provided for educational and informational purposes only. Always consult qualified professionals before making significant business or financial decisions based on analytics data.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">External Links</h2>
          <p className="leading-relaxed">YT Analyzer may contain links to external websites, including YouTube video pages, channel pages, and YouTube's official policies. We are not responsible for the content, privacy practices, or availability of any external sites. Links are provided for convenience only and do not imply endorsement.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p className="leading-relaxed">To the fullest extent permitted by applicable law, YT Analyzer, its creator, and contributors shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of or reliance on data, recommendations, or any other content provided by this tool.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="leading-relaxed">Questions or concerns? Contact us at <a href="mailto:hello@printplues.com" className="text-primary hover:underline">hello@printplues.com</a> or through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
