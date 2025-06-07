import mysql from 'mysql2/promise'
import { EventEmitter } from 'events'

// Enhanced connection pool configuration with valid MySQL2 options only
const poolConfig = {
  host: process.env.DB_HOST || 'srv1835.hstgr.io',
  user: process.env.DB_USER || 'u725458043_ryntlntno',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u725458043_rtlntnodev',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 100,
  maxIdle: parseInt(process.env.DB_MAX_IDLE) || 10,
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 60000,
  charset: 'utf8mb4',
  timezone: '+08:00', // Change to Philippines timezone
  multipleStatements: false,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  } : false,
  enableKeepAlive: true,
  keepAliveInitialDelay: 300000,
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT) || 20000,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true, // Change to true to handle dates as strings
  debug: false,
  trace: false,
}

// Separate reconnection settings (handled by our pool manager)
const reconnectionConfig = {
  maxReconnectAttempts: parseInt(process.env.DB_MAX_RECONNECT_ATTEMPTS) || 10,
  reconnectInterval: parseInt(process.env.DB_RECONNECT_INTERVAL) || 5000,
  exponentialBackoff: true,
  maxReconnectDelay: 30000
}

// Pool management class
class DatabasePoolManager extends EventEmitter {
  constructor() {
    super()
    this.pool = null
    this.isHealthy = true
    this.reconnectAttempts = 0
    this.healthCheckInterval = null
    this.connectionAttempts = 0
    this.lastConnectionTime = null
    this.stats = {
      totalConnections: 0,
      activeConnections: 0,
      queuedRequests: 0,
      errors: 0,
      lastError: null,
      queryCount: 0,
      slowQueries: 0,
      averageQueryTime: 0
    }
    this.queryTimes = []
  }

  createPool() {
    if (this.pool) {
      return this.pool
    }

    try {
      this.pool = mysql.createPool(poolConfig)
      this.setupPoolEventHandlers()
      this.startHealthCheck()
      this.lastConnectionTime = Date.now()
      console.log('Database pool created successfully')
      return this.pool
    } catch (error) {
      console.error('Failed to create database pool:', error)
      throw error
    }
  }

  setupPoolEventHandlers() {
    this.pool.on('connection', (connection) => {
      console.log('New database connection established:', connection.threadId)
      this.stats.totalConnections++
      this.connectionAttempts = 0 // Reset on successful connection
      this.emit('connection', connection)
    })

    this.pool.on('acquire', (connection) => {
      this.stats.activeConnections++
      this.emit('acquire', connection)
    })

    this.pool.on('release', (connection) => {
      this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1)
      this.emit('release', connection)
    })

    this.pool.on('error', (error) => {
      console.error('Database pool error:', error)
      this.stats.errors++
      this.stats.lastError = {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      }
      this.isHealthy = false
      this.emit('error', error)
    })

