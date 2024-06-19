export default async function GeoDecode(address: string) {
    const url: string = "https://cleaner.dadata.ru/api/v1/clean/address";
    const token = "ef9ba03f20f9246fc647322efa5ec79bef3f99d4";
    const secret = "42c8102872054c6cb00e4a8aadd14fe547c15371";

    const options: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token,
            "X-Secret": secret
        },
        body: JSON.stringify([address])
    };
    const response = await fetch(url, options);
    const result = await response.json();
    const geoLat: number = result[0].geo_lat;
    const geoLon: number = result[0].geo_lon;

    const geo = [Number(geoLat), Number(geoLon)];
    return geo;
}

