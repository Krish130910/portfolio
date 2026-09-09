/**
 * portfolio-store.js
 * Central Data Store and Repository for Krish Savaliya's Portfolio & Admin Panel
 * Uses localStorage for persistence with event dispatching for real-time reactivity.
 */

const STORAGE_KEY = "krish_portfolio_data_v1";
const AUTH_KEY = "krish_portfolio_admin_auth";

class PortfolioStoreManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.resetToDefaults();
    }
  }

  _getRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.resetToDefaults();
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing portfolio data, resetting to defaults", e);
      return this.resetToDefaults();
    }
  }

  _saveRaw(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event for real-time synchronization between tabs/components
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolioDataChanged", { detail: data })
      );
    }
    return data;
  }

  generateId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }

  resetToDefaults() {
    const seed = typeof DEFAULT_PORTFOLIO_DATA !== "undefined"
      ? JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA))
      : {};
    this._saveRaw(seed);
    return seed;
  }

  exportData() {
    return JSON.stringify(this._getRaw(), null, 2);
  }

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        this._saveRaw(parsed);
        return { success: true };
      }
      return { success: false, error: "Invalid JSON structure" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ================= PROFILE & HERO ================= */
  getProfile() {
    const data = this._getRaw();
    return data.profile || {};
  }

  updateProfile(profileData) {
    const data = this._getRaw();
    data.profile = { ...data.profile, ...profileData };
    this._saveRaw(data);
    return data.profile;
  }

  /* ================= ABOUT ME ================= */
  getAbout() {
    const data = this._getRaw();
    return data.about || { title: "About Me", paragraphs: [] };
  }

  updateAbout(aboutData) {
    const data = this._getRaw();
    data.about = { ...data.about, ...aboutData };
    this._saveRaw(data);
    return data.about;
  }

  /* ================= SKILLS ================= */
  getSkills() {
    const data = this._getRaw();
    return data.skills || [];
  }

  getSkillCategory(id) {
    const skills = this.getSkills();
    return skills.find((c) => c.id === id) || null;
  }

  saveSkillCategory(category) {
    const data = this._getRaw();
    if (!data.skills) data.skills = [];

    if (category.id) {
      const idx = data.skills.findIndex((c) => c.id === category.id);
      if (idx !== -1) {
        data.skills[idx] = { ...data.skills[idx], ...category };
      } else {
        data.skills.push(category);
      }
    } else {
      category.id = this.generateId("cat");
      data.skills.push(category);
    }

    this._saveRaw(data);
    return category;
  }

  deleteSkillCategory(id) {
    const data = this._getRaw();
    data.skills = (data.skills || []).filter((c) => c.id !== id);
    this._saveRaw(data);
    return true;
  }

  /* ================= PROJECTS ================= */
  getProjects() {
    const data = this._getRaw();
    return (data.projects || []).sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getProject(id) {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  saveProject(project) {
    const data = this._getRaw();
    if (!data.projects) data.projects = [];

    if (project.id) {
      const idx = data.projects.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        data.projects[idx] = { ...data.projects[idx], ...project };
      } else {
        data.projects.push(project);
      }
    } else {
      project.id = this.generateId("proj");
      if (!project.order) project.order = data.projects.length + 1;
      data.projects.push(project);
    }

    this._saveRaw(data);
    return project;
  }

  deleteProject(id) {
    const data = this._getRaw();
    data.projects = (data.projects || []).filter((p) => p.id !== id);
    this._saveRaw(data);
    return true;
  }

  /* ================= EXPERIENCE ================= */
  getExperience() {
    const data = this._getRaw();
    return (data.experience || []).sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getExperienceItem(id) {
    const exp = this.getExperience();
    return exp.find((e) => e.id === id) || null;
  }

  saveExperience(item) {
    const data = this._getRaw();
    if (!data.experience) data.experience = [];

    if (item.id) {
      const idx = data.experience.findIndex((e) => e.id === item.id);
      if (idx !== -1) {
        data.experience[idx] = { ...data.experience[idx], ...item };
      } else {
        data.experience.push(item);
      }
    } else {
      item.id = this.generateId("exp");
      if (!item.order) item.order = data.experience.length + 1;
      data.experience.push(item);
    }

    this._saveRaw(data);
    return item;
  }

  deleteExperience(id) {
    const data = this._getRaw();
    data.experience = (data.experience || []).filter((e) => e.id !== id);
    this._saveRaw(data);
    return true;
  }

  /* ================= CERTIFICATIONS ================= */
  getCertifications() {
    const data = this._getRaw();
    return data.certifications || [];
  }

  getCertification(id) {
    const certs = this.getCertifications();
    return certs.find((c) => c.id === id) || null;
  }

  saveCertification(item) {
    const data = this._getRaw();
    if (!data.certifications) data.certifications = [];

    if (item.id) {
      const idx = data.certifications.findIndex((c) => c.id === item.id);
      if (idx !== -1) {
        data.certifications[idx] = { ...data.certifications[idx], ...item };
      } else {
        data.certifications.push(item);
      }
    } else {
      item.id = this.generateId("cert");
      data.certifications.push(item);
    }

    this._saveRaw(data);
    return item;
  }

  deleteCertification(id) {
    const data = this._getRaw();
    data.certifications = (data.certifications || []).filter((c) => c.id !== id);
    this._saveRaw(data);
    return true;
  }

  /* ================= TESTIMONIALS ================= */
  getTestimonials(onlyVisible = false) {
    const data = this._getRaw();
    const list = data.testimonials || [];
    return onlyVisible ? list.filter((t) => t.visible !== false) : list;
  }

  getTestimonial(id) {
    const list = this.getTestimonials();
    return list.find((t) => t.id === id) || null;
  }

  saveTestimonial(item) {
    const data = this._getRaw();
    if (!data.testimonials) data.testimonials = [];

    if (item.id) {
      const idx = data.testimonials.findIndex((t) => t.id === item.id);
      if (idx !== -1) {
        data.testimonials[idx] = { ...data.testimonials[idx], ...item };
      } else {
        data.testimonials.push(item);
      }
    } else {
      item.id = this.generateId("test");
      if (typeof item.visible === "undefined") item.visible = true;
      data.testimonials.push(item);
    }

    this._saveRaw(data);
    return item;
  }

  deleteTestimonial(id) {
    const data = this._getRaw();
    data.testimonials = (data.testimonials || []).filter((t) => t.id !== id);
    this._saveRaw(data);
    return true;
  }

  toggleTestimonialVisibility(id) {
    const data = this._getRaw();
    const item = (data.testimonials || []).find((t) => t.id === id);
    if (item) {
      item.visible = !item.visible;
      this._saveRaw(data);
      return item.visible;
    }
    return false;
  }

  /* ================= MESSAGES (CONTACT INBOX) ================= */
  getMessages() {
    const data = this._getRaw();
    return (data.messages || []).sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
  }

  getMessage(id) {
    const msgs = this.getMessages();
    return msgs.find((m) => m.id === id) || null;
  }

  addMessage(msg) {
    const data = this._getRaw();
    if (!data.messages) data.messages = [];

    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newMsg = {
      id: this.generateId("msg"),
      name: msg.name || "Anonymous",
      email: msg.email || "",
      subject: msg.subject || "No Subject",
      message: msg.message || "",
      date: msg.date || dateFormatted,
      status: "new"
    };

    data.messages.unshift(newMsg);
    this._saveRaw(data);
    return newMsg;
  }

  updateMessageStatus(id, status) {
    const data = this._getRaw();
    const msg = (data.messages || []).find((m) => m.id === id);
    if (msg) {
      msg.status = status; // 'new', 'read', 'replied'
      this._saveRaw(data);
      return msg;
    }
    return null;
  }

  deleteMessage(id) {
    const data = this._getRaw();
    data.messages = (data.messages || []).filter((m) => m.id !== id);
    this._saveRaw(data);
    return true;
  }

  getUnreadMessageCount() {
    const msgs = this.getMessages();
    return msgs.filter((m) => m.status === "new").length;
  }

  /* ================= RESUME ================= */
  getResume() {
    const data = this._getRaw();
    return (
      data.resume || {
        fileName: "resume.pdf",
        fileUrl: "resume.pdf",
        lastUpdated: "September 2026",
        fileSize: "245 KB"
      }
    );
  }

  updateResume(resumeData) {
    const data = this._getRaw();
    data.resume = { ...data.resume, ...resumeData };
    this._saveRaw(data);
    return data.resume;
  }

  /* ================= SETTINGS ================= */
  getSettings() {
    const data = this._getRaw();
    return (
      data.settings || {
        siteTitle: "Krish Savaliya | Portfolio",
        metaDescription: "",
        metaKeywords: "",
        email: "krishsavaliya018@gmail.com",
        linkedin: "https://www.linkedin.com/in/krish-savaliya-5a139a31a/",
        github: "https://github.com/Krish130910",
        footerDepartment:
          "Department of Information Technology | Marwadi University",
        footerCopyright: "© 2026 Krish Savaliya. All Rights Reserved.",
        sections: {
          hero: true,
          about: true,
          skills: true,
          projects: true,
          experience: true,
          certifications: true,
          testimonials: true,
          contact: true
        }
      }
    );
  }

  updateSettings(settingsData) {
    const data = this._getRaw();
    data.settings = { ...data.settings, ...settingsData };
    this._saveRaw(data);
    return data.settings;
  }

  toggleSectionVisibility(sectionKey, isVisible) {
    const data = this._getRaw();
    if (!data.settings) data.settings = {};
    if (!data.settings.sections) data.settings.sections = {};
    data.settings.sections[sectionKey] = isVisible;
    this._saveRaw(data);
    return data.settings.sections;
  }

  /* ================= AUTHENTICATION ================= */
  isAdminLoggedIn() {
    const session = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (!session) return false;
    try {
      const auth = JSON.parse(session);
      return auth && auth.isLoggedIn === true;
    } catch {
      return false;
    }
  }

  login(email, password, remember = false) {
    // Demo credentials
    const validEmails = ["admin@example.com", "krish@example.com", "krishsavaliya018@gmail.com"];
    const validPassword = "admin123";

    if (
      validEmails.includes(email.toLowerCase().trim()) &&
      password === validPassword
    ) {
      const session = {
        isLoggedIn: true,
        email: email.trim(),
        name: "Krish Savaliya",
        role: "Super Admin",
        loginTime: new Date().toISOString()
      };
      const str = JSON.stringify(session);
      if (remember) {
        localStorage.setItem(AUTH_KEY, str);
      } else {
        sessionStorage.setItem(AUTH_KEY, str);
      }
      return { success: true, user: session };
    }
    return { success: false, error: "Invalid email or password. Use demo credentials: admin@example.com / admin123" };
  }

  logout() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    return true;
  }

  getCurrentUser() {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /* ================= DASHBOARD SUMMARY STATS ================= */
  getDashboardStats() {
    const data = this._getRaw();
    const skillsCount = (data.skills || []).reduce(
      (acc, c) => acc + (c.items ? c.items.length : 0),
      0
    );
    const messages = data.messages || [];
    const unreadMessages = messages.filter((m) => m.status === "new").length;

    return {
      projectsCount: (data.projects || []).length,
      skillCategoriesCount: (data.skills || []).length,
      totalSkillsCount: skillsCount,
      experienceCount: (data.experience || []).length,
      certificationsCount: (data.certifications || []).length,
      testimonialsCount: (data.testimonials || []).length,
      messagesCount: messages.length,
      unreadMessagesCount: unreadMessages
    };
  }
}

// Global Singleton Instance
const PortfolioStore = new PortfolioStoreManager();

if (typeof window !== "undefined") {
  window.PortfolioStore = PortfolioStore;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = PortfolioStore;
}
