
export default async function user(req, res) {
  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly

  res.status(200).json({ user: {} || null });
}
