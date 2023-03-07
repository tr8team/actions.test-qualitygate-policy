import { ZodError } from "zod";
import { Err, Ok, Result } from "./core/result.js";
import { None, Option, Some } from "./core/option";

function toResult<T>(
  du: { success: true; data: T } | { success: false; error: ZodError }
): Result<T, ZodError> {
  if (du.success) {
    return Ok(du.data);
  }
  return Err(du.error);
}

function toOption<T>(any?: T | undefined | null): Option<T> {
  if (any == null) {
    return None();
  }
  return Some(any);
}

function parseJSON<T>(raw: string): Result<T, Error> {
  try {
    const json: T = JSON.parse(raw);
    return Ok(json);
  } catch (e) {
    return Err(e as Error);
  }
}

export { toResult, parseJSON, toOption };
