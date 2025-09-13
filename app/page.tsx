import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Video, Zap, Globe, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Spam Shield</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/register" className="text-gray-300 hover:text-white transition-colors">
              Register Video
            </Link>
            <Link href="/verify" className="text-gray-300 hover:text-white transition-colors">
              Verify Video
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">Web3 + AI Powered</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Protect Digital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Truth</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Spam Shield combines blockchain technology and AI to detect deepfakes and verify video authenticity.
            Ensure tamper-proof verification and protect against misinformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                Register Your Video
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm px-8 py-3"
              >
                Verify Suspicious Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Cutting-Edge Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Blockchain Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Ethereum/Polygon smart contracts store cryptographic hashes and metadata for tamper-proof
                  verification.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">AI Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  PyTorch-based deepfake detection models analyze videos for manipulation and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">IPFS Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Decentralized storage ensures videos remain accessible and immutable across the network.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <Video className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Real-time Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Instant verification results combining AI analysis with blockchain registry lookups.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How VideoAuthChain Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Content Registration</h3>
                  <p className="text-gray-300">
                    Original creators upload videos and register them on the blockchain with unique cryptographic
                    hashes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                  <p className="text-gray-300">
                    Suspicious videos are analyzed using advanced PyTorch deepfake detection models.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Blockchain Verification</h3>
                  <p className="text-gray-300">
                    Results are cross-referenced with the blockchain registry for comprehensive authenticity
                    verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-white/10">
              <div className="text-center space-y-6">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Verified Authentic</h3>
                <p className="text-gray-300">
                  Get instant, tamper-proof verification results backed by blockchain technology and AI analysis.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-400">
                  <span>🔗 Blockchain Verified</span>
                  <span>🤖 AI Analyzed</span>
                  <span>🛡️ Tamper-Proof</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Secure Digital Truth?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the fight against misinformation and protect the integrity of digital content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                Start Protecting Content
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-purple-400/10 backdrop-blur-sm px-8 py-3"
              >
                Verify Content Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">VideoAuthChain</span>
          </div>
          <p className="text-gray-400">Protecting digital integrity through Web3 and AI technology</p>
        </div>
      </footer>
    </div>
  )
}
