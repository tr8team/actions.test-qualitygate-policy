import { literal, number, object, z } from "zod";
import { BasePolicy } from "./base-policy";
import { Policy } from "../interface/policy";
import {
  IntermediateElement,
  IntermediateEntry,
  PolicyResult,
} from "../output";

const anyDeltaCoveragePolicy = object({
  type: literal("any-delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
})
  .required()
  .strict();

type AnyDeltaCoveragePolicyConfig = z.infer<typeof anyDeltaCoveragePolicy>;

class AnyDeltaCoveragePolicy extends BasePolicy implements Policy {
  readonly #config: AnyDeltaCoveragePolicyConfig;

  constructor(
    name: string,
    target: string,
    config: AnyDeltaCoveragePolicyConfig
  ) {
    super(name, target);
    this.#config = config;
  }

  evaluate(current: IntermediateEntry): Promise<IntermediateEntry> {
    // ensure that current's coverage must have not dropped below base coverage, if possible
    return this.filteredEvaluate(
      current,
      (item): Promise<IntermediateElement> => {
        if (item.data.type === "test-coverage") {
          const { data } = item;
          return data.delta
            .map((delta) => {
              const fWarn =
                data.function === 100
                  ? Math.min(this.#config.warn, delta.function)
                  : this.#config.warn;
              const lWarn =
                data.line === 100
                  ? Math.min(this.#config.warn, delta.line)
                  : this.#config.warn;
              const bWarn =
                data.branch === 100
                  ? Math.min(this.#config.warn, delta.branch)
                  : this.#config.warn;
              const sWarn =
                data.statement === 100
                  ? Math.min(this.#config.warn, delta.statement)
                  : this.#config.warn;

              const fFail =
                data.function === 100
                  ? Math.min(this.#config.fail, delta.function)
                  : this.#config.fail;
              const lFail =
                data.line === 100
                  ? Math.min(this.#config.fail, delta.line)
                  : this.#config.fail;
              const bFail =
                data.branch === 100
                  ? Math.min(this.#config.fail, delta.branch)
                  : this.#config.fail;
              const sFail =
                data.statement === 100
                  ? Math.min(this.#config.fail, delta.statement)
                  : this.#config.fail;

              let verdict: PolicyResult = "pass";
              if (
                delta.function < fWarn ||
                delta.line < lWarn ||
                delta.branch < bWarn ||
                delta.statement < sWarn
              ) {
                verdict = "warn";
              }
              if (
                delta.function < fFail ||
                delta.line < lFail ||
                delta.branch < bFail ||
                delta.statement < sFail
              ) {
                verdict = "fail";
              }
              return this.updateElement(item, verdict);
            })
            .unwrapOr(item);
        }
        return Promise.resolve(item);
      }
    );
  }
}

export { anyDeltaCoveragePolicy, AnyDeltaCoveragePolicy };
export type { AnyDeltaCoveragePolicyConfig };
