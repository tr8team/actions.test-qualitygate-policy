import { IntermediateEntry } from "../output";
import { HistoryEntry } from "../history";

interface Policy {
  evaluate(current: IntermediateEntry, base?: HistoryEntry): IntermediateEntry;
}

export { Policy };
