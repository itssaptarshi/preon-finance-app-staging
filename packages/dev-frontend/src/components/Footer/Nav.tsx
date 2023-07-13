// @ts-nocheck
import React from "react";
import NavLink from "./NavLink";
import logo from "../Navbar/assets/logo.svg"

import { Flex, Text } from "@chakra-ui/react";

const Links = [
  { title: "User Docs", link: "https://docs.preon.finance/" },
  { title: "Technical Docs", link: "https://techdocs.preon.finance/" },
  {
    title: "Audit",
    link: "https://techdocs.preon.finance/about-preon-finance/audits-and-risks"
  }
];

const Nav: React.FC = () => {
  return (
    <Flex flex={1} direction={["column", null, null, "row"]}>
      <Flex
        align="center"
        justify={["center", null, null, "flex-start"]}
        flex={1}
        gap={5}
        mb={[6, null, null, 0]}
      >
        <img src={logo} alt="Preon Finance" style={{ width: "150px" }} />
        {/* <Text textStyle="title2" mb={0}>
          Preon
        </Text> */}
      </Flex>

      <Flex
        as="nav"
        align="center"
        justify="center"
        direction={["column", null, null, "row"]}
        flex={[1, null, null, 2]}
        gap={4}
      >
        {Links.map(({ title, link }) => (
          <NavLink to={link} key={title}>
            {title}
          </NavLink>
        ))}
      </Flex>
    </Flex>
  );
};

export default Nav;
