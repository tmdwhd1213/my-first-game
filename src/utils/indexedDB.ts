import { getRequestError, getRequestResult } from './indexedDBUtil'

const dbName = 'myDatabase'
const storeName = 'myStore'

export const openDB = (version = 1): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = (event) => {
      const db = getRequestResult<IDBDatabase>(event)
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' })
      }
    }

    request.onsuccess = (event) => {
      const db = getRequestResult<IDBDatabase>(event)
      return resolve(db)
    }

    request.onerror = (event) => {
      const error = getRequestError(event)
      return reject(error)
    }
  })
}

export const addData = (db: IDBDatabase, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.add(data)

    request.onsuccess = () => resolve()
    request.onerror = (event) => {
      const error = getRequestError(event)
      reject(error)
    }
  })
}

export const getData = (
  db: IDBDatabase,
  key: number | string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = (event) => {
      const result = getRequestResult<IDBDatabase>(event)
      resolve(result)
    }

    request.onerror = (event) => {
      const error = getRequestError(event)
      reject(error)
    }
  })
}

export const getAllData = (db: IDBDatabase): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result
      resolve(result)
    }

    request.onerror = (event) => {
      const error = getRequestError(event)
      reject(error)
    }
  })
}
