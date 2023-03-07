import {
  CodeQualityMetadata,
  DocumentMetadata,
  HistoryEntry,
  Input,
  TestCoverageMetadata,
  TestResultMetadata,
} from "./history";
import { Option } from "./core/option";

type PolicyResult = "pass" | "warn" | "fail";
type PolicyData = {
  pass: string[];
  warn: string[];
  fail: string[];
};

type CoverageDelta = {
  line: number;
  function: number;
  statement: number;
  branch: number;
};

type IntermediateTestResultMetadata = TestResultMetadata & {
  resultDetails: PolicyData;
};
type IntermediateTestCoverageMetadata = TestCoverageMetadata & {
  delta: Option<CoverageDelta>;
  resultDetails: PolicyData;
};

type IntermediateDocumentMetadata = DocumentMetadata & {
  resultDetails: PolicyData;
};
type IntermediateCodeQualityMetadata = CodeQualityMetadata & {
  resultDetails: PolicyData;
};

type IntermediateMetadata =
  | IntermediateDocumentMetadata
  | IntermediateCodeQualityMetadata
  | IntermediateTestResultMetadata
  | IntermediateTestCoverageMetadata;

type IntermediateElement = { data: IntermediateMetadata } & Input;

type IntermediateEntry = { items: IntermediateElement[] } & HistoryEntry;

type OutputMetadata = IntermediateMetadata & { result: PolicyResult };

type OutputElement = { data: OutputMetadata } & Input;

type OutputEntry = { items: OutputElement[] } & HistoryEntry;

interface Output {
  current: OutputEntry;
  history: OutputEntry[];
}

export type {
  IntermediateMetadata,
  IntermediateTestCoverageMetadata,
  IntermediateElement,
  IntermediateEntry,
  IntermediateTestResultMetadata,
  PolicyResult,
  PolicyData,
  TestCoverageMetadata,
  OutputEntry,
  OutputElement,
  OutputMetadata,
  Output,
};
