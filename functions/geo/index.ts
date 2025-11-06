interface EORequest extends Request {
  eo: {
    geo: {
      asn: number;
      countryName: string;
      countryCodeAlpha2: string;
      countryCodeAlpha3: string;
      countryCodeNumeric: string;
      regionName: string;
      regionCode: string;
      cityName: string;
      latitude: number;
      longitude: number;
      cisp: string;
    };
    uuid: string;
    clientIp: string;
  };
}

export async  onRequest({ request }: { request: EORequest }) {
  // 2. 在 try 块外部声明 ipData 变量，并给一个初始值
  let ipData = null;
  let error = null;

  try {
    // 3. 使用标准的 fetch 获取公网IP信息
    // ipapi.co 会返回更丰富的信息，包括IP、国家、城市等
    const ipifyResponse = await fetch('https://ipapi.co/json');
    
    // 检查响应是否成功 (HTTP状态码 200-299)
    if (!ipifyResponse.ok) {
      throw new Error(`HTTP error! status: ${ipifyResponse.status}`);
    }
    
    ipData = await ipifyResponse.json();
  } catch (e) {
    // 4. 捕获错误并存入 error 变量
    console.error('Failed to fetch public IP:', e);
    error = e.message;
  }

  // 5. 根据是否成功获取数据，返回不同的响应
  const responseBody = {
    success: error === null,
    data: ipData,
    error: error,
  };

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*', // 允许跨域访问
    },
  });
}
