import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LegalEase | Home Page",
  description: "LegalEase is a modern online lawyer hiring platform that connects clients with verified lawyers for legal consultation and services. Browse lawyer profiles, book appointments, manage cases, and access trusted legal support through a secure and user-friendly platform.",
  keywords: [
    "LegalEase",
    "Online Lawyer Hiring Platform",
    "Lawyer Booking",
    "Legal Consultation",
    "Find Lawyers",
    "Attorney Directory",
    "Legal Services",
    "Appointment Booking",
    "Case Management",
    "Law Firm",
    "Next.js",
    "MERN Stack"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">

        <main>
          <Providers>
            {children}
          </Providers>
        </main>

      </body>
    </html>
  );
}
