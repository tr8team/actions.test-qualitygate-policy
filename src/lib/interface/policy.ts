import { IntermediateEntry } from "../output";

interface Policy {
  evaluate(current: IntermediateEntry): Promise<IntermediateEntry>;
}

export { Policy };
