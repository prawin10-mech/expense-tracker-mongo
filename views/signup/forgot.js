var email = document.getElementById("email").value;
async function forgot(e) {
  e.preventDefault();
  email = document.getElementById("email").value;
  const parentNode = document.getElementById("resetLink");

  const forgotPassword = await axios.post(
    `http://localhost:3000/password/forgotpassword/${email}`
  );
  console.log(forgotPassword);
  const childNode = forgotPassword.data.resetlink;
  parentNode.innerHTML = childNode;
}

async function resetPassword() {
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 2000);

  const newPassword = document.getElementById("active").value;
  const updatedPassword = {
    password: newPassword,
  };

  document.body.innerHTML += `<div id="error" style="color: green";>Password updated successfully please wait until the page redirects</div>`;
  const token = localStorage.getItem("token");
  await axios.post(
    `http://localhost:3000/users/password/forgotpassword/resetpassword/${email}`,
    updatedPassword,
    {
      headers: { Authorization: token },
    }
  );
}
