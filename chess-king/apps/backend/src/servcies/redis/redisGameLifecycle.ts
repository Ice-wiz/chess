import redis from "../../config/redis";
import { Game, GameResult } from "@repo/db";
import {
  RedisGameStateSchema,
  RedisGamePlayersSchema,
  RedisGameStatusSchema,
} from "./schemas";
import utils, { getKey } from "./utils";

export class RedisGameLifecycle {
  static async initGame(game: Game) {
    const { id, whitePlayerId, blackPlayerId, startingFen, currentFen } = game;

    const pipeline = redis.multi();

    RedisGameStateSchema.parse({
      fen: currentFen ?? startingFen,
      clockWhite: "600000",
      clockBlack: "600000",
    });

    RedisGamePlayersSchema.parse({
      white: whitePlayerId,
      black: blackPlayerId,
    });

    // Set up game data in Redis

    pipeline.hset(getKey(id, "state"), {
      fen: currentFen ?? startingFen,
      clockWhite: "600000", 
      clockBlack: "600000",
    });

    pipeline.hset(getKey(id, "players"), {
      white: whitePlayerId,
      black: blackPlayerId,
    });

    pipeline.del(getKey(id, "moves"));

    pipeline.set(getKey(id, "status"), "in_progress");

    utils.refreshTTL(pipeline, id);

    await pipeline.exec();
    console.log(`🎮 Initialized game ${id} in Redis`);
  }

  static async endGame(gameId: string, result: GameResult) {
    const resultLower = result.toLowerCase() as keyof typeof RedisGameStatusSchema.Values;

    if (!RedisGameStatusSchema.safeParse("completed").success) {
      throw new Error("Invalid game status");
    }

    const pipeline = redis.multi();

    pipeline.set(getKey(gameId, "status"), "completed");
    pipeline.hset(getKey(gameId, "state"), "result", result);

    utils.refreshTTL(pipeline, gameId);

    await pipeline.exec();
    console.log(`✅ Game ${gameId} ended with result: ${result}`);
  }

  static async abandonGame(gameId: string) {
    const pipeline = redis.multi();

    pipeline.set(getKey(gameId, "status"), "abandoned");

    utils.refreshTTL(pipeline, gameId);

    await pipeline.exec();
    console.log(`⚠️ Game ${gameId} marked as abandoned`);

    setTimeout(() => utils.clearGameFromRedis(gameId), 10_000); 
  }
}
