import { describe, it, should } from "vitest";
import { BasicPolicyFactory } from "../../src/lib/basic-policy-factory";
import { AnyCoveragePolicy } from "../../src/lib/policy/any-coverage-policy";
import { PolicyConfig } from "../../src/lib/policy-config";
import { AnyDeltaCoveragePolicy } from "../../src/lib/policy/any-delta-coverage-policy";
import { DeltaCoveragePolicy } from "../../src/lib/policy/delta-coverage-policy";
import { MinCoveragePolicy } from "../../src/lib/policy/min-coverage-policy";
import { MaxLiteralTestPolicy } from "../../src/lib/policy/max-literal-test-policy";
import { MinLiteralTestPolicy } from "../../src/lib/policy/min-literal-test-policy";
import { MaxPercentageTestPolicy } from "../../src/lib/policy/max-percentage-test-policy";
import { MinPercentageTestPolicy } from "../../src/lib/policy/min-percentage-test-policy";

should();

describe("BasicPolicyFactory", function() {

  const factory = new BasicPolicyFactory();
  describe("generate", function() {

    it("should return an instance of AnyCoveragePolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          type: "any-coverage-policy",
        }
      }
      const expected = new AnyCoveragePolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          type: "any-coverage-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of AnyDeltaCoveragePolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          type: "any-delta-coverage-policy",
        }
      }
      const expected = new AnyDeltaCoveragePolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          type: "any-delta-coverage-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of DeltaCoveragePolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "function",
          type: "delta-coverage-policy",
        }
      }
      const expected = new DeltaCoveragePolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "function",
          type: "delta-coverage-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of MinCoveragePolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "line",
          type: "min-coverage-policy",
        }
      }
      const expected = new MinCoveragePolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "line",
          type: "min-coverage-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of MaxLiteralTestPolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "skip",
          type: "max-literal-test-policy",
        }
      }
      const expected = new MaxLiteralTestPolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "skip",
          type: "max-literal-test-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of MinLiteralTestPolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "min-literal-test-policy",
        }
      }
      const expected = new MinLiteralTestPolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "min-literal-test-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of MaxPercentageTestPolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "max-percentage-test-policy",
        }
      }
      const expected = new MaxPercentageTestPolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "max-percentage-test-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });

    it("should return an instance of MinPercentageTestPolicy", function() {

      // arrange
      const subj: PolicyConfig = {
        name: "Sample Coverage",
        target: "Unit Test Coverage",
        data: {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "min-percentage-test-policy",
        }
      }
      const expected = new MinPercentageTestPolicy(
        "Sample Coverage",
        "Unit Test Coverage",
        {
          fail: 10,
          warn: 20,
          metric: "pass",
          type: "min-percentage-test-policy",
        }
      )

      // act
      const act = factory.generate(subj);

      // assert
      act.should.deep.equal(expected);

    });


    it("should throw error if unknown instance is passed in", function() {

      const act = () => factory.generate({data: { type: "random"}} as any);

      act.should.throw(Error, "Unknown policy type: random");

    });

  });

});
