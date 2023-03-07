import { literal, number, object, z } from "zod";
import { coverageMetric } from "../enums";
import { BasePolicy } from "./base-policy";
import { Policy } from "../interface/policy";
import { IntermediateEntry, PolicyResult } from "../output";

const minCoveragePolicy = object({
  type: literal("min-coverage-policy"),
  metric: coverageMetric,
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

type MinCoveragePolicyConfig = z.infer<typeof minCoveragePolicy>;

class MinCoveragePolicy extends BasePolicy implements Policy {
  readonly #config: MinCoveragePolicyConfig;

  constructor(name: string, target: string, cofing: MinCoveragePolicyConfig) {
    super(name, target);
    this.#config = cofing;
  }

  evaluate(current: IntermediateEntry): Promise<IntermediateEntry> {
    return this.filteredEvaluate(current, (item) => {
      if (item.data.type === "test-coverage") {
        const { data } = item;
        let verdict: PolicyResult = "pass";
        if (data[this.#config.metric] < this.#config.warn) {
          verdict = "warn";
        }
        if (data[this.#config.metric] < this.#config.fail) {
          verdict = "fail";
        }
        return Promise.resolve(this.updateElement(item, verdict));
      }
      return Promise.resolve(item);
    });
  }
}

export { minCoveragePolicy, MinCoveragePolicy };

export type { MinCoveragePolicyConfig };
