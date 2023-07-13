import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import erc20abi from "./ERC20.json";
import { Image, Img } from "@chakra-ui/react";
import {
  Button,
  Table,
  Thead,
  Tr,
  Td,
  TableContainer,
  Th,
  Tbody,
  Box,
  Flex,
  Text
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { contractAddresses } from "../config/constants";
// import { format } from "prettier";
// import { Form } from "react-final-form";
import { AdjustInput, Icon } from "../components";
// import ethereum from "./icon/ethereum.png";
// import matic from "./icon/matic.png";
// import btc from "./icon/wbtc.png";
// import stmatic from "./icon/polygon.png";

export default function Faucet() {
  const initBalanceState = {
    wMatic: "0.00",
    stMatic: "0.00",
    wBtc: "0.00",
    wEth: "0.00",
    preon: "0.00",
    lp: "0.00",
    iWmatic: "0.00",
    iUsdc: "0.00",
    iDai: "0.00"
  };
  const private_key = "2db18bfe3ccface0aab16f9055027261d5229a0ac57234a4b7d9f911c1fd9df3"; // need to change
  const networkAPI = "https://preon-rpc.fmobuild.com/"; // need to change
  const chainID = 137; // need to change

  const wMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  const stMATIC = "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4";
  const wBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
  const wETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  const iWMATIC = "0xb880e6AdE8709969B9FD2501820e052581aC29Cf";
  const iUSDC = "0x590Cd248e16466F747e74D4cfa6C48f597059704";
  const iDAI = "0xbE068B517e869f59778B3a8303DF2B8c13E05d06";

  const lp = contractAddresses.lpToken.address;

  const provider = new ethers.providers.JsonRpcProvider(networkAPI, chainID);
  const signer = new ethers.Wallet(private_key, provider);

  console.log("@signer:", signer.address);

  const [balances, setBalances] = useState(initBalanceState);
  const [isLoading, setisLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const [state, setState] = useState({
    address: ""
  });

  const handleChange = e =>
    setState(prevState => ({
      ...state,
      [e.target.name]: e.target.value
    }));

  const _update = async () => {
    let _contract = await new ethers.Contract(wMATIC, erc20abi.abi, signer);
    const _wmaticBal = await _contract.balanceOf(signer.address);

    console.log("@signer address", signer.address);

    _contract = await new ethers.Contract(stMATIC, erc20abi.abi, signer);
    const _stmaticBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(wBTC, erc20abi.abi, signer);
    const _wbtcBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(wETH, erc20abi.abi, signer);
    const _wEthBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(lp, erc20abi.abi, signer);
    const _lpBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(iWMATIC, erc20abi.abi, signer);
    const _iwmaticBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(iUSDC, erc20abi.abi, signer);
    const _iusdcBal = await _contract.balanceOf(signer.address);

    _contract = await new ethers.Contract(iDAI, erc20abi.abi, signer);
    const _idaiBal = await _contract.balanceOf(signer.address);

    setBalances({
      wMatic: +(+_wmaticBal / 1e18).toFixed(2),
      stMatic: +(+_stmaticBal / 1e18).toFixed(2),
      wBtc: +(+_wbtcBal / 1e8).toFixed(2),
      wEth: +(+_wEthBal / 1e18).toFixed(2),
      lp: +(+_lpBal / 1e18).toFixed(2),
      iWmatic: +(+_iwmaticBal / 1e18).toFixed(2),
      iUsdc: +(+_iusdcBal / 1e6).toFixed(2),
      iDai: +(+_idaiBal / 1e18).toFixed(2)
    });
  };

  useEffect(() => {
    _update();
  }, []);

  const __sendNative = async () => {
    const tx = {
      from: signer.address,
      to: state.address,
      value: (20e18).toString()
    };

    const _balance = await provider.getBalance(state.address);

    if (+_balance < 20e18) {
      try {
        const _ = await signer.sendTransaction(tx);
      } catch (e) {
        console.error("@error on sending matic", e);
      }
    } else {
      console.log("@balance: matic", "balance higher than 20MATIC");
    }
  };

  const __erc20Transfer = async (name, ercToken, decimals, amount) => {
    const contract = await new ethers.Contract(ercToken, erc20abi.abi, signer);

    const _balance = await contract.balanceOf(state.address);
    if (+_balance >= +amount) {
      console.log(`you already have enough ${name}`);
      return;
    }

    try {
      console.log(
        "=".repeat(20),
        `@transfering: ${name} ${+amount / 10 ** decimals}`,
        "=".repeat(20)
      );
      const tx = await contract.transfer(state.address, amount);
      console.log("@transfer:", tx.hash);
      console.log("=".repeat(80));
      console.log("");
    } catch (e) {
      console.error(`@Error at ${name} transfer`, e.title);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setisLoading(true);
    setDisable(true);
    console.log("getting balance.....");
    __sendNative();

    const _wmaticSend = "1700000000000000000000"; // 1700 matic
    const _stmaticSend = "3000000000000000000000"; // 3000 stmatic
    const _wethSend = "12000000000000000000"; // 12eth
    const _btcSend = "300000000"; // 3btc
    const _lpSend = "500000000000000000"; // 0.5 lp token
    const _iwmaticSend = "1000000000000000000000"; // 1000 iwmatic
    const _iusdcSend = "1000000000"; // 1000 iusdc
    const _idaiSend = "1000000000000000000000"; // 1000 idai

    await __erc20Transfer("wMatic", wMATIC, 18, _wmaticSend);
    await __erc20Transfer("stMatic", stMATIC, 18, _stmaticSend);
    await __erc20Transfer("wBtc", wBTC, 8, _btcSend);
    await __erc20Transfer("wEth", wETH, 18, _wethSend);
    await __erc20Transfer("lp", lp, 18, _lpSend);
    await __erc20Transfer("iWMatic", iWMATIC, 18, _iwmaticSend);
    await __erc20Transfer("iUsdc", iUSDC, 6, _iusdcSend);
    await __erc20Transfer("iDai", iDAI, 18, _idaiSend);

    setDisable(false);
    setisLoading(false);
  };

  return (
    <>
      <Box layerStyle="card" flex={1} mt={6}>
        <Flex>
          <Text textStyle="title2">Faucet</Text>
        </Flex>
        <div
          style={{
            textAlign: "center",
            margin: "50px",
            padding: "0.5em",
            background: "#brand.1100",
            backdropFilter: "blur(10px)",
            borderRadius: "1em",
            color: "whitesmoke",
            fontSize: "1.3em"
          }}
        >
          <div>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      style={{
                        color: "white",
                        fontSize: "16px"
                      }}
                    >
                      Name
                    </Th>
                    <Th
                      style={{
                        color: "white",
                        fontSize: "16px"
                      }}
                    >
                      Balance
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="WMATIC"
                        h={6}
                        w={6}
                        mr={3}
                      />
                      wMATIC
                    </Td>
                    <Td>{balances.wMatic}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="WBTC"
                        h={6}
                        w={6}
                        mr={3}
                      />
                      wBtc
                    </Td>
                    <Td>{balances.wBtc}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="WETH"
                        h={6}
                        w={6}
                        mr={3}
                      />
                      wEth
                    </Td>
                    <Td>{balances.wEth}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="Balancer"
                        h={6}
                        w={6}
                        mr={3}
                      />{" "}
                      lp (star/matic)
                    </Td>
                    <Td>{balances.lp}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="WMATIC"
                        h={6}
                        w={6}
                        mr={3}
                      />{" "}
                      iWMatic
                    </Td>
                    <Td>{balances.iWmatic}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="iUSDC"
                        h={6}
                        w={6}
                        mr={3}
                      />{" "}
                      iUSDC
                    </Td>
                    <Td>{balances.iUsdc}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      {" "}
                      <Icon
                        bg="rgba(255,255,255,1)"
                        p="2px"
                        borderRadius="1em"
                        iconName="iDAI"
                        h={6}
                        w={6}
                        mr={3}
                      />{" "}
                      iDAI
                    </Td>
                    <Td>{balances.iDai}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
            {/* <h4>wMATIC: {balances.wMatic}</h4>
          <h4>stMATIC: {balances.stMatic}</h4>
          <h4>wBtc: {balances.wBtc}</h4>
          <h4>wEth: {balances.wEth}</h4>
          <h4>lp (Star/matic): {balances.lp}</h4>
          <h4>preon: {balances.preon}</h4> */}
          </div>
          {/* <hr /> */}
          <form onSubmit={handleSubmit}>
            <label style={{ color: "white", fontSize: "1.5em" }} htmlFor="token">
              {" "}
              User address :{" "}
            </label>
            <input
              style={{
                color: "white",
                outlineColor: "#C157F9",
                border: "1px solid rgb(193, 87, 249)",
                borderRadius: "5px",
                padding: "0.1em",
                fontSize: "1.1em",
                color: "black",
                marginTop: "30px",
                borderColor: "#C157F9",
                background: "#ffffff0d"
              }}
              type="text"
              name="address"
              onChange={handleChange}
            ></input>
            <div style={{ height: "20px" }}></div>
            <br></br>

            <Button type="submit" variant="gradient" disabled={disable}>
              {isLoading ? "...Getting" : "Get All Assets"}
            </Button>
          </form>
        </div>
      </Box>
    </>
  );
}
