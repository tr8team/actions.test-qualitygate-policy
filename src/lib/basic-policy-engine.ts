import { PolicyEngine } from "./interface/policy-engine";
import { HistoryEntry } from "./history";
import { Policy } from "./interface/policy";
import { OutputEntry } from "./output";
import { ElementMapper } from "./interface/mapper";
import { Option } from "./core/option";

class BasicPolicyEngine implements PolicyEngine {
  readonly #policies: Policy[];
  readonly #mapper: ElementMapper;

  async evaluate(
    current: HistoryEntry,
    base: Option<HistoryEntry>
  ): Promise<OutputEntry> {
    const start = this.#mapper.inputToIntermediate(current, base);
    const intermediate = await this.#policies.reduce(
      async (prev, x) => await x.evaluate(await prev),
      Promise.resolve(start)
    );
    return this.#mapper.intermediateToOutput(intermediate);
  }

  constructor(policies: Policy[], mapper: ElementMapper) {
    this.#policies = policies;
    this.#mapper = mapper;
  }
}

export { BasicPolicyEngine };
