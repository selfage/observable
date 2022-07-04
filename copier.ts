import { copyMessage } from "@selfage/message/copier";
import { ObservableDescriptor } from "./descriptor";
import { ObservableAssembler } from "./assembler";

export function checkSourceNonNull(source: any): boolean {
  return Boolean(source);
}

export function nullifyOutput(): any {
  return undefined;
}

export function checkArrayNonNull(sourceField: any): boolean {
  return Boolean(sourceField);
}

export function nullifyArray(ret: any, fieldName: string): void {
  ret[fieldName] = undefined;
}

export function popArrayUntilTargetLength(
  retArrayField: any,
  targetLength: number
): void {
  for (let i = retArrayField.length; i > targetLength; i--) {
    retArrayField.pop();
  }
}

export function copyField(sourceField: any): any {
  return sourceField;
}

export let OBSERVABLE_COPIER = new ObservableAssembler(
  checkSourceNonNull,
  nullifyOutput,
  checkArrayNonNull,
  nullifyArray,
  popArrayUntilTargetLength,
  copyField,
  copyField,
  copyMessage
);

export function copyObservable<T>(
  from: T,
  descriptor: ObservableDescriptor<T>,
  to?: T
): T {
  return OBSERVABLE_COPIER.processObservableType(from, descriptor, to);
}
