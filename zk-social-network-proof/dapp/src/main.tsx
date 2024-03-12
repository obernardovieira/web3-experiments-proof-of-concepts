import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { config } from './network/wagmi.ts'
import { Buffer } from 'buffer'
import App from './App.tsx'
import { DBConfig } from "./DBConfig";
import { initDB, IndexedDB } from "react-indexed-db-hook";

initDB(DBConfig);

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <IndexedDB
          name="ZK-Social-Proof-DB"
          version={1}
          objectStoresMeta={[
            {
              store: "verifications",
              storeConfig: { keyPath: "id", autoIncrement: true },
              storeSchema: [
                { name: "identifier", keypath: "identifier", options: { unique: true } },
                { name: "network", keypath: "network", options: { unique: false } },
                { name: "status", keypath: "status", options: { unique: false } },
              ],
            },
          ]}
        >
          <App />
        </IndexedDB>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
