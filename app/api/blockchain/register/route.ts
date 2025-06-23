import { type NextRequest, NextResponse } from "next/server"

// Mock blockchain registration endpoint
export async function POST(request: NextRequest) {
  try {
    const { title, creator, description, fileHash } = await request.json()

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock blockchain data
    const mockData = {
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      registrationId: `VAC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
      status: "confirmed",
    }

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
