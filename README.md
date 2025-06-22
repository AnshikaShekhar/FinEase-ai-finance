# 💸 FinEase - Full Stack AI Finance Platform

FinEase is a modern, AI-powered finance management platform designed to help users track expenses, get budget insights, and automate workflows. Built using **Next.js**, **Supabase**, **Prisma**, **Inngest**, **ArcJet**, **Tailwind CSS**, and **Shadcn UI**, it offers a seamless and secure user experience. Now with **receipt scanning via Google Cloud Vision API** and **email notifications** for budget alerts!

🚀 **Live Demo:** [https://fin-ease-ai-finance.vercel.app/](https://fin-ease-ai-finance.vercel.app/)

---

## ⚙️ Tech Stack

| Technology         | Purpose                                        |
|--------------------|------------------------------------------------|
| Next.js            | React-based full-stack framework               |
| Supabase           | Auth & PostgreSQL database                     |
| Prisma             | ORM for type-safe DB queries                   |
| Inngest            | Serverless event-driven background jobs        |
| ArcJet             | Bot protection & rate limiting                 |
| Tailwind CSS       | Utility-first CSS framework                    |
| Shadcn UI          | Modern, accessible UI components               |
| Google Vision API  | OCR for receipt scanning                       |
| Resend             | Email service for notifications                |
| Vercel             | Frontend + API deployment                      |

---

## ✨ Features

- 🔐 Supabase Auth for secure login/signup
- 📥 Add, categorize, and manage income and expenses
- 📊 Dynamic dashboards with monthly/yearly insights
- 🤖 AI-based transaction classification
- 🧾 **Receipt Scanner**: Upload receipt images and auto-extract data using **Google Cloud Vision API**
- 📧 **Email Notifications**: Receive alerts for budget limits & monthly summaries using **Resend**
- 🔁 Background jobs powered by **Inngest** for:
  - Reminder alerts
  - Scheduled reports
- 🛡️ Security with **ArcJet** for rate-limiting and abuse prevention
- 🎨 Clean UI built using **Shadcn UI** + **Tailwind CSS**
- 🌐 Deployed on **Vercel**

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finease.git

# 2. Navigate into the project
cd finease

# 3. Install dependencies
npm install

# 4. Create environment variables file
cp .env.example .env.local

#5 . Fill in .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_url
RESEND_API_KEY=your_resend_api_key
GOOGLE_APPLICATION_CREDENTIALS=./lib/gcp-key.json
#6. Run
npm run dev


