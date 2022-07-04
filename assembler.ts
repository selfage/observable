import { ObservableArray } from "@selfage/observable_array";
import {
  PrimitiveType,
  EnumDescriptor,
  MessageDescriptor,
} from "@selfage/message/descriptor";
import { ObservableDescriptor, ObservableField, ArrayType } from "./descriptor";

export class ObservableAssembler {
  public constructor(
    private sourceCheckFn: (source: any) => boolean,
    private outputNulliyFn: (output?: any) => any,
    private arrayCheckFn: (sourceField: any) => boolean,
    private arrayResetFn: (ret: any, fieldName: string) => void,
    private arrayPopFn: (retArrayField: any, targetLength: number) => void,
    private processPrimitiveType: (
      sourceField: any,
      primitiveType: PrimitiveType,
      outputField?: any
    ) => any,
    private processEnumType: (
      sourceField: any,
      enumType: EnumDescriptor<any>,
      outputField?: any
    ) => any,
    private processMessageType: (
      sourceField: any,
      messageType: MessageDescriptor<any>,
      outputField?: any
    ) => any
  ) {}

  public processObservableType<T>(
    source: any,
    descriptor: ObservableDescriptor<T>,
    output?: T
  ): T {
    if (!this.sourceCheckFn(source)) {
      return this.outputNulliyFn(output);
    }

    let ret: any = output;
    if (!ret) {
      ret = new descriptor.constructor();
    }
    for (let field of descriptor.fields) {
      if (!field.asArray) {
        ret[field.name] = this.processField(
          source[field.name],
          field,
          ret[field.name]
        );
      } else if (!this.arrayCheckFn(source[field.name])) {
        this.arrayResetFn(ret, field.name);
      } else {
        if (!ret[field.name]) {
          switch (field.asArray) {
            case ArrayType.NORMAL:
              ret[field.name] = new Array<any>();
              break;
            case ArrayType.OBSERVABLE:
              ret[field.name] = new ObservableArray<any>();
              break;
          }
        }
        let sourceArrayField = source[field.name];
        let retArrayField = ret[field.name];
        let i = 0;
        for (let element of sourceArrayField) {
          if (i < retArrayField.length) {
            switch (field.asArray) {
              case ArrayType.NORMAL:
                retArrayField[i] = this.processField(
                  element,
                  field,
                  retArrayField[i]
                );
                break;
              case ArrayType.OBSERVABLE:
                retArrayField.set(
                  i,
                  this.processField(element, field, retArrayField.get(i))
                );
                break;
            }
          } else {
            retArrayField.push(this.processField(element, field));
          }
          i++;
        }
        this.arrayPopFn(retArrayField, sourceArrayField.length);
      }
    }
    return ret;
  }

  private processField(
    sourceField: any,
    field: ObservableField,
    outputField?: any
  ): any {
    if (field.primitiveType) {
      let value = this.processPrimitiveType(
        sourceField,
        field.primitiveType,
        outputField
      );
      return value;
    } else if (field.enumType) {
      return this.processEnumType(sourceField, field.enumType, outputField);
    } else if (field.messageType) {
      return this.processMessageType(
        sourceField,
        field.messageType,
        outputField
      );
    } else if (field.observableType) {
      return this.processObservableType(
        sourceField,
        field.observableType,
        outputField
      );
    }
  }
}
