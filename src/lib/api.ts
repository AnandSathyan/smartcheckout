import { Product } from "../types/Product"

export async function fetchProductInfo(code: string, storeId: string, machineId: string): Promise<Product | null> {
  // This is a mock implementation. In a real-world scenario, you would make an API call here.
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

  // Mock product data

  const mockProducts: { [key: string]: Product } = {
    //@ts-ignore
    "123456": { id: 123456, name: "Sample Product 1", price: 9.99 },
    //@ts-ignore
    "789012": { id: 789012, name: "Sample Product 2", price: 14.99 },
    // Add more mock products as needed
  }

  return mockProducts[code] || null
}

