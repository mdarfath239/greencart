"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";

/** Restores local cart data after hydration to keep server/client HTML in sync. */
export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
