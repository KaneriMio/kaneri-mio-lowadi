export default async function handler(req, res) {
  const { code } = req.query;
  res.send(`
    <script>
      const res = { token: "${code}", provider: "github" };
      window.opener.postMessage(JSON.stringify(res), window.location.origin);
    </script>
  `);
}
