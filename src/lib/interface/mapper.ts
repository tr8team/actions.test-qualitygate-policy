import { HistoryEntry } from "../history";
import { IntermediateEntry, OutputEntry } from "../output";

interface ElementMapper {
  inputToIntermediate(h: HistoryEntry): IntermediateEntry;

  intermediateToOutput(h: IntermediateEntry): OutputEntry;
}

export { ElementMapper };
