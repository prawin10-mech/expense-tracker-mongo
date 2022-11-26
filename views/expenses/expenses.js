async function addExpense(e) {
  e.preventDefault();
  const money = e.target.money.value;
  const description = e.target.description.value;
  const category = e.target.category.value;

  const expense = {
    money: money,
    description: description,
    category: category,
  };
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/expenses",
      expense,
      {
        headers: { Authorization: token },
      }
    );
    showDetailsOnDisplay(response.data);
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const getData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/expenses`, {
        headers: { Authorization: token },
      });
      let data = response.data;
      for (let i = 0; i < data.length; i++) {
        showDetailsOnDisplay(response.data[i]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  getData();
});

const showDetailsOnDisplay = async (data) => {
  try {
    await axios.get(`http://localhost:3000/expenses/${data.id}`);
    var parentNode = document.getElementById("addExpenses");
    var childNode = `<li id=${data.id}>${data.money} Rupees for ${data.description}-${data.category}
                    <button id="editBtn" onclick="editData('${data.id}')">Edit</button>
                    <button id="deleteBtn" onclick="deleteData('${data.id}')">X</button>
                    </li>`;
    parentNode.innerHTML += childNode;
    document.getElementById("money").value = "";
    document.getElementById("description").value = "";
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (userId) => {
  try {
    deleteDataFromDisplay(userId);
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/expenses/delete/${userId}`, {
      headers: { Authorization: token },
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteDataFromDisplay = async (userId) => {
  let parentNode = document.getElementById("addExpenses");
  let childNode = document.getElementById(userId);
  parentNode.removeChild(childNode);
};
