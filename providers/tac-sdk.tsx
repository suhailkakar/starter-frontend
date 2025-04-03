"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TacSdk, Network, SenderFactory } from '@tonappchain/sdk';
import { TonConnectUI } from '@tonconnect/ui';

// Create context for TAC SDK
const TacSdkContext = createContext(null);

export function useTacSdk() {
  const context = useContext(TacSdkContext);
  if (!context) {
    throw new Error('useTacSdk must be used within a TacSdkProvider');
  }
  return context;
}

export function TacSdkProvider({ children, network = Network.TESTNET }: {
  children: React.ReactNode,
  network?: Network
}) {
  const [tacSdk, setTacSdk] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeSdk() {
      try {
        setIsInitializing(true);
        // Initialize TAC SDK
        const sdk = await TacSdk.create({
          network: network
        });

        setTacSdk(sdk);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize TAC SDK:', err);
        setError(err.message || 'Failed to initialize TAC SDK');
      } finally {
        setIsInitializing(false);
      }
    }

    initializeSdk();

    // Cleanup function
    return () => {
      if (tacSdk) {
        // Close any open connections
        tacSdk.closeConnections();
      }
    };
  }, [network]);

  // Create a sender from TON wallet
  async function createSender(tonConnectUI: TonConnectUI) {
    if (!tonConnectUI) {
      throw new Error('TON Connect UI instance required');
    }

    const sender = await SenderFactory.getSender({
      tonConnect: tonConnectUI
    });

    return sender;
  }

  const value = {
    tacSdk,
    isInitializing,
    error,
    createSender
  };

  return (
    <TacSdkContext.Provider value={value}>
      {
        children
      }
    </TacSdkContext.Provider>
  );
}