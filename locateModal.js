(function () {
  // ---------- store data (swap fetchStores() for a real endpoint) ----------
  function fetchStores() {
    return Promise.resolve([
      {
        id: 1,
        name: "Abenson Waltermart North Edsa",
        addr: "2nd Floor Waltermart North EDSA, Veterans Village, Quezon City",
        hours: "9AM to 9PM",
        phones: ["(02) 8332 1045", "0918 804 1478", "0917 571 6609"],
        viberNumber: "639178041478",
        image: "./assets/map-photo.png",
        mapsQuery: "14.657041755862403,121.02103504516913",
      },
      {
        id: 2,
        name: "Abenson SM North EDSA",
        addr: "Upper Ground Floor, SM North EDSA, Quezon City",
        hours: "10AM to 9PM",
        phones: ["(02) 8441 2200", "0917 555 0199"],
        viberNumber: "639175550199",
        image: "https://placehold.co/600x400/163ba8/ffffff?text=SM+North+EDSA",
        mapsQuery: "14.6567,121.0303",
      },
      {
        id: 3,
        name: "Abenson TriNoma",
        addr: "3rd Floor TriNoma Mall, North Avenue, Quezon City",
        hours: "10AM to 9PM",
        phones: ["(02) 8916 3344", "0918 222 4455"],
        viberNumber: "639182224455",
        image: "https://placehold.co/600x400/0f2c80/ffffff?text=TriNoma",
        mapsQuery: "14.6537,121.0322",
      },
    ]);
  }

  let allStores = [];
  let activeId = null;

  // ---------- open/close (button-triggered only, no drag) ----------
  const getModal = () => document.getElementById("locator-modal");

  function openModal() {
    const modal = getModal();
    if (!modal) return;

    modal.classList.add("show-modal");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = getModal();
    if (!modal) return;

    modal.classList.remove("show-modal");
    document.body.style.overflow = "";
  }

  // ---------- store list rendering ----------
  function toTelHref(display) {
    let digits = display.replace(/\D/g, ""); // e.g. "(02) 8332 1045" -> "0283321045"
    if (digits.charAt(0) === "0") digits = "63" + digits.slice(1); // PH local -> intl
    return "tel:+" + digits;
  }

  function renderStores(list) {
    const resultsEl = document.getElementById("storeResults");
    resultsEl.innerHTML = "";
    if (!list.length) {
      resultsEl.innerHTML =
        '<p style="font-size:13px;color:var(--muted);padding:10px;">No stores match your search.</p>';
      return;
    }
    list.forEach(function (store) {
      const card = document.createElement("div");
      card.setAttribute("role", "button");
      card.tabIndex = 0;
      card.className = "store-card" + (store.id === activeId ? " is-active" : "");
      card.dataset.id = store.id;

      const phonesHtml = store.phones
        .map(function (num) {
          return '<a class="phone-link" href="' + toTelHref(num) + '">' + num + "</a>";
        })
        .join('<span class="phone-sep"> • </span>');

      card.innerHTML =
        "<h3>" +
        store.name +
        "</h3>" +
        "<p>" +
        store.addr +
        "</p>" +
        "<p>Operating Hours: " +
        store.hours +
        "</p>" +
        '<div class="phones">' +
        phonesHtml +
        "</div>" +
        '<span class="viber-btn" data-viber="' +
        store.viberNumber +
        '"><svg class="viber-icon" xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none"><path d="M39.533 14.0305C38.7441 13.2862 35.5512 10.9133 28.4323 10.8814C28.4323 10.8814 20.0401 10.3661 15.9526 14.2086C13.6791 16.537 12.8777 19.9533 12.7908 24.1838C12.7038 28.4143 12.5982 36.341 20.0587 38.4913H20.0649L20.0587 41.7739C20.0587 41.7739 20.009 43.1035 20.8662 43.3707C21.8974 43.7015 22.5062 42.69 23.4939 41.6022C24.0343 41.0042 24.7797 40.1263 25.345 39.4583C30.4512 39.8972 34.3709 38.8921 34.8182 38.7458C35.8494 38.4022 41.6823 37.6388 42.6265 29.7121C43.608 21.531 42.1544 16.3652 39.533 14.0305ZM40.3965 29.1141C39.5951 35.7303 34.8679 36.1502 33.9982 36.4365C33.6255 36.5573 30.1779 37.4353 25.8482 37.149C25.8482 37.149 22.618 41.1378 21.6117 42.1747C21.2824 42.5119 20.9221 42.4801 20.9284 41.8121C20.9284 41.3732 20.9532 36.3601 20.9532 36.3601C14.6295 34.5661 15.0022 27.8163 15.0705 24.2856C15.1389 20.7548 15.7911 17.8603 17.7168 15.9136C21.1768 12.7009 28.3019 13.178 28.3019 13.178C34.3212 13.2035 37.2036 15.0611 37.8744 15.6845C40.0921 17.6312 41.2227 22.288 40.3965 29.1141ZM31.7619 23.9739C31.7868 24.521 30.9854 24.5591 30.9606 24.012C30.8923 22.6125 30.2524 21.9318 28.9355 21.8554C28.4013 21.8236 28.451 21.0029 28.979 21.0347C30.7121 21.1302 31.675 22.148 31.7619 23.9739ZM33.0229 24.6927C33.0851 21.9954 31.4389 19.8833 28.3143 19.6479C27.7863 19.6097 27.8422 18.7891 28.3702 18.8272C31.9731 19.0944 33.8926 21.6327 33.8243 24.7118C33.8181 25.2589 33.0105 25.2335 33.0229 24.6927ZM35.9425 25.5452C35.9487 26.0923 35.1412 26.0987 35.1412 25.5516C35.1039 20.3668 31.7309 17.5422 27.6372 17.5104C27.1092 17.504 27.1092 16.6897 27.6372 16.6897C32.2154 16.7215 35.8991 19.9596 35.9425 25.5452ZM35.2406 31.7861V31.7988C34.5697 33.0075 33.3149 34.3435 32.0228 33.9172L32.0104 33.8981C30.6997 33.5228 27.6124 31.8942 25.6618 30.3038C24.6555 29.4895 23.7361 28.5289 23.028 27.6064C22.3882 26.7857 21.7421 25.8124 21.1147 24.6418C19.7916 22.1926 19.4996 21.0984 19.4996 21.0984C19.0834 19.7751 20.3817 18.4901 21.5682 17.803H21.5806C22.1521 17.4976 22.6988 17.5994 23.0653 18.0511C23.0653 18.0511 23.8355 18.9926 24.1648 19.457C24.4754 19.8896 24.8916 20.5831 25.109 20.9711C25.4879 21.6646 25.2518 22.3707 24.8791 22.6633L24.1337 23.2741C23.7548 23.5858 23.8045 24.1647 23.8045 24.1647C23.8045 24.1647 24.9102 28.4461 29.0411 29.5276C29.0411 29.5276 29.6064 29.5785 29.9108 29.1905L30.5071 28.4271C30.7929 28.0454 31.4824 27.8036 32.1595 28.1917C33.0726 28.7197 34.2343 29.5404 35.0045 30.2847C35.4394 30.6473 35.5388 31.2008 35.2406 31.7861Z" fill="#3F59D9"></path></svg>Chat on Viber</span>';
      resultsEl.appendChild(card);
    });
  }

  function selectStore(id) {
    activeId = id;
    const store = allStores.find(function (s) {
      return s.id === id;
    });
    if (!store) return;

    document.querySelectorAll(".store-card").forEach(function (c) {
      c.classList.toggle("is-active", Number(c.dataset.id) === id);
    });

    const photoEl = document.getElementById("storePhoto");
    const directionsBtn = document.getElementById("getDirectionsBtn");
    photoEl.src = store.image;
    photoEl.alt = "Map preview near " + store.name;
    directionsBtn.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(store.mapsQuery);
  }

  // ---------- single delegated click listener (same architecture as the FAQ modal) ----------
  document.addEventListener("click", function (e) {
    const modal = getModal();

    // Open
    if (e.target.closest("#open-button")) {
      openModal();
      return;
    }

    // Close (X button)
    if (e.target.closest(".locator-close-btn")) {
      closeModal();
      return;
    }

    // Close on backdrop click
    if (e.target === modal) {
      closeModal();
      return;
    }

    const viberEl = e.target.closest(".viber-btn");
    if (viberEl) {
      e.stopPropagation();
      window.location.href = "viber://chat?number=%2B" + viberEl.dataset.viber;
      return;
    }

    // Phone number tap — let the tel: link do its default action,
    if (e.target.closest(".phone-link")) {
      e.stopPropagation();
      return;
    }

    // Select a store card (generic fallback — must come last)
    const card = e.target.closest(".store-card");
    if (card) {
      selectStore(Number(card.dataset.id));
      return;
    }
  });

  // Prevent clicks inside the modal content from closing it via backdrop logic
  document.addEventListener("click", function (e) {
    const modal = getModal();
    if (e.target.closest(".modal-content-locator") && e.target !== modal) {
      e.stopPropagation();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".store-card");
      if (card) {
        e.preventDefault(); // stop Space from scrolling the list
        selectStore(Number(card.dataset.id));
      }
    }
  });

  document.getElementById("storeSearch").addEventListener("input", function () {
    const q = this.value.toLowerCase();
    const filtered = allStores.filter(function (s) {
      return s.name.toLowerCase().includes(q) || s.addr.toLowerCase().includes(q);
    });
    renderStores(filtered);
  });

  fetchStores()
    .then(function (stores) {
      allStores = stores;
      renderStores(stores);
      if (stores.length) selectStore(stores[0].id);
    })
    .catch(function () {
      renderStores([]);
    });
})();
