import redis from "../../config/redis";
import utils, { getKey } from "./utils";
import { RedisGameClockSchema } from "./schemas";
import { z } from "zod";

export class RedisClock {
  // ⏱️ Update clocks in Redis
  static async updateClocks(data: z.infer<typeof RedisGameClockSchema>) {
    RedisGameClockSchema.parse(data); // Validate input

    const { gameId, clockWhite, clockBlack } = data;

    const pipeline = redis.multi();

    pipeline.hset(getKey(gameId, "state"), {
      clockWhite: clockWhite.toString(),
      clockBlack: clockBlack.toString(),
    });

    utils.refreshTTL(pipeline, gameId);

    await pipeline.exec();
    console.log(`⏱️ Clocks updated for game ${gameId}`);
  }

  // 🕒 Get current clocks
  static async getClocks(gameId: string): Promise<{
    clockWhite: number;
    clockBlack: number;
  }> {
    const data = await redis.hgetall(getKey(gameId, "state"));

    return {
      clockWhite: parseInt(data.clockWhite || "0", 10),
      clockBlack: parseInt(data.clockBlack || "0", 10),
    };
  }
}
