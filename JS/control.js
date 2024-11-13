document.addEventListener("DOMContentLoaded", () => {
  const navbarItems = document.querySelectorAll(".navbar span");
  const sections = {
    Hero: document.querySelector(".hero"),
    About: document.querySelector(".about"),
    Skills: document.querySelector(".skills"),
    Contact: document.querySelector(".contact"),
  };

  function hideAllSections() {
    Object.values(sections).forEach((section) => {
      section.classList.add("hidden");
    });
  }

  navbarItems.forEach((item) => {
    item.addEventListener("click", () => {
      hideAllSections();
      const sectionName = item.textContent.trim();
      const section = sections[sectionName];
      if (section) {
        section.classList.remove("hidden");
      }
    });
  });
  hideAllSections();
  sections.Hero.classList.remove("hidden");
});
