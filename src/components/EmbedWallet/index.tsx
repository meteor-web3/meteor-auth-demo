/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from "react";

// import "@meteor-web3/meteor-iframe";
// import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { MessageTypes, message } from "@meteor-web3/components";
import {
  Chain,
  Connector,
  BaseProvider,
  DataverseSnapProvider,
  MeteorWalletProvider,
  MeteorWebProvider,
  SYSTEM_CALL,
  WALLET,
} from "@meteor-web3/connector";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Tooltip, CircularProgress } from "@mui/material";
import {
  PrivyProvider,
  usePrivy,
  useLogin,
  useLogout,
  useWallets,
  useCreateWallet,
} from "@privy-io/react-auth";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

import { EmbedWalletContainer, WalletListContainer } from "./styled";

export type WalletConfig = {
  enabled?: {
    dataverseSnap?: boolean;
    meteorWallet?: boolean;
    meteorWeb?: boolean;
  };
};

export interface EmbedWalletProps {
  walletConfig?: WalletConfig;
}

export let appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

let meteorConnector: Connector;
let snapProvider: DataverseSnapProvider;
let meteorWalletProvider: MeteorWalletProvider;
let meteorWebProvider: MeteorWebProvider;

export const EmbedWallet = ({ walletConfig }: EmbedWalletProps) => {
  const [connectRes, setConnectRes] = useState<ConnectRes>();

  return (
    <PrivyProvider
      // use your own appId to make sure connect successfully
      // this test appId is only for localhost:3000
      appId='clpispdty00ycl80fpueukbhl'
      config={{
        loginMethods: ["google", "twitter", "github", "apple", "discord"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },
      }}
    >
      <EmbedWalletContainer layout transition={{ duration: 0.15 }}>
        <p className='top-tip'>
          {connectRes
            ? "You have already logged in"
            : "Choose a wallet to log in"}
        </p>
        <div className='logo-container' style={{ marginBottom: "16px" }}>
          <img
            className='logo'
            src='https://avatars.githubusercontent.com/u/118692557?s=200&v=4'
            alt='Meteor'
          />
          <span>Meteor</span>
        </div>
        {connectRes && (
          <div className='connected'>
            <p>{connectRes.address}</p>
            <p>{connectRes.pkh}</p>
          </div>
        )}
        <WalletList
          walletConfig={walletConfig}
          onConnect={setConnectRes}
          onDisconnect={() => setConnectRes(undefined)}
        />
        <div className='footer'>
          <a
            href='https://github.com/meteor-web3'
            target='_blank'
            rel='noreferrer'
          >
            Powered by Meteor
          </a>
        </div>
      </EmbedWalletContainer>
    </PrivyProvider>
  );
};

export type ConnectRes = {
  address: string;
  pkh: string;
};

export type SupportedWallet =
  | "google"
  | (typeof WALLET)["METAMASK" | "WALLETCONNECT"];

export interface WalletListProps {
  walletConfig?: WalletConfig;
  onConnect?: (connectRes: ConnectRes) => void;
  onDisconnect?: () => void;
}

