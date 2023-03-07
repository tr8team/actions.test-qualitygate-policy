import { chai, describe, it, should } from "vitest";
import { IntermediateEntry } from "../../../src/lib/output";
import { None, Some } from "../../../src/lib/core/option";

// @ts-ignore
import helper from "../../helper.js";
import { MinLiteralTestPolicy, MinLiteralTestPolicyConfig } from "../../../src/lib/policy/min-literal-test-policy";

should();

chai.use(helper);

describe("MinLiteralTestPolicy", () => {

  describe("evaluate", () => {

    const config: MinLiteralTestPolicyConfig = {
      fail: 5,
      warn: 10,
      metric: "pass",
      type: "min-literal-test-policy",
    }

    const policy = new MinLiteralTestPolicy(
      "At least 5 passed test",
      "Unit Test",
      config
    );


    it("should return the same object if the target is not found", async () => {

      const current: IntermediateEntry = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Integration Test",
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
            name: "Integration Test",
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 5,
                statement: 10,
                function: 15,
                line: 20,
                delta: None(),
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-coverage",
                branch: 5,
                statement: 10,
                function: 15,
                line: 20,
                delta: None(),
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
        return actual.should.be.congruent(expected);

    });

    it("should return with resultDetails pass increment by 1 if test is below warn threshold", async function() {

      const current: IntermediateEntry = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Unit Test",
            url: "sample-url",
            data: {
              type: "test-result",
              skip: 3,
              pass: 100,
              fail: 0,
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
            name: "Unit Test",
            url: "sample-url",
            data: {
              type: "test-result",
              skip: 3,
              pass: 100,
              fail: 0,
              resultDetails: {
                fail: [
                  "Sample Policy"
                ],
                pass: [
                  "All Test Must Pass",
                  "Skipped test must be lower than 20%",
                  "At least 5 passed test",
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

    describe("test metric is lower than warning threshold but higher than fail", () => {

      it("should return resultDetails warn increment by 1 if skip is higher than warning threshold but lower than fail", async function() {

        const sConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "skip",
          type: "min-literal-test-policy",
        }

        const sPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          sConfig
        );


        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 0,
                skip: 8,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 0,
                skip: 8,
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
                    "Random Name",
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

      it("should return resultDetails warn increment by 1 if fail is higher than warning threshold but lower than fail", async function() {
        const fConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "fail",
          type: "min-literal-test-policy",
        }

        const fPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          fConfig
        );

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 8,
                skip: 0,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 8,
                skip: 0,
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
                    "Random Name",
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

      it("should return resultDetails warn increment by 1 if pass is higher than warning threshold but lower than fail", async function() {


        const pConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "pass",
          type: "min-literal-test-policy",
        }

        const pPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          pConfig
        );

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 8,
                fail: 0,
                skip: 0,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 8,
                fail: 0,
                skip: 0,
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
                    "Random Name",
                  ],
                }
              }
            }
          ]
        };
        // act
        const actual = await pPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);
      });


    });


    describe("test metric is lower than fail threshold", function() {

      it("should return resultDetails fail increment by 1 if skip is higher than fail threshold", async function() {
        const sConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "skip",
          type: "min-literal-test-policy",
        }

        const sPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          sConfig
        );
        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 0,
                skip: 2,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 0,
                skip: 2,
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Random Name",
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

      it("should return resultDetails fail increment by 1 if fail is higher than fail threshold", async function() {
        const fConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "skip",
          type: "min-literal-test-policy",
        }

        const fPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          fConfig
        );

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 3,
                skip: 3,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 0,
                fail: 3,
                skip: 3,
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Random Name",
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

      it("should return resultDetails fail increment by 1 if pass is higher than fail threshold", async function() {
        const pConfig: MinLiteralTestPolicyConfig = {
          fail: 5,
          warn: 10,
          metric: "skip",
          type: "min-literal-test-policy",
        }

        const pPolicy = new MinLiteralTestPolicy(
          "Random Name",
          "Unit Test",
          pConfig
        );

        const current: IntermediateEntry = {
          sha: "random-sha",
          url: "random-url",
          action: "action",
          items: [
            {
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 1,
                fail: 0,
                skip: 0,
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
              name: "Unit Test",
              url: "sample-url",
              data: {
                type: "test-result",
                pass: 1,
                fail: 0,
                skip: 0,
                resultDetails: {
                  fail: [
                    "Sample Policy",
                    "Random Name",
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
        const actual = await pPolicy.evaluate(current);

        // assert
        return actual.should.be.congruent(expected);


      });


    });

  });

});
