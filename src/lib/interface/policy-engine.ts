import { HistoryEntry } from "../history";
import { OutputEntry } from "../output";

interface PolicyEngine {
  evaluate(current: HistoryEntry, base?: HistoryEntry): OutputEntry;
}

export { PolicyEngine };
