import { HistoryEntry, History } from "../history";
import { Option } from "../core/option";
import { PolicyConfigs } from "../policy-config";
import { Result } from "../core/result";

interface ActionInput {
  current: HistoryEntry;

  base: Option<HistoryEntry>;

  history: History;

  policies: PolicyConfigs;
}
interface InputRetriever {
  retrieve(): Result<ActionInput, Error>;
}

export { InputRetriever, ActionInput };
