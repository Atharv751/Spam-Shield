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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