    this.pool.on('enqueue', () => {
      this.stats.queuedRequests++
      this.emit('enqueue')
    })
  }

  startHealthCheck() {
    // Clear existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.healthCheck()
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }, 30000) // Check every 30 seconds
  }

  async healthCheck() {
    try {
      const connection = await this.pool.getConnection()
      const startTime = Date.now()
      
      // Test connection with a simple query
      await connection.execute('SELECT 1 as test')
      
      const duration = Date.now() - startTime
      connection.release()
      
      if (!this.isHealthy) {
        console.log('Database connection restored')
        this.isHealthy = true
        this.reconnectAttempts = 0
        this.emit('restored')
      }

      // Update stats
      this.updateQueryStats(duration)
      
    } catch (error) {
      console.error('Health check failed:', error)
      this.isHealthy = false
      await this.handleConnectionFailure()
    }
  }

  async handleConnectionFailure() {
    this.reconnectAttempts++
    
    if (this.reconnectAttempts <= reconnectionConfig.maxReconnectAttempts) {
      const delay = reconnectionConfig.exponentialBackoff 
        ? Math.min(
            reconnectionConfig.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
            reconnectionConfig.maxReconnectDelay
          )
        : reconnectionConfig.reconnectInterval

      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${reconnectionConfig.maxReconnectAttempts}) in ${delay}ms`)
      
      setTimeout(async () => {
        try {
          await this.recreatePool()
        } catch (error) {
          console.error('Reconnection failed:', error)
        }
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
      this.emit('maxReconnectAttemptsReached')
    }
  }

  async recreatePool() {
    try {
      if (this.pool) {
        await this.gracefulShutdown()
      }
      
      this.pool = null
      this.createPool()
      console.log('Database pool recreated successfully')
      this.emit('poolRecreated')
    } catch (error) {
      console.error('Failed to recreate pool:', error)
      throw error
    }
  }

  async gracefulShutdown() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }

    if (this.pool) {
      try {
        // Wait for active connections to finish
        const maxWait = 10000 // 10 seconds
        const startTime = Date.now()
        
        while (this.stats.activeConnections > 0 && (Date.now() - startTime) < maxWait) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        await this.pool.end()
        console.log('Database pool closed gracefully')
      } catch (error) {
        console.error('Error during graceful shutdown:', error)
      }
    }
  }

  updateQueryStats(duration = 0) {
    this.stats.queryCount++
    this.queryTimes.push(duration)
    
    // Keep only last 100 query times for average calculation
    if (this.queryTimes.length > 100) {
      this.queryTimes.shift()
    }
    
    this.stats.averageQueryTime = this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length
    
    if (duration > 5000) {
      this.stats.slowQueries++
    }
  }

  getStats() {
    return {
      ...this.stats,
      isHealthy: this.isHealthy,
      reconnectAttempts: this.reconnectAttempts,
      uptime: this.lastConnectionTime ? Date.now() - this.lastConnectionTime : 0,
      poolConfig: {
        connectionLimit: poolConfig.connectionLimit,
        queueLimit: poolConfig.queueLimit,
        maxIdle: poolConfig.maxIdle,
        idleTimeout: poolConfig.idleTimeout,
        acquireTimeout: poolConfig.acquireTimeout
      },
      reconnectionConfig
    }
  }

  async closePool() {
    await this.gracefulShutdown()
    this.pool = null
  }
}

// Create singleton instance
const poolManager = new DatabasePoolManager()

// Enhanced connection acquisition with circuit breaker pattern
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureThreshold = threshold
    this.timeout = timeout
    this.failureCount = 0
    this.lastFailureTime = null
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  onSuccess() {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
}

const circuitBreaker = new CircuitBreaker()

// Get pool instance
export const getPool = () => {
  return poolManager.createPool()
}

// Enhanced execute query with circuit breaker and monitoring
export const executeQuery = async (query, params = [], options = {}) => {
  const { 
    retries = 3, 
    retryDelay = 1000,
    timeout = 30000 
  } = options

  return await circuitBreaker.execute(async () => {
    let lastError = null
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const pool = getPool()
        const startTime = Date.now()
        
        // Set query timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout')), timeout)
        })
        
        const queryPromise = pool.execute(query, params)
        const [rows, fields] = await Promise.race([queryPromise, timeoutPromise])
        
        const duration = Date.now() - startTime
        
        // Update stats
        poolManager.updateQueryStats(duration)
        
        // Log slow queries
        if (duration > 5000) {
          console.warn(`Slow query detected (${duration}ms):`, query.substring(0, 100))
        }
        
        return { 
          success: true, 
          data: rows, 
          fields,
          duration,
          attempt
        }
      } catch (error) {
        lastError = error
        console.error(`Query attempt ${attempt} failed:`, error.message)
        
        // Don't retry on certain errors
        if (error.code === 'ER_BAD_DB_ERROR' || 
            error.code === 'ER_ACCESS_DENIED_ERROR' ||
            error.code === 'ER_PARSE_ERROR' ||
            error.code === 'ER_NO_SUCH_TABLE') {
          break
        }
        
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError || new Error('Unknown error')
  }).catch(error => ({
    success: false,
    error: error.message,
    code: error.code,
    attempts: retries
  }))
}

// Transaction support
export const executeTransaction = async (queries) => {
  const connection = await getPool().getConnection()
  
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params || [])
      results.push(rows)
    }
    
    await connection.commit()
    return { success: true, data: results }
  } catch (error) {
    await connection.rollback()
    console.error('Transaction failed:', error)
    return { success: false, error: error.message }
  } finally {
    connection.release()
  }
}

// Batch operations
export const executeBatch = async (query, paramSets) => {
  const connection = await getPool().getConnection()
  
  try {
    const results = []
    for (const params of paramSets) {
      const [rows] = await connection.execute(query, params)
      results.push(rows)
    }
    
    return { success: true, data: results }
  } catch (error) {
    console.error('Batch execution failed:', error)
    return { success: false, error: error.message }
  } finally {
    connection.release()
  }
}

// Get single record
export const getOne = async (table, conditions = {}, select = '*') => {
  const whereClause = Object.keys(conditions).length > 0 
    ? 'WHERE ' + Object.keys(conditions).map(key => `\`${key}\` = ?`).join(' AND ')
    : ''
  
  const query = `SELECT ${select} FROM ${table} ${whereClause} LIMIT 1`
  const params = Object.values(conditions)
  
  const result = await executeQuery(query, params)
  return result.success ? result.data[0] || null : null
}

