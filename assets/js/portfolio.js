/**
 * portfolio.js
 * Public Portfolio Dynamic Hydration & Interactivity Adapter
 * Connects Krish Savaliya's static index.html with PortfolioStore
 * Preserves the original HTML & CSS layout while allowing real-time CMS updates.
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof PortfolioStore === "undefined") {
      console.warn("PortfolioStore not found. Running with static HTML fallback.");
      return;
    }

    hydratePortfolio();

    // Listen for storage changes from other tabs or admin panel
    window.addEventListener("portfolioDataChanged", () => {
      hydratePortfolio();
    });

    setupContactForm();
  });

  function hydratePortfolio() {
    const profile = PortfolioStore.getProfile();
    const about = PortfolioStore.getAbout();
    const skills = PortfolioStore.getSkills();
    const projects = PortfolioStore.getProjects();
    const experience = PortfolioStore.getExperience();
    const certs = PortfolioStore.getCertifications();
    const testimonials = PortfolioStore.getTestimonials(true); // only visible
    const resume = PortfolioStore.getResume();
    const settings = PortfolioStore.getSettings();

    /* 1. Global Meta & Title */
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.metaDescription) {
      metaDesc.setAttribute("content", settings.metaDescription);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && settings.metaKeywords) {
      metaKeywords.setAttribute("content", settings.metaKeywords);
    }

    /* 2. Resume Header Button */
    const resumeLink = document.querySelector(".resume-cell a");
    if (resumeLink && resume) {
      resumeLink.setAttribute("href", resume.fileUrl || "resume.pdf");
      resumeLink.setAttribute("download", resume.fileName || "resume.pdf");
    }

    /* 3. Hero Section */
    const heroSection = document.getElementById("hero");
    if (heroSection && profile) {
      const nameEl = heroSection.querySelector(".hero-name");
      if (nameEl && profile.name) nameEl.textContent = profile.name;

      const titleEl = heroSection.querySelector(".section-title");
      if (titleEl && profile.title) titleEl.textContent = profile.title;

      const subEl = heroSection.querySelector(".hero-subtitle");
      if (subEl && profile.subtitle) subEl.textContent = profile.subtitle;

      const bioEls = heroSection.querySelectorAll(".hero-bio");
      if (bioEls.length >= 2) {
        if (profile.bio1) bioEls[0].textContent = profile.bio1;
        if (profile.bio2) bioEls[1].textContent = profile.bio2;
      }

      // CTA Buttons
      const primaryBtn = heroSection.querySelector(".btn-primary");
      if (primaryBtn) {
        if (profile.ctaPrimaryText) primaryBtn.textContent = profile.ctaPrimaryText;
        const parentLink = primaryBtn.closest("a");
        if (parentLink && profile.ctaPrimaryLink) parentLink.setAttribute("href", profile.ctaPrimaryLink);
      }

      const secondaryBtn = heroSection.querySelector(".btn-secondary");
      if (secondaryBtn) {
        if (profile.ctaSecondaryText) secondaryBtn.textContent = profile.ctaSecondaryText;
        const parentLink = secondaryBtn.closest("a");
        if (parentLink && profile.ctaSecondaryLink) parentLink.setAttribute("href", profile.ctaSecondaryLink);
      }

      // Avatar
      const imgWrapper = heroSection.querySelector(".hero-img-wrapper");
      if (imgWrapper) {
        if (profile.avatarType === "image" && profile.avatarUrl) {
          imgWrapper.innerHTML = `
            <img src="${profile.avatarUrl}" alt="${profile.name || 'Krish'}" width="250" height="250" style="width: 250px; height: 250px; object-fit: cover; border-radius: 50%; border: 4px solid #FB923C;" onerror="this.onerror=null; this.src='image.jpg';">
          `;
        } else {
          imgWrapper.innerHTML = `
            <svg class="hero-img" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" width="250" height="250">
              <circle cx="125" cy="125" r="123" fill="#FFF1E6" stroke="#FB923C" stroke-width="4"/>
              <circle cx="125" cy="95" r="38" fill="#FFD4A8"/>
              <path d="M67 202c0-35 26-59 58-59s58 24 58 59c0 8-6 14-14 14H81c-8 0-14-6-14-14Z" fill="#FFD4A8"/>
            </svg>
          `;
        }
      }
    }

    /* 4. About Section */
    const aboutSection = document.getElementById("about");
    if (aboutSection && about) {
      const titleEl = aboutSection.querySelector(".section-title");
      if (titleEl && about.title) titleEl.textContent = about.title;

      const aboutCard = aboutSection.querySelector(".about-card");
      if (aboutCard && Array.isArray(about.paragraphs) && about.paragraphs.length > 0) {
        aboutCard.innerHTML = about.paragraphs
          .map((p) => `<p class="about-text">${escapeHtml(p)}</p>`)
          .join("\n");
      }
    }

    /* 5. Skills Section */
    const skillsSection = document.getElementById("skills");
    if (skillsSection && Array.isArray(skills) && skills.length > 0) {
      const skillsRow = skillsSection.querySelector(".skills-row");
      if (skillsRow) {
        const colWidth = Math.max(20, Math.floor(100 / skills.length));
        skillsRow.innerHTML = skills
          .map((cat) => {
            const itemsHtml = (cat.items || [])
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("\n");
            return `
              <td class="skill-card" width="${colWidth}%" valign="top">
                <h2 class="card-title">${escapeHtml(cat.title)}</h2>
                <ul class="skill-list">
                  ${itemsHtml}
                </ul>
              </td>
            `;
          })
          .join("\n");
      }
    }

    /* 6. Projects Section */
    const projectsSection = document.getElementById("projects");
    if (projectsSection && Array.isArray(projects) && projects.length > 0) {
      const projectsRow = projectsSection.querySelector(".projects-row");
      if (projectsRow) {
        const colWidth = Math.max(25, Math.floor(100 / Math.min(3, projects.length)));
        projectsRow.innerHTML = projects
          .map((p) => {
            const descParas = (p.description || p.shortDesc || "")
              .split("\n")
              .filter((d) => d.trim().length > 0)
              .map((d) => `<p class="project-desc">${escapeHtml(d)}</p>`)
              .join("\n");

            const imgFile = p.image || "image.jpg";
            const targetLink = p.link || "#contact";

            return `
              <td class="project-card" width="${colWidth}%" valign="top" align="center">
                <img class="project-img" src="${escapeHtml(imgFile)}" alt="${escapeHtml(p.title)}" width="220" height="150" onerror="this.onerror=null; this.src='image.jpg';">
                <h2 class="card-title">${escapeHtml(p.title)}</h2>
                ${descParas}
                <a href="${escapeHtml(targetLink)}" class="project-link">
                  <button class="btn btn-project">View Project</button>
                </a>
              </td>
            `;
          })
          .join("\n");
      }
    }

    /* 7. Experience Section */
    const expSection = document.getElementById("experience");
    if (expSection && Array.isArray(experience) && experience.length > 0) {
      const expTable = expSection.querySelector(".experience-table");
      if (expTable) {
        // Group into pairs of 2 cards per row
        let rowsHtml = "";
        for (let i = 0; i < experience.length; i += 2) {
          const pair = experience.slice(i, i + 2);
          const colsHtml = pair
            .map((item) => {
              const bulletsHtml = (item.bullets || [])
                .map((b) => `<li>${escapeHtml(b.replace(/^[•\-\*]\s*/, ''))}</li>`)
                .join("\n");
              return `
                <td class="experience-card" width="50%" valign="top">
                  <h2 class="card-title">${escapeHtml(item.title)}</h2>
                  <h4 class="card-subtitle">${escapeHtml(item.subtitle || item.period || "")}</h4>
                  <ul class="experience-list">
                    ${bulletsHtml}
                  </ul>
                </td>
              `;
            })
            .join("\n");

          // If odd number of cards, fill empty td
          const extraTd = pair.length === 1 ? '<td class="experience-card" width="50%" valign="top" style="visibility:hidden;"></td>' : '';

          rowsHtml += `<tr class="experience-row">${colsHtml}${extraTd}</tr>`;
        }
        expTable.innerHTML = rowsHtml;
      }
    }

    /* 8. Certifications Section */
    const certsSection = document.getElementById("certifications");
    if (certsSection && Array.isArray(certs) && certs.length > 0) {
      const certsRow = certsSection.querySelector(".certifications-row");
      if (certsRow) {
        const colWidth = Math.max(25, Math.floor(100 / Math.min(3, certs.length)));
        certsRow.innerHTML = certs
          .map((c) => {
            return `
              <td class="certification-card" width="${colWidth}%" valign="top">
                <h2 class="card-title">${escapeHtml(c.title)}</h2>
                <p class="certification-desc">${escapeHtml(c.description)}</p>
                ${c.issuer || c.date ? `<small style="color: #bd5712; font-weight: bold; display: block; margin-top: 6px;">${escapeHtml(c.issuer || '')} ${c.date ? `(${escapeHtml(c.date)})` : ''}</small>` : ''}
              </td>
            `;
          })
          .join("\n");
      }
    }

    /* 9. Testimonials Section */
    const testSection = document.getElementById("testimonials");
    if (testSection) {
      const testRow = testSection.querySelector(".testimonials-row");
      if (testRow && Array.isArray(testimonials)) {
        if (testimonials.length === 0) {
          testSection.style.display = "none";
        } else {
          testSection.style.display = "";
          const colWidth = Math.max(25, Math.floor(100 / Math.min(3, testimonials.length)));
          testRow.innerHTML = testimonials
            .map((t) => {
              const stars = "★".repeat(t.rating || 5);
              return `
                <td class="testimonial-card" width="${colWidth}%" valign="top">
                  <div class="testimonial-stars" aria-label="${t.rating || 5} out of 5 stars">
                    ${stars}
                  </div>
                  <p class="testimonial-quote">
                    &quot;${escapeHtml(t.quote)}&quot;
                  </p>
                  <b class="testimonial-author">— ${escapeHtml(t.author)}</b>
                </td>
              `;
            })
            .join("\n");
        }
      }
    }

    /* 10. Footer Details & Socials */
    const footer = document.querySelector(".site-footer");
    if (footer && settings) {
      const linksP = footer.querySelector(".footer-links");
      if (linksP) {
        linksP.innerHTML = `
          <a class="footer-link" href="mailto:${escapeHtml(settings.email || 'krishsavaliya018@gmail.com')}">Email</a>
          |
          <a class="footer-link" href="${escapeHtml(settings.linkedin || 'https://www.linkedin.com/in/krish-savaliya-5a139a31a/')}" target="_blank">LinkedIn</a>
          |
          <a class="footer-link" href="${escapeHtml(settings.github || 'https://github.com/Krish130910')}" target="_blank">GitHub</a>
          |
          <a class="footer-link" href="admin/login.html" style="color: #ed7c25; font-weight: bold;">Admin Portal</a>
        `;
      }

      const deptP = footer.querySelector(".footer-contact");
      if (deptP && settings.footerDepartment) {
        deptP.textContent = settings.footerDepartment;
      }

      const copyP = footer.querySelector(".footer-copy");
      if (copyP && settings.footerCopyright) {
        copyP.textContent = settings.footerCopyright;
      }
    }

    /* 11. Section Visibility Control */
    const sectionsConfig = settings.sections || {};
    const sectionIds = ["hero", "about", "skills", "projects", "experience", "certifications", "testimonials", "contact"];

    sectionIds.forEach((secId) => {
      const isVisible = sectionsConfig[secId] !== false;
      const el = document.getElementById(secId);
      if (el) {
        el.style.display = isVisible ? "" : "none";
        
        // Hide surrounding hr/br
        let next = el.nextElementSibling;
        while (next && (next.tagName === "BR" || next.classList.contains("section-divider"))) {
          next.style.display = isVisible ? "" : "none";
          next = next.nextElementSibling;
        }
      }

      // Hide corresponding nav link in header
      const navLink = document.querySelector(`.nav-link[href="#${secId}"]`);
      if (navLink) {
        navLink.style.display = isVisible ? "" : "none";
      }
    });
  }

  function setupContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const subjectInput = form.querySelector('input[name="subject"]');
      const messageInput = form.querySelector("textarea");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Add to store
      PortfolioStore.addMessage({
        name: name,
        email: email,
        subject: subject || "Contact Inquiry",
        message: message
      });

      // Show success notification in UI
      let notice = document.getElementById("contactSuccessNotice");
      if (!notice) {
        notice = document.createElement("div");
        notice.id = "contactSuccessNotice";
        notice.style.maxWidth = "600px";
        notice.style.margin = "20px auto";
        notice.style.padding = "16px 20px";
        notice.style.backgroundColor = "#ecfdf5";
        notice.style.border = "1px solid #a7f3d0";
        notice.style.borderRadius = "10px";
        notice.style.color = "#065f46";
        notice.style.textAlign = "center";
        notice.style.fontSize = "15px";
        notice.style.fontWeight = "600";
        notice.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.15)";
        form.parentNode.insertBefore(notice, form);
      }

      notice.innerHTML = `
        <span style="font-size: 18px; margin-right: 6px;">🎉</span>
        Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been sent successfully. Krish will get back to you shortly!
      `;
      notice.style.display = "block";

      // Reset form
      form.reset();

      // Scroll smoothly to notice
      notice.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        if (notice) notice.style.display = "none";
      }, 7000);
    });
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
