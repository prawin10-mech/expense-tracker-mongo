async function forgot(e) {
  e.preventDefault();
  const email = document.getElementById("email");
  const forgotPassword = await axios.get(
    `http://localhost:3000/users/password/forgotpassword/${email}`
  );
  console.log(forgotPassword);
}
