import {
  HistoryEntry,
  Input,
  Metadata,
  TestCoverageMetadata,
  TestResultMetadata,
} from "./history";

type PolicyResult = "pass" | "warn" | "fail";
type PolicyData = {
  pass: string[];
  warn: string[];
  fail: string[];
};

type IntermediateTestResultMetadata = TestResultMetadata & {
  resultDetails: PolicyData;
};
type IntermediateTestCoverageMetadata = TestCoverageMetadata & {
  resultDetails: PolicyData;
};

type IntermediateMetadata =
  | Exclude<Metadata, TestResultMetadata | TestCoverageMetadata>
  | IntermediateTestResultMetadata
  | IntermediateTestCoverageMetadata;

type IntermediateElement = { data: IntermediateMetadata } & Input;

type IntermediateEntry = { items: IntermediateElement[] } & HistoryEntry;

type OutputTestResultMetadata = IntermediateTestResultMetadata & {
  result: PolicyResult;
};
type OutputTestCoverageMetadata = IntermediateTestCoverageMetadata & {
  result: PolicyResult;
};

type OutputMetadata =
  | Exclude<Metadata, TestResultMetadata | TestCoverageMetadata>
  | OutputTestCoverageMetadata
  | OutputTestResultMetadata;

type OutputElement = { data: OutputMetadata } & Input;

type OutputEntry = { items: OutputElement[] } & HistoryEntry;

export type {
  IntermediateMetadata,
  IntermediateTestCoverageMetadata,
  IntermediateElement,
  IntermediateEntry,
  IntermediateTestResultMetadata,
  PolicyResult,
  PolicyData,
  OutputTestCoverageMetadata,
  TestCoverageMetadata,
  OutputEntry,
  OutputElement,
  OutputMetadata,
};
