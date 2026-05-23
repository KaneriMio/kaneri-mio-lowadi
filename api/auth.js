export default async function handler(req, res) {
  const { client_id } = req.query;
  res.redirect(`https://github.com{client_id}&scope=repo,user`);
}
