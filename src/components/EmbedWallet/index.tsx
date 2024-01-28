import React, { useState } from "react";

import "meteor-iframe/meteor-iframe";
import { MessageTypes, message } from "@dataverse/dataverse-components";
import {
  Connector,
  DataverseSnapProvider,
  MeteorWalletProvider,
  MeteorWebProvider,
  SYSTEM_CALL,
} from "@meteor-web3/connector";
import { Tooltip } from "@mui/material";

import { EmbedWalletContainer } from "./styled";

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

export const appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

let meteorConnector: Connector;
let snapProvider: DataverseSnapProvider;
let meteorWalletProvider: MeteorWalletProvider;
let meteorWebProvider: MeteorWebProvider;

export const EmbedWallet = ({ walletConfig }: EmbedWalletProps) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();
  const [pkh, setPkh] = useState<string>();

  const handleSnapConnect = async () => {
    try {
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
      if (!meteorConnector) {
        meteorConnector = new Connector(snapProvider);
      } else {
        meteorConnector.setProvider(snapProvider);
      }
      const connectRes = await meteorConnector.connectWallet();
      if (!connectRes) {
        throw "Connect Wallet Failed! Please Check if not install Dataverse Snap or not enabled MetaMask flask.";
      }
      setAddress(connectRes.address);
      const { pkh } = await meteorConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId,
        },
      });
      setPkh(pkh);
      setConnected(true);
      message.success("Wallet connected by Dataverse Snap successfully.");
    } catch (e: any) {
      console.warn(e);
      message({
        type: MessageTypes.Error,
        content:
          "Failed to connect to Dataverse Snap, with: " + (e?.message || e),
        duration: 10e3,
      });
      setConnected(false);
    }
  };

  const handleMeteorWalletConnect = async () => {
    try {
      if (!meteorWalletProvider || meteorWalletProvider.destroyed) {
        meteorWalletProvider = new MeteorWalletProvider();
      }
      if (!meteorConnector) {
        meteorConnector = new Connector(meteorWalletProvider);
      } else {
        meteorConnector.setProvider(meteorWalletProvider);
      }
      const connectRes = await meteorConnector.connectWallet();
      if (!connectRes) {
        throw "Connect Wallet Failed! Please Check if not install Meteor Wallet or not enabled Meteor Wallet.";
      }
      setAddress(connectRes.address);
      const { pkh } = await meteorConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId,
        },
      });
      setPkh(pkh);
      setConnected(true);
      message.success("Wallet connected by Meteor Wallet successfully.");
    } catch (e: any) {
      console.warn(e);
      message({
        type: MessageTypes.Error,
        content:
          "Failed to connect to Meteor Wallet, with: " + (e?.message || e),
        duration: 10e3,
      });
      setConnected(false);
    }
  };

  const handleMeteorWebConnect = async () => {
    try {
      if (!meteorWebProvider || meteorWebProvider.destroyed) {
        const iframe = document.getElementById(
          "meteor-iframe",
        ) as HTMLIFrameElement;
        if (!iframe) {
          throw "Meteor Web wallet failed to load or has not been loaded yet.";
        }
        meteorWebProvider = new MeteorWebProvider(iframe.contentWindow!);
      }
      if (!meteorConnector) {
        meteorConnector = new Connector(meteorWebProvider);
      } else {
        meteorConnector.setProvider(meteorWebProvider);
      }
      const connectRes = await meteorConnector.connectWallet();
      if (!connectRes) {
        throw "Connect Wallet Failed!";
      }
      setAddress(connectRes.address);
      const { pkh } = await meteorConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId,
        },
      });
      setPkh(pkh);
      setConnected(true);
      message.success("Wallet connected by Meteor Web successfully.");
    } catch (e: any) {
      console.warn(e);
      message({
        type: MessageTypes.Error,
        content: "Failed to connect to Meteor Web, with: " + (e?.message || e),
        duration: 10e3,
      });
      setConnected(false);
    }
  };

  return (
    <EmbedWalletContainer>
      <p className='top-tip'>Choose a wallet to log in</p>
      <div className='logo-container' style={{ marginBottom: "16px" }}>
        <img
          className='logo'
          src='https://avatars.githubusercontent.com/u/118692557?s=200&v=4'
          alt='Meteor'
        />
        <span>Meteor</span>
      </div>
      {connected && (
        <div className='connected'>
          <p>{address}</p>
          <p>{pkh}</p>
        </div>
      )}
      <div className='wallet-list'>
        <Tooltip
          arrow
          placement='right'
          title='Dataverse Snap is still in the testing phase, you need to disable Metamask stable and enable Metamask flask, and run the snap server locally by yourself before using it.'
        >
          <div
            className='wallet-item'
            data-disabled={walletConfig?.enabled?.dataverseSnap === false}
            onClick={handleSnapConnect}
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
            onClick={handleMeteorWalletConnect}
          >
            <img
              className='wallet-logo'
              src='https://avatars.githubusercontent.com/u/67382952?s=200&v=4'
            />
            Meteor Wallet
          </div>
        </Tooltip>
        <Tooltip
          arrow
          placement='right'
          title='This wallet will be embedded in an iframe and only support MetaMask as External-Wallet for now.'
        >
          <div
            className='wallet-item'
            data-disabled={walletConfig?.enabled?.meteorWeb === false}
            onClick={handleMeteorWebConnect}
          >
            <span className='wallet-logo'>🌈</span>
            Meteor Web
          </div>
        </Tooltip>
      </div>
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
  );
};
