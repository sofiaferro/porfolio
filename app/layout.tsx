import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Sofia Ferro | Portfolio",
  description: "Software Engineer, AI Engineer, and Creative Technologist",
  generator: 'v0.dev',
  icons: {
    icon: '/icon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono bg-background`}>
        {children}
      </body>
    </html>
  )
} 