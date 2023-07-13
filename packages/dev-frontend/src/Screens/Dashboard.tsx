// @ts-nocheck
import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Header } from "../components";
import { PoolSummary, StakeSummary, SystemSummary } from "../PageComponents/Dashboard";

const Dashboard: React.FC = () => (
  <Box>
    <Box display="flex" alignItems="center" width="100%" height="170px" zIndex={-1}></Box>
    <Flex flexDirection="column" bg="transparent" gap="64px">
      <SystemSummary />
      <PoolSummary />
      <StakeSummary />
    </Flex>
  </Box>
);

export default Dashboard;
