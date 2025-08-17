"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import "@/styles/globals.css";
import { redirect } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-offwhite text-gray-900 font-sans">
        <QueryClientProvider client={queryClient}>
          <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="font-serif text-xl md:text-2xl font-bold text-gold">
                  MyHotel
                </div>
                <nav className="hidden md:flex items-center gap-4">
                  <button className="text-gray-700 hover:text-gold transition font-medium">
                    Rooms
                  </button>
                  <button className="text-gray-700 hover:text-gold transition font-medium">
                    Facilities
                  </button>
                  <button className="text-gray-700 hover:text-gold transition font-medium">
                    Gallery
                  </button>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="px-5 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold border border-gold transition"
                  onClick={() => redirect("/booking")}
                >
                  BOOK NOW
                </button>
                <button
                  className="md:hidden flex flex-col gap-1.5"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Toggle Menu"
                >
                  <span className="w-6 h-0.5 bg-gray-800"></span>
                  <span className="w-6 h-0.5 bg-gray-800"></span>
                  <span className="w-6 h-0.5 bg-gray-800"></span>
                </button>
              </div>
            </div>

            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <nav className="flex flex-col p-4 gap-2 bg-white shadow-inner">
                <button className="text-gray-700 hover:text-gold text-left font-medium">
                  Rooms
                </button>
                <button className="text-gray-700 hover:text-gold text-left font-medium">
                  Facilities
                </button>
                <button className="text-gray-700 hover:text-gold text-left font-medium">
                  Gallery
                </button>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-white border-t border-gold/30 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">
              <h4 className="text-lg font-serif font-bold mb-2">Contact Us</h4>
              <p className="text-gray-700 mb-1">
                123 Luxury St, Hotel City, Country
              </p>
              <p className="text-gray-700 mb-1">Phone: +123 456 7890</p>
              <p className="text-gray-700">Email: contact@myhotel.com</p>
              <p className="mt-4 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} MyHotel. All rights reserved.
              </p>
            </div>
          </footer>
        </QueryClientProvider>
      </body>
    </html>
  );
}
