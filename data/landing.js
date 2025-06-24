import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// ✅ Features Data (icons as component references, not JSX)
export const featuresData = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your spending patterns with AI-powered analytics",
  },
  {
    icon: Receipt,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: PieChart,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: CreditCard,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
  },
  {
    icon: Zap,
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
  },
];

// ✅ How It Works Data (icons as component references)
export const howItWorksData = [
  {
    icon: CreditCard,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: BarChart3,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: PieChart,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// ✅ Testimonials Data (local images preferred for Vercel)
export const testimonialsData = [
  {
    name: "Kate Johnson",
    role: "Product Manager",
    image: "/avatars/kate.jpg",
    quote:
      "FinEase has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "John Smith",
    role: "Freelancer",
    image: "/avatars/john.jpg",
    quote:
      "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Rachel Green",
    role: "Financial Advisor",
    image: "/avatars/rachel.jpg",
    quote:
      "I recommend FinEase to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];
