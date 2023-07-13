// @ts-nocheck
import { Box, BoxProps, AspectRatio } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet";
import TokenInfoProvider from "../../AppState/TokenInfo/TokenInfoProvider";

type RootWrapperProps = BoxProps;

const RootWrapper: React.FC<RootWrapperProps> = ({ children, ...props }) => (
  <TokenInfoProvider>
    <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />
    </Helmet>
    <Box as="main" bg="linear-gradient(180deg, rgba(16, 11, 18, 0) 0%, #100B12 92.19%)">
      <AspectRatio
        pos="fixed"
        zIndex={-1}
        overflow="hidden"
        width={"100vw"}
        height="100vh"
        ratio={1 / 1}
      >
        <video width="200" height="300" autoPlay loop muted controls={false}>
          <source src="./assets/space-1080_conv-transcode.mp4" type="video/mp4" />
        </video>
      </AspectRatio>

      {children}
    </Box>
  </TokenInfoProvider>
);

export default RootWrapper;
