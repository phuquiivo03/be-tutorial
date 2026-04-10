// // worker/worker.ts
// import { connectQueue, publishMessage } from "../shared/rabbitmq";
// import { mintNFT, resizeImage } from "../services";
// import { QueueName, MQActions, Queue, RoutingKey } from "../config/mq";
// import JobService from "../modules/job/job.service";
// import { CreateJobDTO, JobStatus } from "../dtos";
// import amqp from "amqplib";
// import { ErrorMessages } from "../messages";
// import { Job } from "../types";
// async function startWorker() {
//   const channel = await connectQueue();

//   channel.consume(QueueName.WEB3, async (msg) => {
//     await handleError(
//       msg as amqp.Message,
//       channel,
//       RoutingKey.MINT,
//       async () => {
//         const data = JSON.parse(msg?.content.toString() || "") as CreateJobDTO;
//         const jobData = {
//           id: data.id,
//           data: data.data,
//           action: MQActions.MINT,
//         };
//         const job: Job = await JobService.create(jobData);
//         await mintNFT();
//         // update job status to completed
//         await JobService.update(job.id, JobStatus.COMPLETED);
//         channel.ack(msg as amqp.Message);
//       },
//     );
//   });
// }

// async function handleError(
//   msg: amqp.Message,
//   channel: amqp.Channel,
//   routingKey: RoutingKey,
//   callback: () => Promise<void>,
// ) {
//   try {
//     return await Promise.resolve(callback());
//   } catch (error) {
//     const data = JSON.parse(msg.content.toString());
//     switch (error.message) {
//       case ErrorMessages.FAILED_TO_MINT_NFT:
//         handleRetry(msg, channel);
//         break;
//       case ErrorMessages.FAILED_TO_CREATE_JOB:
//         handlePendingJob(msg, channel, data.id);
//         break;
//       default:
//         handleCancelJob(data.id, msg, channel);
//         break;
//     }
//   }
// }



// startWorker();
