export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiRequest = async <T>(
    endpoint: string, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: any
      headers?: Record<string, string>
    } = {}
  ): Promise<{ data: T | null; error: string | null; status: number }> => {
    try {
      const { method = 'GET', body, headers = {} } = options
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }

      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body)
      }

      const response = await fetch(`${config.public.apiBase}${endpoint}`, fetchOptions)
      
      const result = await response.json()
      
      return {
        data: response.ok ? result.data : null,
        error: response.ok ? null : result.error || 'An error occurred',
        status: response.status
      }
    } catch (error) {
      console.error('API Request Error:', error)
      return {
        data: null,
        error: 'Network error occurred',
        status: 0
      }
    }
  }

  return {
    apiRequest
  }
}