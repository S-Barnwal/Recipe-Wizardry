const TermsConditions = () => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Terms & <span className="text-orange-500">Conditions</span>
          </h1>

          <p className="mt-4 text-muted-foreground">
            Last Updated: June 2026
          </p>
        </div>

        <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm">

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>

            <p className="text-muted-foreground leading-7">
              By accessing and using Recipe Wizardry, you agree to comply
              with these Terms and Conditions. If you do not agree with
              any part of these terms, please discontinue using our
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Use of Services
            </h2>

            <p className="text-muted-foreground leading-7">
              Recipe Wizardry provides AI-powered recipe suggestions,
              meal planning tools, and food-related recommendations.
              Users are responsible for ensuring that ingredients and
              recipes are suitable for their dietary requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              3. User Responsibilities
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate information.</li>
              <li>Use the platform responsibly.</li>
              <li>Do not misuse or exploit the service.</li>
              <li>Respect intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Intellectual Property
            </h2>

            <p className="text-muted-foreground leading-7">
              All content, branding, logos, software, and designs
              available on Recipe Wizardry are protected by copyright
              and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Limitation of Liability
            </h2>

            <p className="text-muted-foreground leading-7">
              Recipe Wizardry shall not be held liable for any dietary
              issues, allergies, or damages resulting from the use of
              recipes or recommendations provided by the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Changes to Terms
            </h2>

            <p className="text-muted-foreground leading-7">
              We reserve the right to modify these terms at any time.
              Continued use of the platform after updates constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Contact Information
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

export default TermsConditions;