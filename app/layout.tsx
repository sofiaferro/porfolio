import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Sofia Ferro | Porfolio",
  description: "Software Engineer, AI Engineer, and Creative Technologist",
  generator: 'v0.dev',
  icons: {
    icon: '/icon.ico',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} font-sans bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}



