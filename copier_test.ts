import { copyObservable } from "./copier";
import {
  NestedState,
  NESTED_STATE,
} from "./test_data/state";
import { eqObservable } from "./test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";
import { ObservableArray } from "@selfage/observable_array";

TEST_RUNNER.run({
  name: "CopierTest",
  cases: [
    {
      name: "CopyObservableNested",
      execute: () => {
        // Prepare
        let source: NestedState = {
          strValue: "std",
          one: { videoId: "ppp" },
          ones: [{ videoId: "ooo" }, { videoId: "lll" }, { videoId: "kkkkkk" }],
          two: ObservableArray.of(
            { videoIds: ObservableArray.of("11111", "2222", "1331") },
            { videoIds: ObservableArray.of() }
          ),
          mess: { userId: "id" },
        };

        // Execute
        let ret = copyObservable(source, NESTED_STATE);

        // Verify
        assertThat(ret, eqObservable(source, NESTED_STATE), "copied");
      },
    },
    {
      name: "CopyMessageNestedInPlaceOverrides",
      execute: () => {
        // Prepare
        let source: NestedState = {
          strValue: "std",
          one: { videoId: "ppp" },
          ones: [{ videoId: "lll" }, { videoId: "kkkkkk" }],
          two: ObservableArray.of(
            { videoIds: ObservableArray.of("11111", "1331") },
            { videoIds: ObservableArray.of() },
            { videoIds: ObservableArray.of("232323") }
          ),
          mess: { userId: "id1" },
        };
        let dest: NestedState = {
          strValue: "std",
          one: { videoId: "aaa" },
          ones: [{ videoId: "lll" }, { videoId: "aaaaa" }, { videoId: "mmmm" }],
          two: ObservableArray.of(
            { videoIds: ObservableArray.of("11111", "2222", "1331") },
            { videoIds: ObservableArray.of() }
          ),
          mess: { userId: "id2" },
        };

        // Execute
        let ret = copyObservable(source, NESTED_STATE, dest);

        // Verify
        assertThat(dest, eqObservable(source, NESTED_STATE), "copied");
        assertThat(ret, eq(dest), "copied reference");
      },
    },
  ],
});
