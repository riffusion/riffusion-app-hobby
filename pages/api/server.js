const SERVER_URL = "http://129.146.52.68:3013/run_inference/";

export default async function handler(req, res) {
  let headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const response = await fetch(SERVER_URL, {
    method: "POST",
    headers: headers,
    body: req.body,
  });

  const data = await response.json();
  res.status(200).json({ data });
}