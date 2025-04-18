import redis from "../../config/redis";
import { Move } from "@repo/db";
import { RedisMoveSchema, RedisMove } from "./schemas";
import utils, { getKey } from "./utils";

export class RedisMoveHandler {
  // Add a move to Redis
  static async addMove(gameId: string, move: Move) {
    // Validate move before storing
    const redisMove: RedisMove = {
      id: move.id,
      moveNumber: move.moveNumber,
      from: move.from,
      to: move.to,
      before: move.before,
      after: move.after,
      san: move.san ?? undefined,
      timeTaken: move.timeTaken ?? undefined,
      createdAt: move.createdAt.toISOString(),
    };

    RedisMoveSchema.parse(redisMove);

    const pipeline = redis.multi();

    pipeline.rpush(getKey(gameId, "moves"), JSON.stringify(redisMove));

    utils.refreshTTL(pipeline, gameId);

    await pipeline.exec();

    console.log(`➕ Move ${move.id} pushed to Redis for game ${gameId}`);
  }

  // Get all moves for a game
  static async getMoves(gameId: string): Promise<RedisMove[]> {
    const rawMoves = await redis.lrange(getKey(gameId, "moves"), 0, -1);

    const parsed = rawMoves.map((raw) => {
      const parsed = JSON.parse(raw);
      return RedisMoveSchema.parse(parsed);
    });

    return parsed;
  }

  // Clear all moves (optional, not used often)
  static async clearMoves(gameId: string) {
    await redis.del(getKey(gameId, "moves"));
    console.log(`🗑️ Cleared all moves for game ${gameId}`);
  }
}
