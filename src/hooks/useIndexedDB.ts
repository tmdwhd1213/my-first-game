import { useState, useEffect } from 'react'
import { openDB, addData, getData, getAllData } from '../utils/indexedDB'

const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    const initializeDB = async () => {
      const database = await openDB()
      setDb(database)
    }

    initializeDB()
  }, [])

  const add = async (data: any) => {
    if (!db) throw new Error('Database not initialized')
    await addData(db, data)
  }

  const get = async (key: number | string) => {
    if (!db) throw new Error('Database not initialized')
    return await getData(db, key)
  }

  const getAll = async () => {
    if (!db) throw new Error('Database not initialized')
    return await getAllData(db)
  }

  //   const remove = async (key: number | string) => {
  //     if (!db) throw new Error('Database not initialized')
  //     await deleteData(db, key)
  //   }

  return { add, get, getAll }
}

export default useIndexedDB
