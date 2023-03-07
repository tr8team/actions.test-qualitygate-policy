import { ElementMapper } from "./interface/mapper";
import { HistoryEntry, Input, TestCoverageMetadata } from "./history";
import {
  IntermediateElement,
  IntermediateEntry,
  IntermediateMetadata,
  OutputElement,
  OutputEntry,
} from "./output";
import { Option } from "./core/option";
import { toOption } from "./util";

class BasicElementMapper implements ElementMapper {
  toIntermediateMetadata(
    { url, name, data }: Input,
    base: Option<Input[]>
  ): IntermediateElement {
    const d = ((): IntermediateMetadata => {
      switch (data.type) {
        case "documentation":
          return {
            ...data,
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
          };
        case "code-quality":
          return {
            ...data,
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
          };
        case "test-coverage":
          return {
            ...data,
            delta: base
              .andThen(
                (x) =>
                  toOption(
                    x.find(
                      (b) => b.name === name && b.data.type === "test-coverage"
                    )?.data
                  ) as Option<TestCoverageMetadata>
              )
              .map((x) => ({
                branch: data.branch - x.branch,
                line: data.line - x.line,
                function: data.function - x.function,
                statement: data.statement - x.statement,
              })),
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

  inputToIntermediate(
    { sha, url, items, action }: HistoryEntry,
    base: Option<HistoryEntry>
  ): IntermediateEntry {
    return {
      url,
      sha,
      action,
      items: items.map((x) =>
        this.toIntermediateMetadata(
          x,
          base.map((b) => b.items)
        )
      ),
    };
  }

  toOutputMetadata({ url, name, data }: IntermediateElement): OutputElement {
    return {
      url,
      name,
      data: {
        ...data,
        result:
          data.resultDetails.fail.length > 0
            ? "fail"
            : data.resultDetails.warn.length > 0
            ? "warn"
            : "pass",
      },
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
