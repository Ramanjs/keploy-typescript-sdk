/* eslint-disable @typescript-eslint/no-explicit-any */
import { getExecutionContext } from "../../src/context";
import { NO_SQL } from "../../src/keploy";
import { MODE_OFF, MODE_RECORD, MODE_TEST } from "../../src/mode";
import { ProcessDep } from "../../src/util";

// @ts-ignore
export function kDeleteOne(...args) {
  if (
    getExecutionContext() == undefined ||
    getExecutionContext().context == undefined
  ) {
    console.error(
      "keploy context is not present to mock deleteOne dependency call"
    );
    // @ts-ignore
    this.col.prototype.deleteOne.apply(this, args);
    return;
  }

  // fetch the keploy context for API requests
  const ctx = getExecutionContext().context;
  const meta: { [key: string]: string } = {
    name: "deleteOne",
    filter: JSON.stringify(args[0]),
    update: JSON.stringify(args[1]),
    type: NO_SQL,
  };

  switch (ctx.mode) {
    case MODE_RECORD:
      {
        const callback = args[args.length - 1];
        if (typeof callback === "function") {
          // wrap callback of updateOne to capture the mongodb-native-driver outputs
          // @ts-ignore
          args[args.length - 1] = function (...outputs) {
            ProcessDep(meta, ...outputs);
            // calls the actual mongoose callback for findOne
            callback.apply(this, outputs);
          };
        }
      }
      // @ts-ignore
      this.col.prototype.deleteOne.apply(this, args);
      break;
    case MODE_TEST:
      {
        const callback = args[args.length - 1];
        if (typeof callback === "function") {
          // mocked outputs of updateOne opperation
          const outputs: any[] = [null, {}];
          const mocks = ProcessDep(meta, ...outputs);
          // calls the actual mongoose callback for findOne
          // @ts-ignore
          callback.apply(this, mocks);
        }
      }
      break;
    case MODE_OFF:
      // call the actual deleteOne operation
      // @ts-ignore
      this.col.prototype.deleteOne.apply(this, args);
      break;
    default:
      console.debug(
        `keploy mode '${ctx.mode}' is invalid. Modes: 'record' / 'test' / 'off'(default)`
      );
      // @ts-ignore
      this.col.prototype.deleteOne.apply(this, args);
      break;
  }
}

// @ts-ignore
export function kDeleteMany(...args) {
  // checks for the keploy executionContext
  if (
    getExecutionContext() == undefined ||
    getExecutionContext().context == undefined
  ) {
    console.error(
      "keploy context is not present to mock deleteMany dependency call"
    );
    // @ts-ignore
    this.col.prototype.deleteMany.apply(this, args);
    return;
  }

  // fetch the keploy context for API requests
  const ctx = getExecutionContext().context;
  const meta: { [key: string]: string } = {
    name: "deleteMany",
    filter: JSON.stringify(args[0]),
    type: NO_SQL,
  };
  switch (ctx.mode) {
    case MODE_RECORD:
      {
        const callback = args[args.length - 1];
        if (typeof callback === "function") {
          // wrap callback of deleteMany to capture the mongodb-native-driver outputs
          // @ts-ignore
          args[args.length - 1] = function (...outputs) {
            ProcessDep(meta, ...outputs);
            // calls the actual mongoose callback for findOne
            callback.apply(this, outputs);
          };
        }
      }
      // @ts-ignore
      this.col.prototype.deleteMany.apply(this, args);
      break;
    case MODE_TEST:
      {
        const callback = args[args.length - 1];
        if (typeof callback === "function") {
          // mocked outputs of deleteMany opperation
          const outputs: any[] = [null, {}];
          const mocks = ProcessDep(meta, ...outputs);
          // calls the actual mongoose callback for findOne
          // @ts-ignore
          callback.apply(this, mocks);
        }
      }
      break;
    case MODE_OFF:
      // call the actual deleteMany operation
      // @ts-ignore
      this.col.prototype.deleteMany.apply(this, args);
      break;
    default:
      console.debug(
        `keploy mode '${ctx.mode}' is invalid. Modes: 'record' / 'test' / 'off'(default)`
      );
      // @ts-ignore
      this.col.prototype.deleteMany.apply(this, args);
      break;
  }
}
