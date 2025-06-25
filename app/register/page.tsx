"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Shield, Upload, Hash, Globe, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletConnection } from "@/components/wallet-connection"
import { BlockchainTransaction } from "@/components/blockchain-transaction"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creator: "",
    file: null as File | null,
  })
  const [registrationData, setRegistrationData] = useState({
    hash: "",
    ipfsHash: "",
    blockchainTx: "",
    registrationId: "",
  })

  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  const handleWalletConnected = (accounts: string[]) => {
    setWalletConnected(accounts.length > 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file || !walletConnected) return

    setIsUploading(true)

    // Simulate registration process
    const steps = [
      { name: "Uploading to IPFS", delay: 2000 },
      { name: "Generating cryptographic hash", delay: 1500 },
      { name: "Preparing blockchain transaction", delay: 1000 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setStep(i + 2)
      await new Promise((resolve) => setTimeout(resolve, steps[i].delay))
    }

    // Generate mock registration data
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`
    const mockIpfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`
    const mockId = `VAC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    setRegistrationData({
      hash: mockHash,
      ipfsHash: mockIpfsHash,
      blockchainTx: "",
      registrationId: mockId,
    })

    setStep(5) // Move to blockchain transaction step
    setIsUploading(false)
  }

  const handleTransactionComplete = (result: any) => {
    setRegistrationData((prev) => ({
      ...prev,
      blockchainTx: result.hash,
    }))

    // Save registration data to localStorage
    const savedVideos = JSON.parse(localStorage.getItem("registeredVideos") || "[]")
    const newVideo = {
      id: registrationData.registrationId,
      title: formData.title,
      creator: formData.creator,
      description: formData.description,
      registrationDate: new Date().toISOString().split("T")[0],
      hash: registrationData.hash,
      ipfsHash: registrationData.ipfsHash,
      blockchainTx: result.hash,
      status: "verified",
      verifications: 0,
      fileName: formData.file?.name || "Unknown",
    }
    savedVideos.push(newVideo)
    localStorage.setItem("registeredVideos", JSON.stringify(savedVideos))

    setRegistrationComplete(true)
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <CardTitle className="text-3xl text-white">Registration Complete!</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Your video has been successfully registered on VideoAuthChain and the Polygon blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Registration ID</Label>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                      <code className="text-purple-400 font-mono text-sm">{registrationData.registrationId}</code>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Cryptographic Hash</Label>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                      <code className="text-green-400 font-mono text-xs break-all">{registrationData.hash}</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">IPFS Hash</Label>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                      <code className="text-blue-400 font-mono text-xs break-all">{registrationData.ipfsHash}</code>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Blockchain Transaction</Label>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                      <code className="text-yellow-400 font-mono text-xs break-all">
                        {registrationData.blockchainTx}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Your video is now permanently registered on the Polygon blockchain</li>
                  <li>• The transaction is visible in your MetaMask wallet</li>
                  <li>• Anyone can verify its authenticity using the registration ID</li>
                  <li>• The cryptographic hash ensures tamper-proof verification</li>
                  <li>• Your content is protected against deepfake impersonation</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm"
                  >
                    Register Another Video
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Register Your Video</h1>
          <p className="text-gray-300 text-lg">
            Protect your content by registering it on the blockchain with MetaMask
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: 1, name: "Upload Details", icon: Upload },
              { step: 2, name: "IPFS Storage", icon: Globe },
              { step: 3, name: "Generate Hash", icon: Hash },
              { step: 4, name: "Prepare Transaction", icon: Shield },
              { step: 5, name: "Blockchain Record", icon: CheckCircle },
            ].map(({ step: stepNum, name, icon: Icon }) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${step >= stepNum ? "bg-purple-600" : "bg-gray-600"} mb-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className={`text-xs ${step >= stepNum ? "text-purple-400" : "text-gray-500"}`}>{name}</span>
              </div>
            ))}
          </div>
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Registration Form */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-6 w-6 mr-2 text-purple-400" />
                Video Registration
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isUploading
                  ? "Processing your video registration..."
                  : "Fill in the details to register your video on VideoAuthChain"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isUploading && step < 5 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">
                          Video Title
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="bg-black/20 border-white/10 text-white"
                          placeholder="Enter video title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="creator" className="text-gray-300">
                          Creator Name
                        </Label>
                        <Input
                          id="creator"
                          value={formData.creator}
                          onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                          className="bg-black/20 border-white/10 text-white"
                          placeholder="Your name or organization"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="file" className="text-gray-300">
                          Video File
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="bg-black/20 border-white/10 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                          required
                        />
                        {formData.file && (
                          <p className="text-sm text-gray-400 mt-1">
                            Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-black/20 border-white/10 text-white h-32"
                        placeholder="Describe your video content..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                    disabled={
                      !formData.file ||
                      !formData.title ||
                      !formData.creator ||
                      !formData.description ||
                      !walletConnected
                    }
                  >
                    {!walletConnected ? "Connect Wallet First" : "Start Registration Process"}
                  </Button>
                </form>
              ) : step === 5 ? (
                <BlockchainTransaction
                  videoData={{
                    registrationId: registrationData.registrationId,
                    title: formData.title,
                    creator: formData.creator,
                    description: formData.description,
                    contentHash: registrationData.hash,
                    ipfsHash: registrationData.ipfsHash,
                  }}
                  onTransactionComplete={handleTransactionComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step === 2 && "Uploading to IPFS..."}
                    {step === 3 && "Generating cryptographic hash..."}
                    {step === 4 && "Preparing blockchain transaction..."}
                  </h3>
                  <p className="text-gray-300">Please wait while we securely process your video</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Connection */}
          <div className="space-y-6">
            <WalletConnection onWalletConnected={handleWalletConnected} />

            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Registration Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Video will be uploaded to IPFS for decentralized storage</li>
                  <li>• Cryptographic hash will be generated for tamper-proof verification</li>
                  <li>• Registration will be recorded on Polygon blockchain</li>
                  <li>• Transaction will appear in your MetaMask wallet</li>
                  <li>• You'll receive a unique registration ID for future verification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
