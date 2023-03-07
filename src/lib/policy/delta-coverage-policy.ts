import { literal, number, object, z } from "zod";
import { BasePolicy } from "./base-policy";
import { Policy } from "../interface/policy";
import { IntermediateEntry, PolicyResult } from "../output";
import { coverageMetric } from "../enums";

const deltaCoveragePolicy = object({
  type: literal("delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
  metric: coverageMetric,
}).strict();

type DeltaCoveragePolicyConfig = z.infer<typeof deltaCoveragePolicy>;

class DeltaCoveragePolicy extends BasePolicy implements Policy {
  readonly #config: DeltaCoveragePolicyConfig;

  constructor(name: string, target: string, config: DeltaCoveragePolicyConfig) {
    super(name, target);
    this.#config = config;
  }

  evaluate(current: IntermediateEntry): Promise<IntermediateEntry> {
    return this.filteredEvaluate(current, (item) => {
      if (item.data.type === "test-coverage") {
        const { data } = item;
        return data.delta
          .map((delta) => {
            const warn =
              data[this.#config.metric] === 100
                ? Math.min(this.#config.warn, delta[this.#config.metric])
                : this.#config.warn;

            const fail =
              data[this.#config.metric] === 100
                ? Math.min(this.#config.fail, delta[this.#config.metric])
                : this.#config.fail;

            let verdict: PolicyResult = "pass";
            if (delta[this.#config.metric] < warn) {
              verdict = "warn";
            }
            if (delta[this.#config.metric] < fail) {
              verdict = "fail";
            }
            return this.updateElement(item, verdict);
          })
          .unwrapOr(item);
      }
      return Promise.resolve(item);
    });
  }
}

export { deltaCoveragePolicy, DeltaCoveragePolicy };
export type { DeltaCoveragePolicyConfig };
