export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">1. Overview</h2>
          <p className="leading-relaxed">YT Analyzer ("we", "our", "us") is a free analytics tool that queries the YouTube Data API v3 to surface channel performance data. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights regarding that data.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">2. Data We Do Not Collect</h2>
          <p className="leading-relaxed">YT Analyzer does not operate a database. We do not collect, store, or retain:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Personal information (name, email, phone number)</li>
            <li>Account credentials or authentication tokens</li>
            <li>Search history or browsing behavior</li>
            <li>IP addresses or device fingerprints</li>
            <li>Any user-generated content</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">3. YouTube Data API Usage</h2>
          <p className="leading-relaxed">This application uses the YouTube Data API v3 to retrieve publicly available channel and video statistics. By using this tool, you are also subject to <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube's Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>. We only access public data that any user could view on YouTube directly.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">4. Cookies and Local Storage</h2>
          <p className="leading-relaxed">We do not use cookies for tracking or advertising. The application uses in-memory query caching (via TanStack Query) within your browser session only. This data is discarded when you close or refresh the tab. No data is persisted to local storage.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
          <p className="leading-relaxed">YT Analyzer calls the YouTube Data API v3, operated by Google LLC. Google may log API requests in accordance with their own privacy policy. We do not share any user data with third parties because we do not collect user data.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">6. Children's Privacy</h2>
          <p className="leading-relaxed">YT Analyzer is not directed at children under the age of 13. We do not knowingly collect information from children. If you believe a child has submitted information, please contact us and we will address it promptly.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
          <p className="leading-relaxed">We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Continued use of YT Analyzer after changes constitutes acceptance of the revised policy.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
          <p className="leading-relaxed">Questions about this policy? Contact us at <a href="mailto:hello@printplues.com" className="text-primary hover:underline">hello@printplues.com</a> or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
