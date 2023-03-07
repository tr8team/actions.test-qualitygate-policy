import { chai, describe, it, should } from "vitest";
import { IntermediateEntry } from "../../../src/lib/output";
import { None, Some } from "../../../src/lib/core/option";
// @ts-ignore
import helper from "../../helper";
import { DeltaCoveragePolicy, DeltaCoveragePolicyConfig } from "../../../src/lib/policy/delta-coverage-policy";

should()

chai.use(helper)

describe("AnyDeltaCoveragePolicy", () => {

  describe("evaluate", () => {

    const config: DeltaCoveragePolicyConfig = {
      fail: 1,
      warn: 1.5,
      metric: "line",
      type: "delta-coverage-policy",

    }

    const policy = new DeltaCoveragePolicy(
      "Unit Test Coverage cannot drop by more than 1%",
      "Unit Test Coverage",
      config
    );

    it("should return the same object if the target is not found", async () => {

      const current: IntermediateEntry = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Integration Test Coverage",
            url: "sample-url",
            data: {
              type: "test-coverage",
              branch: 100,
              function: 100,
              line: 100,
              statement: 100,
              delta: Some({
                branch: -50,
                line: -50,
                function: -50,
                statement: -50,
              }),
              resultDetails: {
                fail: [],
                pass: [
                  "Sample Policy"
                ],
                warn: [
                  "Sample Policy"
                ],
              }
            }
          }
        ]
      };
      const expected = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Integration Test Coverage",
            url: "sample-url",
            data: {
              type: "test-coverage",
              branch: 100,
              function: 100,
              line: 100,
              statement: 100,
              delta: Some({
                branch: -50,
                line: -50,
                function: -50,
                statement: -50,
              }),
              resultDetails: {
                fail: [],
                pass: [
                  "Sample Policy"
                ],
                warn: [
                  "Sample Policy"
                ],
              }
            }
          }
        ]
      };

      // act
      const actual = await policy.evaluate(current);

      // assert
      await actual.should.be.congruent(expected);

    });

    it("should return the same object if the target is found but the type is not test-coverage",async function() {

      const current: IntermediateEntry = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Unit Test Coverage",
            url: "sample-url",
            data: {
              type: "test-result",
              skip: 0,
              fail: 0,
              pass: 0,
              resultDetails: {
                fail: [
                  "Sample Policy"
                ],
                pass: [],
                warn: [],
              }
            }
          }
        ]
      };
      const expected = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Unit Test Coverage",
            url: "sample-url",
            data: {
              type: "test-result",
              skip: 0,
              fail: 0,
              pass: 0,
              resultDetails: {
                fail: [
                  "Sample Policy"],
                pass: [],
                warn: [],
              }
            }
          }
        ]
      };

      // act
      const actual = await policy.evaluate(current);

      // assert
      actual.should.deep.equal(expected);

    });

    describe("pass cases", function() {

      it("should return with resultDetails pass increment by 1 if metric is higher", async function() {

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 80,
                function: 80,
                line: 99,
                statement: 72,
                delta: Some({
                  branch: -5,
                  function: -5,
                  line: 5,
                  statement: -5,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 80,
                function: 80,
                line: 99,
                statement: 72,
                delta: Some({
                  branch: -5,
                  function: -5,
                  line: 5,
                  statement: -5,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await policy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);


      });

      it("should return with resultDetails pass increment by 1 if maximum possible increase is lower than threshold", async function() {


        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 100,
                function: 100,
                line: 100,
                statement: 100,
                delta: Some({
                  branch: -3,
                  function: -5,
                  line: 0.5,
                  statement: -5,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 100,
                function: 100,
                line: 100,
                statement: 100,
                delta: Some({
                  branch: -3,
                  function: -5,
                  line: 0.5,
                  statement: -5,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await policy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });


      it("should return with resultDetails pass increment by 1 if delta is None", async function() {

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 15,
                function: 16,
                line: 7,
                statement: 80,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Unit Test Coverage cannot drop by more than 5%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 15,
                function: 16,
                line: 7,
                statement: 80,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Unit Test Coverage cannot drop by more than 5%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await policy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });

    })

    describe("target metric coverage is lower than warning threshold but higher than fail", () => {

      it("should return resultDetails warn increment by 1 if line coverage is lower than warning threshold but higher than fail", async function() {

        const lineConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "line",
          type: "delta-coverage-policy",
        }

        const linePolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          lineConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: -5,
                  function: -2,
                  line: 1.2,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: -5,
                  function: -2,
                  line: 1.2,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await linePolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);


      });

      it("should return resultDetails warn increment by 1 if statement coverage is lower than warning threshold but higher than fail", async function() {
        const sConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "statement",
          type: "delta-coverage-policy",
        }

        const sPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          sConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 70,
                delta: Some({
                  branch: -50,
                  function: -2,
                  line: 5,
                  statement: 1.2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 70,
                delta: Some({
                  branch: -50,
                  function: -2,
                  line: 5,
                  statement: 1.2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await sPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });

      it("should return resultDetails warn increment by 1 if function coverage is lower than warning threshold but higher than fail", async function() {
        const fConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "function",
          type: "delta-coverage-policy",
        }

        const fPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          fConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 5,
                  function: 1.2,
                  line: 1,
                  statement: -2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 5,
                  function: 1.2,
                  line: 1,
                  statement: -2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await fPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);
      });

      it("should return resultDetails warn increment by 1 if branch coverage is lower than warning threshold but higher than fail", async function() {
        const bConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "branch",
          type: "delta-coverage-policy",
        }

        const bPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          bConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 1.2,
                  function: -7,
                  line: 1,
                  statement: 2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 1.2,
                  function: -7,
                  line: 1,
                  statement: 2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await bPolicy.evaluate(current);

        return actual.should.be.congruent(expected);

      });

    });


    describe("any coverage is lower than fail threshold", function() {

      it("should return resultDetails fail increment by 1 if function coverage is lower than fail threshold", async function() {
        const lineConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "line",
          type: "delta-coverage-policy",
        }

        const linePolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          lineConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 5,
                  function: -2,
                  line: 0,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: 5,
                  function: -2,
                  line: 0,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await linePolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });

      it("should return resultDetails fail increment by 1 if line coverage is lower than fail threshold", async function() {
        const sConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "statement",
          type: "delta-coverage-policy",
        }

        const sPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          sConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 50,
                delta: Some({
                  branch: 5,
                  function: 2,
                  line: -2,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 50,
                delta: Some({
                  branch: 5,
                  function: 2,
                  line: -2,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await sPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });

      it("should return resultDetails fail increment by 1 if statement coverage is lower than fail threshold", async function() {
        const fConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "function",
          type: "delta-coverage-policy",
        }

        const fPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          fConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 70,
                delta: Some({
                  branch: 5,
                  function: -10,
                  line: 3,
                  statement: -2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 70,
                delta: Some({
                  branch: 5,
                  function: -10,
                  line: 3,
                  statement: -2,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await fPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);


      });

      it("should return resultDetails fail increment by 1 if branch coverage is lower than fail threshold", async function() {
        const bConfig: DeltaCoveragePolicyConfig = {
          fail: 1,
          warn: 1.5,
          metric: "branch",
          type: "delta-coverage-policy",
        }

        const bPolicy = new DeltaCoveragePolicy(
          "Unit Test Coverage cannot drop by more than 1%",
          "Unit Test Coverage",
          bConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: -2,
                  function: 2,
                  line: 5,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy"
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };
        const expected = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test Coverage",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 96,
                function: 99,
                line: 69,
                statement: 100,
                delta: Some({
                  branch: -2,
                  function: 2,
                  line: 5,
                  statement: 0,
                }),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Unit Test Coverage cannot drop by more than 1%",
                  ],
                  pass: [
                    "All Test Must Pass",
                    "Skipped test must be lower than 20%",
                  ],
                  warn: [
                    "Function coverage must be higher than 80%",
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await bPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });


    });


  });

});
