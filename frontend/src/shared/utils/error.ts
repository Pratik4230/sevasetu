export function getErrorMessage(error: any, fallback: string) {
  const apiMessage = error?.response?.data?.message;
  const apiData = error?.response?.data?.data;

  if (Array.isArray(apiData) && apiData.length > 0) {
    const firstMessage = apiData[0]?.message;
    if (typeof firstMessage === "string" && firstMessage.trim()) {
      return firstMessage;
    }
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return fallback;
}
