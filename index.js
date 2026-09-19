document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });
});
