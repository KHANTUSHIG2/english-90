import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "IELTSPrep — Achieve Your Target Band Score",
  description:
    "Practice IELTS Listening, Reading, Writing and get AI-powered feedback. Trusted by thousands of students worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-muted">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-primary text-white mt-16 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-bold text-lg mb-3">IELTSPrep</div>
                  <p className="text-blue-200 text-sm">
                    Your trusted companion for IELTS success.
                  </p>
                </div>
                <div>
                  <div className="font-semibold mb-3">Practice</div>
                  <ul className="space-y-2 text-sm text-blue-200">
                    <li><a href="/practice/listening" className="hover:text-white">Listening</a></li>
                    <li><a href="/practice/reading" className="hover:text-white">Reading</a></li>
                    <li><a href="/practice/writing" className="hover:text-white">Writing</a></li>
                    <li><a href="/practice/vocabulary" className="hover:text-white">Vocabulary</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-3">Account</div>
                  <ul className="space-y-2 text-sm text-blue-200">
                    <li><a href="/login" className="hover:text-white">Login</a></li>
                    <li><a href="/register" className="hover:text-white">Register</a></li>
                    <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-3">Legal</div>
                  <ul className="space-y-2 text-sm text-blue-200">
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-blue-800 mt-8 pt-6 text-sm text-blue-300 text-center">
                © {new Date().getFullYear()} IELTSPrep. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
