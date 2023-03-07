import { array, discriminatedUnion, object, string, z } from "zod";
import { anyCoveragePolicy } from "./policy/any-coverage-policy";
import { anyDeltaCoveragePolicy } from "./policy/any-delta-coverage-policy";
import { deltaCoveragePolicy } from "./policy/delta-coverage-policy";
import { minCoveragePolicy } from "./policy/min-coverage-policy";
import { maxLiteralTestPolicy } from "./policy/max-literal-test-policy";
import { minLiteralTestPolicy } from "./policy/min-literal-test-policy";
import { maxPercentageTestPolicy } from "./policy/max-percentage-test-policy";
import { minPercentageTestPolicy } from "./policy/min-percentage-test-policy";

// TODO: future implementations
// const averageCoveragePolicy = object({
//   type: literal("average-coverage-policy"),
//   warn: number().min(0).max(100),
//   fail: number().min(0).max(100),
// })
//   .required()
//   .strict();
//
// const averageDeltaCoveragePolicy = object({
//   type: literal("average-delta-coverage-policy"),
//   warn: number().min(-100).max(100),
//   fail: number().min(-100).max(100),
// })
//   .required()
//   .strict();

const policyTypes = discriminatedUnion("type", [
  anyCoveragePolicy,
  anyDeltaCoveragePolicy,
  deltaCoveragePolicy,
  minCoveragePolicy,
  maxLiteralTestPolicy,
  minLiteralTestPolicy,
  maxPercentageTestPolicy,
  minPercentageTestPolicy,
]);

const policyConfig = object({
  name: string(),
  target: string(),
  data: policyTypes,
})
  .required()
  .strict();

const policyConfigs = array(policyConfig);

type PolicyConfig = z.infer<typeof policyConfig>;
type PolicyConfigs = z.infer<typeof policyConfigs>;

export { policyConfig, policyConfigs };
export type { PolicyConfigs, PolicyConfig };
