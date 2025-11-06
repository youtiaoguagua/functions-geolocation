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

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  // 3. 在 try 块外部声明变量，并明确指定其类型
  let ipData: IpInfo | null = null;
  let errorMessage: string | null = null;

  try {
    // 使用标准的 fetch 获取公网IP信息
    const ipifyResponse = await fetch('https://ipapi.co/json');
    
    // 检查响应是否成功 (HTTP状态码 200-299)
    if (!ipifyResponse.ok) {
      // 抛出一个错误，可以被 catch 块捕获
      throw new Error(`HTTP error! status: ${ipifyResponse.status}`);
    }
    
    // 4. 使用类型断言告诉 TypeScript fetch 的结果符合 IpInfo 接口
    // 在生产环境中，你可能需要更严格的运行时验证来确保数据结构正确。
    ipData = (await ipifyResponse.json()) as IpInfo;

  } catch (e: unknown) { // 5. 在 TypeScript 中，catch 块的变量默认是 unknown 类型
    console.error('Failed to fetch public IP:', e);
    
    // 6. 安全地处理 unknown 类型的错误
    if (e instanceof Error) {
      errorMessage = e.message;
    } else {
      // 如果抛出的不是一个 Error 对象，将其转换为字符串
      errorMessage = String(e);
    }
  }

  // 7. 构建最终的响应体，其类型符合 ApiResponse 接口
  const responseBody: ApiResponse = {
    success: errorMessage === null,
    data: ipData,
    error: errorMessage,
  };

  return new Response(JSON.stringify(responseBody, null, 2), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*', // 允许跨域访问
    },
  });
}
