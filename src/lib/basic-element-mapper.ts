import { ElementMapper } from "./interface/mapper";
import { HistoryEntry, Input } from "./history";
import {
  IntermediateElement,
  IntermediateEntry,
  IntermediateMetadata,
  OutputElement,
  OutputEntry,
  OutputMetadata,
} from "./output";

class BasicElementMapper implements ElementMapper {
  toIntermediateMetadata({ url, name, data }: Input): IntermediateElement {
    const d = ((): IntermediateMetadata => {
      switch (data.type) {
        case "documentation":
          return {
            ...data,
          };
        case "code-quality":
          return {
            ...data,
          };
        case "test-coverage":
          return {
            ...data,
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
          };
        case "test-result":
          return {
            ...data,
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
          };
        default:
          throw new Error("unreachable");
      }
    })();

    return {
      url,
      name,
      data: d,
    };
  }

  inputToIntermediate({
    sha,
    url,
    items,
    action,
  }: HistoryEntry): IntermediateEntry {
    return {
      url,
      sha,
      action,
      items: items.map((x) => this.toIntermediateMetadata(x)),
    };
  }

  toOutputMetadata({ url, name, data }: IntermediateElement): OutputElement {
    const d = ((): OutputMetadata => {
      switch (data.type) {
        case "documentation":
          return {
            ...data,
          };
        case "code-quality":
          return {
            ...data,
          };
        case "test-coverage":
          return {
            ...data,
            result:
              data.resultDetails.fail.length > 0
                ? "fail"
                : data.resultDetails.warn.length > 0
                ? "warn"
                : "pass",
          };
        case "test-result":
          return {
            ...data,
            result:
              data.resultDetails.fail.length > 0
                ? "fail"
                : data.resultDetails.warn.length > 0
                ? "warn"
                : "pass",
          };
        default:
          throw new Error("unreachable");
      }
    })();

    return {
      url,
      name,
      data: d,
    };
  }

  intermediateToOutput({
    sha,
    url,
    items,
    action,
  }: IntermediateEntry): OutputEntry {
    return {
      url,
      sha,
      action,
      items: items.map((x) => this.toOutputMetadata(x)),
    };
  }
}

export { BasicElementMapper };
