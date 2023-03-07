import { Validator } from "./validator.js";
import { Result } from "../core/result.js";
import { Option } from "../core/option.js";

interface ActionIO {
  get(key: string): string;

  getObject<T>(key: string, validator: Option<Validator<T>>): Result<T, Error>;

  getOptionalObject<T>(
    key: string,
    validator: Option<Validator<T>>
  ): Result<Option<T>, Error>;

  set(key: string, value: string): void;

  setObject(key: string, value: object): void;

  setFail(message: string | Error): void;
}

export type { ActionIO };
