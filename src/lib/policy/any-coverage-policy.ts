import { Policy } from "../interface/policy";
import { IntermediateEntry, PolicyResult } from "../output";
import { literal, number, object, z } from "zod";
import { BasePolicy } from "./base-policy";

const anyCoveragePolicy = object({
  type: literal("any-coverage-policy"),
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

type AnyCoveragePolicyConfig = z.infer<typeof anyCoveragePolicy>;

class AnyCoveragePolicy extends BasePolicy implements Policy {
  readonly #config: AnyCoveragePolicyConfig;

  constructor(name: string, target: string, config: AnyCoveragePolicyConfig) {
    super(name, target);
    this.#config = config;
  }

  evaluate(current: IntermediateEntry): Promise<IntermediateEntry> {
    return this.filteredEvaluate(current, (item) => {
      if (item.data.type === "test-coverage") {
        const { data } = item;
        let verdict: PolicyResult = "pass";
        if (
          data.function < this.#config.warn ||
          data.line < this.#config.warn ||
          data.branch < this.#config.warn ||
          data.statement < this.#config.warn
        ) {
          verdict = "warn";
        }
        if (
          data.function < this.#config.fail ||
          data.line < this.#config.fail ||
          data.branch < this.#config.fail ||
          data.statement < this.#config.fail
        ) {
          verdict = "fail";
        }
        return Promise.resolve(this.updateElement(item, verdict));
      }
      return Promise.resolve(item);
    });
  }
}

export { AnyCoveragePolicy, anyCoveragePolicy };
export type { AnyCoveragePolicyConfig };
