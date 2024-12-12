export async function fetchProductInfo(eancode: string, companyID: string, brandID: string) {
  try {
    // Data you want to send in x-www-form-urlencoded format
    const data = {
      eancode,
      companyID,
      brandID
    };

    // Convert data to x-www-form-urlencoded format
    const urlEncodedData = new URLSearchParams(data).toString();

    // Sending the request as a POST with x-www-form-urlencoded data
    const response = await fetch('http://217.165.16.202:81/SelfCheckOutAPI/ItemMaster', {
      method: 'POST', // Change to POST if you want to send data
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData, // Include the URL-encoded data as the body
    });

    // Check if the response is successful
    const responseData = await response.json();

    if (responseData.status === 1) {
      return {
        product_name: responseData.product.product_name,
        nutriments: responseData.product.nutriments,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
}
