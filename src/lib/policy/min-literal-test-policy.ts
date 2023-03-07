import { literal, number, object, z } from "zod";
import { testMetric } from "../enums";
import { Policy } from "../interface/policy";
import { BasePolicy } from "./base-policy";
import { IntermediateEntry, PolicyResult } from "../output";

const minLiteralTestPolicy = object({
  type: literal("min-literal-test-policy"),
  metric: testMetric,
  warn: number().min(0),
  fail: number().min(0),
}).strict();

type MinLiteralTestPolicyConfig = z.infer<typeof minLiteralTestPolicy>;

class MinLiteralTestPolicy extends BasePolicy implements Policy {
  readonly #config: MinLiteralTestPolicyConfig;

  constructor(
    name: string,
    target: string,
    config: MinLiteralTestPolicyConfig
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
        if (data[this.#config.metric] < warn) {
          verdict = "warn";
        }
        if (data[this.#config.metric] < fail) {
          verdict = "fail";
        }
        return Promise.resolve(this.updateElement(item, verdict));
      }
      return Promise.resolve(item);
    });
  }
}

export { minLiteralTestPolicy, MinLiteralTestPolicy };

export type { MinLiteralTestPolicyConfig };
