import * as React from "react";

// Type for the callback function
type Callback<T> = (state: T) => void;

const useStateWithCallback = <T>(
  initialState: T,
  callback: Callback<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState<T>(initialState);

  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current) {
      callback(state);
    } else {
      didMount.current = true;
    }
  }, [state, callback]);

  return [state, setState];
};

const useStateWithCallbackInstant = <T>(
  initialState: T,
  callback: Callback<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState<T>(initialState);

  const didMount = React.useRef(false);

  React.useLayoutEffect(() => {
    if (didMount.current) {
      callback(state);
    } else {
      didMount.current = true;
    }
  }, [state, callback]);

  return [state, setState];
};

const useStateWithCallbackLazy = <T>(
  initialValue: T
): [T, (newValue: T, callback?: Callback<T>) => void] => {
  const callbackRef = React.useRef<Callback<T> | null>(null);

  const [value, setValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value);
      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = React.useCallback(
    (newValue: T, callback?: Callback<T>) => {
      if (callback) {
        callbackRef.current = callback;
      }
      setValue(newValue);
    },
    []
  );

  return [value, setValueWithCallback];
};

export { useStateWithCallbackInstant, useStateWithCallbackLazy };

export default useStateWithCallback;
