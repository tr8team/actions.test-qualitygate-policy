import { describe, it, should } from "vitest";
import { SafeParseError, SafeParseSuccess } from "zod";
import { policyConfig, PolicyConfig } from "../../src/lib/policy-config";

should();

describe("input validator", () => {
  describe("valid objects", () => {
    const theory: { subject: any; expected: PolicyConfig }[] = [
      {
        subject: {
          name: "No Fail Test",
          target: "Unit Test Reporter",
          data: {
            type: "max-literal-test-policy",
            metric: "fail",
            warn: 0,
            fail: 0
          }
        },
        expected: {
          name: "No Fail Test",
          target: "Unit Test Reporter",
          data: {
            type: "max-literal-test-policy",
            metric: "fail",
            warn: 0,
            fail: 0
          }
        }
      },
      {
        subject: {
          name: "A least 1 test pass",
          target: "Integration TEst Report",
          data: {
            type: "min-literal-test-policy",
            metric: "pass",
            warn: 5,
            fail: 1
          }
        },
        expected: {
          name: "A least 1 test pass",
          target: "Integration TEst Report",
          data: {
            type: "min-literal-test-policy",
            metric: "pass",
            warn: 5,
            fail: 1
          }
        }
      },
      {
        subject: {
          name: "A least 80% test pass",
          target: "Int Test Report",
          data: {
            type: "min-percentage-test-policy",
            metric: "pass",
            warn: 90,
            fail: 80
          }
        },
        expected: {
          name: "A least 80% test pass",
          target: "Int Test Report",
          data: {
            type: "min-percentage-test-policy",
            metric: "pass",
            warn: 90,
            fail: 80
          }
        }
      },
      {
        subject: {
          name: "At most 10% skip",
          target: "Unit Report",
          data: {
            type: "max-percentage-test-policy",
            metric: "skip",
            warn: 5,
            fail: 10
          }
        },
        expected: {
          name: "At most 10% skip",
          target: "Unit Report",
          data: {
            type: "max-percentage-test-policy",
            metric: "skip",
            warn: 5,
            fail: 10
          }
        }
      },
      {
        subject: {
          name: "At least 50% line coverage",
          target: "Unit Coverage Report",
          data: {
            type: "min-coverage-policy",
            metric: "line",
            warn: 60,
            fail: 50
          }
        },
        expected: {
          name: "At least 50% line coverage",
          target: "Unit Coverage Report",
          data: {
            type: "min-coverage-policy",
            metric: "line",
            warn: 60,
            fail: 50
          }
        }
      },
      {
        subject: {
          name: "All coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "any-coverage-policy",
            warn: 60,
            fail: 50
          }
        },
        expected: {
          name: "All coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "any-coverage-policy",
            warn: 60,
            fail: 50
          }
        }
      },
      {
        subject: {
          name: "Any coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "all-coverage-policy",
            warn: 60,
            fail: 50
          }
        },
        expected: {
          name: "Any coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "all-coverage-policy",
            warn: 60,
            fail: 50
          }
        }
      },
      {
        subject: {
          name: "Average coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "average-coverage-policy",
            warn: 60,
            fail: 50
          }
        },
        expected: {
          name: "Average coverage must be above 50",
          target: "Unit Coverage Report",
          data: {
            type: "average-coverage-policy",
            warn: 60,
            fail: 50
          }
        }
      },
      {
        subject: {
          name: "Branch coverage must not drop by more than 10%",
          target: "Integration Coverage Report",
          data: {
            type: "delta-coverage-policy",
            metric: "line",
            warn: -5,
            fail: -10
          }
        },
        expected: {
          name: "Branch coverage must not drop by more than 10%",
          target: "Integration Coverage Report",
          data: {
            type: "delta-coverage-policy",
            metric: "line",
            warn: -5,
            fail: -10
          }
        }
      },
      {
        subject: {
          name: "All coverage must increase by 1%",
          target: "Unit Coverage Report",
          data: {
            type: "any-delta-coverage-policy",
            warn: 2,
            fail: 1
          }
        },
        expected: {
          name: "All coverage must increase by 1%",
          target: "Unit Coverage Report",
          data: {
            type: "any-delta-coverage-policy",
            warn: 2,
            fail: 1
          }
        }
      },
      {
        subject: {
          name: "Any coverage must increase by 5%",
          target: "Unit Coverage Report",
          data: {
            type: "all-delta-coverage-policy",
            warn: 10,
            fail: 5
          }
        },
        expected: {
          name: "Any coverage must increase by 5%",
          target: "Unit Coverage Report",
          data: {
            type: "all-delta-coverage-policy",
            warn: 10,
            fail: 5
          }
        }
      },
      {
        subject: {
          name: "Average coverage must not drop by 20%",
          target: "Unit Coverage Report",
          data: {
            type: "average-delta-coverage-policy",
            warn: 0,
            fail: 20
          }
        },
        expected: {
          name: "Average coverage must not drop by 20%",
          target: "Unit Coverage Report",
          data: {
            type: "average-delta-coverage-policy",
            warn: 0,
            fail: 20
          }
        }
      }
    ];

    theory.forEach(({ subject, expected }) => {
      it("should return the validated object and no error object", () => {
        // act
        const act = policyConfig.safeParse(subject) as SafeParseSuccess<PolicyConfig>;
        act.success.should.be.true;
        act.data.should.deep.equal(expected);

      });
    });
  });

  describe("invalid objects", () => {
    describe("missing required fields", () => {
      const theory = [
        {
          subject: { name: "Test Input" },
          expected: {
            issues: [{
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["target"],
              message: "Required"
            }, {
              code: "invalid_type",
              expected: "object",
              received: "undefined",
              path: ["data"],
              message: "Required"
            }], name: "ZodError"
          }
        },
        {
          subject: { name: "Test Input", target: "Unit Test" },
          expected: {
            issues: [
              {
                code: "invalid_type",
                expected: "object",
                received: "undefined",
                path: ["data"],
                message: "Required"
              }
            ], name: "ZodError"
          }
        }
      ];
      theory.forEach(({ subject, expected }) => {
        it(`for subject ${JSON.stringify(subject)} error should be ${JSON.stringify(expected)}`, () => {
          const act = policyConfig.safeParse(subject) as SafeParseError<PolicyConfig>;
          act.success.should.be.false;
          act.error.issues.should.deep.equal(expected.issues);
        });
      });
    });

    describe("extra fields", () => {
      const theory = [
        {
          subject: {
            name: "Test Input",
            target: "Unit Coverage Report",
            extraField: "some value",
            data: {
              type: "min-literal-test-policy",
              metric: "fail",
              warn: 5,
              fail: 2
            }
          },
          expected: {
            "issues": [
              {
                "code": "unrecognized_keys",
                "keys": [
                  "extraField"
                ],
                "message": "Unrecognized key(s) in object: 'extraField'",
                "path": []
              }
            ], "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Test Input",
            target: "Unit Coverage Report",
            data: {
              type: "max-literal-test-policy",
              metric: "fail",
              extraField: "some value",
              warn: 5,
              fail: 2
            }
          },
          expected: {
            "issues": [{
              "code": "unrecognized_keys",
              "keys": [
                "extraField"
              ],
              "message": "Unrecognized key(s) in object: 'extraField'",
              "path": [
                "data"
              ]
            }], "name": "ZodError"
          }
        }
      ];
      theory.forEach(({ subject, expected }) => {
        it(`for subject ${JSON.stringify(subject)} error should be ${expected}`, () => {
          const act = policyConfig.safeParse(subject) as SafeParseError<PolicyConfig>;
          act.success.should.be.false;
          act.error.issues.should.deep.equal(expected.issues);
        });
      });
    });

    describe("fields with wrong type", () => {
      const theory = [
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "average-coverage-policy",
              warn: "string",
              fail: 2
            }
          },

          expected: {
            issues: [{
              "code": "invalid_type",
              "expected": "number",
              "message": "Expected number, received string",
              "path": [
                "data",
                "warn"
              ],
              "received": "string"
            }],
            name: "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "all-delta-coverage-policy",
              warn: 10,
              fail: false
            }
          },

          expected: {
            issues: [{
              "code": "invalid_type",
              "expected": "number",
              "message": "Expected number, received boolean",
              "path": [
                "data",
                "fail"
              ],
              "received": "boolean"
            }],
            name: "ZodError"
          }
        }
      ];
      theory.forEach(({ subject, expected }) => {
        it(`for subject ${JSON.stringify(subject)} error should be ${expected}`, () => {
          const act = policyConfig.safeParse(subject) as SafeParseError<PolicyConfig>;
          act.success.should.be.false;
          act.error.issues.should.deep.equal(expected.issues);
        });
      });
    });

    describe("fields with invalid values", () => {
      const theory = [
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "any-coverage-policy",
              warn: 1000,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "any-coverage-policy",
              warn: 2,
              fail: 1000
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "any-coverage-policy",
              warn: -1,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "any-coverage-policy",
              warn: 100,
              fail: -1
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },

        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "all-coverage-policy",
              warn: 1000,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "all-coverage-policy",
              warn: 2,
              fail: 1000
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "all-coverage-policy",
              warn: -1,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "all-coverage-policy",
              warn: 100,
              fail: -1
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },

        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "average-coverage-policy",
              warn: 1000,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "average-coverage-policy",
              warn: 2,
              fail: 1000
            }
          },
          expected: {
            issues: [
              {
                code: "too_big",
                exact: false,
                inclusive: true,
                maximum: 100,
                message: "Number must be less than or equal to 100",
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "average-coverage-policy",
              warn: -1,
              fail: 2
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "warn"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
        {
          subject: {
            name: "Average coverage must be above 80%",
            target: "Unit Coverage Report",
            data: {
              type: "average-coverage-policy",
              warn: 100,
              fail: -1
            }
          },
          expected: {
            issues: [
              {
                code: "too_small",
                exact: false,
                inclusive: true,
                message: "Number must be greater than or equal to 0",
                minimum: 0,
                path: [
                  "data",
                  "fail"
                ],
                type: "number"
              }
            ],
            "name": "ZodError"
          }
        },
      ];
      theory.forEach(({ subject, expected }) => {
        it(`for subject ${JSON.stringify(subject)} error should be ${expected}`, () => {
          const act = policyConfig.safeParse(subject) as SafeParseError<PolicyConfig>;
          act.success.should.be.false;
          act.error.issues.should.deep.equal(expected.issues);
        });
      });
    });
  });
});
