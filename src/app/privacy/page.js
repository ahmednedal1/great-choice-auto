export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl mb-2">Privacy Policy</h1>
      <div className="swoosh-divider w-16 mb-8" />
      <div className="prose prose-sm text-[var(--text-secondary)] space-y-4">
        <p>
          This is placeholder text. Replace this page with your shop's actual
          privacy policy before launch — covering what customer data you collect
          (name, email, phone, favorites, inquiries), how it's stored (Supabase,
          in Canada/US depending on your project region), and how customers can
          request their data be deleted.
        </p>
        <p>
          A lawyer or a privacy policy generator (many free ones exist for small
          businesses) can help you draft the real version quickly.
        </p>
      </div>
    </div>
  );
}
