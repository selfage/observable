import { ObservableDescriptor, ObservableField, ArrayType } from "./descriptor";
import {
  MatchFn,
  assertThat,
  eq,
  assert,
  eqArray,
} from "@selfage/test_matcher";
import { eqMessageField } from "@selfage/message/test_matcher";
import { eqObservableArray } from "@selfage/observable_array/test_matcher";

export function eqObservable<T>(
  expected: T | undefined,
  descriptor: ObservableDescriptor<T>
): MatchFn<T> {
  return (actual) => {
    if (expected === undefined) {
      assertThat(actual, eq(undefined), "nullity");
      return;
    }
    assert(Boolean(actual), `to not be null`, `null`);
    let expectedAny = expected as any;
    let actualAny = actual as any;
    for (let fieldDescriptor of descriptor.fields) {
      let fieldMatcher: MatchFn<any>;
      if (!fieldDescriptor.asArray) {
        fieldMatcher = eqObservableField(
          expectedAny[fieldDescriptor.name],
          fieldDescriptor
        );
      } else {
        let eqElements: Array<MatchFn<any>>;
        if (expectedAny[fieldDescriptor.name] !== undefined) {
          eqElements = new Array<MatchFn<any>>();
          for (let element of expectedAny[fieldDescriptor.name]) {
            eqElements.push(eqObservableField(element, fieldDescriptor));
          }
        }
        switch (fieldDescriptor.asArray) {
          case ArrayType.NORMAL:
            fieldMatcher = eqArray(eqElements);
            break;
          case ArrayType.OBSERVABLE:
            fieldMatcher = eqObservableArray(eqElements);
            break;
        }
      }
      assertThat(
        actualAny[fieldDescriptor.name],
        fieldMatcher,
        `${fieldDescriptor.name} field`
      );
    }
  };
}

export function eqObservableField(
  expectedField: any,
  fieldDescriptor: ObservableField
): MatchFn<any> {
  if (fieldDescriptor.observableType) {
    return eqObservable(expectedField, fieldDescriptor.observableType);
  } else {
    return eqMessageField(expectedField, fieldDescriptor);
  }
}
