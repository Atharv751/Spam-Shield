import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "VideoAuthChain - AI Deepfake Detection & Video Verification",
  description:
    "Professional AI-powered platform for detecting deepfakes and verifying video authenticity using blockchain technology and advanced neural networks.",
  keywords: "deepfake detection, AI, blockchain, video verification, authenticity, neural networks, web3",
  authors: [{ name: "VideoAuthChain Team" }],
  openGraph: {
    title: "VideoAuthChain - Professional Deepfake Detection",
    description: "Advanced AI and blockchain technology for video authenticity verification",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body>{children}</body>
    </html>
  )
}
