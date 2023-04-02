import type { Placement } from "../placement.ts";

/**
 * Storer stores Placements in a database.
 */
export interface Storer {
  /**
   * Get the last 100 placements.
   */
  read(): Promise<Placement[]>;

  /**
   * Write a placement to the database.
   */
  write(placement: Placement): Promise<void>;
}

// TODO: Implement a storer that uses a database.
// See: https://developers.cloudflare.com/workers/learning/using-durable-objects/
