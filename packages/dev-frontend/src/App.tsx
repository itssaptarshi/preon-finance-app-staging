import { Web3ReactProvider } from "@web3-react/core";
import { BatchedWebSocketAugmentedWeb3Provider } from "@liquity/providers";
import { Center, Text, Button, ChakraProvider } from "@chakra-ui/react";
import { RootWrapper } from "./components";
import Loading from "./Screens/Loading";
import WalletConnector from "./components/WalletConnector";
import { LiquityProvider } from "./hooks/LiquityContext";
import { TransactionProvider } from "./components/Transaction";
import theme from "./Theme";
import PreonFrontend from "./PreonFrontend";
import logo from "../src/components/Navbar/assets/logo.svg";

declare var window: any;

const switchNetwork = () => {
  if (!window.ethereum) return;
  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x89` }]
  });
};

const EthersWeb3ReactProvider: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={provider => new BatchedWebSocketAugmentedWeb3Provider(provider)}>
      {children}
    </Web3ReactProvider>
  );
};

const UnsupportedMainnetFallback: React.FC = () => (
  <Center w="100vw" h="100vh" flexDirection="column" p={10}>
    <img src="/img/3d-preon.png" alt="Preon Finance" style={{ width: "12rem" }} />
    <Text textStyle="title4" my={5} textAlign="center">
      Please switch your chain to the Polygon Chain.
    </Text>
    <Button variant="gradient" mb={10} onClick={switchNetwork}>
      Switch Network
    </Button>
  </Center>
);

const App = () => {
  const unsupportedNetworkFallback = (chainId: number) => (
    <Center w="100vw" h="100vh" flexDirection="column" p={10}>
      <img src={logo} alt="Preon Finance" style={{ width: "12rem" }} />
      <Text textStyle="title4" my={5} textAlign="center">
        Please switch your chain to the Polygon Chain.
      </Text>
      <Button variant="gradient" mb={10} onClick={switchNetwork}>
        Switch Network
      </Button>
    </Center>
  );

  return (
    <EthersWeb3ReactProvider>
      <RootWrapper>
        <ChakraProvider theme={theme}>
          <WalletConnector loader={<Loading />}>
            <LiquityProvider
              loader={<Loading />}
              unsupportedNetworkFallback={unsupportedNetworkFallback}
              unsupportedMainnetFallback={<UnsupportedMainnetFallback />}
            >
              <TransactionProvider>
                <PreonFrontend />
              </TransactionProvider>
            </LiquityProvider>
          </WalletConnector>
        </ChakraProvider>
      </RootWrapper>
    </EthersWeb3ReactProvider>
  );
};

export default App;
