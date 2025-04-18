import { z } from "zod";
import { GameStatus, GameResult } from "@repo/db";

// game schema (partial , specific to redis)

export const RedisGameStateSchema = z.object({
  fen: z.string(),
  clockWhite: z.string(),
  clockBlack: z.string(),
});

export type RedisGameState = z.infer<typeof RedisGameStateSchema>;

// players

export const RedisGamePlayersSchema = z.object({
  white: z.string(),
  black: z.string(),
});

export type RedisGamePlayers = z.infer<typeof RedisGamePlayersSchema>;

// clock updation

export const RedisGameClockSchema = z.object({
  gameId: z.string(),
  clockWhite: z.number(),
  clockBlack: z.number(),
});

// moves

export const RedisMoveSchema = z.object({
  id: z.string(),
  moveNumber: z.number(),
  from: z.string(),
  to: z.string(),
  before: z.string(),
  after: z.string(),
  san: z.string().optional(),
  comments: z.string().optional(),
  timeTaken: z.number().optional(),
  createdAt: z.string(),
});

export type RedisMove = z.infer<typeof RedisMoveSchema>;

// game status

export const RedisGameStatusSchema = z.enum([
  "in_progress",
  "completed",
  "abandoned",
  "time_up",
]);
export type RedisGameStatus = z.infer<typeof RedisGameStatusSchema>;
