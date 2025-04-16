import redis from "./config/redis";

async function testRedis() {
  await redis.set("test-key", "hello from redis");
  const value = await redis.get("test-key");
  console.log("🔁 Fetched from Redis:", value);
  redis.quit();
}

testRedis();
