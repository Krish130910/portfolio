/* ==========================================================================
   KRISH SAVALIYA | PORTFOLIO ADMIN PANEL JAVASCRIPT (js/admin.js)
   Practical 4: Bootstrap Modal & Component Integration
   Practical 5: JavaScript DOM Manipulation, Event Handling & FormData Logging
   Practical 6: Reusable Client-Side Form Validation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ========================================================================
     REUSABLE VALIDATION & UTILITY FUNCTIONS (Practical 6)
     ======================================================================== */

  /**
   * Appends an error message below the given form field.
   * @param {HTMLElement} field - The input or textarea element
   * @param {string} message - Validation error description
   */
  function showError(field, message) {
    // Check if error already exists for this field to avoid duplicates
    let existing = field.parentNode.querySelector(".error-message");
    if (existing) {
      existing.textContent = message;
      return;
    }
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-danger small mt-1";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  /**
   * Removes all error messages inside the given form.
   * @param {HTMLFormElement} form - Target form
   */
  function clearErrors(form) {
    const existingErrors = form.querySelectorAll(".error-message");
    existingErrors.forEach(function (el) {
      el.remove();
    });
  }

  /**
   * Validates whether a given string is a valid HTTP or HTTPS URL.
   * @param {string} string - The URL to validate
   * @returns {boolean}
   */
  function isValidUrl(string) {
    if (!string || string.trim() === "") return false;
    try {
      const url = new URL(string.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  /**
   * Logs form data to the browser console using FormData API (Practical 5).
   * @param {string} headerText - Heading to print in console
   * @param {HTMLFormElement} form - Form element containing data
   */
  function logFormData(headerText, form) {
    console.log("========== " + headerText + " ==========");
    const formData = new FormData(form);
    formData.forEach(function (value, name) {
      console.log(name + " : " + value);
    });
    console.log("=====================================");
  }

  /**
   * Safely closes a Bootstrap modal instance.
   * @param {string} modalId - DOM ID of the modal
   */
  function closeModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  // Real-time error removal when user starts typing in any input/textarea
  document.querySelectorAll("input, textarea, select").forEach(function (field) {
    field.addEventListener("input", function () {
      const error = field.parentNode.querySelector(".error-message");
      if (error) {
        error.remove();
      }
    });
  });

  /* ========================================================================
     1. SKILLS MANAGEMENT (admin/skills.html)
     ======================================================================== */
  let activeSkillItem = null;

  // Edit skill click handler (delegation)
  document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".btn-edit-skill");
    if (editBtn) {
      activeSkillItem = editBtn.closest(".list-group-item");
      const name = editBtn.getAttribute("data-name") || activeSkillItem.querySelector(".skill-label").childNodes[0].textContent.trim();
      const category = editBtn.getAttribute("data-category") || "Web Development";
      const tag = editBtn.getAttribute("data-tag") || (activeSkillItem.querySelector(".subtag") ? activeSkillItem.querySelector(".subtag").textContent.trim() : "");

      const nameInput = document.getElementById("editSkillName");
      const catInput = document.getElementById("editSkillCategory");
      const tagInput = document.getElementById("editSkillTag");

      if (nameInput) nameInput.value = name;
      if (catInput) catInput.value = category;
      if (tagInput) tagInput.value = tag;
    }

    const delBtn = event.target.closest(".btn-delete-skill");
    if (delBtn) {
      activeSkillItem = delBtn.closest(".list-group-item");
    }
  });

  // Confirm delete skill
  const confirmDeleteSkillBtn = document.getElementById("confirmDeleteSkillBtn");
  if (confirmDeleteSkillBtn) {
    confirmDeleteSkillBtn.addEventListener("click", function () {
      if (activeSkillItem) {
        const parentList = activeSkillItem.closest(".list-group");
        activeSkillItem.remove();
        activeSkillItem = null;
        if (parentList) {
          const card = parentList.closest(".card");
          const countBadge = card.querySelector(".category-count");
          if (countBadge) {
            countBadge.textContent = parentList.children.length + " Skills";
          }
        }
        console.log("SKILL DELETED: Skill item was successfully removed from UI.");
      }
      closeModal("deleteSkillModal");
    });
  }

  // Add Skill Form Validation & Submission
  const addSkillForm = document.getElementById("addSkill");
  if (addSkillForm) {
    addSkillForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(addSkillForm);

      let isValid = true;
      const nameInput = document.getElementById("newSkillName");
      const categoryInput = document.getElementById("newSkillCategory");
      const tagInput = document.getElementById("newSkillTag");

      if (nameInput && nameInput.value.trim() === "") {
        showError(nameInput, "Skill name is required.");
        isValid = false;
      }
      if (categoryInput && categoryInput.value.trim() === "") {
        showError(categoryInput, "Category is required.");
        isValid = false;
      }
      if (tagInput && tagInput.value.trim() === "") {
        showError(tagInput, "Sub-tag / Type is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("ADD SKILL DATA", addSkillForm);

        // Dynamically add to the target category list
        const catValue = categoryInput.value;
        let targetList = null;
        if (catValue.includes("Web")) {
          targetList = document.querySelector("#categoryWeb .skill-items-list");
        } else if (catValue.includes("AI") || catValue.includes("Machine")) {
          targetList = document.querySelector("#categoryAI .skill-items-list");
        } else {
          targetList = document.querySelector("#categoryTools .skill-items-list");
        }

        if (targetList) {
          const newItem = document.createElement("li");
          newItem.className = "list-group-item d-flex justify-content-between align-items-center";
          newItem.innerHTML = `
            <span class="skill-label">${nameInput.value.trim()} <span class="badge bg-secondary ms-1 subtag">${tagInput.value.trim()}</span></span>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary btn-edit-skill" data-bs-toggle="modal" data-bs-target="#editSkillModal" data-name="${nameInput.value.trim()}" data-category="${catValue}" data-tag="${tagInput.value.trim()}">Edit</button>
              <button type="button" class="btn btn-outline-danger btn-delete-skill" data-bs-toggle="modal" data-bs-target="#deleteSkillModal">Delete</button>
            </div>
          `;
          targetList.appendChild(newItem);

          // Update count badge
          const countBadge = targetList.closest(".card").querySelector(".category-count");
          if (countBadge) {
            countBadge.textContent = targetList.children.length + " Skills";
          }
        }

        addSkillForm.reset();
        closeModal("addSkillModal");
      }
    });
  }

  // Edit Skill Form Validation & Submission
  const editSkillForm = document.getElementById("editSkill");
  if (editSkillForm) {
    editSkillForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(editSkillForm);

      let isValid = true;
      const nameInput = document.getElementById("editSkillName");
      const categoryInput = document.getElementById("editSkillCategory");
      const tagInput = document.getElementById("editSkillTag");

      if (nameInput && nameInput.value.trim() === "") {
        showError(nameInput, "Skill name is required.");
        isValid = false;
      }
      if (categoryInput && categoryInput.value.trim() === "") {
        showError(categoryInput, "Category is required.");
        isValid = false;
      }
      if (tagInput && tagInput.value.trim() === "") {
        showError(tagInput, "Sub-tag / Type is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("EDIT SKILL DATA", editSkillForm);

        if (activeSkillItem) {
          const labelSpan = activeSkillItem.querySelector(".skill-label");
          if (labelSpan) {
            labelSpan.innerHTML = `${nameInput.value.trim()} <span class="badge bg-secondary ms-1 subtag">${tagInput.value.trim()}</span>`;
          }
          const editBtn = activeSkillItem.querySelector(".btn-edit-skill");
          if (editBtn) {
            editBtn.setAttribute("data-name", nameInput.value.trim());
            editBtn.setAttribute("data-category", categoryInput.value);
            editBtn.setAttribute("data-tag", tagInput.value.trim());
          }
        }

        closeModal("editSkillModal");
      }
    });
  }

  /* ========================================================================
     2. PROJECTS MANAGEMENT (admin/projects.html)
     ======================================================================== */
  let activeProjectCard = null;

  document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".btn-edit-project");
    if (editBtn) {
      activeProjectCard = editBtn.closest(".project-card-item");
      const title = activeProjectCard.querySelector(".project-title").textContent.trim();
      const techBadges = activeProjectCard.querySelectorAll(".tech-stack-container .badge");
      const techList = [];
      techBadges.forEach((b) => techList.push(b.textContent.trim()));

      const liveLink = activeProjectCard.querySelector(".link-live") ? activeProjectCard.querySelector(".link-live").getAttribute("href") : "";
      const githubLink = activeProjectCard.querySelector(".link-github") ? activeProjectCard.querySelector(".link-github").getAttribute("href") : "";

      const pointItems = activeProjectCard.querySelectorAll(".points-list li");
      const points = [];
      pointItems.forEach((p) => points.push(p.textContent.trim()));

      const titleInput = document.getElementById("editProjectTitle");
      const techInput = document.getElementById("editTechStack");
      const liveInput = document.getElementById("editLiveLink");
      const githubInput = document.getElementById("editGithubLink");
      const pointsInput = document.getElementById("editProjectPoints");

      if (titleInput) titleInput.value = title;
      if (techInput) techInput.value = techList.join(", ");
      if (liveInput) liveInput.value = liveLink;
      if (githubInput) githubInput.value = githubLink;
      if (pointsInput) pointsInput.value = points.join("\n");
    }

    const delBtn = event.target.closest(".btn-delete-project");
    if (delBtn) {
      activeProjectCard = delBtn.closest(".project-card-item");
    }
  });

  // Confirm delete project
  const confirmDeleteProjectBtn = document.getElementById("confirmDeleteProjectBtn");
  if (confirmDeleteProjectBtn) {
    confirmDeleteProjectBtn.addEventListener("click", function () {
      if (activeProjectCard) {
        activeProjectCard.remove();
        activeProjectCard = null;
        console.log("PROJECT DELETED: Project card was removed from UI.");
      }
      closeModal("deleteProjectModal");
    });
  }

  // Add Project Form Validation & Submission
  const addProjectForm = document.getElementById("addProject");
  if (addProjectForm) {
    addProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(addProjectForm);

      let isValid = true;
      const titleInput = document.getElementById("newProjectTitle");
      const techInput = document.getElementById("newTechStack");
      const liveInput = document.getElementById("newLiveLink");
      const githubInput = document.getElementById("newGithubLink");
      const pointsInput = document.getElementById("newProjectPoints");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Project title is required.");
        isValid = false;
      }
      if (techInput && techInput.value.trim() === "") {
        showError(techInput, "Tech stack is required.");
        isValid = false;
      }
      if (liveInput && liveInput.value.trim() !== "" && !isValidUrl(liveInput.value)) {
        showError(liveInput, "Please enter a valid URL (starting with http:// or https://).");
        isValid = false;
      }
      if (githubInput && githubInput.value.trim() !== "" && !isValidUrl(githubInput.value)) {
        showError(githubInput, "Please enter a valid URL (starting with http:// or https://).");
        isValid = false;
      }
      if (pointsInput && pointsInput.value.trim() === "") {
        showError(pointsInput, "Bullet points are required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("ADD PROJECT DATA", addProjectForm);

        const container = document.getElementById("projectsContainer");
        if (container) {
          const techBadgesHtml = techInput.value
            .split(",")
            .map((t) => `<span class="badge bg-primary me-1">${t.trim()}</span>`)
            .join("");

          const pointsListHtml = pointsInput.value
            .split("\n")
            .filter((p) => p.trim() !== "")
            .map((p) => `<li>${p.trim()}</li>`)
            .join("");

          const liveHref = liveInput && liveInput.value.trim() ? liveInput.value.trim() : "#";
          const ghHref = githubInput && githubInput.value.trim() ? githubInput.value.trim() : "#";

          const newCard = document.createElement("div");
          newCard.className = "col-lg-4 col-md-6 project-card-item";
          newCard.innerHTML = `
            <div class="card admin-card h-100">
              <img src="../image.jpg" class="project-img-preview" alt="${titleInput.value.trim()}" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold mb-2 project-title">${titleInput.value.trim()}</h5>
                <div class="mb-3 tech-stack-container">${techBadgesHtml}</div>
                <ul class="text-muted small ps-3 mb-4 points-list">${pointsListHtml}</ul>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                  <div class="btn-group btn-group-sm">
                    <a href="${liveHref}" target="_blank" class="btn btn-outline-secondary link-live">Live</a>
                    <a href="${ghHref}" target="_blank" class="btn btn-outline-secondary link-github">GitHub</a>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-primary btn-edit-project" data-bs-toggle="modal" data-bs-target="#editProjectModal">Edit</button>
                    <button type="button" class="btn btn-danger btn-delete-project" data-bs-toggle="modal" data-bs-target="#deleteProjectModal">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          container.appendChild(newCard);
        }

        addProjectForm.reset();
        closeModal("addProjectModal");
      }
    });
  }

  // Edit Project Form Validation & Submission
  const editProjectForm = document.getElementById("editProject");
  if (editProjectForm) {
    editProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(editProjectForm);

      let isValid = true;
      const titleInput = document.getElementById("editProjectTitle");
      const techInput = document.getElementById("editTechStack");
      const liveInput = document.getElementById("editLiveLink");
      const githubInput = document.getElementById("editGithubLink");
      const pointsInput = document.getElementById("editProjectPoints");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Project title is required.");
        isValid = false;
      }
      if (techInput && techInput.value.trim() === "") {
        showError(techInput, "Tech stack is required.");
        isValid = false;
      }
      if (liveInput && liveInput.value.trim() !== "" && !isValidUrl(liveInput.value)) {
        showError(liveInput, "Please enter a valid URL (starting with http:// or https://).");
        isValid = false;
      }
      if (githubInput && githubInput.value.trim() !== "" && !isValidUrl(githubInput.value)) {
        showError(githubInput, "Please enter a valid URL (starting with http:// or https://).");
        isValid = false;
      }
      if (pointsInput && pointsInput.value.trim() === "") {
        showError(pointsInput, "Bullet points are required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("EDIT PROJECT DATA", editProjectForm);

        if (activeProjectCard) {
          const titleEl = activeProjectCard.querySelector(".project-title");
          if (titleEl) titleEl.textContent = titleInput.value.trim();

          const techContainer = activeProjectCard.querySelector(".tech-stack-container");
          if (techContainer) {
            techContainer.innerHTML = techInput.value
              .split(",")
              .map((t) => `<span class="badge bg-primary me-1">${t.trim()}</span>`)
              .join("");
          }

          const pointsList = activeProjectCard.querySelector(".points-list");
          if (pointsList) {
            pointsList.innerHTML = pointsInput.value
              .split("\n")
              .filter((p) => p.trim() !== "")
              .map((p) => `<li>${p.trim()}</li>`)
              .join("");
          }

          const liveLinkEl = activeProjectCard.querySelector(".link-live");
          if (liveLinkEl && liveInput) {
            liveLinkEl.setAttribute("href", liveInput.value.trim() || "#");
          }

          const ghLinkEl = activeProjectCard.querySelector(".link-github");
          if (ghLinkEl && githubInput) {
            ghLinkEl.setAttribute("href", githubInput.value.trim() || "#");
          }
        }

        closeModal("editProjectModal");
      }
    });
  }

  /* ========================================================================
     3. EXPERIENCE & ACTIVITIES MANAGEMENT (admin/experience.html)
     ======================================================================== */
  let activeExpRow = null;

  document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".btn-edit-exp");
    if (editBtn) {
      activeExpRow = editBtn.closest(".exp-row-item");
      const title = activeExpRow.querySelector(".exp-item-title").textContent.trim();
      const cat = activeExpRow.querySelector(".exp-item-category").textContent.trim();
      const desc = activeExpRow.querySelector(".exp-item-desc").textContent.trim();

      const titleInput = document.getElementById("editExpTitle");
      const catInput = document.getElementById("editExpCategory");
      const descInput = document.getElementById("editExpDesc");

      if (titleInput) titleInput.value = title;
      if (catInput) catInput.value = cat;
      if (descInput) descInput.value = desc;
    }

    const delBtn = event.target.closest(".btn-delete-exp");
    if (delBtn) {
      activeExpRow = delBtn.closest(".exp-row-item");
    }
  });

  // Confirm delete experience
  const confirmDeleteExpBtn = document.getElementById("confirmDeleteExpBtn");
  if (confirmDeleteExpBtn) {
    confirmDeleteExpBtn.addEventListener("click", function () {
      if (activeExpRow) {
        activeExpRow.remove();
        activeExpRow = null;
        const tbody = document.getElementById("experienceTableBody");
        const countBadge = document.getElementById("expCountBadge");
        if (tbody && countBadge) {
          countBadge.textContent = tbody.children.length + " Entries";
        }
        console.log("EXPERIENCE ENTRY DELETED: Removed from UI.");
      }
      closeModal("deleteExpModal");
    });
  }

  // Add Experience Form Validation & Submission
  const addExpForm = document.getElementById("addExpForm");
  if (addExpForm) {
    addExpForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(addExpForm);

      let isValid = true;
      const titleInput = document.getElementById("expTitle");
      const categoryInput = document.getElementById("expCategory");
      const descInput = document.getElementById("expDesc");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Title is required.");
        isValid = false;
      }
      if (categoryInput && categoryInput.value.trim() === "") {
        showError(categoryInput, "Category is required.");
        isValid = false;
      }
      if (descInput && descInput.value.trim() === "") {
        showError(descInput, "Description is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("ADD EXPERIENCE DATA", addExpForm);

        const tbody = document.getElementById("experienceTableBody");
        if (tbody) {
          const newRow = document.createElement("tr");
          newRow.className = "exp-row-item";
          newRow.innerHTML = `
            <td class="ps-4">
              <strong class="exp-item-title">${titleInput.value.trim()}</strong>
              <div class="text-muted small exp-item-subtitle">Marwadi University | 2026</div>
            </td>
            <td><span class="badge bg-primary exp-item-category">${categoryInput.value}</span></td>
            <td class="text-muted small exp-item-desc">${descInput.value.trim()}</td>
            <td class="text-end pe-4">
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-primary btn-edit-exp" data-bs-toggle="modal" data-bs-target="#editExpModal">Edit</button>
                <button type="button" class="btn btn-outline-danger btn-delete-exp" data-bs-toggle="modal" data-bs-target="#deleteExpModal">Delete</button>
              </div>
            </td>
          `;
          tbody.appendChild(newRow);

          const countBadge = document.getElementById("expCountBadge");
          if (countBadge) {
            countBadge.textContent = tbody.children.length + " Entries";
          }
        }

        addExpForm.reset();
        closeModal("addExpModal");
      }
    });
  }

  // Edit Experience Form Validation & Submission
  const editExpForm = document.getElementById("editExpForm");
  if (editExpForm) {
    editExpForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(editExpForm);

      let isValid = true;
      const titleInput = document.getElementById("editExpTitle");
      const categoryInput = document.getElementById("editExpCategory");
      const descInput = document.getElementById("editExpDesc");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Title is required.");
        isValid = false;
      }
      if (categoryInput && categoryInput.value.trim() === "") {
        showError(categoryInput, "Category is required.");
        isValid = false;
      }
      if (descInput && descInput.value.trim() === "") {
        showError(descInput, "Description is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("EDIT EXPERIENCE DATA", editExpForm);

        if (activeExpRow) {
          const titleEl = activeExpRow.querySelector(".exp-item-title");
          const catEl = activeExpRow.querySelector(".exp-item-category");
          const descEl = activeExpRow.querySelector(".exp-item-desc");

          if (titleEl) titleEl.textContent = titleInput.value.trim();
          if (catEl) catEl.textContent = categoryInput.value;
          if (descEl) descEl.textContent = descInput.value.trim();
        }

        closeModal("editExpModal");
      }
    });
  }

  /* ========================================================================
     4. CERTIFICATIONS MANAGEMENT (admin/certifications.html)
     ======================================================================== */
  let activeCertCard = null;

  document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".btn-edit-cert");
    if (editBtn) {
      activeCertCard = editBtn.closest(".cert-card-item");
      const title = activeCertCard.querySelector(".cert-title").textContent.trim();
      const issuer = activeCertCard.querySelector(".cert-issuer").textContent.trim();
      const desc = activeCertCard.querySelector(".cert-desc").textContent.trim();

      const titleInput = document.getElementById("editCertTitle");
      const issuerInput = document.getElementById("editCertIssuer");
      const descInput = document.getElementById("editCertDesc");

      if (titleInput) titleInput.value = title;
      if (issuerInput) issuerInput.value = issuer;
      if (descInput) descInput.value = desc;
    }

    const delBtn = event.target.closest(".btn-delete-cert");
    if (delBtn) {
      activeCertCard = delBtn.closest(".cert-card-item");
    }
  });

  // Confirm delete certification
  const confirmDeleteCertBtn = document.getElementById("confirmDeleteCertBtn");
  if (confirmDeleteCertBtn) {
    confirmDeleteCertBtn.addEventListener("click", function () {
      if (activeCertCard) {
        activeCertCard.remove();
        activeCertCard = null;
        console.log("CERTIFICATION DELETED: Removed from UI.");
      }
      closeModal("deleteCertModal");
    });
  }

  // Add Certificate Form Validation & Submission
  const addCertForm = document.getElementById("addCertForm");
  if (addCertForm) {
    addCertForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(addCertForm);

      let isValid = true;
      const titleInput = document.getElementById("certTitle");
      const issuerInput = document.getElementById("certIssuer");
      const descInput = document.getElementById("certDesc");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Certificate title is required.");
        isValid = false;
      }
      if (issuerInput && issuerInput.value.trim() === "") {
        showError(issuerInput, "Issuing organization is required.");
        isValid = false;
      }
      if (descInput && descInput.value.trim() === "") {
        showError(descInput, "Description is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("ADD CERTIFICATION DATA", addCertForm);

        const container = document.getElementById("certificationsContainer");
        if (container) {
          const newCard = document.createElement("div");
          newCard.className = "col-lg-4 col-md-6 cert-card-item";
          newCard.innerHTML = `
            <div class="card admin-card h-100">
              <div class="cert-icon-box">
                <span>Verified</span>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title fw-bold mb-0 cert-title">${titleInput.value.trim()}</h5>
                </div>
                <span class="badge bg-primary mb-2 align-self-start cert-issuer">${issuerInput.value.trim()}</span>
                <p class="text-muted small mb-4 cert-desc">${descInput.value.trim()}</p>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                  <span class="text-muted small">Issued: 2026</span>
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary btn-edit-cert" data-bs-toggle="modal" data-bs-target="#editCertModal">Edit</button>
                    <button type="button" class="btn btn-outline-danger btn-delete-cert" data-bs-toggle="modal" data-bs-target="#deleteCertModal">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          container.appendChild(newCard);
        }

        addCertForm.reset();
        closeModal("addCertModal");
      }
    });
  }

  // Edit Certificate Form Validation & Submission
  const editCertForm = document.getElementById("editCertForm");
  if (editCertForm) {
    editCertForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(editCertForm);

      let isValid = true;
      const titleInput = document.getElementById("editCertTitle");
      const issuerInput = document.getElementById("editCertIssuer");
      const descInput = document.getElementById("editCertDesc");

      if (titleInput && titleInput.value.trim() === "") {
        showError(titleInput, "Certificate title is required.");
        isValid = false;
      }
      if (issuerInput && issuerInput.value.trim() === "") {
        showError(issuerInput, "Issuing organization is required.");
        isValid = false;
      }
      if (descInput && descInput.value.trim() === "") {
        showError(descInput, "Description is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("EDIT CERTIFICATION DATA", editCertForm);

        if (activeCertCard) {
          const titleEl = activeCertCard.querySelector(".cert-title");
          const issuerEl = activeCertCard.querySelector(".cert-issuer");
          const descEl = activeCertCard.querySelector(".cert-desc");

          if (titleEl) titleEl.textContent = titleInput.value.trim();
          if (issuerEl) issuerEl.textContent = issuerInput.value.trim();
          if (descEl) descEl.textContent = descInput.value.trim();
        }

        closeModal("editCertModal");
      }
    });
  }

  /* ========================================================================
     5. TESTIMONIALS MANAGEMENT (admin/testimonials.html)
     ======================================================================== */
  let activeTestimonialCard = null;

  document.addEventListener("click", function (event) {
    const editBtn = event.target.closest(".btn-edit-testimonial");
    if (editBtn) {
      activeTestimonialCard = editBtn.closest(".testimonial-card-item");
      const author = activeTestimonialCard.querySelector(".testimonial-author").textContent.replace(/^-\s*/, "").trim();
      const quote = activeTestimonialCard.querySelector(".testimonial-quote").textContent.replace(/^"|"$/g, "").trim();

      const authorInput = document.getElementById("editAuthorName");
      const quoteInput = document.getElementById("editQuote");

      if (authorInput) authorInput.value = author;
      if (quoteInput) quoteInput.value = quote;
    }

    const delBtn = event.target.closest(".btn-delete-testimonial");
    if (delBtn) {
      activeTestimonialCard = delBtn.closest(".testimonial-card-item");
    }
  });

  // Confirm delete testimonial
  const confirmDeleteTestimonialBtn = document.getElementById("confirmDeleteTestimonialBtn");
  if (confirmDeleteTestimonialBtn) {
    confirmDeleteTestimonialBtn.addEventListener("click", function () {
      if (activeTestimonialCard) {
        activeTestimonialCard.remove();
        activeTestimonialCard = null;
        console.log("TESTIMONIAL DELETED: Removed from UI.");
      }
      closeModal("deleteTestimonialModal");
    });
  }

  // Add Testimonial Form Validation & Submission
  const addTestimonialForm = document.getElementById("addTestimonialForm");
  if (addTestimonialForm) {
    addTestimonialForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(addTestimonialForm);

      let isValid = true;
      const authorInput = document.getElementById("authorName");
      const ratingInput = document.getElementById("rating");
      const quoteInput = document.getElementById("quote");

      if (authorInput && authorInput.value.trim() === "") {
        showError(authorInput, "Author name is required.");
        isValid = false;
      }
      if (ratingInput && ratingInput.value.trim() === "") {
        showError(ratingInput, "Rating is required.");
        isValid = false;
      }
      if (quoteInput && quoteInput.value.trim() === "") {
        showError(quoteInput, "Testimonial quote is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("ADD TESTIMONIAL DATA", addTestimonialForm);

        const container = document.getElementById("testimonialsContainer");
        if (container) {
          const newCard = document.createElement("div");
          newCard.className = "col-lg-4 col-md-6 testimonial-card-item";
          newCard.innerHTML = `
            <div class="card admin-card h-100 p-3">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="star-rating testimonial-stars">★★★★★</span>
                  <span class="badge bg-primary testimonial-tag">Endorsement</span>
                </div>
                <p class="card-text fst-italic text-secondary mb-4 testimonial-quote">
                  "${quoteInput.value.trim()}"
                </p>
                <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <strong class="testimonial-author">- ${authorInput.value.trim()}</strong>
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary btn-edit-testimonial" data-bs-toggle="modal" data-bs-target="#editTestimonialModal">Edit</button>
                    <button type="button" class="btn btn-outline-danger btn-delete-testimonial" data-bs-toggle="modal" data-bs-target="#deleteTestimonialModal">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          container.appendChild(newCard);
        }

        addTestimonialForm.reset();
        closeModal("addTestimonialModal");
      }
    });
  }

  // Edit Testimonial Form Validation & Submission
  const editTestimonialForm = document.getElementById("editTestimonialForm");
  if (editTestimonialForm) {
    editTestimonialForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(editTestimonialForm);

      let isValid = true;
      const authorInput = document.getElementById("editAuthorName");
      const ratingInput = document.getElementById("editRating");
      const quoteInput = document.getElementById("editQuote");

      if (authorInput && authorInput.value.trim() === "") {
        showError(authorInput, "Author name is required.");
        isValid = false;
      }
      if (ratingInput && ratingInput.value.trim() === "") {
        showError(ratingInput, "Rating is required.");
        isValid = false;
      }
      if (quoteInput && quoteInput.value.trim() === "") {
        showError(quoteInput, "Testimonial quote is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("EDIT TESTIMONIAL DATA", editTestimonialForm);

        if (activeTestimonialCard) {
          const authorEl = activeTestimonialCard.querySelector(".testimonial-author");
          const quoteEl = activeTestimonialCard.querySelector(".testimonial-quote");

          if (authorEl) authorEl.textContent = "- " + authorInput.value.trim();
          if (quoteEl) quoteEl.textContent = `"${quoteInput.value.trim()}"`;
        }

        closeModal("editTestimonialModal");
      }
    });
  }

  /* ========================================================================
     6. CONTACT MESSAGES & QUICK REPLY (admin/contact.html)
     ======================================================================== */
  let activeMessageRow = null;

  document.addEventListener("click", function (event) {
    const viewBtn = event.target.closest(".btn-view-msg");
    if (viewBtn) {
      activeMessageRow = viewBtn.closest(".msg-row-item");

      const sender = viewBtn.getAttribute("data-sender");
      const email = viewBtn.getAttribute("data-email");
      const subject = viewBtn.getAttribute("data-subject");
      const date = viewBtn.getAttribute("data-date");
      const content = viewBtn.getAttribute("data-content");

      const senderEl = document.getElementById("viewMsgSender");
      const subEl = document.getElementById("viewMsgSubject");
      const dateEl = document.getElementById("viewMsgDate");
      const bodyEl = document.getElementById("viewMsgBody");

      if (senderEl) senderEl.textContent = `From: ${sender} <${email}>`;
      if (subEl) subEl.textContent = `Subject: ${subject}`;
      if (dateEl) dateEl.textContent = `Received: ${date}`;
      if (bodyEl) bodyEl.textContent = content;

      // Mark as read if previously unread
      if (activeMessageRow.classList.contains("table-warning")) {
        activeMessageRow.classList.remove("table-warning");
        const statusBadge = activeMessageRow.querySelector(".msg-status");
        if (statusBadge && statusBadge.textContent.trim() === "Unread") {
          statusBadge.textContent = "Read";
          statusBadge.className = "badge bg-secondary msg-status";

          const unreadBadge = document.getElementById("unreadBadge");
          if (unreadBadge) {
            unreadBadge.textContent = "0 Unread";
            unreadBadge.className = "badge bg-success p-2 fs-6";
          }
        }
      }
    }

    const delBtn = event.target.closest(".btn-delete-msg");
    if (delBtn) {
      activeMessageRow = delBtn.closest(".msg-row-item");
    }
  });

  // Confirm delete message
  const confirmDeleteMessageBtn = document.getElementById("confirmDeleteMessageBtn");
  if (confirmDeleteMessageBtn) {
    confirmDeleteMessageBtn.addEventListener("click", function () {
      if (activeMessageRow) {
        activeMessageRow.remove();
        activeMessageRow = null;
        const tbody = document.getElementById("messagesTableBody");
        const totalBadge = document.getElementById("totalMessagesBadge");
        if (tbody && totalBadge) {
          totalBadge.textContent = tbody.children.length + " Total";
        }
        console.log("MESSAGE DELETED: Removed from inbox table.");
      }
      closeModal("deleteMessageModal");
    });
  }

  // Quick Reply Form Validation & Submission
  const quickReplyForm = document.getElementById("quickReplyForm");
  if (quickReplyForm) {
    quickReplyForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(quickReplyForm);

      let isValid = true;
      const replyInput = document.getElementById("replyMessage");

      if (replyInput && replyInput.value.trim() === "") {
        showError(replyInput, "Reply message is required.");
        isValid = false;
      }

      if (isValid) {
        logFormData("QUICK REPLY DATA", quickReplyForm);

        if (activeMessageRow) {
          const statusBadge = activeMessageRow.querySelector(".msg-status");
          if (statusBadge) {
            statusBadge.textContent = "Replied";
            statusBadge.className = "badge bg-success msg-status";
          }
        }

        quickReplyForm.reset();
        closeModal("viewMessageModal");
        alert("Reply sent successfully!");
      }
    });
  }

  // Inbox Search Filtering
  const searchInput = document.getElementById("messageSearchInput");
  const searchBtn = document.getElementById("messageSearchBtn");
  function filterMessages() {
    if (!searchInput) return;
    const term = searchInput.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#messagesTableBody .msg-row-item");
    rows.forEach(function (row) {
      const text = row.textContent.toLowerCase();
      if (text.includes(term)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMessages);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", filterMessages);
  }
});
