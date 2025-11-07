document.addEventListener('DOMContentLoaded', function() {
  const userId = localStorage.getItem('user_id');
  if (userId) showWelcome(userId);

  document.getElementById('login-btn').onclick = function() {
    login();
  };
  document.getElementById('show-register-btn').onclick = function() {
    showRegister();
  };
  document.getElementById('register-btn').onclick = function() {
    registerUser();
  };
  document.getElementById('cancel-register-btn').onclick = function() {
    hideRegister();
  };
  document.getElementById('view-errors-btn').onclick = function() {
    viewErrors();
  };
  document.getElementById('goto-debug-btn').onclick = function() {
    showDebug();
  };
  document.getElementById('logout-btn').onclick = function() {
    logout();
  };
  document.getElementById('submit-snippet-btn').onclick = function() {
    submitSnippet();
  };
  document.getElementById('cancel-debug-btn').onclick = function() {
    hideDebug();
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

function showRegister() {
  document.getElementById('login-section').style.display = "none";
  document.getElementById('register-section').style.display = "block";
  document.getElementById('register-error').textContent = "";
  document.getElementById('register-success').textContent = "";
  document.getElementById('register-user-id-input').value = '';
}

function hideRegister() {
  document.getElementById('login-section').style.display = "block";
  document.getElementById('register-section').style.display = "none";
  document.getElementById('register-error').textContent = "";
  document.getElementById('register-success').textContent = "";
}

function registerUser() {
  const newUserId = document.getElementById('register-user-id-input').value.trim();
  const errorMsg = document.getElementById('register-error');
  const successMsg = document.getElementById('register-success');
  errorMsg.textContent = "";
  successMsg.textContent = "";
  if (!newUserId) {
    errorMsg.textContent = "User ID is required";
    return;
  }
  fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_id: newUserId})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      successMsg.textContent = "Registration successful! You may now log in.";
      setTimeout(hideRegister, 1400);
    } else {
      errorMsg.textContent = data.error || "Registration failed";
    }
  })
  .catch(() => {
    errorMsg.textContent = "Connection error";
  });
}

function showWelcome(userId) {
  document.getElementById('login-section').style.display = "none";
  document.getElementById('register-section').style.display = "none";
  document.getElementById('welcome-section').style.display = "block";
  document.getElementById('results-section').style.display = "none";
  document.getElementById('debug-section').style.display = "none";
  document.getElementById('welcome-msg').textContent = "Welcome, " + userId + "!";
  document.getElementById('errors-tbody').innerHTML = "";
  document.getElementById('no-errors').textContent = "";
}

function viewErrors() {
  const userId = localStorage.getItem('user_id');
  document.getElementById('results-section').style.display = "block";
  document.getElementById('debug-section').style.display = "none";
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

function showDebug() {
  document.getElementById('debug-section').style.display = "block";
  document.getElementById('results-section').style.display = "none";
  document.getElementById('debug-error').textContent = "";
  document.getElementById('debug-success').textContent = "";
  document.getElementById('snippet-input').value = '';
  document.getElementById('backend-debug-result').textContent = "";
}

function hideDebug() {
  document.getElementById('debug-section').style.display = "none";
}

function submitSnippet() {
  const codeSnippet = document.getElementById('snippet-input').value.trim();
  const errorMsg = document.getElementById('debug-error');
  const successMsg = document.getElementById('debug-success');
  const resultBox = document.getElementById('backend-debug-result');
  errorMsg.textContent = "";
  successMsg.textContent = "";
  resultBox.textContent = "";

  if (!codeSnippet) {
    errorMsg.textContent = "Please paste your code snippet!";
    return;
  }

  // Send the code to the backend for debugging (change '/debug' to your backend API)
  fetch('/debug', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({code: codeSnippet, user_id: localStorage.getItem('user_id')})
  })
  .then(res => res.json())
  .then(data => {
    if (data.result) {
      successMsg.textContent = "Debugging result received below:";
      resultBox.textContent = data.result;
    } else {
      errorMsg.textContent = data.error || "Error debugging code";
    }
  })
  .catch(() => {
    errorMsg.textContent = "Connection error";
  });
}

function logout() {
  localStorage.removeItem('user_id');
  document.getElementById('login-section').style.display = "block";
  document.getElementById('register-section').style.display = "none";
  document.getElementById('welcome-section').style.display = "none";
  document.getElementById('results-section').style.display = "none";
  document.getElementById('debug-section').style.display = "none";
  document.getElementById('login-error').textContent = "";
  document.getElementById('user-id-input').value = "";
}
