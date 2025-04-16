import { Game, Move } from "@repo/db";

import redis from "../config/redis";

const GAME_TTL = 300; // 5 minutes

const getKey = (gameId: string, field: string) => {
  return `game:${gameId}:${field}`;
};

// initalize the game in redis

export class GameStore {
  static async init(game: Game) {
    const { id, whitePlayerId, blackPlayerId, currentFen } = game;

    const pipeline = redis.multi();

    pipeline.hset(getKey(id, "state"), {
      fen: currentFen ?? game.startingFen,
      clockWhite: "30000",
    });

    pipeline.hset(getKey(id, "players"), {
      white: whitePlayerId,
      black: blackPlayerId,
    });

    pipeline.del(getKey(id, "moves"));
    pipeline.set(getKey(id, "status"), "in_progress");

    ["state", "players", "moves", "status"].forEach((field) => {
      pipeline.expire(getKey(id, field), GAME_TTL);
    });

    await pipeline.exec();
    console.log(`🎮 Game ${id} initialized in Redis`);
  }

  static async makeMove(gameId:string,move:Move,fen:string,clockWhite:number,clockBlack:number){
    const pipeline = redis.multi();

    pipeline.rpush(getKey(gameId, "moves"), JSON.stringify(move));
    pipeline.hset(getKey(gameId, "state"),{
        fen,
        clockWhite:
        clockBlack
    })
  }
}
