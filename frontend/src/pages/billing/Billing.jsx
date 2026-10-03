import React, { useState } from 'react';
import {
  CreditCard, Plus, Download, ShieldCheck, DollarSign,
  FileText, CheckCircle2, ChevronRight, ExternalLink, HelpCircle,
  AlertCircle, Edit2, X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function Billing() {
  const [activeNav, setActiveNav] = useState('settings'); // settings, activity
  const [setupDismissed, setSetupDismissed] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    name: 'Business Shipping Suite Maritime Logistics LLC',
    address: 'Port Boulevard 402, Rotterdam, Netherlands',
    currency: 'USD ($)',
    taxId: 'NL-884920194B01'
  });

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-092',
      date: 'Oct 1, 2026',
      amount: 1420.50,
      description: 'Meta Ads Sponsored Ocean Logistics Campaigns',
      method: 'Visa ending in 4092',
      status: 'Paid'
    },
    {
      id: 'INV-2026-081',
      date: 'Sep 15, 2026',
      amount: 2150.00,
      description: 'Automated Liner API & Reach Promotion',
      method: 'Visa ending in 4092',
      status: 'Paid'
    },
    {
      id: 'INV-2026-074',
      date: 'Aug 31, 2026',
      amount: 980.20,
      description: 'North Sea Wind Project Video Ads',
      method: 'MasterCard ending in 8831',
      status: 'Paid'
    }
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#18191a]">
      {/* Header */}
      <div className="p-6 border-b border-[#e4e6eb] dark:border-[#3e4042] bg-white dark:bg-[#242526]">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-[#0866ff]" />
          <h1 className="text-xl font-bold text-[#050505] dark:text-white">
            Billing & Payments
          </h1>
        </div>
        <p className="text-xs text-[#65676b] dark:text-slate-400">
          Manage payment settings, outstanding balance, business invoicing info, and receipt history.
        </p>
      </div>

      {/* Main Multi-Column Layout: Left Nav + Center Content + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-Navigation (180px) */}
        <div className="w-48 border-r border-[#e4e6eb] dark:border-[#3e4042] p-3 space-y-1 shrink-0 hidden md:block bg-white dark:bg-[#242526]">
          <button
            onClick={() => setActiveNav('settings')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeNav === 'settings'
                ? 'bg-blue-50 text-[#0866ff] dark:bg-blue-900/30'
                : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100'
            }`}
          >
            Payment settings
          </button>
          <button
            onClick={() => setActiveNav('activity')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeNav === 'activity'
                ? 'bg-blue-50 text-[#0866ff] dark:bg-blue-900/30'
                : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100'
            }`}
          >
            Payment activity
          </button>
        </div>

        {/* Center Main Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Onboarding Notice: "Set up your account" */}
          {!setupDismissed && (
            <div className="mbs-card p-4 flex items-start justify-between gap-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0866ff] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                    Set up your business payment account
                  </h3>
                  <p className="text-[11px] text-[#65676b] mt-0.5">
                    Add a backup payment method to ensure uninterrupted delivery of commercial shipping campaigns.
                  </p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <button
                      onClick={() => alert('Launching Payment Setup Wizard')}
                      className="px-3 py-1 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs"
                    >
                      Get started
                    </button>
                    <button
                      onClick={() => setSetupDismissed(true)}
                      className="text-xs font-semibold text-[#65676b] hover:text-[#050505]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setSetupDismissed(true)} className="text-[#65676b] hover:text-[#050505]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Outstanding Balance & Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outstanding Balance */}
            <div className="mbs-card p-5 space-y-3">
              <span className="text-xs font-semibold text-[#65676b] block">
                Outstanding Balance
              </span>
              <div className="text-3xl font-bold text-[#050505] dark:text-white">
                {formatCurrency(344.20)}
              </div>
              <p className="text-xs text-[#65676b]">
                Next billing threshold will be processed on Oct 15, 2026.
              </p>
              <button
                onClick={() => alert('Processing early payment balance')}
                className="px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 shadow-2xs"
              >
                Pay now
              </button>
            </div>

            {/* Payment Methods */}
            <div className="mbs-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#65676b]">
                  Payment Methods
                </span>
                <button
                  onClick={() => alert('Add Payment Method dialog')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0866ff] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add method</span>
                </button>
              </div>

              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[#0866ff] text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#050505] dark:text-white block">
                      •••• 4092
                    </span>
                    <span className="text-[10px] text-[#65676b]">Expires 08/28 • Primary</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="mbs-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                Business Info
              </h2>
              <button
                onClick={() => alert('Edit Business Info dialog')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0866ff] hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#65676b] block">Business Name:</span>
                <strong className="text-[#050505] dark:text-white">{businessInfo.name}</strong>
              </div>
              <div>
                <span className="text-[#65676b] block">Currency:</span>
                <strong className="text-[#050505] dark:text-white">{businessInfo.currency}</strong>
              </div>
              <div>
                <span className="text-[#65676b] block">Address:</span>
                <strong className="text-[#050505] dark:text-white">{businessInfo.address}</strong>
              </div>
              <div>
                <span className="text-[#65676b] block">Tax ID / VAT:</span>
                <strong className="text-[#050505] dark:text-white">{businessInfo.taxId}</strong>
              </div>
            </div>
          </div>

          {/* Payment Activity Table */}
          <div className="mbs-card overflow-hidden">
            <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                Payment Activity
              </h2>
              <button
                onClick={() => alert('Downloading all statement receipts')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0866ff] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download receipts</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Invoice ID</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#0866ff]">
                        {inv.id}
                      </td>
                      <td className="py-3 px-4 text-[#050505] dark:text-white">
                        {inv.date}
                      </td>
                      <td className="py-3 px-4 text-[#65676b]">
                        {inv.description}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#050505] dark:text-white">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Downloading PDF invoice for ${inv.id}`)}
                          className="p-1 hover:text-[#0866ff]"
                        >
                          <Download className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Payment History & Help Center (220px) */}
        <div className="w-56 border-l border-[#e4e6eb] dark:border-[#3e4042] p-4 space-y-5 shrink-0 hidden lg:block bg-white dark:bg-[#242526]">
          <div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white mb-2">
              Payment History
            </h3>
            <p className="text-[11px] text-[#65676b]">
              Lifetime total billed across commercial shipping promotions:
            </p>
            <span className="text-lg font-bold text-[#050505] dark:text-white block mt-1">
              {formatCurrency(14820.70)}
            </span>
          </div>

          <div className="pt-3 border-t border-[#e4e6eb] dark:border-[#3e4042] space-y-2">
            <h3 className="text-xs font-bold text-[#050505] dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#0866ff]" />
              <span>Help Center</span>
            </h3>
            <div className="space-y-1 text-[11px]">
              <a href="#" className="block text-[#0866ff] hover:underline">• How ad billing works</a>
              <a href="#" className="block text-[#0866ff] hover:underline">• Payment threshold FAQs</a>
              <a href="#" className="block text-[#0866ff] hover:underline">• Tax invoice requirements</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
