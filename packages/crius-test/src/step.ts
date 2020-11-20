import { Step as BaseStep, StepFunction as BaseStepFunction } from "crius";
import { Hooks } from "crius-runner";

export interface BaseContext<P = {}, C = {}> extends Hooks<P, C> {
  title?: string;
  example?: any;
}

export class Step<P = {}, C = {}> extends BaseStep<P, C & BaseContext<P, C>> {
  static title?: string;
  static handleParams?(handleParams: any[]): any[];
  static examples?: any[];
  static context?: any;
  static test?(...args: any[]): void;
  static skip?(...args: any[]): void;
  static beforeEach?(...args: any[]): void;
  static afterEach?(...args: any[]): void;
  static plugins?: any[];
  run() {}

  // TODO ts ignore with non-react jsx
  render() {
    return null;
  }
  setState() {}
  forceUpdate() {}
  state: any;
  refs: any;
  // TODO ts ignore with non-react jsx
}

export interface StepFunction<P = {}, C = {}>
  extends BaseStepFunction<P, C & BaseContext<P, C>> {}
