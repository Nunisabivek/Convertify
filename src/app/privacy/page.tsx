import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Convertify",
  description:
    "Privacy policy for the Convertify website and Android app. File conversion runs on your device. We do not upload your files to Convertify servers.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://convertify.work/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Convertify",
    description:
      "Privacy policy for the Convertify website and Android app. File conversion runs on your device.",
    url: "https://convertify.work/privacy",
  },
};

const LAST_UPDATED = "27 August 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-10 text-slate-700 leading-relaxed">
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            This page is a plain-language description of how Convertify works today.
            It is not legal advice.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Who we are and what this covers
            </h2>
            <p className="mt-3">
              Convertify is operated by Convertify /{" "}
              <a href="https://convertify.work" className="text-indigo-600 hover:underline">
                convertify.work
              </a>
              . The operator is Bivek Nunisa. Contact:{" "}
              <a href="mailto:support@convertify.work" className="text-indigo-600 hover:underline">
                support@convertify.work
              </a>
              .
            </p>
            <p className="mt-3">This policy covers:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                The Convertify website at{" "}
                <a href="https://convertify.work" className="text-indigo-600 hover:underline">
                  https://convertify.work
                </a>
                , a Next.js file converter that runs in your browser.
              </li>
              <li>
                The Convertify Android app (package name{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">com.convertify.app</code>
                ), a free app we plan to list on Google Play.
              </li>
            </ul>
            <p className="mt-3">
              There are no user accounts, no sign-up, and no email collection required
              to use the conversion tools on the website or in the Android app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Files and documents
            </h2>
            <p className="mt-3">
              Convertify is built so that conversion happens on your device. Your files
              are not uploaded to Convertify servers for conversion. We do not receive
              the contents of the files you convert.
            </p>
            <p className="mt-3">
              <strong>Website:</strong> files you choose stay in the browser. Conversion
              uses JavaScript and WebAssembly in that browser session. The converted
              result is generated locally and downloaded from your device.
            </p>
            <p className="mt-3">
              <strong>Android app:</strong> you pick a file with the Android system file
              picker. A copy may be stored in the app&apos;s own storage so the app can
              convert it. Conversion runs on the device. You can share the result
              through the system share sheet or save it (for example to Downloads).
              Convertify does not upload those files to Convertify servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. What we do collect
            </h2>
            <p className="mt-3">
              Using the tools does not require an account. We do not ask for your name
              or email to convert a file.
            </p>
            <p className="mt-3">
              <strong>Website hosting and logs.</strong> The website is hosted on Vercel.
              Like most websites, the host may record standard request information such
              as IP address, browser type, date/time, and the page requested. We do not
              use those logs to identify you in order to convert files, and we do not
              store your file contents on our servers.
            </p>
            <p className="mt-3">
              <strong>Website analytics.</strong> The website uses Google Analytics to
              understand aggregate traffic (for example which pages are visited). The
              site is configured to anonymize IP addresses in Analytics. This is
              website measurement, not file upload. The current Android app does not
              include Google Analytics.
            </p>
            <p className="mt-3">
              <strong>Android app storage.</strong> The app may keep a copy of a file
              you picked, plus the converted output, in app storage until you delete
              it from the app or uninstall the app. That copy stays on the device. We
              do not require an account, and we do not operate a Convertify user
              database for the app.
            </p>
            <p className="mt-3">
              <strong>Google Play / Android.</strong> If you install the app from
              Google Play, Google may collect crash reports, device and diagnostics
              data, and store-related information as part of the Play platform. That
              collection is by Google, not a Convertify account system.
            </p>
            <p className="mt-3">
              If you email support, we receive whatever you include in that message
              so we can reply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Advertising</h2>
            <p className="mt-3">
              <strong>Website (current).</strong> The website shows third-party display
              ads from Adsterra. Those ads may use cookies and similar technologies
              to serve and measure ads. We do not control how Adsterra sets cookies.
            </p>
            <p className="mt-3">
              <strong>Android app (current version).</strong> The current Android app
              does not show in-app ads. It does not include AdMob or a Facebook SDK
              in this version.
            </p>
            <p className="mt-3">
              <strong>Possible later changes.</strong> We may later:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>show in-app ads in the Android app using Google AdMob;</li>
              <li>
                promote the app with paid campaigns such as Google Ads and Meta /
                Facebook ads.
              </li>
            </ul>
            <p className="mt-3">
              If we add in-app ads or paid install campaigns, we may use advertising
              identifiers and install attribution (for example the Google advertising
              ID and Play Install Referrer) for that purpose. Those features are{" "}
              <strong>not</strong> in the current Android app. We will update this
              policy before or when they are added.
            </p>
            <p className="mt-3">
              <strong>Cookies on the website.</strong> The website may set cookies or
              allow third parties (Google Analytics and Adsterra) to set cookies or
              similar storage. You can block or delete cookies in your browser
              settings. Doing so may affect ads or measurement on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Android permissions
            </h2>
            <p className="mt-3">
              The Android app only requests access needed to pick a file, convert it
              on the device, and let you save or share the result:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Internet.</strong> Used so the WebView can load the app and
                related web resources. Conversion of the file you pick does not upload
                that file to Convertify servers.
              </li>
              <li>
                <strong>Files you choose.</strong> You grant access to a specific file
                through the system picker. The app does not need access to your entire
                photo or file library.
              </li>
              <li>
                <strong>Save / share.</strong> You can save a converted file (for
                example to Downloads) or share it with another app using Android&apos;s
                share sheet. On older Android versions (9 and below) the app may use
                a storage permission to write to Downloads.
              </li>
            </ul>
            <p className="mt-3">
              The current app does not use the camera, microphone, contacts, location,
              or SMS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Children</h2>
            <p className="mt-3">
              Convertify is not directed at children under 13. We do not knowingly
              collect personal information from children under 13. If you believe a
              child has provided personal information, contact{" "}
              <a href="mailto:support@convertify.work" className="text-indigo-600 hover:underline">
                support@convertify.work
              </a>{" "}
              and we will delete it if we have it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              7. Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this page when the website or Android app changes — for
              example if we add in-app ads or install campaigns. The date at the top
              will change when we do. Continued use after an update means you are
              using the product under the revised description.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Contact</h2>
            <p className="mt-3">
              Questions about this policy:{" "}
              <a href="mailto:support@convertify.work" className="text-indigo-600 hover:underline">
                support@convertify.work
              </a>
            </p>
            <p className="mt-3">
              Website:{" "}
              <a href="https://convertify.work" className="text-indigo-600 hover:underline">
                https://convertify.work
              </a>
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-slate-500">
          <Link href="/" className="text-indigo-600 hover:underline">
            ← Back to Convertify
          </Link>
        </p>
      </div>
    </div>
  );
}
