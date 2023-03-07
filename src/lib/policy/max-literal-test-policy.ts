import { literal, number, object, z } from "zod";
import { testMetric } from "../enums";
import { Policy } from "../interface/policy";
import { BasePolicy } from "./base-policy";
import { IntermediateEntry, PolicyResult } from "../output";

const maxLiteralTestPolicy = object({
  type: literal("max-literal-test-policy"),
  metric: testMetric,
  warn: number().min(0),
  fail: number().min(0),
})
  .required()
  .strict();

type MaxLiteralTestPolicyConfig = z.infer<typeof maxLiteralTestPolicy>;

class MaxLiteralTestPolicy extends BasePolicy implements Policy {
  readonly #config: MaxLiteralTestPolicyConfig;

  constructor(
    name: string,
    target: string,
    config: MaxLiteralTestPolicyConfig
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
        let verdict: PolicyResult = "pass";
        if (data[this.#config.metric] > warn) {
          verdict = "warn";
        }
        if (data[this.#config.metric] > fail) {
          verdict = "fail";
        }
        return Promise.resolve(this.updateElement(item, verdict));
      }
      return Promise.resolve(item);
    });
  }
}

export { maxLiteralTestPolicy, MaxLiteralTestPolicy };

export type { MaxLiteralTestPolicyConfig };
