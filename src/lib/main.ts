import { Option } from "./core/option";
import { InputRetriever } from "./interface/input-retriever";
import { QualityGateService } from "./service";
import { ActionIO } from "./interface/io";

class App {
  readonly #input: InputRetriever;
  readonly #service: QualityGateService;

  readonly #io: ActionIO;

  run(): Option<Error> {
    return this.#input
      .retrieve()
      .map((input) => this.#service.audit(input))
      .run((output) => {
        this.#io.setObject("current", output.current);
        this.#io.setObject("history", output.history);
      })
      .err();
  }

  constructor(
    input: InputRetriever,
    service: QualityGateService,
    io: ActionIO
  ) {
    this.#input = input;
    this.#service = service;
    this.#io = io;
  }
}

export { App };
