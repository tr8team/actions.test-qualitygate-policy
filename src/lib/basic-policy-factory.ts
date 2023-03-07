import { PolicyFactory } from "./interface/policy-factory";
import { PolicyConfig } from "./policy-config";
import { Policy } from "./interface/policy";
import { AnyCoveragePolicy } from "./policy/any-coverage-policy";
import { AnyDeltaCoveragePolicy } from "./policy/any-delta-coverage-policy";
import { DeltaCoveragePolicy } from "./policy/delta-coverage-policy";
import { MinCoveragePolicy } from "./policy/min-coverage-policy";
import { MaxLiteralTestPolicy } from "./policy/max-literal-test-policy";
import { MinLiteralTestPolicy } from "./policy/min-literal-test-policy";
import { MaxPercentageTestPolicy } from "./policy/max-percentage-test-policy";
import { MinPercentageTestPolicy } from "./policy/min-percentage-test-policy";

class BasicPolicyFactory implements PolicyFactory {
  generate({ name, target, data }: PolicyConfig): Policy {
    switch (data.type) {
      case "any-coverage-policy":
        return new AnyCoveragePolicy(name, target, data);
      case "any-delta-coverage-policy":
        return new AnyDeltaCoveragePolicy(name, target, data);
      case "delta-coverage-policy":
        return new DeltaCoveragePolicy(name, target, data);
      case "min-coverage-policy":
        return new MinCoveragePolicy(name, target, data);
      case "max-literal-test-policy":
        return new MaxLiteralTestPolicy(name, target, data);
      case "min-literal-test-policy":
        return new MinLiteralTestPolicy(name, target, data);
      case "max-percentage-test-policy":
        return new MaxPercentageTestPolicy(name, target, data);
      case "min-percentage-test-policy":
        return new MinPercentageTestPolicy(name, target, data);
      default:
        throw new Error(`Unknown policy type: ${(data as any).type}`);
    }
  }
}

export { BasicPolicyFactory };
