import { ObservableArray } from "@selfage/observable_array";
import {
  parsePrimitive,
  parseEnum,
  parseMessage,
} from "@selfage/message/parser";
import { ObservableDescriptor } from "./descriptor";
import { ObservableAssembler } from "./assembler";

export function checkSourceNonNull(source: any): boolean {
  return Boolean(source) && typeof source === "object";
}

export function nullifyOutput(): any {
  return undefined;
}

export function checkArrayType(sourceField: any): boolean {
  return Array.isArray(sourceField) || sourceField instanceof ObservableArray;
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

export let OBSERVABLE_PARSER = new ObservableAssembler(
  checkSourceNonNull,
  nullifyOutput,
  checkArrayType,
  nullifyArray,
  popArrayUntilTargetLength,
  parsePrimitive,
  parseEnum,
  parseMessage
);

export function parseObservable<T>(
  raw: any,
  descriptor: ObservableDescriptor<T>,
  output?: T
): T {
  return OBSERVABLE_PARSER.processObservableType(raw, descriptor, output);
}
