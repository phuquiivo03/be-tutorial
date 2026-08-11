import { Decimal } from "@prisma/client/runtime/client";
import { CurrencyEnum } from "../modules/transaction";
import { currencies } from "../modules/transaction";

export const convertMoney = (
  amount: Decimal | number,
  currencySymbol: CurrencyEnum,
): String => {
  if (!(amount instanceof Decimal)) {
    amount = Decimal(amount);
  }
  const currency = currencies[currencySymbol];
  const formattedAmount = amount
    .div(currency.breakdown)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedAmount}`;
};
