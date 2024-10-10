const isFulfilled = <T>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === "fulfilled";

const isRejected = <T>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === "rejected";

function unwrapPromiseSettled<T>(responses: PromiseSettledResult<T>[]) {
  const data = responses.filter(isFulfilled).map((p) => p.value);
  const errors = responses
    .filter(isRejected)
    .map((p) => (p.reason?.message as string) || "Algo deu errado");
  return [data, errors] as const;
}

export { isFulfilled, isRejected, unwrapPromiseSettled };