export const WalletList = ({
  walletConfig,
  onConnect,
  onDisconnect,
}: WalletListProps) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<
    "meteor-wallet" | "meteor-web"
  >();
  const [connectedWallet, setConnectedWallet] = useState<SupportedWallet>();
  const [waitForPrivyConnecting, setWaitForPrivyConnecting] =
    useState<boolean>(false);

  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  const { login: privyLogin } = useLogin();
  const { logout: privyLogout } = useLogout();
  const { createWallet: privyCreateWallet } = useCreateWallet();

  const handleConnectWallet = async (wallet: SupportedWallet) => {
    setConnecting(true);
    try {
      // init provider and connector
      let provider: BaseProvider;
      switch (selectedProvider) {
        case undefined:
          if (!snapProvider || snapProvider.destroyed) {
            const snapOrigin = prompt(
              "Please input your snap server url:",
              "http://localhost:8080",
            );
            if (!snapOrigin) {
              throw "Please input your snap server url.";
            }
            snapProvider = new DataverseSnapProvider("local:" + snapOrigin);
          }
          provider = snapProvider;
          break;
        case "meteor-wallet":
          if (!meteorWalletProvider || meteorWalletProvider.destroyed) {
            meteorWalletProvider = new MeteorWalletProvider();
          }
          provider = meteorWalletProvider;
          break;
        case "meteor-web":
          if (!meteorWebProvider || meteorWebProvider.destroyed) {
            meteorWebProvider = new MeteorWebProvider();
          }
          provider = meteorWebProvider;
          break;
        default:
          throw "Unsupported provider.";
      }
      if (!meteorConnector) {
        meteorConnector = new Connector(provider);
        if (location.hostname !== "localhost") {
          const appInfo = await meteorConnector.getDAppInfo({
            hostname: location.hostname,
          });
          appId = appInfo.id;
        }
      } else {
        meteorConnector.setProvider(provider);
      }
      // connect the real wallet
      let connectRes: {
        address: string;
        chain: Chain;
        wallet: WALLET;
        userInfo?: any;
      };
      if (selectedProvider !== "meteor-web") {
        if (wallet === WALLET.METAMASK && !window.ethereum) {
          throw "MetaMask is not installed or not enabled.";
        }
        connectRes = await meteorConnector.connectWallet({
          wallet: wallet === "google" ? WALLET.PARTICLE : wallet,
          preferredAuthType: wallet === "google" ? "google" : undefined,
        });
        if (!connectRes) {
          if (selectedProvider === undefined) {
            throw "Connect Wallet Failed! Please Check if not install Dataverse Snap or not enabled MetaMask flask.";
          } else {
            throw "Connect Wallet Failed! Please Check if not install Meteor Wallet or not enabled Meteor Wallet.";
          }
        }
      } else {
        let ethereumProvider: any;
        // handle external-wallet process
        if (wallet === "google") {
          if (!privyReady) {
            throw "Privy is not ready, please waiting...";
          }
          const embededWallet = privyWallets.find(
            wallet => wallet.walletClientType === "privy",
          );
          if (!embededWallet) {
            setWaitForPrivyConnecting(true);
            if (!privyAuthenticated) {
              privyLogin();
            } else {
              privyCreateWallet();
            }
            return;
          } else {
            ethereumProvider = await embededWallet.getEthereumProvider();
          }
        } else {
          switch (wallet) {
            case WALLET.METAMASK:
              if (!window.ethereum) {
                throw "MetaMask is not installed or not enabled.";
              }
              ethereumProvider = window.ethereum;
              break;
            // case WALLET.COINBASE:
            //   const chainId = 1;
            //   const jsonRpcUrl = "https://mainnet.infura.io/v3";
            //   const coinbaseWallet = new CoinbaseWalletSDK({
            //     appName: "Meteor",
            //     darkMode: false,
            //   });
            //   const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
            //     jsonRpcUrl,
            //     chainId,
            //   );
            //   ethereumProvider = coinbaseProvider;
            //   break;
            case WALLET.WALLETCONNECT:
              const client = await EthereumProvider.init({
                // use your own projectId to make sure connect successfully
                projectId: "de2a6e522f354b90448adfa7c76d9c05",
                showQrModal: true,
                chains: [1],
                optionalChains: [80001],
                methods: [
                  "wallet_switchEthereumChain",
                  "wallet_addEthereumChain",
                  "eth_sendTransaction",
                  "personal_sign",
                  "eth_signTypedData_v4",
                ],
                events: ["chainChanged", "accountsChanged"],
              });
              await client.enable();
              ethereumProvider = client;
              break;
            default:
              throw "Unsupported wallet";
          }
        }
        connectRes = await meteorConnector.connectWallet({
          provider: ethereumProvider,
        });
        if (!connectRes) {
          throw "Connect Wallet Failed! Please Check if not install Dataverse Snap or not enabled MetaMask flask.";
        }
      }
      const { pkh } = await meteorConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId,
        },
      });
      // setConnected(true);
      onConnect?.({ address: connectRes.address, pkh });
      setConnectedWallet(wallet);
      message.success("Wallet connected successfully.");
    } catch (e: any) {
      console.warn(e);
      message({
        type: MessageTypes.Error,
        content: "Failed to connect, " + (e?.message || e),
        duration: 10e3,
      });
      // setConnected(false);
      onDisconnect?.();
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    const embededWallet = privyWallets.find(
      wallet => wallet.walletClientType === "privy",
    );
    if (embededWallet && waitForPrivyConnecting) {
      setWaitForPrivyConnecting(false);
      handleConnectWallet("google");
    }
  }, [privyWallets, handleConnectWallet]);

  const walletProviders = (
    <>
      <Tooltip
        arrow
        placement='right'
        title='Dataverse Snap is still in the testing phase, you need to use Metamask flask and run the snap server locally before using it.'
      >
        <div
          className='wallet-item'
          data-disabled={walletConfig?.enabled?.dataverseSnap === false}
          onClick={() => handleConnectWallet(WALLET.METAMASK)}
        >
          <img
            className='wallet-logo'
            src='https://avatars.githubusercontent.com/u/11744586?s=200&v=4'
          />
          Dataverse Snap
        </div>
      </Tooltip>
      <Tooltip
        arrow
        placement='right'
        title='You may need to pre-install the Meteor-Wallet browser extension before using it. Only MetaMask stable is available, you need to disable MetaMask flask.'
      >
        <div
          className='wallet-item'
          data-disabled={walletConfig?.enabled?.meteorWallet === false}
          onClick={() => setSelectedProvider("meteor-wallet")}
        >
          <img
            className='wallet-logo'
            src='https://avatars.githubusercontent.com/u/118692557?s=200&v=4'
          />
          Meteor Wallet
        </div>
      </Tooltip>
      <Tooltip
        arrow
        placement='right'
        title='This wallet will be embedded in an iframe and only support External-Wallet for now.'
      >
        <div
          className='wallet-item'
          data-disabled={walletConfig?.enabled?.meteorWeb === false}
          onClick={() => setSelectedProvider("meteor-web")}
        >
          <span className='wallet-logo'>🌈</span>
          Meteor Web
        </div>
      </Tooltip>
    </>
  );

  const walletList = (
    <>
      <div
        className='wallet-item'
        data-disabled={walletConfig?.enabled?.dataverseSnap === false}
        onClick={handleConnectWallet.bind(null, "google")}
      >
        <img
          className='wallet-logo'
          src='https://avatars.githubusercontent.com/u/1342004?s=200&v=4'
        />
        Web2 Social
        {selectedProvider === "meteor-wallet"
          ? "(via Particle)"
          : "(via Privy)"}
      </div>
      <div
        className='wallet-item'
        data-disabled={walletConfig?.enabled?.dataverseSnap === false}
        onClick={handleConnectWallet.bind(null, WALLET.METAMASK)}
      >
        <img
          className='wallet-logo'
          src='https://avatars.githubusercontent.com/u/11744586?s=200&v=4'
        />
        Metamask
      </div>
      {/* <div
        className='wallet-item'
        data-disabled={walletConfig?.enabled?.dataverseSnap === false}
        onClick={handleConnectWallet.bind(null, WALLET.COINBASE)}
      >
        <img
          className='wallet-logo'
          src='https://avatars.githubusercontent.com/u/1885080?s=200&v=4'
        />
        Coinbase Wallet
      </div> */}
      {/* <div
        className='wallet-item'
        data-disabled={walletConfig?.enabled?.dataverseSnap === false}
        onClick={handleConnectWallet.bind(null, "rainbow")}
      >
        <img
          className='wallet-logo'
          src='https://avatars.githubusercontent.com/u/48327834?s=200&v=4'
        />
        Rainbow
      </div> */}
      <div
        className='wallet-item'
        data-disabled={walletConfig?.enabled?.dataverseSnap === false}
        onClick={handleConnectWallet.bind(null, WALLET.WALLETCONNECT)}
      >
        <img
          className='wallet-logo'
          src='https://avatars.githubusercontent.com/u/37784886?s=200&v=4'
        />
        WalletConnect
      </div>
      <div
        className='wallet-item'
        onClick={() => setSelectedProvider(undefined)}
      >
        <ArrowBackIcon className='wallet-logo' />
        Go back
      </div>
    </>
  );

  return (
    <WalletListContainer layout transition={{ duration: 0.15 }}>
      {connecting && (
        <>
          <div className='wallet-item'>
            <CircularProgress className='wallet-logo' />
            Connecting...
          </div>
          <div
            className='wallet-item'
            onClick={() => {
              setConnecting(false);
            }}
          >
            <CancelOutlinedIcon className='wallet-logo' />
            Force cancel
          </div>
        </>
      )}
      {!connecting &&
        (connectedWallet ? (
          <div
            className='wallet-item'
            onClick={async () => {
              if (privyAuthenticated) {
                await privyLogout();
              }
              setConnectedWallet(undefined);
              onDisconnect?.();
            }}
          >
            <ArrowBackIcon className='wallet-logo' />
            Reconnect another wallet
          </div>
        ) : selectedProvider ? (
          walletList
        ) : (
          walletProviders
        ))}
    </WalletListContainer>
  );
};
