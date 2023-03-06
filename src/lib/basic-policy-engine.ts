import { PolicyEngine } from "./interface/policy-engine";
import { HistoryEntry } from "./history";
import { Policy } from "./interface/policy";
import { OutputEntry } from "./output";
import { ElementMapper } from "./interface/mapper";

class BasicPolicyEngine implements PolicyEngine {
  readonly #policies: Policy[];
  readonly #mapper: ElementMapper;

  evaluate(current: HistoryEntry, base?: HistoryEntry): OutputEntry {
    const start = this.#mapper.inputToIntermediate(current);
    const intermediate = this.#policies.reduce(
      (prev, x) => x.evaluate(prev, base),
      start
    );
    return this.#mapper.intermediateToOutput(intermediate);
  }

  constructor(policies: Policy[], mapper: ElementMapper) {
    this.#policies = policies;
    this.#mapper = mapper;
  }
}

export { BasicPolicyEngine };
