import { parseObservable } from "./parser";
import {
  SimpleState,
  SIMPLE_STATE,
  NESTED_STATE,
  NestedState,
  TwoState,
} from "./test_data/state";
import { eqObservable } from "./test_matcher";
import { ObservableArray } from "@selfage/observable_array";
import { assertThat, eq } from "@selfage/test_matcher";
import { NODE_TEST_RUNNER } from "@selfage/test_runner";

NODE_TEST_RUNNER.run({
  name: "ParserTest",
  cases: [
    {
      name: "ParseObservablePrimitivesAllPopulated",
      execute: () => {
        // Execute
        let parsed = parseObservable(
          {
            numValue: 12,
            strValue: "123",
            boolValue: false,
            numArray: [],
            strArray: ["5", 6, "7"],
            boolArray: [false, 1, true],
            numObArray: ["1", 2, 3],
            strObArray: ["aa", "bb"],
            boolObArray: ["ss"],
          },
          SIMPLE_STATE
        );

        // Verify
        let expected: SimpleState = {
          numValue: 12,
          strValue: "123",
          boolValue: false,
          numArray: [],
          strArray: ["5", undefined, "7"],
          boolArray: [false, undefined, true],
          numObArray: ObservableArray.of(undefined, 2, 3),
          strObArray: ObservableArray.of("aa", "bb"),
          boolObArray: ObservableArray.of<boolean>(undefined),
        };
        assertThat(parsed, eqObservable(expected, SIMPLE_STATE), "parsed");
      },
    },
    {
      name: "ParseObservablePrimtivesOverride",
      execute: () => {
        // Prepare
        let original: SimpleState = {
          numValue: 12,
          boolValue: true,
          numArray: [],
          strArray: ["a"],
          strObArray: ObservableArray.of("5", undefined, "7"),
          boolObArray: ObservableArray.of<boolean>(false, undefined, true),
        };

        // Execute
        let parsed = parseObservable(
          {
            strValue: "123",
            boolValue: false,
            numArray: [2, 3],
            strArray: [],
            numObArray: ["1", 2, 4],
            strObArray: ["5", "6", "7", "10"],
            boolObArray: [true],
          },
          SIMPLE_STATE,
          original
        );

        // Verify
        let expected: SimpleState = {
          strValue: "123",
          boolValue: false,
          numArray: [2, 3],
          strArray: Array.of(),
          numObArray: ObservableArray.of(undefined, 2, 4),
          strObArray: ObservableArray.of("5", "6", "7", "10"),
          boolObArray: ObservableArray.of(true),
        };
        assertThat(parsed, eqObservable(expected, SIMPLE_STATE), "parsed");
        assertThat(parsed, eq(original), "parsed reference");
      },
    },
    {
      name: "ParseObservableFromObservable",
      execute: () => {
        // Prepare
        let state: SimpleState = {
          numValue: 1212,
          strValue: "ssss",
          numArray: [5, 6],
          numObArray: ObservableArray.of(1, 2, 3),
          strObArray: ObservableArray.of("a", "b", "c"),
        };

        // Execute
        let parsed = parseObservable(state, SIMPLE_STATE);

        // Verify
        assertThat(parsed, eqObservable(state, SIMPLE_STATE), "parsed");
      },
    },
    {
      name: "ParseObservableNestedAllPopulated",
      execute: () => {
        // Execute
        let parsed = parseObservable(
          {
            strValue: "sss",
            one: { videoId: "aks" },
            ones: [13, { videoId: "abs" }],
            two: [{ videoIds: ["aaa", 123] }, 12, "hahaha", { videoIds: true }],
            mess: { userId: "123" },
          },
          NESTED_STATE
        );

        // Verify
        let expected: NestedState = {
          strValue: "sss",
          one: { videoId: "aks" },
          ones: [undefined, { videoId: "abs" }],
          two: ObservableArray.of<TwoState>(
            { videoIds: ObservableArray.of("aaa", undefined) },
            undefined,
            undefined,
            {}
          ),
          mess: { userId: "123" },
        };
        assertThat(parsed, eqObservable(expected, NESTED_STATE), "parsed");
      },
    },
    {
      name: "ParseObservableNestedOverride",
      execute: () => {
        // Prepare
        let original: NestedState = {
          strValue: "1313",
          one: {
            videoId: "aaaa",
          },
          ones: [{ videoId: "1111" }],
          two: ObservableArray.of<TwoState>({}),
          mess: { userId: "id1" },
        };

        // Execute
        let parsed = parseObservable(
          {
            one: { videoId: "bbbb" },
            ones: [{ videoId: "2222" }, { videoId: "1" }],
            two: ["1231", { videoIds: ["abc"] }],
            mess: { userId: "id2" },
          },
          NESTED_STATE,
          original
        );

        // Verify
        let expected: NestedState = {
          one: { videoId: "bbbb" },
          ones: [{ videoId: "2222" }, { videoId: "1" }],
          two: ObservableArray.of(undefined, {
            videoIds: ObservableArray.of("abc"),
          }),
          mess: { userId: "id2" },
        };
        assertThat(parsed, eqObservable(expected, NESTED_STATE), "parsed");
        assertThat(parsed, eq(original), "parsed reference");
      },
    },
  ],
});
