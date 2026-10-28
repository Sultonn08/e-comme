(() => {
  const toolbar = document.getElementById("inline-admin-toolbar");
  const message = document.getElementById("inline-admin-message");
  const productDialog = document.getElementById("inline-product-editor");
  const productForm = document.getElementById("inline-product-form");
  const productMessage = document.getElementById("inline-product-message");
  const productTitle = document.getElementById("inline-product-title");
  const savedContent = {};
  const products = new Map();
  let csrfToken = "";
  let isAdmin = false;
  let homeRendered = false;
  let hasChanges = false;
  let imageSlots = null;

  async function readResponse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Permintaan gagal (${response.status}).`);
    return data;
  }

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
  }

  function setDirty(dirty) {
    hasChanges = dirty;
    document.getElementById("inline-save").disabled = !dirty;
    if (dirty) setMessage("Ada perubahan teks yang belum disimpan.");
  }

  function enableInlineTextEditing() {
    if (!isAdmin || !homeRendered) return;
    toolbar.hidden = false;
    document.querySelectorAll("[data-content]").forEach(element => {
      if (toolbar.contains(element)) return;
      const key = element.dataset.content;
      if (!Object.hasOwn(savedContent, key)) return;
      element.contentEditable = "true";
      element.classList.add("inline-editable");
      element.setAttribute("aria-label", `${element.textContent.trim()} — klik untuk mengedit teks`);
      element.addEventListener("input", () => {
        document.querySelectorAll("[data-content]").forEach(duplicate => {
          if (duplicate !== element && duplicate.dataset.content === key) duplicate.textContent = element.textContent;
        });
        setDirty(true);
      });
    });
    markProductCards();
  }

  function markProductCards() {
    if (!isAdmin) return;
    document.querySelectorAll("#terbaru [data-product-id]").forEach(card => {
      const productId = Number(card.dataset.productId);
      if (!products.has(productId) || card.querySelector("[data-inline-product-edit]")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "inline-product-edit";
      button.dataset.inlineProductEdit = String(productId);
      button.textContent = "Edit produk";
      button.setAttribute("aria-label", `Edit ${products.get(productId).nama}`);
      card.append(button);
    });
  }

  function restoreText() {
    document.querySelectorAll("[data-content]").forEach(element => {
      const key = element.dataset.content;
      if (Object.hasOwn(savedContent, key)) element.textContent = savedContent[key];
    });
    document.querySelectorAll(".inline-editable").forEach(element => {
      element.contentEditable = "false";
      element.classList.remove("inline-editable");
      element.removeAttribute("aria-label");
    });
    setDirty(false);
    setMessage("Perubahan teks dibatalkan.");
  }

  async function saveText() {
    const changes = {};
    document.querySelectorAll(".inline-editable[data-content]").forEach(element => {
      const key = element.dataset.content;
      const value = element.innerText.trim();
      if (value !== savedContent[key]) changes[key] = value;
    });
    if (!Object.keys(changes).length) {
      setDirty(false);
      return;
    }

    const response = await fetch("api/content.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify({ content: changes })
    });
    const data = await readResponse(response);
    Object.assign(savedContent, data.content);
    setDirty(false);
    setMessage("Teks berhasil disimpan.");
    window.location.reload();
  }

  function openProductEditor(product = null) {
    productForm.reset();
    productForm.elements.id.value = product?.id ?? "";
    productForm.elements.nama.value = product?.nama ?? "";
    productForm.elements.tipe.value = product?.tipe ?? "";
    productForm.elements.kat.value = product?.kat ?? "Atasan";
    productForm.elements.harga.value = product?.harga ?? "";
    productForm.elements.harga_normal.value = product?.normal ?? "";
    productForm.elements.warna.value = product?.warna ?? "#1C1C1E";
    productForm.elements.deskripsi.value = product?.deskripsi ?? "";
    productForm.elements.gambar.value = JSON.stringify(product?.gambar ?? []);
    productForm.elements.baru.checked = Boolean(product?.baru);
    imageSlots = window.initializeProductImageSlots(document.getElementById("inline-image-slots"), {
      form: productForm,
      pathPrefix: "",
      getProductId: () => Number(productForm.elements.id.value) || 0,
      getCsrfToken: () => csrfToken,
      setMessage: (text, isError = false) => {
        productMessage.textContent = text;
        productMessage.classList.toggle("is-error", isError);
      }
    });
    productTitle.textContent = product ? "Edit produk" : "Tambah produk";
    productMessage.textContent = "";
    productMessage.classList.remove("is-error");
    productDialog.showModal();
  }

  async function saveProduct(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(productForm));
    const id = values.id;
    delete values.id;
    values.baru = productForm.elements.baru.checked;
    values.gambar = JSON.parse(values.gambar || "[]");
    productMessage.textContent = "";
    productMessage.classList.remove("is-error");

    try {
      const response = await fetch(`api/products.php${id ? `?id=${encodeURIComponent(id)}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify(values)
      });
      const data = await readResponse(response);
      if (!id) {
        productForm.elements.id.value = data.id;
        productTitle.textContent = "Edit produk";
        imageSlots.render();
        const newProduct = {
          id: Number(data.id),
          nama: values.nama,
          tipe: values.tipe,
          kat: values.kat,
          harga: Number(values.harga),
          normal: Number(values.harga_normal),
          warna: values.warna,
          deskripsi: values.deskripsi,
          gambar: values.gambar,
          baru: values.baru
        };
        products.set(newProduct.id, newProduct);
        productMessage.textContent = "Produk disimpan. Unggah foto tiap tampilan, lalu simpan perubahan.";
        return;
      }
      productMessage.textContent = id ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.";
      window.location.reload();
    } catch (error) {
      productMessage.textContent = error.message;
      productMessage.classList.add("is-error");
    }
  }

  async function initialize() {
    try {
      const csrfResponse = await fetch("api/auth.php?action=csrf", { headers: { Accept: "application/json" } });
      const auth = await readResponse(csrfResponse);
      if (auth.user?.role !== "admin") return;
      csrfToken = auth.csrfToken;

      const contentResponse = await fetch("api/content.php?admin=1", { headers: { Accept: "application/json" } });
      const contentData = await readResponse(contentResponse);
      for (const field of contentData.fields) savedContent[field.key] = field.value;
      isAdmin = true;
      enableInlineTextEditing();
    } catch (error) {
      console.error("Mode edit beranda gagal dimuat.", error);
    }
  }

  document.addEventListener("store:home-rendered", () => {
    homeRendered = true;
    enableInlineTextEditing();
  });
  document.addEventListener("store:products-rendered", event => {
    products.clear();
    event.detail.products.forEach(product => products.set(Number(product.id), product));
    markProductCards();
  });
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-inline-product-edit]");
    if (button) openProductEditor(products.get(Number(button.dataset.inlineProductEdit)));
  });
  document.getElementById("inline-save").addEventListener("click", async () => {
    try {
      await saveText();
    } catch (error) {
      setMessage(error.message, true);
    }
  });
  document.getElementById("inline-cancel").addEventListener("click", restoreText);
  document.getElementById("inline-add-product").addEventListener("click", () => openProductEditor());
  document.getElementById("inline-product-close").addEventListener("click", () => productDialog.close());
  document.getElementById("inline-product-cancel").addEventListener("click", () => productDialog.close());
  productForm.addEventListener("submit", saveProduct);
  initialize();
})();
