export default async function GeoDecode(address: string) {
    const url: string = "https://cleaner.dadata.ru/api/v1/clean/address";
    const token: string = "af76299f7dae225c05644106e2d432906ecf7ebe";
    const secret: string = "e013939c8df37e83df4be8cccbbcfe4932a31b83";
    const query: string = address;

    const options: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token,
            "X-Secret": secret
        },
        body: JSON.stringify([query])
    };
    const response = await fetch(url, options);
    const result = await response.json();
    const geoLat: number = result[0].geo_lat;
    const geoLon: number = result[0].geo_lon;

    const geo = [Number(geoLat), Number(geoLon)];
    return geo;
}