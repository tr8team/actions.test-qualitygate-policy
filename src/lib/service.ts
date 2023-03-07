import { ActionInput } from "./interface/input-retriever";
import { Output, OutputElement, PolicyResult } from "./output";
import { PolicyFactory } from "./interface/policy-factory";
import { PolicyEngine } from "./interface/policy-engine";
import { ActionIO } from "./interface/io";
import { ILogger } from "./interface/logger";

interface QualityGateService {
  audit(input: ActionInput): Promise<Output>;
}

class BasicQualityGateService implements QualityGateService {
  readonly #factory: PolicyFactory;
  readonly #policyEngine: PolicyEngine;

  readonly #io: ActionIO;

  readonly #log: ILogger;

  emoji(r: PolicyResult): string {
    switch (r) {
      case "pass":
        return "✅";
      case "fail":
        return "❌";
      case "warn":
        return "⚠️";
      default:
        return "";
    }
  }

  printOutput(current: OutputElement): void {
    this.#log.info(`${current.name}, Quality Gate:`);
    this.#log.info(
      `  Final Result: ${this.emoji(current.data.result)} ${
        current.data.result
      }`
    );
    this.#log.info(`  Policies:`);
    for (const p of current.data.resultDetails.pass) {
      this.#log.info(`    ${this.emoji("pass")} ${p}`);
    }
    for (const p of current.data.resultDetails.warn) {
      this.#log.info(`    ${this.emoji("warn")} ${p}`);
    }
    for (const p of current.data.resultDetails.fail) {
      this.#log.info(`    ${this.emoji("fail")} ${p}`);
    }
  }

  async audit(input: ActionInput): Promise<Output> {
    const policies = input.policies.map((policy) =>
      this.#factory.generate(policy)
    );

    const current = await this.#policyEngine.evaluate(
      policies,
      input.current,
      input.base
    );
    const history = await Promise.all(
      input.history.map((entry) =>
        this.#policyEngine.evaluate(policies, entry, input.base)
      )
    );

    // Evaluate policy here
    if (current.items.some((x) => x.data.result === "fail")) {
      this.#io.setFail("Quality Gate Failed");
    }
    // log to console here
    for (const x of current.items) {
      this.printOutput(x);
    }
    return {
      current,
      history,
    };
  }

  constructor(
    factory: PolicyFactory,
    policyEngine: PolicyEngine,
    io: ActionIO,
    log: ILogger
  ) {
    this.#factory = factory;
    this.#policyEngine = policyEngine;
    this.#io = io;
    this.#log = log;
  }
}

export { QualityGateService, BasicQualityGateService };
