import { literal, union } from "zod";

const coverageMetric = union([
  literal("line"),
  literal("function"),
  literal("branch"),
  literal("statement"),
]);
const testMetric = union([literal("pass"), literal("fail"), literal("skip")]);

export { coverageMetric, testMetric };
