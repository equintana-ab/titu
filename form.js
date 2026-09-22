(function () {
  if (window.__tradeInCalcBound) return;
  window.__tradeInCalcBound = true;

  // ---- data source ----
  // Nested object lookup: brand -> model -> storage -> value.
  // No calculation happens at submit time — every combination's value
  // already exists here. Swap for a fetch() call if a real pricing
  const TRADE_IN_DATA = {
    apple: {
      label: "Apple",
      models: {
        "iphone-15": {
          label: "iPhone 15",
          image: "./assets/ip-15.png",
          storage: { "128GB": 5800, "256GB": 6800, "512GB": 7800 },
        },
        "iphone-14": {
          label: "iPhone 14",
          image: "/media/tradein/iphone-14.png",
          storage: { "128GB": 4500, "256GB": 5200 },
        },
      },
    },
    samsung: {
      label: "Samsung",
      models: {
        "galaxy-s24": {
          label: "Galaxy S24",
          image: "/media/tradein/galaxy-s24.png",
          storage: { "128GB": 4200, "256GB": 5000 },
        },
      },
    },
    // huawei / honor / vivo / xiaomi / realme / oppo: same shape, add when pricing is available
  };

  const ESTIMATE_DELAY_MS = 600; // purely cosmetic pacing on the button, not real processing time

  function formatPHP(amount) {
    return (
      "\u20b1" +
      amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function resetSelect(select, placeholderText, disabled) {
    select.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholderText;
    select.appendChild(opt);
    select.disabled = !!disabled;
  }

  function populateSelect(select, entries, placeholderText) {
    resetSelect(select, placeholderText, false);
    Object.keys(entries).forEach((key) => {
      const o = document.createElement("option");
      o.value = key;
      o.textContent = entries[key].label || key;
      select.appendChild(o);
    });
  }

  function storageAsEntries(storageObj) {
    const entries = {};
    Object.keys(storageObj).forEach((key) => {
      entries[key] = { label: key };
    });
    return entries;
  }

  function initForm(form) {
    if (!form || form.hasAttribute("data-tradein-bound")) return;
    form.setAttribute("data-tradein-bound", "true");

    const section = form.closest("#calculator-section") || document;
    const brandSelect = form.querySelector("#brand");
    const modelSelect = form.querySelector("#model");
    const storageSelect = form.querySelector("#condition");
    const submitBtn = form.querySelector(".cs-btn--primary");

    const resultView = section.querySelector("[data-tradein-result]");
    const formWrapper = form.closest(".calculator-section__form");

    function checkSubmitState() {
      submitBtn.disabled = !(brandSelect.value && modelSelect.value && storageSelect.value);
    }

    form.addEventListener("change", (e) => {
      if (e.target === brandSelect) {
        const brand = TRADE_IN_DATA[brandSelect.value];
        resetSelect(storageSelect, "Please select a device first", true);

        if (brand) {
          populateSelect(modelSelect, brand.models, "Please select a model");
        } else {
          resetSelect(modelSelect, "Please select a brand first", true);
        }
        checkSubmitState();
      }

      if (e.target === modelSelect) {
        const brand = TRADE_IN_DATA[brandSelect.value];
        const model = brand ? brand.models[modelSelect.value] : null;

        if (model) {
          populateSelect(storageSelect, storageAsEntries(model.storage), "Please select storage");
        } else {
          resetSelect(storageSelect, "Please select a device first", true);
        }
        checkSubmitState();
      }

      if (e.target === storageSelect) {
        checkSubmitState();
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;

      const brand = TRADE_IN_DATA[brandSelect.value];
      const model = brand.models[modelSelect.value];
      const storageKey = storageSelect.value;
      const value = model.storage[storageKey];

      // Button loading state — the only "delay" in this flow, purely for pacing.
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.textContent = "Calculating...";

      setTimeout(() => {
        submitBtn.classList.remove("is-loading");
        submitBtn.textContent = originalLabel;

        renderResult(brand, model, storageKey, value);
        formWrapper.classList.add("is-hidden");
        resultView.hidden = false;
      }, ESTIMATE_DELAY_MS);
    });

    function renderResult(brand, model, storageKey, value) {
      resultView.querySelector("[data-tradein-result-image]").src = model.image;
      resultView.querySelector("[data-tradein-result-image]").alt = `${brand.label} ${model.label}`;
      resultView.querySelector("[data-tradein-result-brand]").textContent = brand.label.toUpperCase();
      resultView.querySelector("[data-tradein-result-device]").textContent = `${model.label} (${storageKey})`;
      resultView.querySelector("[data-tradein-result-value]").textContent = formatPHP(value);
    }

    if (resultView) {
      resultView.querySelector("[data-tradein-restart]").addEventListener("click", () => {
        form.reset();
        resetSelect(modelSelect, "Please select a brand first", true);
        resetSelect(storageSelect, "Please select a device first", true);
        checkSubmitState();

        resultView.hidden = true;
        formWrapper.classList.remove("is-hidden");
      });

      // "Ready for the next step?" —
      resultView.querySelector("[data-tradein-next]").addEventListener("click", () => {});
    }
  }

  function initAll() {
    document.querySelectorAll(".trade-in-calculator-form-wrapper").forEach(initForm);
  }

  initAll();

  const observer = new MutationObserver(() => {
    initAll();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
