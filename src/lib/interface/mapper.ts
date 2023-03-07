import { HistoryEntry } from "../history";
import { IntermediateEntry, OutputEntry } from "../output";
import { Option } from "../core/option";

interface ElementMapper {
  inputToIntermediate(
    h: HistoryEntry,
    base: Option<HistoryEntry>
  ): IntermediateEntry;

  intermediateToOutput(h: IntermediateEntry): OutputEntry;
}

export { ElementMapper };
