import { describe, it, should, chai } from "vitest";
import { BasicElementMapper } from "../../src/lib/basic-element-mapper";
import { HistoryEntry, Input } from "../../src/lib/history";
import { IntermediateElement, IntermediateEntry, OutputElement, OutputEntry } from "../../src/lib/output";
import { None, Some } from "../../src/lib/core/option";
// @ts-ignore
import helper from "../helper.js";

chai.use(helper);

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
          type: "documentation",
          resultDetails: {
            fail: [],
            pass: [],
            warn: [],
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input, None());

      // assert
      act.should.deep.equal(expected);
    });

    it("should convert a documentation input to intermediate, ignoring base", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "documentation",
        }
      };

      const base: Input[] = [
        {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation",
          }
        }, {
          name: "test2",
          url: "https://example.com",
          data: {
            type: "test-coverage",
            line: 20,
            statement: 20,
            function: 20,
            branch: 40
          }
        }

      ];

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "documentation",
          resultDetails: {
            fail: [],
            pass: [],
            warn: [],
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input, Some(base));

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
          qualityRating: "A",
          resultDetails: {
            fail: [],
            pass: [],
            warn: [],
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input, None());

      // assert
      act.should.deep.equal(expected);

    });


    it("should convert a code-quality input to intermediate, ignoring base", function() {

      // dummy Input data
      const input: Input = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "code-quality",
          qualityRating: "A"
        }
      };
      const base: Input[] = [
        {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation"
          }
        }, {
          name: "test2",
          url: "https://example.com",
          data: {
            type: "test-coverage",
            line: 20,
            statement: 20,
            function: 20,
            branch: 40
          }
        }

      ];

      // expected Intermediate data
      const expected: IntermediateElement = {
        name: "test",
        url: "https://example.com",
        data: {
          type: "code-quality",
          qualityRating: "A",
          resultDetails: {
            fail: [],
            pass: [],
            warn: [],
          }
        }
      };

      // act
      const act = mapper.toIntermediateMetadata(input, Some(base));

      // assert
      act.should.deep.equal(expected);

    });

    describe("test-coverage", function() {
      it("should convert a test-coverage input to intermediate without modification if base is None", function() {

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
            delta: None(),
            resultDetails: {
              fail: [],
              pass: [],
              warn: []
            }
          }
        };

        // act
        const act = mapper.toIntermediateMetadata(input, None());

        // assert
        return act.should.be.congruent(expected);

      });

      it("should convert a test-coverage input to intermediate with delta calculated if base is Some and matches", function() {

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

        const base: Input[] = [
          {
            name: "test",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              line: 50,
              statement: 60,
              function: 20,
              branch: 1
            }
          },
          {
            name: "docs",
            url: "https://example.com",
            data: {
              type: "documentation",
            }
          }
        ]

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
            delta: Some({
              line: 50,
              statement: 40,
              function: 80,
              branch: 99,
            }),
            resultDetails: {
              fail: [],
              pass: [],
              warn: []
            }
          }
        };

        // act
        const act = mapper.toIntermediateMetadata(input, Some(base));

        // assert
        return act.should.be.congruent(expected);

      });

      it("should convert a test-coverage input to intermediate without modification if base is Some and no matches", function() {

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

        const base: Input[] = [
          {
            name: "test-2",
            url: "https://example.com",
            data: {
              type: "test-coverage",
              line: 50,
              statement: 60,
              function: 20,
              branch: 1
            }
          },
          {
            name: "docs",
            url: "https://example.com",
            data: {
              type: "documentation",
            }
          }
        ]

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
            delta: None(),
            resultDetails: {
              fail: [],
              pass: [],
              warn: []
            }
          }
        };

        // act
        const act = mapper.toIntermediateMetadata(input, Some(base));

        // assert
        return act.should.be.congruent(expected);

      });

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
      const act = mapper.toIntermediateMetadata(input, None());

      // assert
      act.should.deep.equal(expected);

    });
    it("should convert a test-result input to intermediate, ignoring base", function() {

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
      const base: Input[] = [
        {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation"
          }
        }, {
          name: "test2",
          url: "https://example.com",
          data: {
            type: "test-coverage",
            line: 20,
            statement: 20,
            function: 20,
            branch: 40
          }
        }

      ];

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
      const act = mapper.toIntermediateMetadata(input, Some(base));

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
        const act = () => mapper.toIntermediateMetadata(input, None());

        // assert
        act.should.throw(Error, "unreachable");

      });

    });

  });

  describe("inputToIntermediate", function() {

    describe("with base", function() {

      describe("base has match", function() {

        const theory: { subject: { current: HistoryEntry, base: HistoryEntry }, expected: IntermediateEntry }[] = [
          {
            subject: {
              current: {
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
              },
              base: {
                sha: "123455550",
                url: "https://example5.com",
                action: "test5",
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
                      line: 80,
                      statement: 80,
                      function: 80,
                      branch: 80
                    }
                  }
                ]
              }
            },
            expected: {
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
                    delta: Some({
                      line: 20,
                      statement: 20,
                      function: 20,
                      branch: 20
                    }),
                    resultDetails: {
                      fail: [],
                      pass: [],
                      warn: []
                    }
                  }
                }
              ]
            }
          },
          {
            subject: {
              current: {
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
                      line: 80,
                      statement: 75,
                      function: 77,
                      branch: 92
                    }
                  }
                ]
              },
              base: {
                sha: "123455550",
                url: "https://example5.com",
                action: "test5",
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
                      line: 80,
                      statement: 80,
                      function: 80,
                      branch: 80
                    }
                  }
                ]
              }
            },
            expected: {
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
                    line: 80,
                    statement: 75,
                    function: 77,
                    branch: 92,
                    delta: Some({
                      line: 0,
                      statement: -5,
                      function: -3,
                      branch: 12
                    }),
                    resultDetails: {
                      fail: [],
                      pass: [],
                      warn: []
                    }
                  }
                }
              ]
            }
          },
          {
            subject: {
              current: {
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
                      line: 0,
                      statement: 100,
                      function: 50,
                      branch: 62
                    }
                  }
                ]
              },
              base: {
                sha: "123455550",
                url: "https://example5.com",
                action: "test5",
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
                      statement: 0,
                      function: 75,
                      branch: 62
                    }
                  }
                ]
              }
            },
            expected: {
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
                    line: 0,
                    statement: 100,
                    function: 50,
                    branch: 62,
                    delta: Some({
                      line: -100,
                      statement: 100,
                      function: -25,
                      branch: 0
                    }),
                    resultDetails: {
                      fail: [],
                      pass: [],
                      warn: []
                    }
                  }
                }
              ]
            }
          }

        ];

        theory.forEach(({ subject: { current, base }, expected }) => {
          it("should convert a history entry with to intermediate", async function() {

            // act
            const act = mapper.inputToIntermediate(current, Some(base));

            // assert
            await act.should.be.congruent(expected);

          });

        });
      });

      describe("base has no match", function() {

        const theory: { subject: { current: HistoryEntry, base: HistoryEntry }, expected: IntermediateEntry }[] = [
          {
            subject: {
              current: {
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
                      line: 80,
                      statement: 75,
                      function: 77,
                      branch: 92
                    }
                  }
                ]
              },
              base: {
                sha: "123455550",
                url: "https://example5.com",
                action: "test5",
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
                    name: "test3",
                    url: "https://example.com",
                    data: {
                      type: "test-coverage",
                      line: 80,
                      statement: 80,
                      function: 80,
                      branch: 80
                    }
                  }
                ]
              }
            },
            expected: {
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
                    line: 80,
                    statement: 75,
                    function: 77,
                    branch: 92,
                    delta: None(),
                    resultDetails: {
                      fail: [],
                      pass: [],
                      warn: []
                    }
                  }
                }
              ]
            }
          },
          {
            subject: {
              current: {
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
                      line: 80,
                      statement: 75,
                      function: 77,
                      branch: 92
                    }
                  }
                ]
              },
              base: {
                sha: "123455550",
                url: "https://example5.com",
                action: "test5",
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
                      type: "test-result",
                      fail: 20,
                      pass: 129,
                      skip: 17
                    }
                  }
                ]
              }
            },
            expected: {
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
                    line: 80,
                    statement: 75,
                    function: 77,
                    branch: 92,
                    delta: None(),
                    resultDetails: {
                      fail: [],
                      pass: [],
                      warn: []
                    }
                  }
                }
              ]
            }
          }
        ];

        theory.forEach(({ subject: { current, base }, expected }) => {

          it("should convert a history entry with to intermediate", async function() {

            // act
            const act = mapper.inputToIntermediate(current, Some(base));

            // assert
            await act.should.be.congruent(expected);

          });


        });

      });

    });

    describe("with no base", function() {

      it("should convert a history entry to intermediate", async function() {

        // dummy Input data
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
                line: 80,
                statement: 75,
                function: 77,
                branch: 92
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
            },
            {
              name: "test2",
              url: "https://example.com",
              data: {
                type: "test-coverage",
                line: 80,
                statement: 75,
                function: 77,
                branch: 92,
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

        // act
        const act = mapper.inputToIntermediate(input, None());

        // assert
        await act.should.be.congruent(expected);

      });

    });


  });

  describe("intermediateToOutput", function() {

    it("should convert a history entry to output", async function() {

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
      const act = await mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should result in warn if warns are not empty and fails are empty", async function() {

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
      const act = await mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);

    });

    it("should result in fail if fails are not empty", async function() {

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
      const act = await mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);


    });

    it("should unwrap coverage delta", async function() {

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
              type: "test-coverage",
              line: 50,
              branch: 50,
              statement: 50,
              function: 50,
              delta: Some({
                line: 5,
                branch: 5,
                statement: 5,
                function: 5,
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
              type: "test-coverage",
              line: 50,
              branch: 50,
              statement: 50,
              function: 50,
              delta: {
                line: 5,
                branch: 5,
                statement: 5,
                function: 5,
              },
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
      const act = await mapper.intermediateToOutput(input);

      // assert
      act.should.deep.equal(expected);

    });

  });

  describe("toOutputMetadata", function() {

    describe("test-result", function() {

      describe("pass", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
                fail: [],
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
                fail: [],
                pass: [
                  "min-test-result"
                ],
                warn: []
              },
              result: "pass"
            }
          };

          // act
          const act = await mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      });

      describe("warn", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
                fail: [],
                pass: [
                  "min-test-result",
                  "max-literal-test-result"
                ],
                warn: [
                  "max-literal-test-result"
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
                fail: [],
                pass: [
                  "min-test-result",
                  "max-literal-test-result"
                ],
                warn: [
                  "max-literal-test-result"
                ]
              },
              result: "warn"
            }
          };

          // act
          const act = await mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      });

      describe("fail", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
          const act = await mapper.toOutputMetadata(input);

          // assert
          act.should.deep.equal(expected);

        });

      });

    });

    describe("test-coverage", function() {

      describe("pass", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
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
              type: "test-coverage",
              statement: 100,
              function: 100,
              branch: 100,
              line: 100,
              delta: null,
              resultDetails: {
                fail: [],
                pass: [
                  "min-test-result",
                  "average-delta-coverage"
                ],
                warn: []
              },
              result: "pass"
            }
          };

          // act
          const act = await mapper.toOutputMetadata(input);

          // assert
          await act.should.be.congruent(expected);

        });

      });

      describe("fail", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
              delta: Some({
                line: -20,
                statement: 24,
                branch: 40,
                function: 80
              }),
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
              delta: {
                line: -20,
                statement: 24,
                branch: 40,
                function: 80
              },
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
          const act = await mapper.toOutputMetadata(input);

          // assert
          await act.should.be.congruent(expected);

        });

      });

      describe("warn", function() {
        it("should convert IntermediateElement to OutputMetadata", async function() {

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
              delta: None(),
              resultDetails: {
                fail: [],
                pass: [],
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
              delta: null,
              resultDetails: {
                fail: [],
                pass: [],
                warn: [
                  "min-test-result"
                ]
              },
              result: "warn"
            }
          };

          // act
          const act = await mapper.toOutputMetadata(input);

          // assert
          await act.should.be.congruent(expected);

        });

      });

    });

    describe("documentation", function() {

      it("should convert IntermediateElement to OutputMetadata", async function() {

        // dummy IntermediateElement data
        const input: IntermediateElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            }
          }
        };

        // expected OutputMetadata data
        const expected: OutputElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "documentation",
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
            result: "pass",
          }
        };

        // act
        const act = await mapper.toOutputMetadata(input);

        // assert
        act.should.deep.equal(expected);

      });

    });

    describe("code-quality", function() {


      it("should convert IntermediateElement to OutputMetadata", async function() {

        // dummy IntermediateElement data
        const input: IntermediateElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "code-quality",
            qualityRating: "B+",
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            }
          }
        };

        // expected OutputMetadata data
        const expected: OutputElement = {
          name: "test",
          url: "https://example.com",
          data: {
            type: "code-quality",
            qualityRating: "B+",
            resultDetails: {
              fail: [],
              pass: [],
              warn: [],
            },
            result: "pass",

          }
        };

        // act
        const act = await mapper.toOutputMetadata(input);

        // assert
        act.should.deep.equal(expected);

      });

    });

  });

});
