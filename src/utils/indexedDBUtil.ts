export const getRequestResult = <T>(event: Event): T => {
  return (event.target as IDBRequest).result as T
}

export const getRequestError = (event: Event): DOMException | null => {
  return (event.target as IDBRequest).error
}
