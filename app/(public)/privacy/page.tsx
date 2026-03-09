import Link from "next/link";

export const metadata = { title: "Privacy Policy – tasks.isaaccritchley.uk" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 block">← Back to home</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What data we collect</h2>
            <p>When you submit a task, we collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The task title, notes, and any other fields you fill in</li>
              <li>Your IP address (for spam prevention and security)</li>
              <li>Your browser&apos;s user agent string</li>
              <li>The date and time of submission</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How we use your data</h2>
            <p>Task data is forwarded to Apple Reminders via IFTTT webhooks. IP addresses are stored for security purposes and to prevent abuse.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data retention</h2>
            <p>Task data is retained indefinitely. You may request deletion by contacting the site owner.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p>For privacy-related queries, contact Isaac Critchley at the email associated with this service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
