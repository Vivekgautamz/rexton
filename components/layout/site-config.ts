/**
 * Single source of truth for navigation across storefront and footer.
 */

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Watches" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const accountNav: NavLink[] = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Watches" },
      { href: "/shop?sort=newest", label: "New Arrivals" },
      { href: "/shop?sort=bestseller", label: "Best Sellers" },
      { href: "/collections", label: "Collections" },
      { href: "/shop/automatic", label: "Automatic" },
      { href: "/shop/chronograph", label: "Chronograph" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Concierge Contact" },
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/return-policy", label: "Returns & Exchanges" },
      { href: "/warranty", label: "2-Year Warranty" },
      { href: "/faq", label: "Frequently Asked Questions" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About REXTON" },
      { href: "/about#craftsmanship", label: "Craftsmanship" },
      { href: "/journal", label: "The Journal" },
      { href: "/admin/login", label: "Staff Portal" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/return-policy", label: "Refund Policy" },
      { href: "/shipping-policy", label: "Complimentary Delivery" },
    ],
  },
];

export const announcementMessages = [
  "Complimentary Insured Shipping Across India",
  "Swiss Timeless Root — Swiss-Inspired Precision",
  "2-Year International Manufacturer Warranty on Every Timepiece",
];
