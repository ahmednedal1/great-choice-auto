export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">Terms of Service</h1>
      <div className="swoosh-divider w-16 mb-8" />
      <div className="prose prose-sm text-[var(--text-secondary)] space-y-4">
        <p>
          This is placeholder text. Replace this page with your shop's actual
          terms before launch — covering that listed prices/availability can
          change, that photos are representative and not a guarantee of exact
          condition, and any disclaimers relevant to used vehicle sales in your
          province/state.
        </p>
      </div>
    </div>
  );
}
