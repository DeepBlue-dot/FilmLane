import { PrismaClient } from "@prisma/client";
import { ExpressContext } from "@apollo/server/express4";
import { JwtPayload } from "jsonwebtoken";

export interface Context {
  prisma: PrismaClient;
  token?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
}

export interface Movie {
  tmdbId: number;
  title: string;
  overview?: string;
  releaseDate?: string;
  posterPath?: string;
  backdropPath?: string;
}

export interface JwtUserPayload extends JwtPayload {
  userId: string;
}