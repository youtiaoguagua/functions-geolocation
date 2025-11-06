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

export async function onRequest({ request }: { request: EORequest }) {
  const eo = request.eo;
  try{
const ipifyResponse = await fetch('https://ipapi.co/json');
      const ipData = await ipifyResponse.json();
   } catch (error) {
    console.error('Failed to fetch public IP:', error);
  }
  return new Response(
    JSON.stringify({
      ipData,
    }),
    {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
 
