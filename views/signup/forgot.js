var email = document.getElementById("email").value;
async function forgot(e) {
  e.preventDefault();
  email = document.getElementById("email").value;
  const parentNode = document.getElementById("resetLink");
  const forgotPassword = await axios.get(
    `http://localhost:3000/users/password/forgotpassword/${email}`
  );
  document.getElementById("active").classList.remove("active");
  document.getElementById("update").classList.remove("active");
}

async function resetPassword() {
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 2000);

  const newPassword = document.getElementById("active").value;
  const updatedPassword = {
    password: newPassword,
  };

  console.log("hello");
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
