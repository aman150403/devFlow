import { createClient } from "redis"

const redisClient = createClient({
    url: "redis://localhost:6379"
})

redisClientw.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default redisClient;