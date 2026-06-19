const PrivacyPolicy = () => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            Privacy <span className="text-orange-500">Policy</span>
          </h1>

          <p className="mt-4 text-muted-foreground">
            Last Updated: June 2026
          </p>
        </div>

        <div className="space-y-10 rounded-2xl border bg-card p-8 shadow-sm">
          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              1. Introduction
            </h2>

            <p className="text-muted-foreground leading-7">
              Smart Recipe AI respects your privacy and is committed
              to protecting your personal information.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Information We Collect
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Name and email address</li>
              <li>Uploaded food images</li>
              <li>Recipe preferences</li>
              <li>Saved recipes and meal plans</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              3. How We Use Your Information
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Generate AI-powered recipes</li>
              <li>Improve user experience</li>
              <li>Provide customer support</li>
              <li>Personalize recommendations</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Data Security
            </h2>

            <p className="text-muted-foreground leading-7">
              We use industry-standard security measures to protect
              user information from unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Contact Us
            </h2>

            <p className="text-muted-foreground">
              Email: support@smartrecipe.ai
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;