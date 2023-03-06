import { Policy } from "../interface/policy";
import { IntermediateEntry } from "../output";
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
  readonly #name: string;
  readonly #config: AnyCoveragePolicyConfig;

  constructor(name: string, target: string, config: AnyCoveragePolicyConfig) {
    super(target);
    this.#name = name;
    this.#config = config;
  }

  evaluate(current: IntermediateEntry): IntermediateEntry {
    return this.filteredEvaluate(current, (item) => {
      if (item.data.type === "test-coverage") {
        const { url, name, data } = item;
        let verdict = "pass";
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
        const { resultDetails, ...ret } = data;
        const rd = {
          fail: [...resultDetails.fail],
          warn: [...resultDetails.warn],
          pass: [...resultDetails.pass],
        };
        if (verdict === "fail") {
          rd.fail.push(this.#name);
        } else if (verdict === "warn") {
          rd.warn.push(this.#name);
        } else {
          rd.pass.push(this.#name);
        }
        return {
          name,
          url,
          data: {
            ...ret,
            resultDetails: rd,
          },
        };
      }
      return item;
    });
  }
}

export { AnyCoveragePolicy, anyCoveragePolicy };
export type { AnyCoveragePolicyConfig };
