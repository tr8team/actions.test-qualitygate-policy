import { describe, it, should } from "vitest";
import { BasicElementMapper } from "../../src/lib/basic-element-mapper";
import { HistoryEntry, Input } from "../../src/lib/history";
import { IntermediateElement, IntermediateEntry, OutputElement, OutputEntry } from "../../src/lib/output";

should();

describe("BasicElementMapper", function() {

  const mapper = new BasicElementMapper();

  describe("toIntermediateMetadata", function() {

    it("should convert a documentation input to intermediate", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "documentation"
        }
      };

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "documentation"
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input);

      // assert
      act.should.deep.equal(expected);
    });

    it("should convert a code-quality input to intermediate", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "code-quality",
          qualityRating: "A"
        }
      };

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "code-quality",
          qualityRating: "A"
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should convert a test-coverage input to intermediate", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "test-coverage",
          line: 100,
          statement: 100,
          function: 100,
          branch: 100
        }
      };

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "test-coverage",
          line: 100,
          statement: 100,
          function: 100,
          branch: 100,
          resultDetails: {
            fail: [],
            pass: [],
            warn: []
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should convert a test-result input to intermediate", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "test-result",
          fail: 20,
          pass: 129,
          skip: 17
        }
      };

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "test-result",
          fail: 20,
          pass: 129,
          skip: 17,
          resultDetails: {
            fail: [],
            pass: [],
            warn: []
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input);

      // assert
      act.should.deep.equal(expected);

    });

    describe("unreachable case", function() {

      it("should throw an error", function() {

        // dummy Input data
        const input: Input = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "unreachable" as any,
            fail: 20,
            pass: 129,
            skip: 17
          }
        };

        // act
        const act = () => mapper.toIntermediateMetadata(input);

        // assert
        act.should.throw(Error,"unreachable");

      });

    });

  });

  describe("inputToIntermediate", function() {

    it("should convert a history entry to intermediate", function() {

      // dummy HistoryEntry data
      const input: HistoryEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17
            }
          }
        ]
      };

      // expected Intermediate data
      const expected: IntermediateEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };

      // act
      const act = mapper.inputToIntermediate(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should convert a history entry with multiple items to intermediate", function() {

      // dummy HistoryEntry data
      const input: HistoryEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17
            }
          },
          {
            name: "test2",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              line: 100,
              statement: 100,
              function: 100,
              branch: 100
            }
          }
        ]
      };

      // expected Intermediate data
      const expected = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          },
          {
            name: "test2",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              line: 100,
              statement: 100,
              function: 100,
              branch: 100,
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };


      // act
      const act = mapper.inputToIntermediate(input);

      // assert
      act.should.deep.equal(expected);

    });

  });

  describe("intermediateToOutput", function() {

    it("should convert a history entry to output", function() {

      // dummy IntermediateEntry data
      const input: IntermediateEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };

      // expected Output data
      const expected: OutputEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [],
                warn: []
              },
              result: "pass"
            }
          }
        ]
      };

      // act
      const act = mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should result in warn if warns are not empty and fails are empty", function() {

      // dummy IntermediateEntry data
      const input: IntermediateEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [
                  "min-test-result"
                ],
                warn: [
                  "average-delta-coverage"
                ]
              }
            }
          }
        ]
      };

      // expected Output data
      const expected: OutputEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [],
                pass: [
                  "min-test-result"
                ],
                warn: [
                  "average-delta-coverage"
                ]
              },
              result: "warn"
            }
          }
        ]
      };

      // act
      const act = mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should result in fail if fails are not empty", function() {

      // dummy IntermediateEntry data
      const input: IntermediateEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                  "min-test-result"
                ],
                pass: [],
                warn: []
              }
            }
          }
        ]
      };

      // expected Output data
      const expected: OutputEntry = {
        sha: "1234567890",
        url: "https://example.com",
        action: "test",
        items: [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                  "min-test-result"
                ],
                pass: [],
                warn: []
              },
              result: "fail"
            }
          }
        ]
      };

      // act
      const act = mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);


    });

  });

  describe("toOutputMetadata", function() {

    describe("test-result", function() {

      describe("pass", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result"
                ],
                warn: []
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result"
                ],
                warn: []
              },
              result: "pass"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

      describe("warn", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result",
                  "max-literal-test-result",
                ],
                warn: [
                  "max-literal-test-result",
                ]
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result",
                  "max-literal-test-result",
                ],
                warn: [
                  "max-literal-test-result",
                ]
              },
              result: "warn"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

      describe("fail", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                  "average-coverage"
                ],
                pass: [
                  "min-test-result"
                ],
                warn: [
                  "max-skip-test"
                ]
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-result",
              fail: 20,
              pass: 129,
              skip: 17,
              resultDetails: {
                fail: [
                  "average-coverage"
                ],
                pass: [
                  "min-test-result"
                ],
                warn: [
                  "max-skip-test"
                ]
              },
              result: "fail"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

    });

    describe("test-coverage", function() {

      describe("pass", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
                ],
                warn: [
                ]
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                ],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
                ],
                warn: [
                ]
              },
              result: "pass"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

      describe("fail", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                  "min-test-result"
                ],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
                ],
                warn: [
                  "min-test-result"
                ]
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                  "min-test-result"
                ],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
                ],
                warn: [
                  "min-test-result"
                ]
              },
              result: "fail"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

      describe("warn", function() {
        it("should convert IntermediateElement to OutputMetadata", function() {

          // dummy IntermediateElement data
          const input: IntermediateElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                ],
                pass: [
                ],
                warn: [
                  "min-test-result"
                ]
              }
            }
          };

          // expected OutputMetadata data
          const expected: OutputElement = {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              resultDetails: {
                fail: [
                ],
                pass: [
                ],
                warn: [
                  "min-test-result"
                ]
              },
              result: "warn"
            }
          };

          // act
          const act = mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      })

    });

    describe("documentation", function() {

      it("should convert IntermediateElement to OutputMetadata", function() {

        // dummy IntermediateElement data
        const input: IntermediateElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation"
          }
        };

        // expected OutputMetadata data
        const expected: OutputElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation"
          }
        };

        // act
        const act = mapper.toOutputMetadata(input);

        // assert
        act.should.deep.equal(expected);

      });

    });

    describe("code-quality", function() {


      it("should convert IntermediateElement to OutputMetadata", function() {

        // dummy IntermediateElement data
        const input: IntermediateElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "code-quality",
            qualityRating: "B+"
          }
        };

        // expected OutputMetadata data
        const expected: OutputElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "code-quality",
            qualityRating: "B+"
          }
        };

        // act
        const act = mapper.toOutputMetadata(input);

        // assert
        act.should.deep.equal(expected);

      });

    });

    describe("unreachable case", function(){

      it("should throw an error", function(){

        // dummy IntermediateElement data
        const input: IntermediateElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "unknown" as any
          }
        };

        // act
        const act = () => mapper.toOutputMetadata(input);

        // assert
        act.should.throw(Error, "unreachable");

      });

    })

  });

});
