import { ObservableDescriptor, ArrayType } from '../descriptor';
import { PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';
import { ObservableArray } from '@selfage/observable_array';

export class SimpleState {
  public numValue?: number;
  public strValue?: string;
  public boolValue?: boolean;
  public numArray?: Array<number>;
  public strArray?: Array<string>;
  public boolArray?: Array<boolean>;
  public numObArray?: ObservableArray<number>;
  public strObArray?: ObservableArray<string>;
  public boolObArray?: ObservableArray<boolean>;
}

export let SIMPLE_STATE: ObservableDescriptor<SimpleState> = {
  name: 'SimpleState',
  constructor: SimpleState,
  fields: [
    {
      name: 'numValue',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'strValue',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'boolValue',
      primitiveType: PrimitiveType.BOOLEAN,
    },
    {
      name: 'numArray',
      primitiveType: PrimitiveType.NUMBER,
      asArray: ArrayType.NORMAL,
    },
    {
      name: 'strArray',
      primitiveType: PrimitiveType.STRING,
      asArray: ArrayType.NORMAL,
    },
    {
      name: 'boolArray',
      primitiveType: PrimitiveType.BOOLEAN,
      asArray: ArrayType.NORMAL,
    },
    {
      name: 'numObArray',
      primitiveType: PrimitiveType.NUMBER,
      asArray: ArrayType.OBSERVABLE,
    },
    {
      name: 'strObArray',
      primitiveType: PrimitiveType.STRING,
      asArray: ArrayType.OBSERVABLE,
    },
    {
      name: 'boolObArray',
      primitiveType: PrimitiveType.BOOLEAN,
      asArray: ArrayType.OBSERVABLE,
    },
  ]
};

export class OneState {
  public videoId?: string;
}

export let ONE_STATE: ObservableDescriptor<OneState> = {
  name: 'OneState',
  constructor: OneState,
  fields: [
    {
      name: 'videoId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
}

export class TwoState {
  public videoIds?: ObservableArray<string>;
}

export let TWO_STATE: ObservableDescriptor<TwoState> = {
  name: 'TwoState',
  constructor: TwoState,
  fields: [
    {
      name: 'videoIds',
      primitiveType: PrimitiveType.STRING,
      asArray: ArrayType.OBSERVABLE,
    },
  ]
}

export interface OneMessage {
  userId?: string;
}

export let ONE_MESSAGE: MessageDescriptor<OneMessage> = {
  name: 'OneMessage',
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    }
  ]
}

export class NestedState {
  public strValue?: string;
  public one?: OneState;
  public ones?: Array<OneState>;
  public two?: ObservableArray<TwoState>;
  public mess?: OneMessage;
}

export let NESTED_STATE: ObservableDescriptor<NestedState> = {
  name: 'NestedState',
  constructor: NestedState,
  fields: [
    {
      name: 'strValue',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'one',
      observableType: ONE_STATE,
    },
    {
      name: 'ones',
      observableType: ONE_STATE,
      asArray: ArrayType.NORMAL,
    },
    {
      name: 'two',
      observableType: TWO_STATE,
      asArray: ArrayType.OBSERVABLE,
    },
    {
      name: 'mess',
      messageType: ONE_MESSAGE,
    },
  ]
}
