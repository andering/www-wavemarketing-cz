type DataLayerEvent = Record<string, unknown>;

export const pushDataLayerEventSafely = (
  dataLayer: unknown,
  event: DataLayerEvent,
) => {
  try {
    if (
      typeof dataLayer !== "object" ||
      dataLayer === null ||
      !("push" in dataLayer) ||
      typeof dataLayer.push !== "function"
    ) {
      return;
    }

    const push = dataLayer.push as (event: DataLayerEvent) => unknown;
    push.call(dataLayer, event);
  } catch {
    // Analytics must never change the result of an accepted submission.
  }
};
