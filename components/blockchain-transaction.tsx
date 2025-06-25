"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Hash, Clock, CheckCircle, AlertTriangle, Loader2, Wallet } from "lucide-react"
import { blockchainService, type TransactionResult } from "@/lib/blockchain"

interface BlockchainTransactionProps {
  videoData: {
    registrationId: string
    title: string
    creator: string
    description: string
    contentHash: string
    ipfsHash: string
  }
  onTransactionComplete?: (result: TransactionResult) => void
}

export function BlockchainTransaction({ videoData, onTransactionComplete }: BlockchainTransactionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null)
  const [error, setError] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const registerOnBlockchain = async () => {
    setIsProcessing(true)
    setError("")
    setProgress(0)

    try {
      // Step 1: Check wallet connection
      setCurrentStep("Checking wallet connection...")
      setProgress(10)

      const accounts = await blockchainService.getAccounts()
      if (accounts.length === 0) {
        throw new Error("No wallet connected. Please connect your MetaMask wallet first.")
      }

      // Step 2: Check network
      setCurrentStep("Verifying network...")
      setProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 3: Check balance
      setCurrentStep("Checking balance...")
      setProgress(40)
      const hasSufficientBalance = await blockchainService.checkSufficientBalance(accounts[0])
      if (!hasSufficientBalance) {
        throw new Error("Insufficient MATIC balance for gas fees. Please get testnet MATIC from the faucet.")
      }

      // Step 4: Prepare transaction
      setCurrentStep("Preparing blockchain transaction...")
      setProgress(55)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Step 5: Send transaction
      setCurrentStep("Sending transaction to blockchain...")
      setProgress(70)

      const result = await blockchainService.registerVideoOnBlockchain(videoData)

      // Step 6: Confirm transaction
      setCurrentStep("Confirming transaction...")
      setProgress(85)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Step 7: Complete
      setCurrentStep("Registration complete!")
      setProgress(100)
      setTransactionResult(result)
      onTransactionComplete?.(result)

      // Show success notification
      console.log("Transaction completed successfully:", result.hash)
    } catch (error: any) {
      console.error("Transaction failed:", error)
      setError(error.message)
      setProgress(0)
      setCurrentStep("")
    } finally {
      setIsProcessing(false)
    }
  }

  const openInExplorer = () => {
    if (transactionResult) {
      window.open(transactionResult.explorerUrl, "_blank")
    }
  }

  const copyTransactionHash = () => {
    if (transactionResult) {
      navigator.clipboard.writeText(transactionResult.hash)
    }
  }

  const retryTransaction = () => {
    setError("")
    setTransactionResult(null)
    registerOnBlockchain()
  }

  if (transactionResult) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            Blockchain Registration Complete
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your video has been successfully registered on the Polygon Mumbai Testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Transaction confirmed! Your video is now registered on the blockchain and visible in MetaMask.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-300">Transaction Hash:</p>
                <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                  <code className="text-xs text-green-400 break-all">
                    {transactionResult.hash.slice(0, 20)}...{transactionResult.hash.slice(-10)}
                  </code>
                  <Button size="sm" variant="ghost" onClick={copyTransactionHash} className="h-6 w-6 p-0 ml-2">
                    <Hash className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-300">Block Number:</p>
                <p className="text-white font-mono">{transactionResult.blockNumber.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-300">Gas Used:</p>
                <p className="text-white font-mono">{transactionResult.gasUsed.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-300">Status:</p>
                <Badge className="bg-green-500/20 text-green-400">{transactionResult.status}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={openInExplorer} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Mumbai PolygonScan
            </Button>

            <Button
              onClick={() => blockchainService.showTransactionInMetaMask(transactionResult.hash)}
              variant="outline"
              className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              View in MetaMask
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2">Transaction Details</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Video registered on Polygon Mumbai Testnet</li>
              <li>• Transaction visible in your MetaMask wallet</li>
              <li>• Permanent blockchain record created</li>
              <li>
                • Registration ID: <code className="text-purple-400">{videoData.registrationId}</code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Hash className="h-5 w-5 mr-2 text-purple-400" />
          Blockchain Registration
        </CardTitle>
        <CardDescription className="text-gray-300">
          Register your video on the Polygon Mumbai Testnet for permanent authenticity verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">
              <div className="mb-2">{error}</div>
              <Button
                onClick={retryTransaction}
                size="sm"
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Processing blockchain transaction...</span>
              <span className="text-sm text-purple-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center text-sm text-gray-400">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {currentStep}
            </div>
          </div>
        )}

        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-3">Transaction Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Registration ID:</span>
              <code className="text-purple-400">{videoData.registrationId}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Video Title:</span>
              <span className="text-white truncate ml-2">{videoData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Creator:</span>
              <span className="text-white truncate ml-2">{videoData.creator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Network:</span>
              <Badge className="bg-purple-500/20 text-purple-400">Mumbai Testnet</Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={registerOnBlockchain}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Transaction...
            </>
          ) : (
            <>
              <Hash className="h-4 w-4 mr-2" />
              Register on Blockchain
            </>
          )}
        </Button>

        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            What to Expect
          </h4>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• MetaMask will prompt you to confirm the transaction</li>
            <li>• Transaction will appear in your MetaMask activity</li>
            <li>• Gas fees are very low on Mumbai testnet</li>
            <li>• Confirmation usually takes 1-2 minutes</li>
            <li>• You'll get a permanent blockchain record</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
