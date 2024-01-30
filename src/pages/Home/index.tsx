import React, { useState } from "react";

import { CheckBox, Switch } from "@meteor-web3/components";
import LockIcon from "@mui/icons-material/Lock";
import { Chip } from "@mui/material";

import {
  CardContainer,
  GridContainer,
  HeaderContainer,
  InnerContainer,
  MainContainer,
  PanelContainer,
} from "./styled";

import { EmbedWallet } from "@/components/EmbedWallet";

export default function Home() {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [meteorWalletEnabled, setMeteorWalletEnabled] = useState(true);
  const [meteorWebEnabled, setMeteorWebEnabled] = useState(true);

  return (
    <MainContainer>
      <HeaderContainer>
        <div className='brand'>
          Meteor Auth
          <Chip label='Demo' variant='outlined' size='small' color='primary' />
        </div>
        <div className='learn-more'>
          <a
            href='https://github.com/meteor-web3'
            target='_blank'
            rel='noreferrer'
          >
            Learn More →
          </a>
        </div>
      </HeaderContainer>
      <CardContainer>
        <PanelContainer>
          <div className='configuration'>
            <div className='config-header'>
              <LockIcon fontSize='small' />
              Authentication
            </div>
            <div className='config-item'>
              <div className='config-item-title'>
                <span>Wallets</span>
                <p onClickCapture={e => e.stopPropagation()}>
                  <Switch
                    style={{ cursor: "not-allowed" }}
                    controlChecked={true}
                    size='small'
                  />
                </p>
              </div>
              <GridContainer>
                <CheckBox
                  className='card-check-box'
                  label='Dataverse Snap'
                  defaultChecked
                  onChange={setSnapEnabled}
                />
                <CheckBox
                  className='card-check-box'
                  label='Meteor Wallet'
                  defaultChecked
                  onChange={setMeteorWalletEnabled}
                />
                <CheckBox
                  className='card-check-box'
                  label='Meteor Web'
                  defaultChecked
                  onChange={setMeteorWebEnabled}
                />
              </GridContainer>
            </div>
          </div>
        </PanelContainer>
        <InnerContainer>
          <EmbedWallet
            walletConfig={{
              enabled: {
                dataverseSnap: snapEnabled,
                meteorWallet: meteorWalletEnabled,
                meteorWeb: meteorWebEnabled,
              },
            }}
          />
        </InnerContainer>
      </CardContainer>
    </MainContainer>
  );
}
