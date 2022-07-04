import { ObservableDescriptor } from "./descriptor";
import { ObservableAssembler } from "./assembler";
import { mergeMessage } from "@selfage/message/merger";

export function checkSourceNonNull(source: any): boolean {
  return Boolean(source);
}

export function acceptOutput(output?: any): any {
  return output;
}

export function checkArrayNonNull(sourceField: any): boolean {
  return Boolean(sourceField);
}

export function noop(): void {}

export function mergeField(
  sourceField: any,
  type: any,
  outputField?: any
): any {
  if (sourceField !== undefined) {
    return sourceField;
  } else {
    return outputField;
  }
}

export let OBSERVABLE_MERGER = new ObservableAssembler(
  checkSourceNonNull,
  acceptOutput,
  checkArrayNonNull,
  noop,
  noop,
  mergeField,
  mergeField,
  mergeMessage
);

export function mergeObservable<T>(
  from: T,
  descriptor: ObservableDescriptor<T>,
  to?: T
): T {
  return OBSERVABLE_MERGER.processObservableType(from, descriptor, to);
}
