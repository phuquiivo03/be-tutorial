import { transferWorker } from "./transfer";

const startWorker = () => {
  transferWorker();
  console.log("Worker started");
};

startWorker();
