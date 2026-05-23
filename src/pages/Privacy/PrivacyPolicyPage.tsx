import { Link } from 'react-router-dom';
import { Shield, Cookie, ArrowLeft } from 'lucide-react';
import { CookieSettingsButton } from '@/components/gdpr/CookieBanner';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back / 返回
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500">Datenschutzerklärung / 隐私政策</p>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-8">Last updated / 最后更新: {new Date().toLocaleDateString('en-GB')}</div>

        <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-8">
          {/* Section 1: Controller */}
          <Section
            title="1. Data Controller / 数据控制者"
            titleZh=""
          >
            <p className="mb-2">The controller responsible for data processing under the GDPR is:</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold">Taptop Menu</p>
              <p className="text-sm text-gray-500 mt-1">[Company Address / 公司地址]</p>
              <p className="text-sm text-gray-500">Email: privacy@taptopmenu.com</p>
              <p className="text-sm text-gray-500 mt-1">VAT ID: [待填写]</p>
              <p className="text-sm text-gray-500">Commercial Register: [待填写]</p>
            </div>
          </Section>

          {/* Section 2: Data Collected */}
          <Section title="2. Data We Collect / 收集的数据">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li><strong>Account Data:</strong> Email address, name, business name, and profile information when you create an account.</li>
              <li><strong>Store Data:</strong> Business name, address, category, product information, and menu content that you create.</li>
              <li><strong>Usage Data:</strong> QR code scan statistics, page interactions, and device information for analytics purposes (with your consent).</li>
              <li><strong>Cookie Data:</strong> Session information, language preferences, and consent records stored as cookies or localStorage.</li>
              <li><strong>Menu Data:</strong> Menu items, categories, allergen information, and tags you create for your digital menus.</li>
            </ul>
          </Section>

          {/* Section 3: Legal Basis */}
          <Section title="3. Legal Basis for Processing / 处理的法律依据 (GDPR Art. 6)">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li><strong>Art. 6(1)(a):</strong> Consent — for analytics cookies, marketing communications</li>
              <li><strong>Art. 6(1)(b):</strong> Contract performance — account creation, providing our menu and QR services</li>
              <li><strong>Art. 6(1)(c):</strong> Legal obligation — tax records, legal compliance</li>
              <li><strong>Art. 6(1)(f):</strong> Legitimate interest — necessary cookies for service operation, fraud prevention</li>
            </ul>
          </Section>

          {/* Section 4: Data Retention */}
          <Section title="4. Data Retention / 数据保留期限">
            <p className="text-sm text-gray-600">
              We retain your personal data only as long as necessary for the purposes stated:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
              <li>Account data: retained until account deletion</li>
              <li>Store/Menu data: retained until account deletion or manual removal</li>
              <li>Analytics data: retained for 26 months</li>
              <li>Cookie consent records: retained for 3 years from last interaction</li>
            </ul>
          </Section>

          {/* Section 5: Cookies */}
          <Section
            title="5. Cookies & Local Storage / Cookie 和本地存储"
            icon={<Cookie className="w-5 h-5 text-amber-500" />}
          >
            <p className="text-sm text-gray-600 mb-3">We use the following types of cookies and localStorage:</p>

            <div className="space-y-3">
              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-gray-900">Necessary / 必要型</h4>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>· <code>taptopmenu_user</code> — Session authentication (localStorage)</p>
                  <p>· <code>taptopmenu_cookie_consent</code> — Consent preferences (localStorage)</p>
                  <p>· <code>sidebar_state</code> — UI layout preference (cookie, 7 days)</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-gray-900">Functional / 功能型 (with consent / 需同意)</h4>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>· Language preferences (localStorage)</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-gray-900">Analytics / 分析型 (with consent / 需同意)</h4>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>· <code>taptopmenu_analytics</code> — Anonymous usage statistics (localStorage)</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CookieSettingsButton />
            </div>
          </Section>

          {/* Section 6: Data Sharing */}
          <Section title="6. Data Sharing & Third Parties / 数据共享与第三方">
            <p className="text-sm text-gray-600 mb-2">We do not sell your personal data. We may share data with:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Google Fonts</strong> (EU user: loaded locally — no data transmitted)</li>
              <li><strong>Firebase</strong> (EU server: europe-west1) — Authentication and data storage</li>
              <li><strong>GitHub Pages</strong> — Website hosting (processed in compliance with GitHub's DPA)</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">All third-party providers are bound by Data Processing Agreements (DPA) with Standard Contractual Clauses (SCC).</p>
          </Section>

          {/* Section 7: Your Rights */}
          <Section title="7. Your Rights Under GDPR / GDPR 下的权利 (Art. 12–23)">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li><strong>Right of Access (Art. 15):</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate personal data</li>
              <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your data ("Right to be Forgotten")</li>
              <li><strong>Right to Restriction (Art. 18):</strong> Restrict processing under certain conditions</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent (Art. 7(3)):</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              To exercise any of these rights, contact us at <strong>privacy@taptopmenu.com</strong>. We will respond within 30 days.
            </p>
            <p className="text-sm text-gray-600">
              You can also delete your data directly from the <Link to="/profile" className="text-violet-600 underline">Profile page</Link>.
            </p>
          </Section>

          {/* Section 8: Right to Complain */}
          <Section title="8. Right to Complain / 投诉权利">
            <p className="text-sm text-gray-600">
              You have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              The competent supervisory authority in Ireland (EU headquarters):
              <br /><strong>Data Protection Commission (DPC)</strong>
              <br />21 Fitzwilliam Square South, Dublin 2, D02 RD28, Ireland
              <br />Website: <a href="https://www.dataprotection.ie" className="text-violet-600 underline" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>
            </p>
          </Section>

          {/* Section 9: Automated Decision Making */}
          <Section title="9. Automated Decision Making / 自动化决策">
            <p className="text-sm text-gray-600">
              Our allergen detection feature provides AI-based suggestions for informational purposes only. It does not make legally binding decisions and requires manual confirmation by the restaurant operator. No automated profiling with legal effects is performed.
            </p>
          </Section>

          {/* Section 10: Children */}
          <Section title="10. Children's Privacy / 儿童隐私">
            <p className="text-sm text-gray-600">
              Our service is not directed to individuals under 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, please contact us immediately.
            </p>
          </Section>

          {/* Section 11: Changes */}
          <Section title="11. Changes to This Policy / 政策变更">
            <p className="text-sm text-gray-600">
              We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </Section>

          {/* Section 12: Contact */}
          <Section title="12. Contact / 联系方式">
            <p className="text-sm text-gray-600">
              For privacy-related inquiries, contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mt-2">
              <p className="text-sm">
                <strong>Email:</strong> dpo@taptopmenu.com<br />
                <strong>Address:</strong> [待填写]<br />
                <strong>Phone:</strong> [待填写]
              </p>
            </div>
          </Section>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Taptop Menu. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; titleZh?: string; icon?: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        {icon && <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">{icon}</div>}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
