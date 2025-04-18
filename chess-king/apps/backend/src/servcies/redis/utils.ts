import redis from "../../config/redis";

const GAME_TTL = 300; // 5 minutes

export const getKey = (gameId: string, field: string) => {
  return `game:${gameId}:${field}`;
};

const utils = class {
  // ✅ Refresh TTL for all fields using a Redis pipeline
  static refreshTTL = (
    pipeline: ReturnType<typeof redis.multi>,
    gameId: string
  ) => {
    ["state", "players", "moves", "status"].forEach((field) => {
      pipeline.expire(getKey(gameId, field), GAME_TTL);
    });
    console.log(`TTL refreshed for game ${gameId}`);
  };

  // ✅ Set TTL manually (outside pipeline)
  static setTTL = async (gameId: string) => {
    const ops = ["state", "players", "moves", "status"].map((field) =>
      redis.expire(getKey(gameId, field), GAME_TTL) // 🔥 fixed typo: was "move", should be "moves"
    );
    await Promise.all(ops);
    console.log(`TTL set for game ${gameId}`);
  };

  // ✅ Clean up Redis keys for a game
  static clearGameFromRedis = async (gameId: string) => {
    const keys = ["state", "players", "moves", "status"].map((field) =>
      getKey(gameId, field)
    );
    await redis.del(...keys);
    console.log(`Deleted all Redis keys for game ${gameId}`);
  };
};

export default utils;
