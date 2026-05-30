"use client";

import { useState } from "react";
import { api } from "../lib/api.js";
import Link from "next/link";

type Profile = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  loyaltyPoints?: number | null;
  marketingConsent?: boolean;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
  marketingWhatsApp?: boolean;
  preferences?: Array<{ preference_type: string; item: string }>;
};

export default function ProfileDetails({ profile }: { profile: Profile }) {
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || "");
  const [marketingEmail, setMarketingEmail] = useState(profile.marketingEmail ?? false);
  const [marketingSMS, setMarketingSMS] = useState(profile.marketingSMS ?? false);
  const [marketingWhatsApp, setMarketingWhatsApp] = useState(profile.marketingWhatsApp ?? false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSavePhone = async () => {
    setStatus(null);
    setError(null);

    try {
      const response = await api.updatePhone(phoneNumber);
      if (response) {
        setStatus("Phone number updated successfully.");
      }
    } catch (err: unknown) {
      setError("Unable to update phone number.");
    }
  };

  const handleToggle = async (field: string, value: boolean) => {
    setStatus(null);
    setError(null);

    try {
      const nextEmail = field === "email" ? value : marketingEmail;
      const nextSMS = field === "sms" ? value : marketingSMS;
      const nextWhatsApp = field === "whatsapp" ? value : marketingWhatsApp;

      const payload: any = {
        marketingConsent: nextEmail || nextSMS || nextWhatsApp
      };

      if (field === "email") payload.marketingEmail = value;
      if (field === "sms") payload.marketingSMS = value;
      if (field === "whatsapp") payload.marketingWhatsApp = value;

      await api.updateMarketingPreferences(payload);
      setStatus("Marketing preferences updated.");

      if (field === "email") setMarketingEmail(value);
      if (field === "sms") setMarketingSMS(value);
      if (field === "whatsapp") setMarketingWhatsApp(value);
    } catch (err: unknown) {
      setError("Unable to update marketing preferences.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
            <p className="mt-2 text-slate-600">Manage personal details, loyalty points, and profile settings.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/profile/addresses" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400">
              Addresses
            </Link>
            <Link href="/profile/orders" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Name</h2>
            <p className="mt-2 text-slate-600">{profile.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-slate-600">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Phone number</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Enter phone number"
          />
          <button
            onClick={handleSavePhone}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            type="button"
          >
            Save
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Loyalty points</h2>
            <p className="mt-2 text-slate-600">{profile.loyaltyPoints ?? 0} points</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Member</div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How loyalty works</h2>
        <p className="mt-2 text-slate-600">You earn 1 point for every €10 spent after your order is delivered. Points are stored automatically on your profile and can be redeemed for future rewards.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Marketing preferences</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <input
              type="checkbox"
              checked={marketingEmail}
              onChange={(e) => handleToggle("email", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <span className="text-sm text-slate-700">Email offers</span>
          </label>
          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <input
              type="checkbox"
              checked={marketingSMS}
              onChange={(e) => handleToggle("sms", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <span className="text-sm text-slate-700">SMS offers</span>
          </label>
          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <input
              type="checkbox"
              checked={marketingWhatsApp}
              onChange={(e) => handleToggle("whatsapp", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <span className="text-sm text-slate-700">WhatsApp offers</span>
          </label>
        </div>
        {status ? <p className="mt-3 text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
        {profile.preferences?.length ? (
          <ul className="mt-4 space-y-2 text-slate-600">
            {profile.preferences.map((pref, index) => (
              <li key={index} className="rounded-2xl bg-slate-50 p-3">
                <span className="font-semibold text-slate-900">{pref.preference_type}</span>: {pref.item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-500">No preferences found yet.</p>
        )}
      </div>
    </div>
  );
}
