"use client";

import { useState } from "react";

type TabType = "dex" | "streaming";

interface FeatureTabsProps {
  dexContent: React.ReactNode;
  streamingContent: React.ReactNode;
}

export const FeatureTabs = ({ dexContent, streamingContent }: FeatureTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("dex");

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-8 flex items-center justify-center gap-2 border-b border-purple-200/60 dark:border-purple-800/60">
        <button
          onClick={() => setActiveTab("dex")}
          className={`relative px-6 py-4 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            activeTab === "dex"
              ? "text-purple-600 dark:text-purple-400"
              : "text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
          }`}
          aria-selected={activeTab === "dex"}
          role="tab"
          aria-controls="dex-panel"
          id="dex-tab"
        >
          Decentralized Exchange
          {activeTab === "dex" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("streaming")}
          className={`relative px-6 py-4 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            activeTab === "streaming"
              ? "text-purple-600 dark:text-purple-400"
              : "text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
          }`}
          aria-selected={activeTab === "streaming"}
          role="tab"
          aria-controls="streaming-panel"
          id="streaming-tab"
        >
          Token Streaming
          {activeTab === "streaming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        <div
          id="dex-panel"
          role="tabpanel"
          aria-labelledby="dex-tab"
          className={activeTab === "dex" ? "block animate-in fade-in duration-300" : "hidden"}
        >
          {dexContent}
        </div>
        <div
          id="streaming-panel"
          role="tabpanel"
          aria-labelledby="streaming-tab"
          className={activeTab === "streaming" ? "block animate-in fade-in duration-300" : "hidden"}
        >
          {streamingContent}
        </div>
      </div>
    </div>
  );
};

