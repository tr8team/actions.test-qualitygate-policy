import { PolicyEngine } from "./interface/policy-engine";
import { HistoryEntry } from "./history";
import { Policy } from "./interface/policy";
import { OutputEntry } from "./output";
import { ElementMapper } from "./interface/mapper";
import { Option } from "./core/option";

class BasicPolicyEngine implements PolicyEngine {
  readonly #mapper: ElementMapper;

  async evaluate(
    policies: Policy[],
    current: HistoryEntry,
    base: Option<HistoryEntry>
  ): Promise<OutputEntry> {
    const start = this.#mapper.inputToIntermediate(current, base);
    const intermediate = await policies.reduce(
      async (prev, x) => await x.evaluate(await prev),
      Promise.resolve(start)
    );
    return await this.#mapper.intermediateToOutput(intermediate);
  }

  constructor(mapper: ElementMapper) {
    this.#mapper = mapper;
  }
}

export { BasicPolicyEngine };
