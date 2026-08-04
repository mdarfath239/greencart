export const categories = [
  { name: "Organic veggies", filter: "Vegetables", image: "/images/organic_vegitable_image.png", bg: "#FEF6DA" },
  { name: "Fresh Fruits", filter: "Fresh Fruits", image: "/images/fresh_fruits_image.png", bg: "#FEE0E0" },
  { name: "Cold Drinks", filter: "Cold Drinks", image: "/images/bottles_image.png", bg: "#F0F5DE" },
  { name: "Instant Food", filter: "Instant Food", image: "/images/maggi_image.png", bg: "#E1F5EC" },
  { name: "Dairy Products", filter: "Dairy", image: "/images/dairy_product_image.png", bg: "#FEE6CD" },
  { name: "Bakery & Breads", filter: "Bakery", image: "/images/bakery_image.png", bg: "#E0F6FE" },
  { name: "Grains & Cereals", filter: "Grains", image: "/images/grain_image.png", bg: "#F1E3F9" },
] as const;

export const features = [
  { title: "Fastest Delivery", description: "Groceries delivered in under 30 minutes.", icon: "/images/delivery_truck_icon.svg" },
  { title: "Freshness Guaranteed", description: "Fresh produce straight from the source.", icon: "/images/leaf_icon.svg" },
  { title: "Affordable Prices", description: "Quality groceries at unbeatable prices.", icon: "/images/coin_icon.svg" },
  { title: "Trusted by Thousands", description: "Loved by 10,000+ happy customers.", icon: "/images/trust_icon.svg" },
] as const;

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "Offers & Deals", href: "/deals" },
  { label: "Contact Us", href: "/products" },
  { label: "FAQs", href: "/products" },
] as const;

export const footerHelpLinks = [
  { label: "Delivery Information", href: "/products" },
  { label: "Return & Refund Policy", href: "/products" },
  { label: "Payment Methods", href: "/products" },
  { label: "Track your Order", href: "/orders" },
  { label: "Contact Us", href: "/products" },
] as const;

export const footerSocialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "YouTube", href: "https://youtube.com" },
] as const;

export const sellerCategories = [
  "Fresh Fruits",
  "Vegetables",
  "Cold Drinks",
  "Instant Food",
  "Dairy",
  "Bakery",
  "Grains",
] as const;
