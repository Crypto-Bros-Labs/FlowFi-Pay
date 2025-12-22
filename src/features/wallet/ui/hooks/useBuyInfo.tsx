import { useState, useCallback } from "react";

export interface BuyAmounts {
  amountFiat: string;
  amountToken: string;
}

export const useBuyInfo = () => {
  const [amounts, setAmounts] = useState<BuyAmounts>({
    amountFiat: "0",
    amountToken: "0.00",
  });

  const updateAmounts = useCallback((fiat: string, token: string) => {
    setAmounts({
      amountFiat: fiat,
      amountToken: token,
    });
  }, []);

  return {
    amounts,
    updateAmounts,
  };
};
