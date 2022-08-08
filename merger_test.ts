import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import { NestedState, NESTED_STATE } from "./test_data/state";
import { mergeObservable } from "./merger";
import { eqObservable } from "./test_matcher";
import { ObservableArray } from "@selfage/observable_array";

TEST_RUNNER.run({
  name: "MergerTest",
  cases: [
    {
      name: "MergeMessageNested",
      execute: () => {
        // Prepare
        let existing: NestedState = {
          strValue: "std",
          one: { videoId: "ppp" },
          ones: [{ videoId: "ooo" }, { videoId: "lll" }, { videoId: "kkkkkk" }],
          two: ObservableArray.of(
            { videoIds: ObservableArray.of("11111", "2222") },
            { videoIds: ObservableArray.of("ahahahaha") },
            { videoIds: ObservableArray.of("ababababab") }
          ),
          mess: { userId: "id2" },
        };
        let source: NestedState = {
          strValue: "std",
          ones: [{}, { videoId: "lll" }, { videoId: "llllll" }],
          two: ObservableArray.of(
            { videoIds: ObservableArray.of("11111", "3333", "1331") },
            {},
            { videoIds: ObservableArray.of() }
          ),
          mess: { userId: "id1" },
        };

        // Execute
        let ret = mergeObservable(source, NESTED_STATE, existing);

        // Verify
        assertThat(
          existing,
          eqObservable(
            {
              strValue: "std",
              one: { videoId: "ppp" },
              ones: [
                { videoId: "ooo" },
                { videoId: "lll" },
                { videoId: "llllll" },
              ],
              two: ObservableArray.of(
                { videoIds: ObservableArray.of("11111", "3333", "1331") },
                { videoIds: ObservableArray.of("ahahahaha") },
                { videoIds: ObservableArray.of("ababababab") }
              ),
              mess: { userId: "id1" },
            },
            NESTED_STATE
          ),
          "merged"
        );
        assertThat(ret, eq(existing), "merged reference");
      },
    },
  ],
});
