import { chai, describe, it, should } from "vitest";
import { IntermediateEntry } from "../../../src/lib/output";
import { None, Some } from "../../../src/lib/core/option";

// @ts-ignore
import helper from "../../helper.js";
import { MinCoveragePolicy, MinCoveragePolicyConfig } from "../../../src/lib/policy/min-coverage-policy";

should();

chai.use(helper);

describe("MinCoveragePolicy", () => {

  describe("evaluate", () => {

    const config: MinCoveragePolicyConfig = {
      fail: 60,
      warn: 80,
      metric: "line",
      type: "min-coverage-policy",
    }

    const policy = new MinCoveragePolicy(
      "No unit test coverage under 60%",
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

    it("should return with resultDetails pass increment by 1 if all coverage is higher than warning threshold", async function() {

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
              branch: 5,
              function: 8,
              line: 80,
              statement: 10,
              delta: None(),
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
              branch: 5,
              function: 8,
              line: 80,
              statement: 10,
              delta: None(),
              resultDetails: {
                fail: [
                  "Sample Policy"
                ],
                pass: [
                  "All Test Must Pass",
                  "Skipped test must be lower than 20%",
                  "No unit test coverage under 60%"
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

    describe("any coverage is lower than warning threshold but higher than fail", () => {

      it("should return resultDetails warn increment by 1 if line coverage is lower than warning threshold but higher than fail", async function() {

        const lConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "line",
          type: "min-coverage-policy",
        }

        const lPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
          "Unit Test Coverage",
          lConfig
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
                function: 20,
                line: 69,
                statement: 50,
                delta: None(),
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
                function: 20,
                line: 69,
                statement: 50,
                delta: None(),
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
                    "No unit test coverage under 60%"
                  ],
                }
              }
            }
          ]
        };

        // act
        const actual = await lPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);


      });

      it("should return resultDetails warn increment by 1 if statement coverage is lower than warning threshold but higher than fail", async function() {
        const sConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "statement",
          type: "min-coverage-policy",
        }

        const sPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 36,
                function: 58,
                line: 29,
                statement: 69,
                delta: None(),
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
                branch: 36,
                function: 58,
                line: 29,
                statement: 69,
                delta: None(),
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
                    "No unit test coverage under 60%"
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


        const fConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "function",
          type: "min-coverage-policy",
        }

        const fPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 26,
                function: 69,
                line: 93,
                statement: 30,
                delta: None(),
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
                branch: 26,
                function: 69,
                line: 93,
                statement: 30,
                delta: None(),
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
                    "No unit test coverage under 60%"
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

        const bConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "branch",
          type: "min-coverage-policy",
        }

        const bPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 60,
                function: 29,
                line: 39,
                statement: 10,
                delta: None(),
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
                branch: 60,
                function: 29,
                line: 39,
                statement: 10,
                delta: None(),
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
                    "No unit test coverage under 60%"
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

      it("should return resultDetails fail increment by 1 if line coverage is lower than fail threshold", async function() {
        const lConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "line",
          type: "min-coverage-policy",
        }

        const lPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
          "Unit Test Coverage",
          lConfig
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
                branch: 56,
                function: 59,
                line: 29,
                statement: 80,
                delta: None(),
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
                branch: 56,
                function: 59,
                line: 29,
                statement: 80,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "No unit test coverage under 60%"
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
        const actual = await lPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);

      });

      it("should return resultDetails fail increment by 1 if statement coverage is lower than fail threshold", async function() {
        const sConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "statement",
          type: "min-coverage-policy",
        }

        const sPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 26,
                function: 20,
                line: 59,
                statement: 59,
                delta: None(),
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
                branch: 26,
                function: 20,
                line: 59,
                statement: 59,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "No unit test coverage under 60%"
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

      it("should return resultDetails fail increment by 1 if function coverage is lower than fail threshold", async function() {
        const fConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "function",
          type: "min-coverage-policy",
        }

        const fPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 60,
                function: 6,
                line: 50,
                statement: 59,
                delta: None(),
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
                branch: 60,
                function: 6,
                line: 50,
                statement: 59,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "No unit test coverage under 60%"
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
        const bConfig: MinCoveragePolicyConfig = {
          fail: 60,
          warn: 80,
          metric: "branch",
          type: "min-coverage-policy",
        }

        const bPolicy = new MinCoveragePolicy(
          "No unit test coverage under 60%",
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
                branch: 46,
                function: 20,
                line: 5,
                statement: 9,
                delta: None(),
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
                branch: 46,
                function: 20,
                line: 5,
                statement: 9,
                delta: None(),
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "No unit test coverage under 60%"
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
