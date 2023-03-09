import { chai, describe, it, should } from "vitest";
// @ts-ignore
import helper from "../../helper";
import { ActionInput, InputRetriever } from "../../../src/lib/interface/input-retriever";
import { Err, Ok, Result } from "../../../src/lib/core/result";
import { History, HistoryEntry } from "../../../src/lib/history";
import { None, Option, Some } from "../../../src/lib/core/option";
import { PolicyConfigs } from "../../../src/lib/policy-config";
import { anything, instance, mock, when } from "ts-mockito";
import { ActionIO } from "../../../src/lib/interface/io";
import { Validator } from "../../../src/lib/interface/validator";
import { IoInputRetriever } from "../../../src/lib/adapters/io-input-retriever";

should();
chai.use(helper);


function buildMock(
  current: Result<HistoryEntry, Error>,
  base: Result<Option<HistoryEntry>, Error>,
  history: Result<Option<History>, Error>,
  policies: Result<PolicyConfigs,Error>,
): InputRetriever {
  const ioMock = mock<ActionIO>();
  const hevMock = mock<Validator<HistoryEntry>>();
  const hvMock = mock<Validator<History>>();
  const pcvMock = mock<Validator<PolicyConfigs>>()
  when(ioMock.getObject("current", anything())).thenReturn(current);
  when(ioMock.getOptionalObject("base", anything())).thenReturn(base);
  when(ioMock.getOptionalObject("history", anything())).thenReturn(history);
  when(ioMock.getObject("policies", anything())).thenReturn(policies);

  const io = instance(ioMock);
  const hev = instance(hevMock);
  const hv = instance(hvMock);
  const pvc = instance(pcvMock);

  return new IoInputRetriever(io, hev, hv, pvc);

}

describe("io-input-retriever", () => {

  describe("retrieve", () => {

    it("should succeed if all dependency succeeds", async function() {
      const subj = buildMock(
        Ok({
          items: [],
          url: "http://1234",
          sha: "sha",
          action: "hello"
        }),
        Ok(None()),
        Ok(Some([] as History)),
        Ok([] as PolicyConfigs)
      )
      const expected: ActionInput = {
        current: {
          items: [],
          url: "http://1234",
          sha: "sha",
          action: "hello"
        },
        base: None(),
        history: [],
        policies: [],
      }
      // act
      const act = subj.retrieve();

      // assert
      await act.should.be.okOf(expected)
    });

    it("should fail if current is invalid", async function() {
      const subj = buildMock(
        Err(new Error("current invalid")),

        Ok(None()),
        Ok(Some([] as History)),
        Ok([] as PolicyConfigs)
      )
      const expected= "current invalid";

      // act
      const act = subj.retrieve();

      // assert
      await act.should.have.errErrorMessage(expected);
    });

    it("should fail if base is invalid", async function() {
      const subj = buildMock(
        Ok({
          items: [],
          url: "http://1234",
          sha: "sha",
          action: "hello"
        }),
        Err(new Error("base invalid")),
        Ok(Some([] as History)),
        Ok([] as PolicyConfigs)
      )
      const expected= "base invalid";

      // act
      const act = subj.retrieve();

      // assert
      await act.should.have.errErrorMessage(expected);
    });

    it("should fail if history is invalid", async function() {
      const subj = buildMock(
        Ok({
          items: [],
          url: "http://1234",
          sha: "sha",
          action: "hello"
        }),
        Ok(None()),
        Err(new Error("history invalid")),
        Ok([] as PolicyConfigs)
      )
      const expected= "history invalid";

      // act
      const act = subj.retrieve();

      // assert
      await act.should.have.errErrorMessage(expected);
    });

    it("should fail if policies is invalid", async function() {
      const subj = buildMock(
        Ok({
          items: [],
          url: "http://1234",
          sha: "sha",
          action: "hello"
        }),
        Ok(None()),
        Ok(None()),
        Err(new Error("policies invalid")),
      )
      const expected= "policies invalid";

      // act
      const act = subj.retrieve();

      // assert
      await act.should.have.errErrorMessage(expected);
    });

  });

});
