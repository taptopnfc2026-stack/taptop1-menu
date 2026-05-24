import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Globe, Shield } from 'lucide-react';

export function ImprintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back / 返回
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Imprint / Impressum</h1>
            <p className="text-gray-500">Legal Notice / 法律声明 · 公司信息</p>
          </div>
        </div>

        <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-8">
          {/* Company Info */}
          <Section title="Company Information / 公司信息" icon={<Building2 className="w-5 h-5 text-cyan-500" />}>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <InfoRow label="Company / 公司名称" value="Taptop Menu" />
              <InfoRow label="Address / 地址" value="[待填写 - EU business address]" />
              <InfoRow label="Email" value="contact@taptopmenu.com" />
              <InfoRow label="Phone / 电话" value="[待填写]" />
            </div>
          </Section>

          {/* Legal Representative */}
          <Section title="Authorized Representative / 法定代表人">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <InfoRow label="Name / 姓名" value="[待填写]" />
              <InfoRow label="Position / 职位" value="Managing Director / 总经理" />
            </div>
          </Section>

          {/* Registration */}
          <Section title="Registration / 商业登记" icon={<Globe className="w-5 h-5 text-cyan-500" />}>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <InfoRow label="Commercial Register / 商业登记号" value="[待填写]" />
              <InfoRow label="Registration Court / 登记法院" value="[待填写]" />
              <InfoRow label="VAT ID / 增值税号 (EU)" value="[待填写]" />
              <InfoRow label="EORI Number" value="[待填写]" />
            </div>
          </Section>

          {/* Responsible for Content */}
          <Section title="Responsible for Content (§ 55 Abs. 2 RStV) / 内容负责人">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <InfoRow label="Name / 姓名" value="[待填写 - same as above]" />
              <InfoRow label="Address / 地址" value="[待填写 - same as above]" />
            </div>
          </Section>

          {/* Dispute Resolution */}
          <Section title="Online Dispute Resolution / 在线争议解决">
            <p className="text-sm text-gray-600 mb-3">
              The European Commission provides a platform for Online Dispute Resolution (ODR):
              <br />
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline">https://ec.europa.eu/consumers/odr</a>
            </p>
            <p className="text-sm text-gray-600">
              We are not obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.
            </p>
          </Section>

          {/* Liability */}
          <Section title="Liability Disclaimer / 免责声明" icon={<Shield className="w-5 h-5 text-cyan-500" />}>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Content Liability / 内容责任</h4>
            <p className="text-sm text-gray-600 mb-4">
              As a service provider, we are responsible for our own content on these pages in accordance with general laws. We are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
            </p>

            <h4 className="font-semibold text-sm text-gray-900 mb-2">Link Liability / 链接责任</h4>
            <p className="text-sm text-gray-600">
              Our offer contains links to external websites of third parties, on whose contents we have no influence. The respective provider or operator of the linked pages is always responsible for their content. We have checked the linked pages for possible legal violations at the time of linking and found no illegal content.
            </p>
          </Section>

          {/* Copyright */}
          <Section title="Copyright / 版权">
            <p className="text-sm text-gray-600">
              The content and works created by the site operators on these pages are subject to copyright law. Reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
            </p>
          </Section>

          {/* EU Compliance */}
          <Section title="EU Compliance / EU 合规声明">
            <p className="text-sm text-gray-600 mb-3">
              Taptop Menu complies with the following EU regulations:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>GDPR</strong> (Regulation (EU) 2016/679) — General Data Protection Regulation</li>
              <li><strong>ePrivacy Directive</strong> (Directive 2002/58/EC) — Privacy and Electronic Communications</li>
              <li><strong>DSA</strong> (Regulation (EU) 2022/2065) — Digital Services Act</li>
              <li><strong>EU 1169/2011</strong> — Food Information to Consumers (Allergen labeling)</li>
              <li><strong>EAA</strong> (Directive (EU) 2019/882) — European Accessibility Act</li>
            </ul>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Taptop Menu. All rights reserved.
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <Link to="/privacy" className="text-violet-600 hover:text-violet-700 underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">Imprint</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-sm text-gray-500 w-48 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
