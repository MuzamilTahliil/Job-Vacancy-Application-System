import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobHub - Find Your Dream Job",
  description: "Job listings and applications platform - Connect employers with talented job seekers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        
        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
              <div>
                <div className="flex items-center text-2xl font-bold mb-4">
                  <span className="text-primary-green">Job</span>
                  <span className="text-white ml-1">Vacancy</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Connecting talented job seekers with amazing opportunities.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="/" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Home</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-primary-green transition-colors text-sm">About</a></li>
                  <li><a href="/jobs" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Jobs</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-5">For Job Seekers</h4>
                <ul className="space-y-3">
                  <li><a href="/register" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Create Account</a></li>
                  <li><a href="/jobs" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Browse Jobs</a></li>
                  <li><a href="/seeker/dashboard" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-5">For Employers</h4>
                <ul className="space-y-3">
                  <li><a href="/register" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Post Jobs</a></li>
                  <li><a href="/employer/dashboard" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Dashboard</a></li>
                  <li><a href="/employer/post-job" className="text-gray-400 hover:text-primary-green transition-colors text-sm">Post a Job</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-sm text-gray-400">&copy; 2025 JobHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
