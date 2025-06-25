"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, CheckCircle, AlertTriangle, ExternalLink, Loader2 } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"

interface WalletConnectionProps {
  onWalletConnected?: (accounts: string[]) => void
}

export function WalletConnection({ onWalletConnected }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [network, setNetwork] = useState<string>("unknown")
  const [balance, setBalance] = useState<string>("0")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  const checkConnection = async () => {
    try {
      const connectedAccounts = await blockchainService.getAccounts()
      if (connectedAccounts.length > 0) {
        setAccounts(connectedAccounts)
        setIsConnected(true)
        onWalletConnected?.(connectedAccounts)

        // Get network and balance info
        const currentNetwork = await blockchainService.getCurrentNetwork()
        setNetwork(currentNetwork)

        const accountBalance = await blockchainService.getBalance(connectedAccounts[0])
        setBalance(accountBalance)
      }
    } catch (error) {
      console.error("Failed to check connection:", error)
    }
  }

  const setupEventListeners = () => {
    blockchainService.onAccountsChanged((newAccounts) => {
      setAccounts(newAccounts)
      setIsConnected(newAccounts.length > 0)
      onWalletConnected?.(newAccounts)

      if (newAccounts.length > 0) {
        blockchainService.getBalance(newAccounts[0]).then(setBalance)
      }
    })

    blockchainService.onChainChanged(async (chainId) => {
      const networkName = await blockchainService.getCurrentNetwork()
      setNetwork(networkName)
    })
  }

  const connectWallet = async () => {
    if (!blockchainService.isMetaMaskInstalled()) {
      setError("MetaMask is not installed. Please install MetaMask extension.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const connectedAccounts = await blockchainService.connectWallet()
      setAccounts(connectedAccounts)
      setIsConnected(true)
      onWalletConnected?.(connectedAccounts)

      // Switch to Mumbai testnet and get balance
      await blockchainService.switchToPolygonTestnet()
      const currentNetwork = await blockchainService.getCurrentNetwork()
      setNetwork(currentNetwork)

      const accountBalance = await blockchainService.getBalance(connectedAccounts[0])
      setBalance(accountBalance)

      // Check if user has sufficient balance
      const hasSufficientBalance = await blockchainService.checkSufficientBalance(connectedAccounts[0])
      if (!hasSufficientBalance) {
        setError("Low MATIC balance. You may need testnet MATIC for gas fees.")
      }
    } catch (error: any) {
      setError(error.message)
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const getFaucetLink = () => {
    window.open("https://faucet.polygon.technology/", "_blank")
  }

  if (!blockchainService.isMetaMaskInstalled()) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-purple-400" />
            MetaMask Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-white">
              MetaMask wallet extension is required to register videos on the blockchain.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => window.open("https://metamask.io/download/", "_blank")}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-purple-400" />
          Wallet Connection
          {isConnected && <CheckCircle className="h-4 w-4 ml-2 text-green-400" />}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {isConnected ? "Wallet connected successfully" : "Connect your MetaMask wallet to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-black/20 p-3 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Account:</span>
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              </div>
              <code className="text-xs text-purple-400 break-all">
                {accounts[0]?.slice(0, 6)}...{accounts[0]?.slice(-4)}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300">Network:</p>
                <p className="text-sm text-white font-medium">{network}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300">Balance:</p>
                <p className="text-sm text-white font-medium">{balance} MATIC</p>
              </div>
            </div>

            {Number.parseFloat(balance) < 0.001 && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-white text-sm">
                  Low balance detected. Get free testnet MATIC from the faucet.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={getFaucetLink}
                variant="outline"
                size="sm"
                className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Get Testnet MATIC
              </Button>
              <Button
                onClick={() => window.open(`https://mumbai.polygonscan.com/address/${accounts[0]}`, "_blank")}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View on Explorer
              </Button>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-1 text-sm">Network Info</h4>
          <ul className="text-gray-300 space-y-1 text-xs">
            <li>• Using Polygon Mumbai Testnet for testing</li>
            <li>• Free testnet MATIC available from faucet</li>
            <li>• Transactions are fast and low-cost</li>
            <li>• All transactions visible in MetaMask</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
