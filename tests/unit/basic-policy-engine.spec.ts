import { describe, expect, it, should } from "vitest";
import { HistoryEntry } from "../../src/lib/history";
import { IntermediateEntry, OutputEntry } from "../../src/lib/output";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { ElementMapper } from "../../src/lib/interface/mapper";
import { Policy } from "../../src/lib/interface/policy";
import { BasicPolicyEngine } from "../../src/lib/basic-policy-engine";

should();

describe("Basic Policy Engine", () => {

  describe("evaluate", () => {

    it("should return an output entry", () => {

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
        mapperToInt: HistoryEntry
        policy1Arg1: IntermediateEntry,
        policy1Arg2: HistoryEntry,
        policy2Arg1: IntermediateEntry,
        policy2Arg2: HistoryEntry,
        mapperToOutput: IntermediateEntry,
      }> = {}

      when(mapperMock.inputToIntermediate(anything()))
        .thenCall((a) => {
          spyState.mapperToInt = a;
          return start;
        });

      when(policy1Mock.evaluate(anything(), anything()))
        .thenCall((a, b) => {
          spyState.policy1Arg1 = a;
          spyState.policy1Arg2 = b;
          return int1;
        });
      when(policy2Mock.evaluate(anything(), anything()))
        .thenCall((a, b) => {
          spyState.policy2Arg1 = a;
          spyState.policy2Arg2 = b;
          return int2;
        });
      when(mapperMock.intermediateToOutput(anything()))
        .thenCall((a) => {
          spyState.mapperToOutput = a;
          return output;
        });

      const mapper = instance(mapperMock);
      const policy1 = instance(policy1Mock);
      const policy2 = instance(policy2Mock);

      const engine = new BasicPolicyEngine([policy1, policy2], mapper);

      // act
      const result = engine.evaluate(current,base);

      result.should.deep.equal(expected.output);
      expect(spyState.mapperToOutput).to.not.be.undefined;
      expect(spyState.mapperToInt).to.not.be.undefined;
      expect(spyState.policy1Arg1).to.not.be.undefined;
      expect(spyState.policy1Arg2).to.not.be.undefined;
      expect(spyState.policy2Arg1).to.not.be.undefined;
      expect(spyState.policy2Arg2).to.not.be.undefined;

      spyState.mapperToInt?.should.deep.equal(expected.input);
      spyState.policy1Arg1?.should.deep.equal(expected.start);
      spyState.policy1Arg2?.should.deep.equal(expected.base);
      spyState.policy2Arg1?.should.deep.equal(expected.int1);
      spyState.policy2Arg2?.should.deep.equal(expected.base);
      spyState.mapperToOutput?.should.deep.equal(expected.int2);

      verify(mapperMock.inputToIntermediate(anything())).once();
      verify(policy1Mock.evaluate(anything(), anything())).once();
      verify(policy2Mock.evaluate(anything(), anything())).once();
      verify(mapperMock.intermediateToOutput(anything())).once();

    });

  });

});
