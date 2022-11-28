async function forgot(e) {
  e.preventDefault();
  const forgotPassword = await axios.get(
    "http://localhost:3000/password/forgotpassword"
  );
}
