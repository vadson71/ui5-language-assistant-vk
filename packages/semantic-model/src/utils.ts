import { isEmpty, has } from "lodash";
import {
  BaseUI5Node,
  UI5SemanticModel
} from "@vscode-ui5/semantic-model-types";

export function newMap<T>(): Record<string, T> {
  // Create an object without a prototype so it doesn't have built-in methods like toString
  return Object.create(null);
}

export function getParentFqn(fqn: string, name: string): string | undefined {
  if (!isEmpty(fqn) && fqn.endsWith("." + name)) {
    return fqn.substring(0, fqn.length - (name.length + 1));
  }
  return undefined;
}

/* istanbul ignore next */
export function error(message: string, throwError: boolean): void {
  if (throwError) {
    throw new Error(message);
  } else {
    console.error(message);
  }
}

export function findValueInMaps<T>(
  key: string,
  ...maps: Record<string, T>[]
): T | undefined {
  for (const mapElement of maps) {
    if (has(mapElement, key)) {
      return mapElement[key];
    }
  }
  return undefined;
}

export function forEachSymbol(
  model: UI5SemanticModel,
  iteratee: (v: BaseUI5Node, k: string) => boolean | void
): void {
  const typeMaps = [
    model.classes,
    model.enums,
    model.namespaces,
    model.interfaces,
    model.typedefs,
    model.functions
  ];
  main: for (const mapElement of typeMaps) {
    for (const key in mapElement) {
      const keepIterating = iteratee(mapElement[key], key);
      if (keepIterating === false) {
        break main;
      }
    }
  }
}
