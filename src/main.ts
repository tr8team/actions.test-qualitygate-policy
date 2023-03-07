import { GithubActionIO } from "./external/github-action-i-o";
import { GithubActionLogger } from "./external/github-action-logger";
import { IoInputRetriever } from "./lib/adapters/io-input-retriever";
import { ZodValidatorAdapter } from "./lib/adapters/zod-validator-adapter";
import { Validator } from "./lib/interface/validator";
import { historyEntry, HistoryEntry, History, history } from "./lib/history";
import { policyConfigs, PolicyConfigs } from "./lib/policy-config";
import { BasicElementMapper } from "./lib/basic-element-mapper";
import { BasicPolicyEngine } from "./lib/basic-policy-engine";
import { BasicPolicyFactory } from "./lib/basic-policy-factory";
import { BasicQualityGateService } from "./lib/service";
import { App } from "./lib/main";
import os from "os";
import { toOption } from "./lib/util";

const io = new GithubActionIO();
const logger = new GithubActionLogger();
const historyEntryValidator: Validator<HistoryEntry> = new ZodValidatorAdapter(
  historyEntry
);
const historyValidator: Validator<History> = new ZodValidatorAdapter(history);
const policyConfigValidator: Validator<PolicyConfigs> = new ZodValidatorAdapter(
  policyConfigs
);
const input = new IoInputRetriever(
  io,
  historyEntryValidator,
  historyValidator,
  policyConfigValidator
);
const mapper = new BasicElementMapper();
const policyEngine = new BasicPolicyEngine(mapper);
const policyFactory = new BasicPolicyFactory();

const service = new BasicQualityGateService(
  policyFactory,
  policyEngine,
  io,
  logger
);

const app = new App(input, service, io);

await app.run().match({
  none: () => {
    logger.info("✅ Successfully tracked commit artifact metadata");
  },
  some: async (err) => {
    logger.error("❌ Failed to execute quality gate");
    io.setFail(err);
    const messages = await toOption<string>(err?.stack).match({
      none: ["❌ No stacktrace found!"],
      some: (stacktrace) => stacktrace.split(os.EOL),
    });
    for (const m of messages) {
      logger.error(m);
    }
  },
});