// Get multiple records
export const getMany = async (table, conditions = {}, options = {}) => {
  const {
    select = '*',
    orderBy = 'id DESC',
    limit = null,
    offset = 0
  } = options

  const whereClause = Object.keys(conditions).length > 0 
    ? 'WHERE ' + Object.keys(conditions).map(key => `\`${key}\` = ?`).join(' AND ')
    : ''

  const limitClause = limit ? `LIMIT ${limit} OFFSET ${offset}` : ''
  
  const query = `SELECT ${select} FROM ${table} ${whereClause} ORDER BY ${orderBy} ${limitClause}`
  const params = Object.values(conditions)
  
  const result = await executeQuery(query, params)
  return result.success ? result.data : []
}

// Insert record
export const insertRecord = async (tableName, data) => {
  try {
    const columns = Object.keys(data).map(col => `\`${col}\``).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
    
    const connection = await getPool().getConnection();
    const [result] = await connection.execute(query, values);
    await connection.release();
    
    return result.insertId;
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    return null;
  }
}

// Update record
export const updateRecord = async (table, data, conditions) => {
  const setClause = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ')
  const whereClause = Object.keys(conditions).map(key => `\`${key}\` = ?`).join(' AND ')
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
  const params = [...Object.values(data), ...Object.values(conditions)]
  
  const result = await executeQuery(query, params)
  return result.success ? result.data.affectedRows : 0
}

// Delete record
export const deleteRecord = async (table, conditions) => {
  const whereClause = Object.keys(conditions).map(key => `\`${key}\` = ?`).join(' AND ')
  const query = `DELETE FROM ${table} WHERE ${whereClause}`
  const params = Object.values(conditions)
  
  const result = await executeQuery(query, params)
  return result.success ? result.data.affectedRows : 0
}

// Get count
export const getCount = async (table, conditions = {}) => {
  const whereClause = Object.keys(conditions).length > 0 
    ? 'WHERE ' + Object.keys(conditions).map(key => `\`${key}\` = ?`).join(' AND ')
    : ''
  
  const query = `SELECT COUNT(*) as count FROM ${table} ${whereClause}`
  const params = Object.values(conditions)
  
  const result = await executeQuery(query, params)
  return result.success ? result.data[0].count : 0
}

// Enhanced utility functions
export const getPoolStats = () => poolManager.getStats()

export const closePool = async () => {
  await poolManager.closePool()
}

// Health check endpoint
export const isHealthy = () => poolManager.isHealthy

// Event listeners for monitoring
export const onPoolEvent = (event, callback) => {
  poolManager.on(event, callback)
}

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database pool...')
  await closePool()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database pool...')
  await closePool()
  process.exit(0)
})