import { motion } from "framer-motion";
import styled from "styled-components";

export const EmbedWalletContainer = styled(motion.div)`
  max-width: 360px;
  border-radius: 24px;
  background-color: #fff;
  box-shadow: rgba(55, 65, 81, 0.15) 0px 8px 36px;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  padding: 0px 16px;
  overflow: hidden;

  .top-tip {
    width: 100%;
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 0px;
    gap: 8px;
    .logo {
      width: 52px;
      height: 52px;
      border-radius: 8px;
    }
    span {
      font-family: Inter-SemiBold;
      font-size: 40px;
      font-weight: 500;
      line-height: 24px;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 8px;
    padding-bottom: 12px;
    gap: 2px;
    font-size: 13px;

    a {
      color: hsl(0, 0%, 57%) !important;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .connected {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 0px;
    font-size: 12px;
    line-height: 24px;
    border-top: 1px solid hsl(0, 0%, 92%);
    border-bottom: 1px solid hsl(0, 0%, 92%);
    margin-bottom: 16px;
    p {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      overflow-wrap: anywhere;
      span {
        color: hsl(0, 0%, 57%);
      }
    }
  }
`;

export const WalletListContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .wallet-item {
    width: 100%;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 16px;
    border-radius: 16px;
    background-color: #fff;
    transition: background-color 200ms ease 0s;
    cursor: pointer;
    border: 1px solid hsl(0, 0%, 92%);

    &:hover {
      background-color: hsl(0, 0%, 96%);
    }

    &[data-disabled="true"] {
      display: none;
    }

    .wallet-logo {
      height: 28px !important;
      width: 28px !important;
      font-size: 20px !important;
      border-radius: 4px !important;
    }
  }
`;
