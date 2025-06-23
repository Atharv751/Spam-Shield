"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Video, Search, Calendar, Hash, CheckCircle, ArrowLeft, Eye, Download, XCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [registeredVideos, setRegisteredVideos] = useState([])
  const [fakeVideoRegistry, setFakeVideoRegistry] = useState([])
  const [recentVerifications, setRecentVerifications] = useState([])

  useEffect(() => {
    // Load authentic registered videos from localStorage
    const savedVideos = JSON.parse(localStorage.getItem("registeredVideos") || "[]")
    setRegisteredVideos(savedVideos)

    // Load fake video registry from localStorage
    const savedFakeVideos = JSON.parse(localStorage.getItem("fakeVideoRegistry") || "[]")
    setFakeVideoRegistry(savedFakeVideos)

    // Load verification history
    const savedVerifications = JSON.parse(localStorage.getItem("verificationHistory") || "[]")
    setRecentVerifications(savedVerifications)
  }, [])

  const filteredVideos = registeredVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredFakeVideos = fakeVideoRegistry.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.detectedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Manage authentic videos and view blockchain registry of known fakes</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Register Authentic Video
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                variant="outline"
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm"
              >
                Verify Video
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Authentic Videos</p>
                  <p className="text-3xl font-bold text-white">{registeredVideos.length}</p>
                </div>
                <Video className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Known Fakes</p>
                  <p className="text-3xl font-bold text-white">{fakeVideoRegistry.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Verifications</p>
                  <p className="text-3xl font-bold text-white">{recentVerifications.length}</p>
                </div>
                <Search className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Detection Rate</p>
                  <p className="text-3xl font-bold text-white">94%</p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="authentic" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="authentic" className="data-[state=active]:bg-green-600">
              Authentic Videos
            </TabsTrigger>
            <TabsTrigger value="fakes" className="data-[state=active]:bg-red-600">
              Fake Registry
            </TabsTrigger>
            <TabsTrigger value="verifications" className="data-[state=active]:bg-purple-600">
              Verifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="authentic" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-white">Your Authentic Videos</CardTitle>
                    <CardDescription className="text-gray-300">
                      Videos you've registered as authentic content
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Input
                      placeholder="Search authentic videos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/20 border-white/10 text-white w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No authentic videos registered yet</p>
                      <Link href="/register">
                        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Register Your First Video
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    filteredVideos.map((video) => (
                      <Card key={video.id} className="bg-black/20 border-white/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                                <Badge className="bg-green-500/20 text-green-400">Authentic</Badge>
                              </div>
                              <p className="text-gray-300 mb-2">by {video.creator}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {video.registrationDate}
                                </span>
                                <span className="flex items-center">
                                  <Hash className="h-4 w-4 mr-1" />
                                  {video.id}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-green-400/10 backdrop-blur-sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fakes" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-white">Blockchain Fake Registry</CardTitle>
                    <CardDescription className="text-gray-300">
                      Known fake/AI-generated videos registered on the blockchain
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Input
                      placeholder="Search fake videos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/20 border-white/10 text-white w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFakeVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No fake videos detected yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Fake videos will automatically appear here when detected by our AI system
                      </p>
                    </div>
                  ) : (
                    filteredFakeVideos.map((video) => (
                      <Card key={video.id} className="bg-black/20 border-red-500/20">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                                <Badge className="bg-red-500/20 text-red-400">Fake/AI Generated</Badge>
                              </div>
                              <p className="text-gray-300 mb-2">Detected by {video.detectedBy}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {video.registrationDate}
                                </span>
                                <span className="flex items-center">
                                  <Hash className="h-4 w-4 mr-1" />
                                  {video.id}
                                </span>
                                <span className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {video.confidence}% confidence
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                              <XCircle className="h-8 w-8 text-red-400" />
                            </div>
                          </div>

                          {video.detectionReasons && video.detectionReasons.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-sm text-gray-400 mb-2">Detection Reasons:</p>
                              <div className="flex flex-wrap gap-2">
                                {video.detectionReasons.slice(0, 3).map((reason, index) => (
                                  <Badge key={index} className="bg-red-500/10 text-red-300 text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Verification History</CardTitle>
                <CardDescription className="text-gray-300">
                  Videos that have been verified through our system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVerifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No verifications performed yet</p>
                      <Link href="/verify">
                        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Verify Your First Video
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    recentVerifications.map((verification) => (
                      <Card key={verification.id} className="bg-black/20 border-white/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{verification.fileName}</h3>
                                <Badge
                                  className={
                                    verification.result === "authentic"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {verification.result === "authentic" ? "Authentic" : "Deepfake Detected"}
                                </Badge>
                                {verification.autoRegistered && (
                                  <Badge className="bg-orange-500/20 text-orange-400">Auto-Registered</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {verification.timestamp}
                                </span>
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {verification.confidence}% confidence
                                </span>
                                {verification.blockchainMatch && (
                                  <span className="flex items-center">
                                    <Hash className="h-4 w-4 mr-1" />
                                    Known Fake
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                              {verification.result === "authentic" ? (
                                <CheckCircle className="h-8 w-8 text-green-400" />
                              ) : (
                                <XCircle className="h-8 w-8 text-red-400" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
