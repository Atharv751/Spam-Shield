"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Zap, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Eye, Database, Brain, Clock } from "lucide-react"
import Link from "next/link"
import { aiAnalysisEngine, type AIAnalysisResult } from "@/lib/ai-analysis"

export default function VerifyPage() {
  const [step, setStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState("")
  const [verificationResult, setVerificationResult] = useState({
    isAuthentic: false,
    confidence: 0,
    deepfakeDetected: false,
    blockchainMatch: false,
    originalHash: "",
    registrationId: "",
    detectedBy: "",
    registrationDate: "",
    detectionReasons: [],
    matchedVideo: null,
    autoRegistered: false,
    aiAnalysis: null as AIAnalysisResult | null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const generateVideoHash = (fileName: string, fileSize: number) => {
    const hashInput = fileName + fileSize.toString()
    let hash = 0
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, "0")}`
  }

  const checkFakeVideoRegistry = (fileName: string, fileSize: number) => {
    const fakeVideoRegistry = JSON.parse(localStorage.getItem("fakeVideoRegistry") || "[]")
    const uploadedFileHash = generateVideoHash(fileName, fileSize)

    const exactMatch = fakeVideoRegistry.find(
      (video) =>
        video.fileName === fileName ||
        video.originalFileName === fileName ||
        video.title.toLowerCase().includes(fileName.toLowerCase().replace(/\.[^/.]+$/, "")),
    )

    if (exactMatch) {
      return {
        found: true,
        video: exactMatch,
        matchType: "exact",
      }
    }

    const similarMatch = fakeVideoRegistry.find((video) => {
      const videoHash = generateVideoHash(video.fileName || video.title, Math.random() * 1000000)
      return (
        Math.abs(Number.parseInt(uploadedFileHash.slice(2, 10), 16) - Number.parseInt(videoHash.slice(2, 10), 16)) <
        1000000
      )
    })

    if (similarMatch) {
      return {
        found: true,
        video: similarMatch,
        matchType: "similar",
      }
    }

    return {
      found: false,
      video: null,
      matchType: null,
    }
  }

  const registerFakeVideoToBlockchain = (fileName: string, fileSize: number, aiAnalysis: AIAnalysisResult) => {
    const fakeVideoRegistry = JSON.parse(localStorage.getItem("fakeVideoRegistry") || "[]")

    const mockHash = generateVideoHash(fileName, fileSize)
    const mockId = `FAKE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    const newFakeVideo = {
      id: mockId,
      title: `AI Detected: ${fileName}`,
      originalFileName: fileName,
      fileName: fileName,
      detectedBy: "VideoAuthChain AI System",
      registrationDate: new Date().toISOString().split("T")[0],
      hash: mockHash,
      detectionReasons: aiAnalysis.detectionReasons,
      confidence: aiAnalysis.confidence,
      status: "confirmed_fake",
      detectionMethod: "Advanced AI Analysis",
      timestamp: new Date().toISOString(),
      aiAnalysis: aiAnalysis,
      modelVersions: aiAnalysis.modelVersions,
      processingTime: aiAnalysis.processingTime,
    }

    fakeVideoRegistry.push(newFakeVideo)
    localStorage.setItem("fakeVideoRegistry", JSON.stringify(fakeVideoRegistry))

    return newFakeVideo
  }

  const handleVerify = async () => {
    if (!file) return

    setIsVerifying(true)
    setStep(1)

    try {
      // STEP 1: Check blockchain registry
      setCurrentAnalysisStep("Checking blockchain registry of known fakes...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const fakeRegistryCheck = checkFakeVideoRegistry(file.name, file.size)
      setStep(2)

      if (fakeRegistryCheck.found) {
        // Video is already known to be fake
        setVerificationResult({
          isAuthentic: false,
          confidence: fakeRegistryCheck.video.confidence || 95,
          deepfakeDetected: true,
          blockchainMatch: true,
          originalHash: fakeRegistryCheck.video.hash,
          registrationId: fakeRegistryCheck.video.id,
          detectedBy: fakeRegistryCheck.video.detectedBy,
          registrationDate: fakeRegistryCheck.video.registrationDate,
          detectionReasons: fakeRegistryCheck.video.detectionReasons || ["Previously detected and registered as fake"],
          matchedVideo: fakeRegistryCheck.video,
          autoRegistered: false,
          aiAnalysis: fakeRegistryCheck.video.aiAnalysis || null,
        })

        setStep(4) // Skip to final step
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        // STEP 2: Advanced AI Analysis
        setCurrentAnalysisStep("Initializing AI deepfake detection models...")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setCurrentAnalysisStep("Analyzing filename and file characteristics...")
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setCurrentAnalysisStep("Running facial and temporal analysis...")
        await new Promise((resolve) => setTimeout(resolve, 1200))

        setCurrentAnalysisStep("Computing neural network confidence scores...")

        // Run the actual AI analysis
        const aiAnalysis = await aiAnalysisEngine.analyzeVideo(file)
        setStep(3)

        let autoRegisteredVideo = null

        // STEP 3: Auto-register if fake detected with high confidence
        if (aiAnalysis.isDeepfake && aiAnalysis.confidence >= 80) {
          setCurrentAnalysisStep("Registering detected fake to blockchain...")
          await new Promise((resolve) => setTimeout(resolve, 2000))
          autoRegisteredVideo = registerFakeVideoToBlockchain(file.name, file.size, aiAnalysis)
        }

        setStep(4)
        setCurrentAnalysisStep("Generating comprehensive report...")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setVerificationResult({
          isAuthentic: !aiAnalysis.isDeepfake,
          confidence: aiAnalysis.confidence,
          deepfakeDetected: aiAnalysis.isDeepfake,
          blockchainMatch: false,
          originalHash: autoRegisteredVideo?.hash || "",
          registrationId: autoRegisteredVideo?.id || "",
          detectedBy: autoRegisteredVideo?.detectedBy || "",
          registrationDate: autoRegisteredVideo?.registrationDate || "",
          detectionReasons: aiAnalysis.detectionReasons,
          matchedVideo: null,
          autoRegistered: !!(aiAnalysis.isDeepfake && aiAnalysis.confidence >= 80),
          aiAnalysis: aiAnalysis,
        })
      }

      // Save verification to localStorage
      const savedVerifications = JSON.parse(localStorage.getItem("verificationHistory") || "[]")
      const newVerification = {
        id: `VER-${Date.now()}`,
        fileName: file.name,
        result: verificationResult.isAuthentic ? "authentic" : "deepfake",
        confidence: verificationResult.confidence,
        timestamp: new Date().toLocaleString(),
        blockchainMatch: fakeRegistryCheck.found,
        autoRegistered: verificationResult.autoRegistered,
        detectionReasons: verificationResult.detectionReasons,
        processingTime: verificationResult.aiAnalysis?.processingTime || 0,
      }
      savedVerifications.unshift(newVerification)
      localStorage.setItem("verificationHistory", JSON.stringify(savedVerifications.slice(0, 10)))
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsVerifying(false)
      setVerificationComplete(true)
    }
  }

  const resetVerification = () => {
    setVerificationComplete(false)
    setIsVerifying(false)
    setStep(1)
    setFile(null)
    setCurrentAnalysisStep("")
  }

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div
                className={`mx-auto mb-4 p-3 rounded-full w-fit ${
                  verificationResult.isAuthentic ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {verificationResult.isAuthentic ? (
                  <CheckCircle className="h-12 w-12 text-green-400" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-400" />
                )}
              </div>
              <CardTitle className="text-3xl text-white">
                {verificationResult.blockchainMatch
                  ? "Known Fake Video - Blockchain Registered"
                  : verificationResult.autoRegistered
                    ? "Deepfake Detected & Auto-Registered"
                    : verificationResult.isAuthentic
                      ? "Video Verified as Authentic"
                      : "Potential Deepfake Detected"}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                AI Analysis completed with {verificationResult.confidence}% confidence
                {verificationResult.aiAnalysis && (
                  <span className="block text-sm mt-1">
                    Processing time: {(verificationResult.aiAnalysis.processingTime / 1000).toFixed(1)}s
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Alert */}
              <Alert
                className={`border ${
                  verificationResult.isAuthentic
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-red-500/50 bg-red-500/10"
                }`}
              >
                <Brain className={`h-4 w-4 ${verificationResult.isAuthentic ? "text-green-400" : "text-red-400"}`} />
                <AlertDescription className="text-white">
                  {verificationResult.blockchainMatch
                    ? "This video is already registered in our blockchain as a known fake/deepfake."
                    : verificationResult.autoRegistered
                      ? "Advanced AI models have detected this as a deepfake and automatically registered it to the blockchain."
                      : verificationResult.isAuthentic
                        ? "Multiple AI models analyzed this video and confirmed it appears to be authentic with no signs of manipulation."
                        : "AI analysis detected potential manipulation but confidence is below auto-registration threshold."}
                </AlertDescription>
              </Alert>

              {/* AI Analysis Details */}
              {verificationResult.aiAnalysis && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-400" />
                        AI Model Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Neural Network Confidence</span>
                        <span className="text-white font-semibold">
                          {(verificationResult.aiAnalysis.analysisDetails.neuralNetworkConfidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Models Used</span>
                        <span className="text-white text-sm">{verificationResult.aiAnalysis.modelVersions.length}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        <p className="mb-1">Active Models:</p>
                        {verificationResult.aiAnalysis.modelVersions.map((model, index) => (
                          <Badge key={index} className="bg-purple-500/20 text-purple-300 text-xs mr-1 mb-1">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                        Detection Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Facial Inconsistencies</span>
                          <span className="text-white">
                            {(verificationResult.aiAnalysis.analysisDetails.facialInconsistencies * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              verificationResult.aiAnalysis.analysisDetails.facialInconsistencies > 0.5
                                ? "bg-red-400"
                                : "bg-green-400"
                            }`}
                            style={{
                              width: `${verificationResult.aiAnalysis.analysisDetails.facialInconsistencies * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Temporal Anomalies</span>
                          <span className="text-white">
                            {(verificationResult.aiAnalysis.analysisDetails.temporalAnomalies * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              verificationResult.aiAnalysis.analysisDetails.temporalAnomalies > 0.5
                                ? "bg-red-400"
                                : "bg-green-400"
                            }`}
                            style={{
                              width: `${verificationResult.aiAnalysis.analysisDetails.temporalAnomalies * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Lip Sync Accuracy</span>
                          <span className="text-white">
                            {(verificationResult.aiAnalysis.analysisDetails.lipSyncAccuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              verificationResult.aiAnalysis.analysisDetails.lipSyncAccuracy > 0.7
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${verificationResult.aiAnalysis.analysisDetails.lipSyncAccuracy * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Advanced Analysis Details */}
              {verificationResult.aiAnalysis && (
                <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Advanced Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-300">Eye Blink Pattern:</span>
                        <Badge
                          className={`ml-2 ${
                            verificationResult.aiAnalysis.analysisDetails.eyeBlinkPattern === "natural"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {verificationResult.aiAnalysis.analysisDetails.eyeBlinkPattern}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-300">Skin Texture Analysis:</span>
                        <span className="text-white ml-2">
                          {(verificationResult.aiAnalysis.analysisDetails.skinTextureAnalysis * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-300">Lighting Consistency:</span>
                        <span className="text-white ml-2">
                          {(verificationResult.aiAnalysis.analysisDetails.lightingConsistency * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-300">Edge Artifacts:</span>
                        <span className="text-white ml-2">
                          {(verificationResult.aiAnalysis.analysisDetails.edgeArtifacts * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-300">Compression Analysis:</span>
                        <span className="text-white ml-2">
                          {(verificationResult.aiAnalysis.analysisDetails.compressionArtifacts * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-300">Frequency Domain:</span>
                        <span className="text-white ml-2">
                          {(verificationResult.aiAnalysis.analysisDetails.frequencyDomainAnalysis * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detection Reasons */}
              {verificationResult.deepfakeDetected && verificationResult.detectionReasons?.length > 0 && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      AI Detection Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {verificationResult.detectionReasons.map((reason, index) => (
                        <li key={index} className="text-red-300 text-sm flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Auto-Registration Notice */}
              {verificationResult.autoRegistered && (
                <Card className="bg-orange-500/10 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Database className="h-5 w-5 mr-2 text-orange-400" />
                      Automatic Blockchain Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-orange-300 text-sm">
                      This video has been automatically added to our blockchain registry of known fake videos based on
                      high-confidence AI detection results (≥80% confidence).
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-300">Registration ID:</span>
                        <code className="text-orange-400 text-sm ml-2">{verificationResult.registrationId}</code>
                      </div>
                      <div>
                        <span className="text-gray-300">Detection Confidence:</span>
                        <span className="text-white text-sm ml-2">{verificationResult.confidence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetVerification}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Verify Another Video
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm"
                  >
                    View Dashboard
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
          <h1 className="text-4xl font-bold text-white mb-4">Advanced AI Video Verification</h1>
          <p className="text-gray-300 text-lg">
            Upload a video for comprehensive AI analysis - optimized to accurately detect real vs AI-generated content
          </p>
        </div>

        {/* Progress Steps */}
        {isVerifying && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[
                { step: 1, name: "Registry Check", icon: Search },
                { step: 2, name: "AI Analysis", icon: Brain },
                { step: 3, name: "Auto-Registration", icon: Database },
                { step: 4, name: "Generate Report", icon: Eye },
              ].map(({ step: stepNum, name, icon: Icon }) => (
                <div key={stepNum} className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${step >= stepNum ? "bg-purple-600" : "bg-gray-600"} mb-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-xs ${step >= stepNum ? "text-purple-400" : "text-gray-500"}`}>{name}</span>
                </div>
              ))}
            </div>
            <Progress value={(step / 4) * 100} className="h-2" />

            {currentAnalysisStep && (
              <div className="mt-4 text-center">
                <p className="text-purple-300 text-sm">{currentAnalysisStep}</p>
              </div>
            )}
          </div>
        )}

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-400" />
              AI-Powered Deepfake Detection
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isVerifying
                ? "Running advanced AI analysis with multiple neural networks..."
                : "Upload a video for comprehensive analysis - accurately distinguishes real from AI-generated content"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerifying ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="verify-file" className="text-gray-300">
                    Select Video File
                  </Label>
                  <Input
                    id="verify-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="bg-black/20 border-white/10 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 mt-2"
                  />
                  {file && (
                    <div className="mt-2 text-sm text-gray-400">
                      <p>
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <p className="text-xs mt-1">
                        Estimated processing time:{" "}
                        {Math.min(8, Math.max(3, (file.size / 1024 / 1024) * 0.5)).toFixed(1)}s
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Improved AI Analysis Pipeline
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>
                      • <strong>Filename Analysis:</strong> Detects AI generation keywords and patterns
                    </li>
                    <li>
                      • <strong>File Characteristics:</strong> Analyzes size, format, and compression patterns
                    </li>
                    <li>
                      • <strong>Technical Analysis:</strong> Facial landmarks, temporal consistency, lip sync
                    </li>
                    <li>
                      • <strong>Conservative Detection:</strong> High threshold to avoid false positives on real videos
                    </li>
                    <li>
                      • <strong>Blockchain Registry:</strong> Cross-reference with known fake database
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                  disabled={!file}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Start Advanced AI Analysis
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step === 1 && "Checking blockchain registry..."}
                  {step === 2 && "Running AI analysis..."}
                  {step === 3 && "Processing results..."}
                  {step === 4 && "Finalizing report..."}
                </h3>
                <p className="text-gray-300 mb-2">{currentAnalysisStep}</p>
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  Processing with improved accuracy algorithms...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
