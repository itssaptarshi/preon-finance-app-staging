import React from "react";
import { TokenInfoContext } from "./context";

// TODO pull exchange rates from blockchain
// TODO add other important token info
const TokenInfoProvider: React.FC = ({ children }) => {
  return <TokenInfoContext.Provider value={{} as any}>{children}</TokenInfoContext.Provider>;
};

export default TokenInfoProvider;
