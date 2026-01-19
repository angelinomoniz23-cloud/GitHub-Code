/* ===== Helpers ===== */
      function $(sel, ctx = document) {
        return ctx.querySelector(sel);
      }
      function $$(sel, ctx = document) {
        return Array.from(ctx.querySelectorAll(sel));
      }

      /* ===== Smooth menu scrolling ===== */
      $$("nav.desktop a[data-scroll], .actions a[data-scroll]").forEach((a) => {
        a.addEventListener("click", function (e) {
          const target = a.getAttribute("data-scroll");
          if (!target) return;
          e.preventDefault();
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      /* ===== Mobile menu toggle ===== */
      function toggleMobileMenu() {
        const nav = document.querySelector("nav.desktop");
        if (!nav) return;
        nav.style.display = nav.style.display === "flex" ? "none" : "flex";
      }

      /* ===== Search (simple filter) ===== */
      $("#searchBtn").addEventListener("click", () => {
        const q = $("#searchInput").value.trim().toLowerCase();
        if (!q) {
          location.hash = "#modelos";
          return;
        }
        document.querySelectorAll(".card").forEach((card) => {
          const text = (card.innerText || "").toLowerCase();
          card.style.display = text.includes(q) ? "" : "none";
        });
      });

      /* ===== Contact form (simulate save) ===== */
      $("#contactForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const n = $("#cname").value.trim();
        const em = $("#cemail").value.trim();
        const msg = $("#cmessage").value.trim();
        if (!n || !em || !msg) {
          alert("Por favor preenche todos os campos.");
          return;
        }
        const contacts = JSON.parse(
          localStorage.getItem("saf_contacts") || "[]"
        );
        contacts.unshift({
          id: Date.now(),
          name: n,
          email: em,
          message: msg,
          date: new Date().toISOString(),
        });
        localStorage.setItem("saf_contacts", JSON.stringify(contacts));
        alert("Obrigado! Mensagem recebida (simulação).");
        this.reset();
      });

      /* ===== Reveal on scroll ===== */
      const sections = document.querySelectorAll("section");
      function reveal() {
        sections.forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.top < window.innerHeight - 80) s.classList.add("visible");
        });
      }
      window.addEventListener("scroll", reveal);
      window.addEventListener("load", reveal);

      /* ===== Planilhas info (titles & short desc) ===== */
      const PLANILHAS_INFO = {
        "dashboard-financeiro": {
          title: "Dashboard Financeiro",
          desc: "KPIs e gráficos de performance.",
        },
        "apuramento-impostos": {
          title: "Apuramento de Impostos",
          desc: "Planilha para cálculo de tributos.",
        },
        "controle-salarios": {
          title: "Controle de Salários",
          desc: "Cálculo de salários e contribuições.",
        },
        "curva-abc": {
          title: "Curva ABC",
          desc: "Classificação ABC do stock e priorização.",
        },
        balanco: {
          title: "Balanço Patrimonial",
          desc: "Apresentação da situação patrimonial.",
        },
        dr: {
          title: "Demonstração de Resultados (DR)",
          desc: "Resultado do exercício e análise de margens.",
        },
        "fluxo-caixa": {
          title: "Fluxo de Caixa Mensal",
          desc: "Controle de entradas e saídas mensais.",
        },
        "folha-pagamento": {
          title: "Folha de Pagamento + IRT",
          desc: "Folha e cálculos de retenções.",
        },
        "livro-vendas-compras": {
          title: "Livro de Vendas e Compras (com IVA)",
          desc: "Registo fiscal de vendas e compras.",
        },
        "controle-stock": {
          title: "Controle de Stock / Inventário",
          desc: "Gestão de inventário e movimentos.",
        },
        balancete: {
          title: "Balancete / DR",
          desc: "Balancete e Demonstração de Resultados.",
        },
        "mapa-iva": {
          title: "Mapa de IVA e Relatórios Fiscais",
          desc: "Apresentação do IVA a pagar/recuperar.",
        },
        "contratos-recibos": {
          title: "Contratos, Fichas e Recibos",
          desc: "Modelos administrativos padrão.",
        },
        "documentos-contabeis": {
          title: "Documentos Contabilísticos (Pacote)",
          desc: "Pacote de documentos para apresentação financeira.",
        },
      };

      /* ===== Cart (localStorage) ===== */
      function getCart() {
        return JSON.parse(localStorage.getItem("saf_cart") || "[]");
      }
      function saveCart(cart) {
        localStorage.setItem("saf_cart", JSON.stringify(cart));
        updateCartCount();
      }
      function updateCartCount() {
        $("#cartCount").innerText = getCart().length;
      }

      /* ===== Top alert show/hide ===== */
      const topAlert = $("#topAlert");
      let topAlertTimer = null;
      function showTopAlert(msg) {
        topAlert.textContent =
          msg || "✅ Planilha adicionada ao carrinho com sucesso!";
        topAlert.style.display = "block";
        topAlert.style.opacity = "1";
        // clear previous timer
        if (topAlertTimer) clearTimeout(topAlertTimer);
        topAlertTimer = setTimeout(() => {
          topAlert.style.transition = "opacity 400ms";
          topAlert.style.opacity = "0";
          setTimeout(() => {
            topAlert.style.display = "none";
            topAlert.style.transition = "";
          }, 420);
        }, 3000); // hide after 3s
      }

      /* ===== Modal logic ===== */
      const modalBackdrop = $("#modalBackdrop");
      const modalTitle = $("#modalTitle");
      const modalDesc = $("#modalDesc");
      const modalWhats = $("#modalWhats");
      const modalEmail = $("#modalEmail");
      const modalClose = $("#modalClose");

      function openModal(planilha) {
        modalTitle.innerText = `Comprar: ${planilha.title}`;
        modalDesc.innerText = `Escolha como quer entrar em contacto para adquirir esta planilha:`;
        modalBackdrop.style.display = "flex";
        modalBackdrop.setAttribute("aria-hidden", "false");

        // wire buttons
        modalWhats.onclick = function () {
          const waText = encodeURIComponent(
            `Olá, tenho interesse na planilha: ${planilha.title}. Como proceder com a compra?`
          );
          window.open(`https://wa.me/244944778154?text=${waText}`, "_blank");
        };
        modalEmail.onclick = function () {
          const subject = encodeURIComponent(
            `Interesse em comprar: ${planilha.title}`
          );
          const body = encodeURIComponent(
            `Olá,\n\nGostaria de adquirir a planilha: ${planilha.title}.\n\nPor favor informe preço e instruções de pagamento.\n\nObrigado.`
          );
          window.location.href = `mailto:safconsulto@gmail.com?subject=${subject}&body=${body}`;
        };
      }
      function closeModal() {
        modalBackdrop.style.display = "none";
        modalBackdrop.setAttribute("aria-hidden", "true");
      }
      modalClose.addEventListener("click", closeModal);
      modalBackdrop.addEventListener("click", function (e) {
        if (e.target === modalBackdrop) closeModal();
      });

      /* ===== When user clicks 'Adicionar ao Carrinho' ===== */
      function attachAddButtons() {
        $$(".add-cart-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            const planilhaId = btn.getAttribute("data-id") || btn.dataset.id;
            const info = PLANILHAS_INFO[planilhaId] || {
              title: beautify(planilhaId),
              desc: "",
            };
            // add to cart
            const cart = getCart();
            cart.push({
              id: planilhaId,
              name: info.title,
              date: new Date().toISOString(),
            });
            saveCart(cart);
            // show top alert
            showTopAlert(
              `✅ "${info.title}" adicionada ao carrinho com sucesso!`
            );
            // small delay so user sees alert then modal appears (0.35s)
            setTimeout(() => openModal(info), 350);
          });
        });
      }
      function beautify(slug) {
        return slug
          ? slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Planilha";
      }

      /* ===== Cart indicator functions ===== */
      $("#cartIndicator").addEventListener("click", function () {
        const cart = getCart();
        if (cart.length === 0) {
          alert("O seu carrinho está vazio.");
          return;
        }
        // show summary in prompt style
        const list = cart.map((c, i) => `${i + 1}. ${c.name}`).join("\n");
        const action = prompt(
          `Itens no carrinho:\n\n${list}\n\nAções:\n1 - Contactar via WhatsApp\n2 - Remover item (ex: 2)\n3 - Esvaziar carrinho\n\nEscreva 1, 2 ou 3:`
        );
        if (!action) return;
        if (action.trim() === "1") {
          const waText = encodeURIComponent(
            `Olá, tenho interesse em comprar as planilhas: ${cart.map((c) => c.name).join(" | ")}. Como proceder?`
          );
          window.open(`https://wa.me/244944778154?text=${waText}`, "_blank");
        } else if (action.trim() === "2") {
          const idx = prompt("Digite o número do item a remover:");
          const i = parseInt(idx, 10) - 1;
          if (!isNaN(i) && i >= 0 && i < cart.length) {
            cart.splice(i, 1);
            saveCart(cart);
            alert("Item removido.");
          } else alert("Número inválido.");
        } else if (action.trim() === "3") {
          if (confirm("Tem certeza que deseja esvaziar o carrinho?")) {
            saveCart([]);
            alert("Carrinho esvaziado.");
          }
        } else {
          alert("Ação cancelada ou inválida.");
        }
      });

      /* ===== Feedback handling (localStorage) ===== */
      function loadFeedback() {
        const list = JSON.parse(localStorage.getItem("saf_feedback") || "[]");
        renderFeedback(list);
      }
      function renderFeedback(list) {
        const dest = $("#feedbackList");
        if (!dest) return;
        if (!list || list.length === 0) {
          dest.innerHTML = '<p class="small">Nenhum comentário ainda.</p>';
          return;
        }
        dest.innerHTML = list
          .map(
            (f) => `
    <div class="comment">
      <strong>${escapeHtml(f.name)}</strong> <small style="color:#8b9999">(${new Date(f.date).toLocaleString()})</small>
      <p style="margin-top:6px">${escapeHtml(f.text)}</p>
    </div>
  `
          )
          .join("");
      }
      $("#btnFeedback").addEventListener("click", function () {
        const name = ($("#fb-name").value || "").trim();
        const email = ($("#fb-email").value || "").trim();
        const text = ($("#fb-text").value || "").trim();
        if (!name || !text) {
          alert("Por favor preencha o nome e o comentário.");
          return;
        }
        const list = JSON.parse(localStorage.getItem("saf_feedback") || "[]");
        list.unshift({ name, email, text, date: new Date().toISOString() });
        localStorage.setItem("saf_feedback", JSON.stringify(list));
        $("#fb-name").value = "";
        $("#fb-email").value = "";
        $("#fb-text").value = "";
        renderFeedback(list);
        alert("Obrigado pelo teu comentário!");
      });

      /* small helper */
      function escapeHtml(unsafe) {
        return String(unsafe)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      /* ===== Init on load ===== */
      window.addEventListener("load", function () {
        attachAddButtons();
        updateCartCount();
        loadFeedback();
        // Make nav links clickable on mobile too
        $$("nav.desktop a").forEach((a) => {
          a.addEventListener("click", (e) => {
            const target = a.getAttribute("data-scroll");
            if (target) {
              e.preventDefault();
              document
                .querySelector(target)
                .scrollIntoView({ behavior: "smooth" });
            }
          });
        });
      });