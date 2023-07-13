import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injectedConnector = new InjectedConnector({});
export const walletConnectConnector = new WalletConnectConnector({
  rpc: { 43114: "https://api.avax.network/ext/bc/C/rpc" },
  qrcode: true
});
