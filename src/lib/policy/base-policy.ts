import { IntermediateElement, IntermediateEntry } from "../output";

class BasePolicy {
  readonly #target: string;

  constructor(target: string) {
    this.#target = target;
  }

  filteredEvaluate(
    current: IntermediateEntry,
    mapper: (i: IntermediateElement) => IntermediateElement
  ): IntermediateEntry {
    const { items, ...c } = current;
    return {
      ...c,
      items: items.map((e) => (e.name === this.#target ? mapper(e) : e)),
    };
  }
}

export { BasePolicy };
