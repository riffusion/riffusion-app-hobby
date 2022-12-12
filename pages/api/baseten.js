const BASETEN_URL = "https://app.baseten.co/applications/2qREaXP/production/worklets/mP7KkLP/invoke";
const BASETEN_API_KEY = "JocxKmyo.g0JreAA8dZy5F20PdMxGAV34a4VGGpom";

export default async function handler(req, res) {
  let headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Api-Key ${BASETEN_API_KEY}`
  };

  const response = await fetch(BASETEN_URL, {
    method: "POST",
    headers: headers,
    body: req.body,
  });

  const data = await response.json();
  res.status(200).json({ data });
}