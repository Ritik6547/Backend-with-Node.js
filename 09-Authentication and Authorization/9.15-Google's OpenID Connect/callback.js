if (window.name === "auth-popup") {
  const code = new URLSearchParams(location.search).get("code");

  if (code) {
    window.opener.postMessage({ code }, location.origin);
    window.close();
  }
}

console.log("callback");
