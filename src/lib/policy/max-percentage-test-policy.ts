import { literal, number, object, z } from "zod";
import { testMetric } from "../enums";
import { Policy } from "../interface/policy";
import { BasePolicy } from "./base-policy";
import { IntermediateEntry, PolicyResult } from "../output";

const maxPercentageTestPolicy = object({
  type: literal("max-percentage-test-policy"),
  metric: testMetric,
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

type MaxPercentageTestPolicyConfig = z.infer<typeof maxPercentageTestPolicy>;

class MaxPercentageTestPolicy extends BasePolicy implements Policy {
  readonly #config: MaxPercentageTestPolicyConfig;

  constructor(
    name: string,
    target: string,
    config: MaxPercentageTestPolicyConfig
  ) {
    super(name, target);
    this.#config = config;
  }

  evaluate(current: IntermediateEntry): Promise<IntermediateEntry> {
    return this.filteredEvaluate(current, (item) => {
      if (item.data.type === "test-result") {
        const { data } = item;
        const warn = this.#config.warn;
        const fail = this.#config.fail;

        const total = data.fail + data.skip + data.pass;
        const percentage =
          total === 0 ? 0 : (data[this.#config.metric] / total) * 100;
        let verdict: PolicyResult = "pass";
        if (percentage > warn) {
          verdict = "warn";
        }
        if (percentage > fail) {
          verdict = "fail";
        }
        return Promise.resolve(this.updateElement(item, verdict));
      }
      return Promise.resolve(item);
    });
  }
}

export { maxPercentageTestPolicy, MaxPercentageTestPolicy };
export type { MaxPercentageTestPolicyConfig };
