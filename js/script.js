/* ==========================================================================
   KRISH SAVALIYA | PORTFOLIO SCRIPT & FORM VALIDATION (js/script.js)
   Practical 6: Client-side Form Validation using Vanilla JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    // Helper function to display error message under a specific field
    function showError(field, message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.color = "#dc3545";
      errorDiv.style.fontSize = "0.85rem";
      errorDiv.style.marginTop = "4px";
      errorDiv.textContent = message;
      field.parentNode.appendChild(errorDiv);
    }

    // Helper function to remove existing error messages
    function clearErrors() {
      const existingErrors = contactForm.querySelectorAll(".error-message");
      existingErrors.forEach(function (el) {
        el.remove();
      });
    }

    // Real-time error clearing when user types
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        const error = input.parentNode.querySelector(".error-message");
        if (error) {
          error.remove();
        }
      });
    });

    // Form submit listener
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      let isValid = true;

      const nameInput = document.getElementById("contactName");
      const emailInput = document.getElementById("contactEmail");
      const subjectInput = document.getElementById("contactSubject");
      const messageInput = document.getElementById("contactMessage");

      // Validate Name
      if (nameInput && nameInput.value.trim() === "") {
        showError(nameInput, "Name is required.");
        isValid = false;
      }

      // Validate Email (presence and standard email format)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput) {
        const emailVal = emailInput.value.trim();
        if (emailVal === "") {
          showError(emailInput, "Email is required.");
          isValid = false;
        } else if (!emailPattern.test(emailVal)) {
          showError(emailInput, "Please enter a valid email address.");
          isValid = false;
        }
      }

      // Validate Subject
      if (subjectInput && subjectInput.value.trim() === "") {
        showError(subjectInput, "Subject is required.");
        isValid = false;
      }

      // Validate Message
      if (messageInput && messageInput.value.trim() === "") {
        showError(messageInput, "Message is required.");
        isValid = false;
      }

      // If valid, log form data to browser console and display confirmation
      if (isValid) {
        console.log("========== CONTACT FORM DATA ==========");
        const formData = new FormData(contactForm);
        formData.forEach(function (value, name) {
          console.log(name + " : " + value);
        });
        console.log("=======================================");

        const successAlert = document.getElementById("formSuccessAlert");
        if (successAlert) {
          successAlert.style.display = "block";
          setTimeout(function () {
            successAlert.style.display = "none";
          }, 5000);
        } else {
          alert("Thank you! Your message has been sent successfully.");
        }

        contactForm.reset();
      }
    });
  }
});
