import { describe, it, should, chai } from "vitest";
import { BasePolicy } from "../../../src/lib/policy/base-policy";
import { IntermediateElement, IntermediateEntry, PolicyData } from "../../../src/lib/output";
import { None, Some } from "../../../src/lib/core/option";
// @ts-ignore
import helper from "../../helper";

should();

chai.use(helper);


describe("BasePolicy", () => {

  describe("filteredEvaluate", () => {

    it("should return the same object if the target is not found", async () => {
      // Arrange
      const subj = new BasePolicy("Ensure coverage above 80%", "Unit Test Report");
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
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const expected: IntermediateEntry = {
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
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const mapper = (i: any) => i;

      // Act
      const act = await subj.filteredEvaluate(current, mapper);

      // Assert
      await act.should.be.congruent(expected);

    });

    it("should return the same object if the target is found but the mapper returns the same object", async () => {

      // Arrange
      const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
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
                function: 20,
                line: 20,
                statement: 25,
                branch: 44
              }),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const expected: IntermediateEntry = {
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
                function: 20,
                line: 20,
                statement: 25,
                branch: 44
              }),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const mapper = (i: any) => i;

      // Act
      const act = await subj.filteredEvaluate(current, mapper);

      // Assert
      await act.should.be.congruent(expected);
    });

    it("should return a new object if the target is found and the mapper returns a new object", async () => {
      // Arrange
      const subj = new BasePolicy("SamplePolicy", "Unit Test Coverage");
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
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const expected: IntermediateEntry = {
        sha: "random-sha",
        url: "random-url",
        action: "action",
        items: [
          {
            name: "Unit Test Coverage",
            url: "sample-url-2",
            data: {
              type: "test-coverage",
              branch: 100,
              function: 100,
              line: 100,
              statement: 100,
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };
      const mapper = (i: any) => ({ ...i, url: "sample-url-2" });

      // Act
      const act = await subj.filteredEvaluate(current, mapper);

      // Assert
      await act.should.be.congruent(expected);
    });

  });

  describe("updatePolicyData", () => {

    describe("fail", function() {

      it("should update the policy data", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: PolicyData = {
          fail: [
            "Policy 1"
          ],
          pass: [
            "Policy 3"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5"
          ]
        };
        const expected: PolicyData = {
          fail: [
            "Policy 1",
            "Sample Policy"
          ],
          pass: [
            "Policy 3"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5"
          ]
        };

        // Act
        const act = subj.updatePolicyData(prev, "fail");

        // Assert
        act.should.be.congruent(expected);


      });

    });

    describe("pass", function() {

      it("should update the policy data", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: PolicyData = {
          fail: [
            "Policy 1"
          ],
          pass: [
            "Policy 3"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5"
          ]
        };
        const expected: PolicyData = {
          fail: [
            "Policy 1"
          ],
          pass: [
            "Policy 3",
            "Sample Policy"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5"
          ]
        };

        // Act
        const act = subj.updatePolicyData(prev, "pass");

        // Assert
        act.should.be.congruent(expected);


      });

    });

    describe("warn", function() {

      it("should update the policy data", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: PolicyData = {
          fail: [
            "Policy 1"
          ],
          pass: [
            "Policy 3"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5"
          ]
        };
        const expected: PolicyData = {
          fail: [
            "Policy 1"
          ],
          pass: [
            "Policy 3"
          ],
          warn: [
            "Policy 2",
            "Policy 4",
            "Policy 5",
            "Sample Policy"
          ]
        };

        // Act
        const act = subj.updatePolicyData(prev, "warn");

        // Assert
        act.should.be.congruent(expected);

      });

    });

  });


  describe("updateElement", () => {

    describe("fail", function() {

      it("should return original update resultDetails for documentation", async () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [],
              warn: [
                "Pol 4",
              ]
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
                "Sample Policy",
              ],
              pass: [],
              warn: [
                "Pol 4",]
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "fail");

        // Assert
        await act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for code-quality", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [],
              pass: [
                "Pol 4",
              ],
              warn: [],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [
                "Sample Policy",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "fail");

        // Assert
        return act.should.be.congruent(expected);

      });


      it("should return should update resultDetails for test-results", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
                "Sample Policy",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "fail");

        // Assert
        return act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for test-coverage", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
              ],
              pass: [
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
                "Sample Policy",
              ],
              pass: [
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "fail");

        // Assert
        return act.should.be.congruent(expected);

      });

    });


    describe("pass", function() {

      it("should return original update resultDetails for documentation", async () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [],
              warn: [
                "Pol 4",
              ]
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Sample Policy",],
              warn: [
                "Pol 4",]
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "pass");

        // Assert
        await act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for code-quality", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [],
              pass: [
                "Pol 4",
              ],
              warn: [],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [
              ],
              pass: [
                "Pol 4",
                "Sample Policy",
              ],
              warn: [],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "pass");

        // Assert
        return act.should.be.congruent(expected);

      });


      it("should return should update resultDetails for test-results", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Pol 4",
                "Sample Policy",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "pass");

        // Assert
        return act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for test-coverage", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
              ],
              pass: [
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
              ],
              pass: [
                "Sample Policy",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "pass");

        // Assert
        return act.should.be.congruent(expected);

      });

    });


    describe("warn", function() {

      it("should return original update resultDetails for documentation", async () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [],
              warn: [
                "Pol 4",
              ]
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Documentation",
          url: "sample-url",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
              ],
              warn: [
                "Pol 4",
                "Sample Policy",
              ]
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "warn");

        // Assert
        await act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for code-quality", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [],
              pass: [
                "Pol 4",
              ],
              warn: [],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Code Quality",
          url: "sample-url",
          data: {
            type: "code-quality",
            qualityRating: "A+",
            resultDetails: {
              fail: [
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Sample Policy",],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "warn");

        // Assert
        return act.should.be.congruent(expected);

      });


      it("should return should update resultDetails for test-results", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test-Result",
          url: "sample-url",
          data: {
            type: "test-result",
            pass: 0,
            skip: 0,
            fail: 0,
            resultDetails: {
              fail: [
                "Pol 1",
                "Pol 2",
              ],
              pass: [
                "Pol 4",
              ],
              warn: [
                "Pol 5",
                "Pol 6",
                "Sample Policy",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "warn");

        // Assert
        return act.should.be.congruent(expected);

      });

      it("should return should update resultDetails for test-coverage", () => {
        // Arrange
        const subj = new BasePolicy("Sample Policy", "Unit Test Coverage");
        const prev: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
              ],
              pass: [
              ],
              warn: [
                "Pol 5",
                "Pol 6",
              ],
            }
          }
        };
        const expected: IntermediateElement = {
          name: "Simple Test Coverage",
          url: "sample-url",
          data: {
            type: "test-coverage",
            branch: 20,
            line: 20,
            function: 30,
            statement: 59,
            delta: Some({
              branch: -2,
              line: 5,
              function: 5,
              statement: 10,
            }),
            resultDetails: {
              fail: [
              ],
              pass: [
              ],
              warn: [
                "Pol 5",
                "Pol 6",
                "Sample Policy",
              ],
            }
          }
        };

        // Act
        const act = subj.updateElement(prev, "warn");

        // Assert
        return act.should.be.congruent(expected);

      });

    });

  });

});
