"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="mt-16 rounded-lg bg-primary/10 px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Never Miss a Deal!</h2>
        <p className="mt-3 text-sm text-gray-600 md:text-base">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email id"
            required
            className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-sm outline-none transition focus:border-primary sm:max-w-md"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition hover:bg-primary-dull"
          >
            Subscribe
          </button>
        </form>
        {submitted && (
          <p className="mt-4 text-sm font-medium text-primary">Thanks for subscribing!</p>
        )}
      </div>
    </section>
  );
}
