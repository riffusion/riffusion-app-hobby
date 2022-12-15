export default async function handler(req, res) {
  let headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const response = await fetch(process.env.RIFFUSION_FLASK_URL, {
    method: "POST",
    headers: headers,
    body: req.body,
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json();
  res.status(200).json({ data });
}
