"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) => set((state) => {
        const existing = state.items.find((entry) => entry.id === item.id);
        if (existing) {
          return { items: state.items.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry) };
        }
        return { items: [...state.items, { ...item, quantity }] };
      }),
      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity > 0 ? state.items.map((item) => item.id === id ? { ...item, quantity } : item) : state.items.filter((item) => item.id !== id),
      })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "greencart-cart", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
