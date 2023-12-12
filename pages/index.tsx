// Import statements (keep your existing imports)
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Leaderboard from "@/components/Leaderboard";
import { getLeaderboard, LeaderboardItem } from "@/lib/clicker-anchor-client";

import {
  airdrop,
  getCurrentGame,
  saveClick,
} from "../lib/clicker-anchor-client";

const Home: NextPage = () => {
  const [currentColorSchemeIndex, setCurrentColorSchemeIndex] = useState(0);

  const colorSchemes = [
    {
      backgroundGradientBeforeConnect: "linear-gradient(to right, #d1e0f9, #e2e2e2)",
      backgroundGradient: "linear-gradient(to right, #d1e0f9, #e2e2e2)",
      navbarGradient: "linear-gradient(to right, #7ea5e0, #7ea5e0)",
      buttonGradient: "linear-gradient(to right, #ffb2bb, #8dd3ff)",
      buttonHoverGradient: "linear-gradient(to right, #8dd3ff, #ffb2bb)",
      leaderboardGradient: "linear-gradient(to right, #adff4e, #9aff9b)",
    },
    {
      backgroundGradientBeforeConnect: "linear-gradient(to right, #bfe5d4, #afd5c2)",
      backgroundGradient: "linear-gradient(to right, #afd5c2, #bfe5d4)",
      navbarGradient: "linear-gradient(to right, #39868c, #186174)",
      buttonGradient: "linear-gradient(to right, #e0d267, #dcb63e)",
      buttonHoverGradient: "linear-gradient(to right, #dcb63e, #e0d267)",
      leaderboardGradient: "linear-gradient(to right, #f7ea96, #bdd79c)",
    },
    {
      backgroundGradientBeforeConnect: "linear-gradient(to right, #ffeded, #ffd3d3)",
      backgroundGradient: "linear-gradient(to right, #ffd3d3, #ffeded)",
      navbarGradient: "linear-gradient(to right, #ff6666, #ff3333)",
      buttonGradient: "linear-gradient(to right, #ffaa80, #ff7a59)",
      buttonHoverGradient: "linear-gradient(to right, #ff7a59, #ffaa80)",
      leaderboardGradient: "linear-gradient(to right, #ffe680, #ffd66b)",
    },
    {
      backgroundGradientBeforeConnect: "linear-gradient(to right, #d6e2f4, #adc8e6)",
      backgroundGradient: "linear-gradient(to right, #adc8e6, #d6e2f4)",
      navbarGradient: "linear-gradient(to right, #4d68b0, #6b82e6)",
      buttonGradient: "linear-gradient(to right, #ffb971, #ff8a5a)",
      buttonHoverGradient: "linear-gradient(to right, #ff8a5a, #ffb971)",
      leaderboardGradient: "linear-gradient(to right, #6ac88e, #4d95b5)",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorSchemeIndex((prevIndex) => (prevIndex + 1) % colorSchemes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentColorScheme = colorSchemes[currentColorSchemeIndex];
  
  const [clicks, setClicks] = useState(0);
  const [effect, setEffect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
  const [gameError, setGameError] = useState("");
  const [gameAccountPublicKey, setGameAccountPublicKey] = useState("");
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);

  const { connected } = useWallet();
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallet = useAnchorWallet();

  async function handleClick() {
    setGameError("");
    if (wallet) {
      try {
        await saveClick({ wallet, endpoint, gameAccountPublicKey });
        setClicks(clicks + 1);
        setEffect(true);
      } catch (e) {
        if (e instanceof Error) {
          setGameError(e.message);
        }
      }
    }
  }

  useEffect(() => {
    async function initGame() {
      if (wallet) {
        const gameState = await getCurrentGame({ wallet, endpoint });
        setIsGameReady(connected && gameState.isReady);
        setClicks(gameState.clicks);
        setGameAccountPublicKey(gameState.gameAccountPublicKey);
        setSolanaExplorerLink(
          `https://explorer.solana.com/address/${gameAccountPublicKey}/anchor-account?cluster=${network}`
        );
        setGameError(gameState.errorMessage);
      } else {
        setIsGameReady(false);
        setClicks(0);
        setGameAccountPublicKey("");
        setSolanaExplorerLink("");
        setGameError("");
      }
    }
    setIsConnected(connected);
    initGame();
  }, [connected, endpoint, network, wallet, gameAccountPublicKey]);

  useEffect(() => {
    async function fetchTestSol(): Promise<void> {
      if (wallet) {
        try {
          await airdrop({ wallet, endpoint });
        } catch (e) {
          if (e instanceof Error) {
            console.error(`Unable to airdrop 1 test SOL due to ${e.message}`);
          }
        }
      }
    }
    fetchTestSol();
  }, [connected, wallet, endpoint]);

  useEffect(() => {
    (async function getLeaderboardData() {
      if (wallet) {
        setLeaders(await getLeaderboard({ wallet, endpoint }));
      }
    })();
  }, [wallet, endpoint]);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1" style={{ background: isConnected ? currentColorScheme.backgroundGradient : currentColorScheme.backgroundGradientBeforeConnect }}>
      <Head>
        <title>AMIGOS ODYSSEY CLICK</title>
        <meta name="title" content="AMIGOS ODYSSEY CLICK" />
        <meta name="description" content="🌌 Welcome to AO SPACE: The dynamic social frontier of Amigos Odyssey! 🚀 Immerse yourself in a decentralized haven on Solana blockchain devnet, fostering vibrant community engagement with a nominal Sol fee per message. Explore our beta version, a Twitter-style clone, and earn exclusive Discord roles and VIP access to NFT drops by actively participating in AO CLICK. Join the evolving world of Amigos Odyssey, where conversations ignite and innovation meets blockchain for an unparalleled social experience! 🌈💬" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="AMIGOS ODYSSEY CLICK" />
        <meta property="og:url" content="https://amigos-odyssey-click.vercel.app/" />
        <meta property="og:image" content="https://amigos-odyssey-click.vercel.app/" />
        <meta property="og:description" content="🌌 Welcome to AO SPACE: The dynamic social frontier of Amigos Odyssey! 🚀 Immerse yourself in a decentralized haven on Solana blockchain devnet, fostering vibrant community engagement with a nominal Sol fee per message. Explore our beta version, a Twitter-style clone, and earn exclusive Discord roles and VIP access to NFT drops by actively participating in AO CLICK. Join the evolving world of Amigos Odyssey, where conversations ignite and innovation meets blockchain for an unparalleled social experience! 🌈💬" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="AMIGOS ODYSSEY CLICK" />
        <meta name="twitter:description" content="🌌 Welcome to AO SPACE: The dynamic social frontier of Amigos Odyssey! 🚀 Immerse yourself in a decentralized haven on Solana blockchain devnet, fostering vibrant community engagement with a nominal Sol fee per message. Explore our beta version, a Twitter-style clone, and earn exclusive Discord roles and VIP access to NFT drops by actively participating in AO CLICK. Join the evolving world of Amigos Odyssey, where conversations ignite and innovation meets blockchain for an unparalleled social experience! 🌈💬" />
        <meta name="twitter:image" content="https://amigos-odyssey-click.vercel.app/" />
      </Head>

      <div className="navbar mb-2 text-base-content rounded-full sm:p-4" style={{ background: currentColorScheme.navbarGradient }}>
        <div className="flex-1 text-xl font-mono">
           <img src="/logo.jpg" alt="Logo" className="h-14 sm:h-14 w-auto rounded-md" />
        </div>
        <div>
          <WalletMultiButton />
        </div>
        <div className="badge badge-accent badge-outline flex-none XXXml-2">
          <a href="#devnet">devnet</a>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="p-4 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center p-2">
              {isGameReady && gameError && (
                <div className="alert alert-error shadow-lg" style={{ background:currentColorScheme. buttonGradient }}>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span style={{ color: 'white' }}>{gameError}</span>
                  </div>
                </div>
              )}
              {isGameReady && (
                <div
                  onAnimationEnd={() => {
                    setEffect(false);
                  }}
                  className={effect ? "animate-wiggle" : ""}
                  style={{ color: 'black', fontWeight: 'bold' }}>
                  {clicks} clicks
                </div>
              )}
            </div>
            <button
              disabled={!isGameReady}
              onClick={() => {
                handleClick();
              }}
              className="btn btn-lg text-white border-4 h-36 w-36 rounded-full transform transition-transform hover:scale-105"
              style={{
                color: 'black', fontWeight: 'bold',
                background:currentColorScheme. buttonGradient,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span
                className="absolute top-0 left-0 w-full h-full bg-white opacity-20"
                style={{
                  transition: 'background 0.3s ease-out',
                  background:currentColorScheme. buttonHoverGradient,
                  color: 'black', fontWeight: 'bold'
                }}
              ></span>
              Click Me 
            </button>

            {isGameReady && (
               <div className="sm:w-3/4">
              <div>
                <p>
                  <strong>
                    <a
                      className="underline"
                      href="https://twitter.com/amigosodyssey"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      Guide
                    </a>
                  </strong>
                </p>
                <p style={{ color: 'black', fontWeight: 'bold' }}>
                  Aim for 500 clicks to unlock exclusive minting access!
                </p>
                <p style={{ color: 'black', fontWeight: 'bold' }}>
                  To participate, simply click the Click Me button. Achieve 500 clicks to qualify for a complimentary minting opportunity.
                </p>
                <p style={{ color: 'black', fontWeight: 'bold' }}>
                  Stay informed and receive timely updates by following us on{" "}
                  <strong>
                    <a
                      className="underline"
                      href="https://twitter.com/amigosodyssey"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      Twitter
                    </a>
                  </strong>
                </p>
              </div>
            </div> 
            )}

            {!isConnected && (
              <div>
                <WalletMultiButton />
              </div>
            )}

            {!isGameReady && isConnected && (
              <div>
                <p className="p-2">Game initializing...</p>
              </div>
            )}
          </div>

          {wallet && (
            <Leaderboard
              leaders={leaders}
              walletPublicKeyString={wallet.publicKey.toBase58()}
              clicks={clicks}
              backgroundGradient={currentColorScheme.leaderboardGradient}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
