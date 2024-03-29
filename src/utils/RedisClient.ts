import { createClient } from "redis";
import { env } from "../env/server.mjs";

const RedisClient = createClient({ url: env.REDIS_URL });

RedisClient.connect()
  .then(() => console.log("Redis Client Connected..."))
  .catch(() =>
    console.error(
      "Couldn't connect to Redis Client, please make sure you have valid connection url in .env file"
    )
  );

export default RedisClient;
