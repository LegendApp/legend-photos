import type { Observable } from '@legendapp/state';
import type React from 'react';
import { type ComponentProps, memo, useLayoutEffect } from 'react';

export type TypedMemo = <T extends React.ComponentType<any>>(
  Component: T,
  propsAreEqual?: (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
  ) => boolean
) => T & { displayName?: string };

export const typedMemo = memo as TypedMemo;

interface HookToObservableProps<T, T2> {
  value$: Observable<T>;
  hook: () => T;
  if?: (value: T) => boolean;
  getValue?: (value: T) => T2;
}
export const HookToObservable = typedMemo(function HookToObservable<T, T2 = T>({
  value$,
  hook,
  if: ifProp,
  getValue,
}: HookToObservableProps<T, T2>) {
  const value = hook();

  useLayoutEffect(() => {
    if (!ifProp || ifProp(value)) {
      const valueToSet = getValue ? getValue(value) : value;
      (value$ as Observable<any>).set(valueToSet);
    }
  }, [value, ifProp, value$, getValue]);

  // This component doesn't render anything
  return null;
});
