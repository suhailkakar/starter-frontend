"use client"

import React from 'react'
import { ThemeProvider } from './theme'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TacSdkProvider } from './tac-sdk'
import { Network } from '@tonappchain/sdk'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TonConnectUIProvider manifestUrl="https://turin.console.tac.build/tonconnect-manifest.json">
        <TacSdkProvider network={Network.TESTNET}>
          {children}
        </TacSdkProvider>
      </TonConnectUIProvider>
    </ThemeProvider>
  )
}
