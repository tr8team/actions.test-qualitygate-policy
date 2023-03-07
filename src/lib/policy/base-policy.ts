import {
  IntermediateElement,
  IntermediateEntry,
  PolicyData,
  PolicyResult,
} from "../output";

class BasePolicy {
  readonly #target: string;
  readonly #name: string;

  constructor(name: string, target: string) {
    this.#name = name;
    this.#target = target;
  }

  async filteredEvaluate(
    current: IntermediateEntry,
    mapper: (i: IntermediateElement) => Promise<IntermediateElement>
  ): Promise<IntermediateEntry> {
    const { items, ...c } = current;
    const mapped = items.map((e) =>
      e.name === this.#target ? mapper(e) : Promise.resolve(e)
    );
    const awaited = await Promise.all(mapped);
    return {
      ...c,
      items: awaited,
    };
  }

  updatePolicyData(prev: PolicyData, verdict: PolicyResult): PolicyData {
    const rd = {
      fail: [...prev.fail],
      warn: [...prev.warn],
      pass: [...prev.pass],
    };
    if (verdict === "fail") {
      rd.fail.push(this.#name);
    } else if (verdict === "warn") {
      rd.warn.push(this.#name);
    } else {
      rd.pass.push(this.#name);
    }
    return rd;
  }

  updateElement(
    prev: IntermediateElement,
    verdict: PolicyResult
  ): IntermediateElement {
    const { url, name, data } = prev;
    const { resultDetails, ...ret } = data;
    const rd = this.updatePolicyData(resultDetails, verdict);
    return {
      name,
      url,
      data: {
        ...ret,
        resultDetails: rd,
      },
    };
  }
}

export { BasePolicy };
