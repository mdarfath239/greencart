"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { addressSchema, type AddressInput } from "@/lib/validations/address";

const initialValues: AddressInput = { name: "", phone: "", street: "", city: "", state: "", zip: "", country: "India" };

export function AddressForm({ returnTo = "/checkout" }: { returnTo?: string }) {
  const router = useRouter();
  const [values, setValues] = useState<AddressInput>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressInput, string>>>({});
  const [requestError, setRequestError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: keyof AddressInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");
    const parsed = addressSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])));
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save the address.");
      router.push(returnTo.startsWith("/") ? returnTo : "/checkout");
      router.refresh();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to save the address.");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof AddressInput; label: string; autoComplete?: string; className?: string }[] = [
    { key: "name", label: "Full name", autoComplete: "name" }, { key: "phone", label: "Phone", autoComplete: "tel" },
    { key: "street", label: "Street address", autoComplete: "street-address", className: "sm:col-span-2" }, { key: "city", label: "City", autoComplete: "address-level2" },
    { key: "state", label: "State / region", autoComplete: "address-level1" }, { key: "zip", label: "Postal code", autoComplete: "postal-code" }, { key: "country", label: "Country", autoComplete: "country-name" },
  ];

  return <form onSubmit={onSubmit} noValidate className="rounded-[2rem] border border-[#dce5d6] bg-white p-6 shadow-[0_18px_55px_-45px_rgba(33,87,44,0.55)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2">{fields.map(({ key, label, autoComplete, className }) => <label key={key} className={className}><span className="mb-2 block text-sm font-bold text-[#38553e]">{label}</span><input value={values[key]} onChange={(event) => update(key, event.target.value)} autoComplete={autoComplete} className={`w-full rounded-xl border bg-[#fdfefc] px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#d9ead3] ${errors[key] ? "border-[#b75143]" : "border-[#cfddca] focus:border-[#4d924f]"}`} />{errors[key] && <span className="mt-1.5 block text-xs font-medium text-[#ad4437]">{errors[key]}</span>}</label>)}</div>{requestError && <p role="alert" className="mt-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4135]">{requestError}</p>}<button disabled={saving} className="mt-7 h-12 rounded-full bg-[#1f6b39] px-7 text-sm font-bold text-white transition hover:bg-[#15562d] disabled:cursor-not-allowed disabled:bg-[#9baba0]">{saving ? "Saving address…" : "Save delivery address"}</button></form>;
}
