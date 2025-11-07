document.addEventListener('DOMContentLoaded', function() {
  // Initial state: check login
  const userId = localStorage.getItem('user_id');
  if (userId) showWelcome(userId);

  document.getElementById('login-btn').onclick = function() {
    login();
  };
  document.getElementById('view-errors-btn').onclick = function() {
    viewErrors();
  };
  document.getElementById('logout-btn').onclick = function() {
    logout();
  };
});

function login() {
  const userId = document.getElementById('user-id-input').value.trim();
  const errorMsg = document.getElementById('login-error');
  errorMsg.textContent = "";
  if (!userId) {
    errorMsg.textContent = "User ID is required";
    return;
  }
  // Simulated login POST request
  fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_id: userId})
  })
  .then(res => res.json())
  .then(data => {
    if (data.user_id) {
      localStorage.setItem('user_id', userId);
      showWelcome(userId);
    } else {
      errorMsg.textContent = data.error || "Login failed";
    }
  })
  .catch(() => {
    errorMsg.textContent = "Connection error";
  });
}

function showWelcome(userId) {
  document.getElementById('login-section').style.display = "none";
  document.getElementById('welcome-section').style.display = "block";
  document.getElementById('welcome-msg').textContent = "Welcome, " + userId + "!";
  document.getElementById('results-section').style.display = "none";
  document.getElementById('errors-tbody').innerHTML = "";
  document.getElementById('no-errors').textContent = "";
}

function viewErrors() {
  const userId = localStorage.getItem('user_id');
  document.getElementById('results-section').style.display = "block";
  document.getElementById('errors-tbody').innerHTML = "";
  document.getElementById('no-errors').textContent = "";
  fetch(`/query?user_id=${encodeURIComponent(userId)}`)
    .then(res => res.json())
    .then(errors => {
      if (!errors || errors.length === 0) {
        document.getElementById('no-errors').textContent = "No errors found";
      } else {
        let rows = "";
        errors.forEach(err => {
          rows += `<tr>
            <td>${err.id}</td>
            <td>${new Date(err.timestamp).toLocaleString()}</td>
            <td>${err.service}</td>
            <td>${err.error_type}</td>
            <td><pre style="font-size:12px; margin:0;">${err.stack_trace}</pre></td>
          </tr>`;
        });
        document.getElementById('errors-tbody').innerHTML = rows;
      }
    })
    .catch(() => {
      document.getElementById('no-errors').textContent = "Failed to fetch errors";
    });
}

function logout() {
  localStorage.removeItem('user_id');
  document.getElementById('login-section').style.display = "block";
  document.getElementById('welcome-section').style.display = "none";
  document.getElementById('results-section').style.display = "none";
  document.getElementById('login-error').textContent = "";
  document.getElementById('user-id-input').value = "";
}
