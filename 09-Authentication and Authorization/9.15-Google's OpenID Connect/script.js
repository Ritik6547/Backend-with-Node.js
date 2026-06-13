const button = document.querySelector("button");

const client_id =
  "183518767383-qors1qe29inuoslplrsj7sr3sepajim3.apps.googleusercontent.com";
const client_secret = "Client Secret";
const URI = "http://localhost:5500/callback.html";
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&scope=openid%20email%20profile&redirect_uri=${URI}`;

button.addEventListener("click", (e) => {
  // Open Popup
  window.open(authUrl, "auth-popup", "left=150,top=180,width=420,height=420");
});

window.addEventListener("message", (e) => {
  if (e.origin !== location.origin) {
    return;
  }
  const { data } = e;
  console.log(data);

  if (data.code) {
    fetchIdToken(data.code);
  }
});

const fetchIdToken = async (code) => {
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
