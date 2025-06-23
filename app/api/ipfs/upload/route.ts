import { type NextRequest, NextResponse } from "next/server"

// Mock IPFS upload endpoint
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Simulate IPFS upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock IPFS hash
    const mockIpfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`

    const mockData = {
      ipfsHash: mockIpfsHash,
      size: file.size,
      fileName: file.name,
      uploadTime: new Date().toISOString(),
      gateway: `https://ipfs.io/ipfs/${mockIpfsHash}`,
      pinned: true,
    }

    return NextResponse.json({
      success: true,
      data: mockData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "IPFS upload failed" }, { status: 500 })
  }
}
