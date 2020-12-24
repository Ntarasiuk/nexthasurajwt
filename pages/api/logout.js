import cookies from 'utils/backend/cookies';

const handler = async (req, res) => {
  res.cookie('refresh_token', "", {
    httpOnly: true,
    path: '/',
    expires: new Date(0)
  });
  res.writeHead(302, { Location: "/" });
  res.end();
};

export default cookies(handler);