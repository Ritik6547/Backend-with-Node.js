const code = new URLSearchParams(location.search).get("code");

const client_id =
  "183518767383-qors1qe29inuoslplrsj7sr3sepajim3.apps.googleusercontent.com";

const client_secret = "client secret";

const URI = "http://localhost:5500";

const fetchIdToken = async () => {
  const payload = `code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${URI}&grant_type=authorization_code`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });

  const data = await res.json();
  if (data.error) {
    console.log("Error Occured");
    console.log(data);
    return;
  }

  const userEncodedInfo = data.id_token.split(".")[1];
  const userInfo = JSON.parse(atob(userEncodedInfo));

  console.log(userInfo);
};

if (code) fetchIdToken();
