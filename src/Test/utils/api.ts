export async function fetchProductInfo(eancode: string) {
    // alert(eancode)
    try {
      const response = await fetch(`http://217.165.16.202:81/SelfCheckOutAPI/ItemMaster/${eancode}.json`);
      const data = await response.json();
      if (data.status === 1) {
        return {
          product_name: data.product.product_name,
          nutriments: data.product.nutriments,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product info:', error);
      return null;
    }
  }
  
  