import { PrimitiveType, EnumDescriptor, MessageDescriptor } from "@selfage/message/descriptor";

export enum ArrayType {
  NOT_AN_ARRAY = 0,
  NORMAL = 1,
  OBSERVABLE = 2,
}

export interface ObservableField {
  name: string;
  primitiveType?: PrimitiveType;
  enumType?: EnumDescriptor<any>;
  messageType?: MessageDescriptor<any>;
  observableType?: ObservableDescriptor<any>;
  asArray?: ArrayType;
}

export interface ObservableDescriptor<T> {
  name: string;
  constructor: new () => T;
  fields?: ObservableField[];
}
