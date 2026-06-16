export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">By accessing or using YT Analyzer ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use the Service.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p className="leading-relaxed">YT Analyzer is a web-based analytics tool that queries publicly available YouTube channel and video data via the YouTube Data API v3. The Service is provided free of charge for personal, educational, and non-commercial research purposes.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. YouTube API Compliance</h2>
          <p className="leading-relaxed">This Service is built on the YouTube Data API v3. Use of this Service is also governed by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Terms of Service</a>. You agree not to use YT Analyzer in any way that violates YouTube's Terms of Service or Google's API Terms of Service.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Permitted Use</h2>
          <p className="leading-relaxed">You may use YT Analyzer to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Research public YouTube channel performance data</li>
            <li>Analyze content strategy for educational or professional purposes</li>
            <li>Compare channels for competitive analysis</li>
            <li>Inform your own content creation decisions</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Prohibited Use</h2>
          <p className="leading-relaxed">You may not:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use the Service to harass, defame, or harm any person or channel</li>
            <li>Attempt to circumvent YouTube API rate limits or quotas</li>
            <li>Scrape or systematically extract data from the Service</li>
            <li>Reverse engineer, decompile, or create derivative works from the Service</li>
            <li>Use the Service for any illegal purpose</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Data Accuracy</h2>
          <p className="leading-relaxed">Data is sourced from the YouTube Data API v3 and reflects what YouTube reports at the time of request. We make no warranty as to the accuracy, completeness, or timeliness of any data. Do not rely solely on YT Analyzer data for commercial or investment decisions.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
          <p className="leading-relaxed">YT Analyzer is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including reliance on analytics data or growth recommendations.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">8. Modifications to the Service</h2>
          <p className="leading-relaxed">We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We may also update these Terms. Continued use of the Service constitutes acceptance of updated Terms.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
          <p className="leading-relaxed">Questions about these Terms? Contact us at <a href="mailto:hello@printplues.com" className="text-primary hover:underline">hello@printplues.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
