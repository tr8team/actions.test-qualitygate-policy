import { HistoryEntry } from "../history";
import { OutputEntry } from "../output";
import { Option } from "../core/option";
import { Policy } from "./policy";

interface PolicyEngine {
  evaluate(
    policies: Policy[],
    current: HistoryEntry,
    base: Option<HistoryEntry>
  ): Promise<OutputEntry>;
}

export { PolicyEngine };
