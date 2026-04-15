import prisma from "../infrastructure/prisma/connect";
import { AccountService } from "../modules/account";
import { ErrorCodes } from "../shared/errors/error-code";
import { ErrorMessages } from "../shared/errors/error-message";

const accountAId = "8013f561-0d56-4bc3-85e9-4d6faabeea4e";
const accountBId = "0d56563a-f130-4f51-94c5-562f7334567d";

async function tx2(prisma) {
  try {
    await prisma.$transaction(async (tx) => {
      console.log("Tx2: lock B");
      await AccountService.lockAccount(accountBId, tx);

      await sleep(1000);

      console.log("Tx2: lock A");

      await AccountService.lockAccount(accountAId, tx);
    });
  } catch (error) {
    console.error("Error in tx2, code:", error.code);
    throw error;
  }
}

async function tx1(prisma) {
  try {
    await prisma.$transaction(async (tx) => {
      console.log("Tx1: lock A");

      await AccountService.lockAccount(accountAId, tx);

      await sleep(1000);

      console.log("Tx1: lock B");

      await AccountService.lockAccount(accountBId, tx);
    });
  } catch (error) {
    console.error("Error in tx1, code:", error.code);
    throw error;
  }
}

(async () => {
  try {
    await Promise.all([tx1(prisma), tx2(prisma)]);
  } catch (error) {
    console.log(`message :${error.message}, code: ${error.code}`);
  }
})();
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
