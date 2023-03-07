import { ActionInput, InputRetriever } from "../interface/input-retriever";
import { ActionIO } from "../interface/io";
import { Result } from "../core/result";
import { Validator } from "../interface/validator";
import { HistoryEntry, History } from "../history";
import { PolicyConfigs } from "../policy-config";
import { Option, Some } from "../core/option";

class IoInputRetriever implements InputRetriever {
  readonly #io: ActionIO;
  readonly #historyEntryValidator: Validator<HistoryEntry>;
  readonly #historyValidator: Validator<History>;
  readonly #policyConfigsValidator: Validator<PolicyConfigs>;

  retrieve(): Result<ActionInput, Error> {
    const current: Result<HistoryEntry, Error> = this.#io.getObject(
      "current",
      Some(this.#historyEntryValidator)
    );
    const base: Result<
      Option<HistoryEntry>,
      Error
    > = this.#io.getOptionalObject("base", Some(this.#historyEntryValidator));
    const history: Result<History, Error> = this.#io.getObject(
      "history",
      Some(this.#historyValidator)
    );
    const policyConfigs: Result<PolicyConfigs, Error> = this.#io.getObject(
      "policies",
      Some(this.#policyConfigsValidator)
    );

    return current.andThen((c: HistoryEntry) =>
      base.andThen((b: Option<HistoryEntry>) =>
        history.andThen((h: History) =>
          policyConfigs.map(
            (p: PolicyConfigs) =>
              ({ current: c, base: b, history: h, policies: p } as ActionInput)
          )
        )
      )
    );
  }

  constructor(
    io: ActionIO,
    historyEntryValidator: Validator<HistoryEntry>,
    historyValidator: Validator<History>,
    policyConfigsValidator: Validator<PolicyConfigs>
  ) {
    this.#io = io;
    this.#historyEntryValidator = historyEntryValidator;
    this.#historyValidator = historyValidator;
    this.#policyConfigsValidator = policyConfigsValidator;
  }
}

export { IoInputRetriever };
