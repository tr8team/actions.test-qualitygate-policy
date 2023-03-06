import { PolicyConfig } from "../policy-config";
import { Policy } from "./policy";

interface PolicyFactory {
  generate(p: PolicyConfig): Policy;
}

export type { PolicyFactory };
