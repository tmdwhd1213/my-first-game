import { useState, useEffect } from 'react'
import { addUser, getUserByUsername, getAllUsers } from '../utils/indexedDB'
import { openDB } from '@/utils/idb'

// User 타입 정의
export interface User {
  username: string
  password: string
}

const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeDB = async () => {
      const database = await openDB()
      setDb(database)
    }

    initializeDB()
  }, [])

  const add = async (data: any) => {
    try {
      if (!db) throw new Error('Database not initialized')
      await addUser(db, data)
    } catch (error: any) {
      setError(error)
      throw error
    }
  }

  const get = async (key: string) => {
    if (!db) throw new Error('Database not initialized')
    return await getUserByUsername(db, key)
  }

  const getAll = async () => {
    if (!db) throw new Error('Database not initialized')
    return await getAllUsers(db)
  }

  return { add, get, getAll, error }
}

export default useIndexedDB
