import { getRequestError, getRequestResult } from './indexedDBUtil'

export const dbName = 'gameDB'
export const storeName = 'players'

export const openDB = (version = 1): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = (event) => {
      const db = getRequestResult<IDBDatabase>(event)
      // players 스토어 추가
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('users', 'users') // 이름으로 검색할 수 있도록 인덱스 추가
      }
    }

    request.onsuccess = (event) => {
      const db = getRequestResult<IDBDatabase>(event)
      resolve(db)
    }

    request.onerror = (event) => {
      const error = getRequestError(event)
      reject(error)
    }
  })
}
