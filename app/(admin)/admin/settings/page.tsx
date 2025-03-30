'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Trash2, RefreshCw, Server, Database, Code, Globe, AlertTriangle, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [clearingCache, setClearingCache] = useState(false)
  const [resettingDatabase, setResettingDatabase] = useState(false)

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the cache?')) {
      return
    }

    try {
      setClearingCache(true)
      await axios.post('/api/admin/settings/clear-cache')
      toast.success('Cache cleared successfully')
    } catch (error) {
      console.error('Error clearing cache:', error)
      toast.error('Failed to clear cache')
    } finally {
      setClearingCache(false)
    }
  }

  const handleResetDatabase = async () => {
    if (!confirm('WARNING: This will reset the database to its initial state. All data will be lost. Are you sure?')) {
      return
    }

    const userInput = prompt('This action cannot be undone. Type "RESET" to confirm.')
    if (userInput !== 'RESET') {
      toast.error('Database reset cancelled')
      return
    }

    try {
      setResettingDatabase(true)
      await axios.post('/api/admin/settings/reset-database')
      toast.success('Database reset successfully')
    } catch (error) {
      console.error('Error resetting database:', error)
      toast.error('Failed to reset database')
    } finally {
      setResettingDatabase(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <RefreshCw className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Cache Management</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Clear the application cache to refresh data and fix potential issues. This will force the application to
              rebuild all cached data.
            </p>
            <Button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {clearingCache ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Clearing Cache...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Clear Cache</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
            <Server className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">System Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Node.js Version</p>
                </div>
                <p className="font-medium text-gray-900">v{process.version}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Next.js Version</p>
                </div>
                <p className="font-medium text-gray-900">15.1.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Environment</p>
                </div>
                <p className="font-medium text-gray-900">{process.env.NODE_ENV}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Database className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Database</p>
                </div>
                <p className="font-medium text-gray-900">PostgreSQL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-red-200">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Warning: Destructive Actions</h3>
                <p className="mt-1 text-sm text-red-700">
                  These actions are destructive and cannot be undone. Please proceed with extreme caution.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="mb-4 sm:mb-0 sm:mr-4">
              <h3 className="text-lg font-medium text-gray-900">Reset Database</h3>
              <p className="text-sm text-gray-500">Reset the database to its initial state. All data will be lost.</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleResetDatabase}
              disabled={resettingDatabase}
              className="flex items-center justify-center gap-2"
            >
              {resettingDatabase ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Reset Database</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
