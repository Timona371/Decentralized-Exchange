"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { AppKitConnectButton } from "@reown/appkit/react";

import { networks } from "@/config/wagmi";
import { shortenAddress } from "@/lib/utils";

const tokens = [
  { symbol: "ETH", name: "Ethereum", balance: "12.46", price: 2980.2 },
  { symbol: "USDC", name: "USD Coin", balance: "42300.12", price: 1.0 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", balance: "2.14", price: 58420.15 },
  { symbol: "ARB", name: "Arbitrum", balance: "18920.00", price: 1.23 },
];

export const DexInterface = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);
  const [sellAmount, setSellAmount] = useState<string>("");

  const activeNetwork = networks.find((item) => item.id === chainId);

  const handleFlip = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount("");
  };

  return (
    <div className="rounded-3xl border border-purple-200/60 bg-white/80 p-6 shadow-lg dark:border-purple-800/60 dark:bg-zinc-900/70 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Swap Tokens</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Trade instantly across liquidity pools
          </p>
        </div>
        <Link
          href="/swap"
          className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-400 dark:hover:bg-purple-900/50"
        >
          Full Interface →
        </Link>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200/60 bg-purple-50/50 p-12 dark:border-purple-800/60 dark:bg-purple-950/20">
          <p className="mb-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Connect your wallet to start swapping
          </p>
          <AppKitConnectButton label="Connect Wallet" size="md" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sell Token */}
          <div className="rounded-2xl border border-purple-200/60 bg-white px-4 py-4 dark:border-purple-800/60 dark:bg-zinc-950/50">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <span>Sell</span>
              <span className="text-zinc-400">Balance: {sellToken.balance}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <select
                className="flex-1 appearance-none rounded-xl border border-purple-200/60 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-purple-800/60 dark:bg-zinc-900 dark:text-zinc-100"
                value={sellToken.symbol}
                onChange={(e) => setSellToken(tokens.find((t) => t.symbol === e.target.value) ?? tokens[0])}
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="0.0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="w-32 rounded-xl border border-transparent bg-transparent text-right text-2xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-purple-200 dark:text-zinc-100 dark:placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Flip Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleFlip}
              className="rounded-full border border-purple-200/60 bg-white p-2 text-purple-600 transition hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800/60 dark:bg-zinc-900 dark:text-purple-400 dark:hover:bg-purple-950/50"
              aria-label="Flip tokens"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Buy Token */}
          <div className="rounded-2xl border border-purple-200/60 bg-white px-4 py-4 dark:border-purple-800/60 dark:bg-zinc-950/50">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <span>Buy</span>
              <span className="text-zinc-400">Balance: {buyToken.balance}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <select
                className="flex-1 appearance-none rounded-xl border border-purple-200/60 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-purple-800/60 dark:bg-zinc-900 dark:text-zinc-100"
                value={buyToken.symbol}
                onChange={(e) => setBuyToken(tokens.find((t) => t.symbol === e.target.value) ?? tokens[1])}
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="w-32 text-right text-2xl font-semibold text-purple-600 dark:text-purple-400">
                ~ 0.00
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <Link
            href="/swap"
            className="block w-full rounded-xl bg-gradient-to-r from-purple-600 to-lilac-600 px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-lilac-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Swap Tokens
          </Link>

          {/* Network Info */}
          {activeNetwork && (
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Connected to {activeNetwork.name}</span>
              <span>•</span>
              <span>{shortenAddress(address, 4)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

