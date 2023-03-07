import { HistoryEntry } from "../history";
import { OutputEntry } from "../output";
import { Option } from "../core/option";

interface PolicyEngine {
  evaluate(
    current: HistoryEntry,
    base: Option<HistoryEntry>
  ): Promise<OutputEntry>;
}

export { PolicyEngine };
