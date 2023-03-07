import { ActionIO } from "../lib/interface/io.js";
import { getInput, setFailed, setOutput } from "@actions/core";
import { parseJSON } from "../lib/util.js";
import { Validator } from "../lib/interface/validator.js";
import { Ok, Result } from "../lib/core/result.js";
import { None, Option, Some } from "../lib/core/option.js";

class GithubActionIO implements ActionIO {
  get(key: string): string {
    return getInput(key);
  }

  getObject<T>(key: string, validator: Option<Validator<T>>): Result<T, Error> {
    const raw = this.get(key);
    return parseJSON(raw).andThen((j) =>
      validator.asResult({
        none: () => Ok(j) as Result<T, Error>,
        some: (v) => v.parse(j),
      })
    );
  }

  set(key: string, value: string): void {
    setOutput(key, value);
  }

  setObject(key: string, value: object): void {
    setOutput(key, JSON.stringify(value));
  }

  getOptionalObject<T>(
    key: string,
    validator: Option<Validator<T>>
  ): Result<Option<T>, Error> {
    const raw = this.get(key);
    if (raw === "") return Ok(None());

    return this.getObject(key, validator).map((o) => Some(o));
  }

  /* istanbul ignore next */
  setFail(message: string | Error): void {
    setFailed(message);
  }
}

export { GithubActionIO };
