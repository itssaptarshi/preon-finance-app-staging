import React, { useState, useEffect } from "react";
import { PageWrapper, Navbar, LiquidationEvent, Popup, BorrowSummary } from "./components";
import {
  Dashboard,
  Stake,
  Borrow,
  Pool,
  Loading,
  LiquidationCalculator,
  Redemption
} from "./Screens";
import { HashRouter, Route, Switch } from "react-router-dom";
import { useLiquity } from "./hooks/LiquityContext";
import { LiquityStoreProvider } from "@liquity/lib-react";
import { StabilityViewProvider } from "./PageComponents/Pool/context/StabilityViewProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { TransactionMonitor } from "./components/Transaction";
import { Grid, GridItem, Text, Box, useDisclosure } from "@chakra-ui/react";
import Faucet from "./Faucet/Faucet";
import Vesting from "./PageComponents/vesting/Vesting";
import MiniCollateralCalculator from "./PageComponents/LiquidationCalculator/MiniCollateralCalculator";
import tokenData from "../src/TokenData";
import BoostFarmCard from "./PageComponents/Farm/FarmHeading";
import FarmHeading from "./PageComponents/Farm/FarmHeading";

const PreonFrontend: React.FC = () => {
  const Router = HashRouter as any;
  const SwitchComponent = Switch as any;
  const RouteComponent = Route as any;
  const { liquity, account } = useLiquity();
  const [snow, setSnow] = useState<0 | 1>(0);
  const queryClient = new QueryClient();
  const toggleSnow = () => {
    if (snow === 0) {
      setSnow(1);
    } else {
      setSnow(0);
    }
  };
  let agreedToDisclaimer;
  useEffect(() => {
    if (localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") == undefined) {
      agreedToDisclaimer = true;
    } else {
      agreedToDisclaimer = false;
    }
  }, [localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet")]);
  let borrowInfograph;
  if (localStorage.getItem(account + "agreedToPreonBorrowInfograph") == undefined) {
    borrowInfograph = true;
  } else {
    borrowInfograph = false;
  }

  let farmInfograph;

  if (localStorage.getItem(account + "agreedToPreonFarmInfograph") == undefined) {
    farmInfograph = true;
  } else {
    farmInfograph = false;
  }

  let vePREONInfograph;

  if (localStorage.getItem(account + "agreedToPreonvePREONInfograph") == undefined) {
    vePREONInfograph = true;
  } else {
    vePREONInfograph = false;
  }
  const { isOpen: isAddCollateralTypeOpen, onClose: onAddCollateralTypeClose } = useDisclosure({
    defaultIsOpen: true
  });

  const { isOpen: isBorrowOpen, onClose: onBorrowOpen } = useDisclosure({
    defaultIsOpen: true
  });

  const { isOpen: isStakeOpen, onClose: onStakeOpen } = useDisclosure({
    defaultIsOpen: true
  });

  const { isOpen: isFarmOpen, onClose: onFarmOpen } = useDisclosure({
    defaultIsOpen: true
  });

  return (
    <LiquityStoreProvider loader={<Loading />} store={liquity.store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <StabilityViewProvider>
            <LiquidationEvent />
            <PageWrapper snow={snow}>
              <Navbar
                walletConnected={true}
                dashboardVisible={true}
                snow={snow}
                setSnow={toggleSnow}
              />
              <Grid
                templateColumns={{
                  "2xl": "repeat(2, 30% 68%)",
                  xl: "repeat(2, 40% 60%)",
                  lg: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  xs: "repeat(1, 1fr)"
                }}
                gap={6}
              >
                {/* left side of screen */}
                <GridItem colSpan={1} w="100%">
                  {/* <Box display="flex" alignItems="center" width="100%" height="170px" zIndex={-1}>
                    <Text
                      fontSize="50px"
                      lineHeight="68px"
                      fontWeight="300"
                      letterSpacing="0.1em"
                      color="white"
                      textTransform="uppercase"
                    >
                      Dashboard
                    </Text>
                  </Box> */}
                  <SwitchComponent>
                    <RouteComponent path="/borrow">
                      <BorrowSummary />
                    </RouteComponent>
                    <RouteComponent path="/farm">
                      {/* <BorrowSummary /> */}
                      <FarmHeading />
                    </RouteComponent>
                    <RouteComponent path="/vePREON">
                      <BorrowSummary />
                    </RouteComponent>
                    <RouteComponent path="/calculator">
                      {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
                        undefined && (
                        <Popup
                          isOpen={isAddCollateralTypeOpen}
                          onClose={onAddCollateralTypeClose}
                          header="Disclaimer: Risks of Using Protocol"
                        />
                      )}
                      <MiniCollateralCalculator collateral={[]} />
                    </RouteComponent>
                    <RouteComponent path="/redemption">
                      <BorrowSummary />
                    </RouteComponent>
                    <RouteComponent path="/">
                      <BorrowSummary />
                    </RouteComponent>
                  </SwitchComponent>
                </GridItem>
                {/* right side of screen */}
                <GridItem colSpan={1} w="100%">
                  <SwitchComponent>
                    <RouteComponent path="/borrow">
                      {borrowInfograph && (
                        <Popup
                          isOpen={isBorrowOpen}
                          onClose={onBorrowOpen}
                          header="Borrow"
                          infographSrc="/img/borrowdiagram.png"
                          mode="borrow"
                        />
                      )}
                      <Borrow />
                    </RouteComponent>
                    <RouteComponent path="/faucet">
                      <Faucet />
                    </RouteComponent>
                    <RouteComponent path="/vesting">
                      <Vesting />
                    </RouteComponent>
                    <RouteComponent path="/farm">
                      {farmInfograph && (
                        <Popup
                          isOpen={isFarmOpen}
                          onClose={onFarmOpen}
                          header="Farm"
                          infographSrc="/img/farm2.png"
                          mode="farm"
                        />
                      )}
                      <Pool />
                    </RouteComponent>
                    {/* <RouteComponent path="/vePREON">
                      {vePREONInfograph && (
                        <Popup
                          isOpen={isStakeOpen}
                          onClose={onStakeOpen}
                          header="PREON Staking"
                          infographSrc="/img/stakediagram.png"
                          mode="vePREON"
                        />
                      )}
                      <Stake />
                    </RouteComponent> */}
                    <RouteComponent path="/calculator">
                      {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
                        undefined && (
                        <Popup
                          isOpen={isAddCollateralTypeOpen}
                          onClose={onAddCollateralTypeClose}
                          header="Disclaimer: Risks of Using Protocol"
                        />
                      )}
                      <LiquidationCalculator />
                    </RouteComponent>
                    <RouteComponent path="/redemption">
                      {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
                        undefined && (
                        <Popup
                          isOpen={isAddCollateralTypeOpen}
                          onClose={onAddCollateralTypeClose}
                          header="Disclaimer: Risks of Using Protocol"
                        />
                      )}
                      <Redemption />
                    </RouteComponent>
                    <RouteComponent path="/">
                      {localStorage.getItem(account + "agreedToPreonFinanceDisclaimerMainnet") ==
                        undefined && (
                        <Popup
                          isOpen={isAddCollateralTypeOpen}
                          onClose={onAddCollateralTypeClose}
                          header="Disclaimer: Risks of Using Protocol"
                        />
                      )}
                      <Dashboard />
                    </RouteComponent>
                    <RouteComponent path="/faucet">
                      <Faucet />
                    </RouteComponent>
                    <RouteComponent path="/vesting">
                      <Vesting />
                      <TransactionMonitor />
                    </RouteComponent>
                  </SwitchComponent>
                </GridItem>
              </Grid>
            </PageWrapper>
          </StabilityViewProvider>
        </Router>
      </QueryClientProvider>
      <TransactionMonitor />
    </LiquityStoreProvider>
  );
};

export default PreonFrontend;
