import {
  array,
  discriminatedUnion,
  literal,
  number,
  object,
  string,
  union,
  z,
} from "zod";

const anyCoveragePolicy = object({
  type: literal("any-coverage-policy"),
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const anyDeltaCoveragePolicy = object({
  type: literal("any-delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
})
  .required()
  .strict();

const allCoveragePolicy = object({
  type: literal("all-coverage-policy"),
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const allDeltaCoveragePolicy = object({
  type: literal("all-delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
})
  .required()
  .strict();

const averageCoveragePolicy = object({
  type: literal("average-coverage-policy"),
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const averageDeltaCoveragePolicy = object({
  type: literal("average-delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
})
  .required()
  .strict();

const coverageMetric = union([
  literal("line"),
  literal("function"),
  literal("branch"),
  literal("statement"),
]);

const deltaCoveragePolicy = object({
  type: literal("delta-coverage-policy"),
  warn: number().min(-100).max(100),
  fail: number().min(-100).max(100),
  metric: coverageMetric,
})
  .required()
  .strict();

const minCoveragePolicy = object({
  type: literal("min-coverage-policy"),
  metric: coverageMetric,
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const testMetric = union([literal("pass"), literal("fail"), literal("skip")]);

const maxLiteralTestPolicy = object({
  type: literal("max-literal-test-policy"),
  metric: testMetric,
  warn: number().min(0),
  fail: number().min(0),
})
  .required()
  .strict();

const minLiteralTestPolicy = object({
  type: literal("min-literal-test-policy"),
  metric: testMetric,
  warn: number().min(0),
  fail: number().min(0),
})
  .required()
  .strict();

const maxPercentageTestPolicy = object({
  type: literal("max-percentage-test-policy"),
  metric: testMetric,
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const minPercentageTestPolicy = object({
  type: literal("min-percentage-test-policy"),
  metric: testMetric,
  warn: number().min(0).max(100),
  fail: number().min(0).max(100),
})
  .required()
  .strict();

const policyTypes = discriminatedUnion("type", [
  anyCoveragePolicy,
  anyDeltaCoveragePolicy,
  allCoveragePolicy,
  allDeltaCoveragePolicy,
  averageCoveragePolicy,
  averageDeltaCoveragePolicy,
  deltaCoveragePolicy,
  minCoveragePolicy,
  maxLiteralTestPolicy,
  minLiteralTestPolicy,
  maxPercentageTestPolicy,
  minPercentageTestPolicy,
]);

const policy = object({
  name: string(),
  target: string(),
  data: policyTypes,
})
  .required()
  .strict();

const policies = array(policy);

type Policy = z.infer<typeof policy>;
type Policies = z.infer<typeof policies>;

export { policy, policies };

export type { Policy, Policies };
