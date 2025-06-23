// IPFS Node Setup Script for VideoAuthChain
// This script sets up IPFS configuration for decentralized storage

const ipfsConfig = {
  API: {
    HTTPHeaders: {
      "Access-Control-Allow-Origin": ["*"],
      "Access-Control-Allow-Methods": ["PUT", "POST", "GET"],
      "Access-Control-Allow-Headers": ["Authorization"],
    },
  },
  Addresses: {
    Swarm: ["/ip4/0.0.0.0/tcp/4001", "/ip6/::/tcp/4001", "/ip4/0.0.0.0/udp/4001/quic", "/ip6/::/udp/4001/quic"],
    Announce: [],
    AppendAnnounce: [],
    NoAnnounce: [],
    API: "/ip4/127.0.0.1/tcp/5001",
    Gateway: "/ip4/127.0.0.1/tcp/8080",
  },
  Bootstrap: [
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
  ],
  Discovery: {
    MDNS: {
      Enabled: true,
      Interval: 10,
    },
    webRTCStar: {
      Enabled: true,
    },
  },
  Datastore: {
    StorageMax: "10GB",
    StorageGCWatermark: 90,
    GCPeriod: "1h",
    Spec: {
      mounts: [
        {
          child: {
            path: "blocks",
            shardFunc: "/repo/flatfs/shard/v1/next-to-last/2",
            sync: true,
            type: "flatfs",
          },
          mountpoint: "/blocks",
          prefix: "flatfs.datastore",
          type: "measure",
        },
        {
          child: {
            compression: "none",
            path: "datastore",
            type: "levelds",
          },
          mountpoint: "/",
          prefix: "leveldb.datastore",
          type: "measure",
        },
      ],
      type: "mount",
    },
  },
  Pinning: {
    RemoteServices: {},
  },
}

console.log("IPFS Configuration for VideoAuthChain:")
console.log(JSON.stringify(ipfsConfig, null, 2))

console.log("\nSetup Instructions:")
console.log("1. Install IPFS: https://docs.ipfs.io/install/")
console.log("2. Initialize IPFS node: ipfs init")
console.log("3. Apply configuration: ipfs config replace config.json")
console.log("4. Start IPFS daemon: ipfs daemon")
console.log("5. Test with: ipfs swarm peers")

const pinningScript = `
#!/bin/bash
# Pin important VideoAuthChain content to ensure availability

echo "Setting up VideoAuthChain IPFS pinning..."

# Pin the VideoAuthChain metadata
ipfs pin add QmVideoAuthChainMetadata

# Set up automatic pinning for new uploads
ipfs config --json Pinning.RemoteServices.VideoAuthChain '{
  "Endpoint": "https://api.pinata.cloud/psa",
  "Key": "YOUR_PINATA_API_KEY"
}'

echo "IPFS pinning configured successfully!"
`

console.log("\nPinning Script:")
console.log(pinningScript)
