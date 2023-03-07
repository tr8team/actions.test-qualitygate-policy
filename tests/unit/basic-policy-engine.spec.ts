import { describe, expect, it, should, chai } from "vitest";
import { HistoryEntry } from "../../src/lib/history";
import { IntermediateEntry, OutputEntry } from "../../src/lib/output";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { ElementMapper } from "../../src/lib/interface/mapper";
import { Policy } from "../../src/lib/interface/policy";
import { BasicPolicyEngine } from "../../src/lib/basic-policy-engine";
import { Some } from "../../src/lib/core/option";
// @ts-ignore
import helper from "../helper";
import chaiAsPromised from "chai-as-promised";
should();
chai.use(chaiAsPromised);
chai.use(helper)


describe("Basic Policy Engine", () => {

  describe("evaluate", () => {

    it("should return an output entry", async () => {

      // dummy base History Entry
      const base: HistoryEntry = {
        sha: "base",
        url: "https://sample.com",
        action: "random.com",
        items: []
      }

      // dummy current History Entry
      const current: HistoryEntry = {
        sha: "current1",
        url: "https://sample.com",
        action: "random.com",
        items: [],
      }

      const start: IntermediateEntry =
        {
          sha: "current1",
          url: "https://sample.com",
          action: "random.com",
          items: [
            {
              url: "lol.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%"
                  ]
                }
              },
              name: "hello1"

            }
          ],
        }

      const int1: IntermediateEntry =
        {
          sha: "current2",
          url: "https://sample2.com",
          action: "random2.com",
          items: [
            {
              url: "lol2.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%2"
                  ]
                }
              },
              name: "hello2"

            }
          ],
        }

      const int2: IntermediateEntry =
        {
          sha: "current3",
          url: "https://sample3.com",
          action: "random3.com",
          items: [
            {
              url: "lol3.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%3"
                  ]
                }
              },
              name: "hello3"
            }
          ],
        }

      const output: OutputEntry =
        {
          sha: "output",
          url: "https://output.com",
          action: "random.output",
          items: [
            {
              url: "out.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%3"
                  ]
                },
                result: "pass",
              },
              name: "output"
            }
          ],
        }

      const expected = {
        base: {
          sha: "base",
          url: "https://sample.com",
          action: "random.com",
          items: []
        },
        input: {
          sha: "current1",
          url: "https://sample.com",
          action: "random.com",
          items: [],
        },
        start: {
          sha: "current1",
          url: "https://sample.com",
          action: "random.com",
          items: [
            {
              url: "lol.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%"
                  ]
                }
              },
              name: "hello1"

            }
          ],
        },
        int1: {
          sha: "current2",
          url: "https://sample2.com",
          action: "random2.com",
          items: [
            {
              url: "lol2.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%2"
                  ]
                }
              },
              name: "hello2"

            }
          ],
        },
        int2:  {
          sha: "current3",
          url: "https://sample3.com",
          action: "random3.com",
          items: [
            {
              url: "lol3.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%3"
                  ]
                }
              },
              name: "hello3"

            }
          ],
        },
        output: {
          sha: "output",
          url: "https://output.com",
          action: "random.output",
          items: [
            {
              url: "out.com",
              data: {
                type: "test-result",
                pass: 20,
                fail: 0,
                skip: 5,
                resultDetails: {
                  fail: [],
                  warn: [],
                  pass: [
                    "Test Coverage at least 80%3"
                  ]
                },
                result: "pass",
              },
              name: "output"
            }
          ],
        },
      }

        // start mocking
      const mapperMock = mock<ElementMapper>();
      const policy1Mock = mock<Policy>();
      const policy2Mock = mock<Policy>();

      const spyState: Partial<{
        mapperToIntArg1: HistoryEntry,
        mapperToIntArg2: HistoryEntry,
        policy1: IntermediateEntry,
        policy2: IntermediateEntry,
        mapperToOutput: IntermediateEntry,
      }> = {}

      when(mapperMock.inputToIntermediate(anything(), anything()))
        .thenCall((a,b) => {
          spyState.mapperToIntArg1 = a;
          spyState.mapperToIntArg2 = b;
          return start;
        });

      when(policy1Mock.evaluate(anything()))
        .thenCall((a) => {
          spyState.policy1 = a;
          return Promise.resolve(int1);
        });
      when(policy2Mock.evaluate(anything()))
        .thenCall((a) => {
          spyState.policy2 = a;
          return Promise.resolve(int2);
        });
      when(mapperMock.intermediateToOutput(anything()))
        .thenCall((a) => {
          spyState.mapperToOutput = a;
          return output;
        });

      const mapper = instance(mapperMock);
      const policy1 = instance(policy1Mock);
      const policy2 = instance(policy2Mock);

      const engine = new BasicPolicyEngine(mapper);

      // act
      const result = await engine.evaluate([policy1, policy2], current,Some(base));

      verify(mapperMock.inputToIntermediate(anything(), anything())).once();
      verify(policy1Mock.evaluate(anything())).once();
      verify(policy2Mock.evaluate(anything())).once();
      verify(mapperMock.intermediateToOutput(anything())).once();

      result.should.deep.equal(expected.output);
      expect(spyState.mapperToOutput).to.not.be.undefined;
      expect(spyState.mapperToIntArg1).to.not.be.undefined;
      expect(spyState.mapperToIntArg2).to.not.be.undefined;
      expect(spyState.policy1).to.not.be.undefined;
      expect(spyState.policy2).to.not.be.undefined;

      spyState.mapperToIntArg1?.should.deep.equal(expected.input);
      await spyState.mapperToIntArg2?.should.be.congruent(Some(expected.base));
      spyState.policy1?.should.deep.equal(expected.start);
      spyState.policy2?.should.deep.equal(expected.int1);
      spyState.mapperToOutput?.should.deep.equal(expected.int2);



    });

  });

});
