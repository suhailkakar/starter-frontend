"use client"

import { MessageSender } from "@/components/message-sender";
import { TONWalletConnect } from "@/components/wallet-connect";
import { CONTRACT_ADDRESS } from "@/lib/contract_address";
import { useTonWallet } from "@tonconnect/ui-react";
import Image from "next/image";

export default function Home() {

  const wallet = useTonWallet()
  return (
    <div >
      <div className="absolute top-4 right-4">
        <TONWalletConnect />
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex items-center justify-center">
            <Image
              className="w-16 h-16 rounded-lg"
              src="https://pbs.twimg.com/profile_images/1881718627642040320/4XMf8y8o_400x400.jpg"
              alt="TAC logo"
              width={180}
              height={38}
              priority
            />
            <h1 className="text-4xl font-bold ml-4">
              tic tac ton
            </h1>
          </div>
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by deploying your contract on {" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                contracts/contracts/MessageProxy.sol
              </code>
              {" "} on TAC EVM
            </li>
            <li className="tracking-[-.01em] mb-2">
              Add your contract address to the{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                lib/contract_address.ts
              </code>
              {" "} file.
            </li>
            <li className="tracking-[-.01em]">
              Connect your wallet and send a message to the contract

            </li>

          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            {wallet?.account ?
              <MessageSender proxyAddress={CONTRACT_ADDRESS.MESSAGE_PROXY} />
              :
              <div className="text-pink-500 font-medium">
                <p>Please connect your wallet to continue</p>
              </div>
            }


          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://docs.tac.build"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Docs
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/tacbuild/example-dapps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://docs.tac.build/developers/sdk/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            TACK SDK →
          </a>
        </footer>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#91019B60,transparent)]"></div>
      </div>
    </div>
  );
}

