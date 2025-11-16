export function parseCookies(req, res, next) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    req.cookies = {};
    return next();
  }

  const cookieArr = cookieHeader.split("; ");
  const cookies = {};

  cookieArr.forEach((cookie) => {
    const index = cookie.indexOf("=");
    const key = cookie.substring(0, index);
    const value = cookie.substring(index + 1);
    cookies[key] = decodeURIComponent(value);
  });

  req.cookies = cookies;

  next();
}
