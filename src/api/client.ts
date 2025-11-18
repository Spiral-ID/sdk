import { AuthResponse, Spiral, CreateSpiralOptions, ApiError } from '../types'

export class SpiralApiClient {
  private baseUrl: string
  private authToken?: string

  constructor(baseUrl: string = 'https://api.spiralid.com') {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string): void {
    this.authToken = token
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let error: ApiError
      
      try {
        error = await response.json()
      } catch {
        error = {
          message: response.statusText,
          code: `HTTP_${response.status}`,
        }
      }
      
      throw new Error(error.message)
    }

    return response.json()
  }

  async getSpirals(): Promise<Spiral[]> {
    const response = await fetch(`${this.baseUrl}/api/spirals`, {
      headers: this.getHeaders(),
    })

    return this.handleResponse<Spiral[]>(response)
  }

  async getSpiral(spiralId: string): Promise<Spiral> {
    const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
      headers: this.getHeaders(),
    })

    return this.handleResponse<Spiral>(response)
  }

  async createSpiral(options: CreateSpiralOptions): Promise<Spiral> {
    const response = await fetch(`${this.baseUrl}/api/spirals`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    return this.handleResponse<Spiral>(response)
  }

  async updateSpiral(spiralId: string, metadata: Record<string, any>): Promise<Spiral> {
    const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ metadata }),
    })

    return this.handleResponse<Spiral>(response)
  }

  async deleteSpiral(spiralId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/spirals/${spiralId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to delete spiral')
    }
  }

  async getUserProfile(address: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/users/${address}`, {
      headers: this.getHeaders(),
    })

    return this.handleResponse(response)
  }
}