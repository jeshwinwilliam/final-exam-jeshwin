
document.addEventListener("DOMContentLoaded", () => {
  const passwordForm = document.getElementById("passwordForm");
  const msg = document.getElementById("message");

  passwordForm.addEventListener("submit", e => {
    e.preventDefault();
    const newPass = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;

    const pattern = /^(?=(?:.*[A-Z]){2})(?=.*[!@#$%^&*]).{9,}$/;

    if (!pattern.test(newPass)) {
      msg.textContent = "❌ Password must have ≥9 chars, 2 uppercase, and 1 special symbol.";
      msg.style.color = "red";
      return;
    }

    if (newPass !== confirmPass) {
      msg.textContent = "❌ Passwords do not match!";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "✅ Password successfully changed!";
    msg.style.color = "green";
    passwordForm.reset();
  });
});
