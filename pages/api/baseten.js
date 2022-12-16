export default async function handler(req, res) {
  let headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Api-Key ${process.env.RIFFUSION_BASETEN_API_KEY}`
  };

  const response = await fetch(process.env.RIFFUSION_BASETEN_URL, {
    method: "POST",
    headers: headers,
    body: req.body,
    signal: AbortSignal.timeout(20000),
  });

  const data = await response.json();
  res.status(200).json({ data });
}
