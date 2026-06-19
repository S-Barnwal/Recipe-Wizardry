const CookiePolicy = () => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Cookie <span className="text-orange-500">Policy</span>
          </h1>

          <p className="mt-4 text-muted-foreground">
            Last Updated: June 2026
          </p>
        </div>

        <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm">

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. What Are Cookies?
            </h2>

            <p className="text-muted-foreground leading-7">
              Cookies are small text files stored on your device that
              help websites remember user preferences and improve the
              browsing experience.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. How We Use Cookies
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Remember user preferences.</li>
              <li>Improve website performance.</li>
              <li>Analyze usage patterns.</li>
              <li>Enhance user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              3. Types of Cookies We Use
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Essential Cookies</li>
              <li>Performance Cookies</li>
              <li>Analytics Cookies</li>
              <li>Preference Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Managing Cookies
            </h2>

            <p className="text-muted-foreground leading-7">
              Users can disable or remove cookies through browser
              settings. However, some features of the platform may not
              function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Third-Party Cookies
            </h2>

            <p className="text-muted-foreground leading-7">
              We may use trusted third-party analytics services that
              place cookies to help us understand platform usage and
              improve our services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Updates to This Policy
            </h2>

            <p className="text-muted-foreground leading-7">
              This Cookie Policy may be updated periodically. Changes
              will be posted on this page along with the revised date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Contact Us
            </h2>

            <p className="text-muted-foreground">
              Email: contact.snehabarnwal@gmail.com
            </p>
          </section>

        </div>
      </div>
    </section>
  );
};

export default CookiePolicy;