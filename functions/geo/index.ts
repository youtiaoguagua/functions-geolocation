// 1. 定义接口，注意这里是 'IpInfo'
interface IpInfo {
  ip: string;
  network: string;
  version: 'IPv4' | 'IPv6';
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  latitude: number;
  longitude: number;
  // ... 其他字段
}

interface ApiResponse {
  success: boolean;
  data: IpInfo | null; // 这里也使用 'IpInfo'
  error: string | null;
}

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  let ipData: IpInfo | null = null; // 这里也使用 'IpInfo'
  let errorMessage: string | null = null;

  try {
    const ipifyResponse = await fetch('https://whois.pconline.com.cn/ipJson.jsp?ip=&json=true');
    
    if (!ipifyResponse.ok) {
      throw new Error(`HTTP error! status: ${ipifyResponse.status}`);
    }
    
    // --- 第 23 行附近的代码 ---
    // 确保这里使用的是大写的 'IpInfo'
    ipData = (await ipifyResponse.json()) as IpInfo;

  } catch (e: unknown) {
    console.error('Failed to fetch public IP:', e);
    
    if (e instanceof Error) {
      errorMessage = e.message;
    } else {
      errorMessage = String(e);
    }
  }

  const responseBody: ApiResponse = {
    success: errorMessage === null,
    data: ipData,
    error: errorMessage,
  };

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
