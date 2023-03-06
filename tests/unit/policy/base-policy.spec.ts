import { describe, it, should } from "vitest";
import { BasePolicy } from "../../../src/lib/policy/base-policy";
import { IntermediateEntry } from "../../../src/lib/output";

should();

describe("BasePolicy", () => {

  describe("filteredEvaluate", () => {

    it("should return the same object if the target is not found", () => {
      // Arrange
      const subj = new BasePolicy("Unit Test Report");
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
              }
            }
          }
        ]
      };
      const mapper = (i: any) => i;

      // Act
      const act = subj.filteredEvaluate(current, mapper);

      // Assert
      act.should.deep.equal(expected);
      act.should.not.equal(current);

    });

    it("should return the same object if the target is found but the mapper returns the same object", () => {

      // Arrange
      const subj = new BasePolicy("Unit Test Coverage");
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
              }
            }
          }
        ]
      };
      const mapper = (i: any) => i;

      // Act
      const act = subj.filteredEvaluate(current, mapper);

      // Assert
      act.should.deep.equal(expected);
      act.should.not.equal(current);


    });

    it("should return a new object if the target is found and the mapper returns a new object", () => {

      // Arrange
      const subj = new BasePolicy("Unit Test Coverage");
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
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
              resultDetails: {
                fail: [],
                pass: [],
                warn: [],
              }
            }
          }
        ]
      };
      const mapper = (i: any) => ({ ...i, url: "sample-url-2" });

      // Act
      const act = subj.filteredEvaluate(current, mapper);

      // Assert
      act.should.deep.equal(expected);
      act.should.not.equal(current);

    });

  });
});
