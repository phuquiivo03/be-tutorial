import { createClient } from "redis";
import { appConfig } from "../../config/";

// redis setup
const client = createClient({
  socket: {
    host: appConfig.redis.host,
    port: parseInt(appConfig.redis.port),
  },
  username: appConfig.redis.username,
  password: appConfig.redis.password,
})
  .on("error", (err) =>
    console.log("Redis Client Error", (err as Error).message),
  )
  .connect();

export default client;
