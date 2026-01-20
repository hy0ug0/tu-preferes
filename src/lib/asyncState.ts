export async function runWithBusyState<T>(
  setBusy: (value: boolean) => void,
  action: () => Promise<T>,
): Promise<T> {
  setBusy(true);
  try {
    return await action();
  } finally {
    setBusy(false);
  }
}
