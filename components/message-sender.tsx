import React, { useState } from 'react';
import { ethers } from 'ethers';
import { OperationTracker, Network } from '@tonappchain/sdk';
import { useTacSdk } from '@/providers/tac-sdk';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function MessageSender({ proxyAddress }: {
  proxyAddress: string
}) {
  const { tacSdk, createSender } = useTacSdk();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tonConnectUI] = useTonConnectUI();

  const wallet = useTonWallet()

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (!wallet || !tacSdk || !message.trim()) {
      setError('Please connect wallet and enter a message');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTxStatus('Preparing transaction...');

      // 1. Create a sender from the TON wallet
      const sender = await createSender(tonConnectUI);

      // 2. Encode the message parameters
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const encodedParams = abiCoder.encode(
        ['tuple(string)'], // Matches the MessageParams struct in the proxy contract
        [[message]]
      );

      // 3. Create the EVM proxy message
      const evmProxyMsg = {
        evmTargetAddress: proxyAddress,
        methodName: "processMessage(bytes,bytes)",
        encodedParameters: encodedParams
      };

      // 4. Send the cross-chain transaction
      setTxStatus('Sending transaction...');
      const transactionLinker = await tacSdk.sendCrossChainTransaction(
        evmProxyMsg,
        sender,
        [] // No tokens to bridge in this example
      );

      setTxStatus('Transaction sent! Tracking status...');

      // 5. Track the transaction
      const tracker = new OperationTracker(Network.TESTNET);

      // Poll for operation ID (it may take some time to appear)
      let opId = null;
      let attempts = 0;

      console.log('transactionLinker', transactionLinker)

      while (!opId && attempts < 10) {
        try {
          console.log('tracker', tracker)
          opId = await tracker.getOperationId(transactionLinker);
          console.log('opId', opId)
          if (opId) {
            setOperationId(opId);
            setTxStatus(`Operation ID: ${opId}`);

            // Start monitoring the status
            monitorTransactionStatus(tracker, opId);
            break;
          }
        } catch (err) {
          console.warn(`Attempt ${attempts + 1} to get operation ID failed:`, err);
        }

        // Wait 3 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      }

      if (!opId) {
        setTxStatus('Transaction sent, but unable to get operation ID for tracking');
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      setTxStatus('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to monitor transaction status
  const monitorTransactionStatus = async (tracker, opId) => {
    try {
      let isComplete = false;
      let attempts = 0;

      while (!isComplete && attempts < 20) {
        const status = await tracker.getOperationStatus(opId);
        setTxStatus(`Status: ${status.stage} (${status.success ? 'Success' : 'Pending'})`);

        if (status.stage === 'EXECUTED_IN_TON' || !status.success) {
          isComplete = true;
          setTxStatus(`Final status: ${status.stage} (${status.success ? 'Success' : 'Failed'})`);
          break;
        }

        // Wait 3 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      }

      if (!isComplete) {
        setTxStatus('Transaction tracking timed out');
      }

    } catch (err) {
      console.error('Error tracking transaction:', err);
      setTxStatus('Error tracking transaction');
    }
  };

  return (
    <div>
      <div className='flex flex-row gap-4'>
        <Input
          type="text"
          className='w-[20rem] h-[2.5rem]'
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter your message"
          disabled={isLoading}
        />
        <Button
          className='bg-[#91019B] rounded-full'
          onClick={sendMessage} disabled={isLoading || !message.trim()}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>

      {txStatus && (
        <div className='mt-2'>
          <h3>Transaction Status:</h3>
          <p>{txStatus}</p>
          {operationId && (
            <p>
              Operation ID: <code>{operationId}</code>
            </p>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-500 mt-2">
          <p>ERROR: {error}</p>
        </div>
      )}
    </div>
  );
}