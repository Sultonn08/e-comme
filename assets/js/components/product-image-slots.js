window.initializeProductImageSlots = function initializeProductImageSlots(container, options) {
  const slotNames = ["Tampilan depan", "Tampilan belakang", "Detail bahan", "Detail produk"];
  const field = options.form.elements.gambar;
  const pathPrefix = options.pathPrefix || "";

  function readImages() {
    const value = JSON.parse(field.value || "[]");
    if (!Array.isArray(value)) throw new Error("Daftar gambar produk tidak valid.");
    return value;
  }

  function render() {
    const images = readImages();
    container.innerHTML = slotNames.map((name, slot) => {
      const image = typeof images[slot] === "string" ? images[slot] : "";
      const preview = image
        ? `<img src="${pathPrefix}${image.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]))}" alt="">`
        : `<span>Belum ada foto</span>`;
      return `<div class="product-image-slot" data-image-slot="${slot}">
        <div class="product-image-preview">${preview}</div>
        <div class="product-image-slot-info"><strong>${name}</strong><small>${image ? "Foto sudah dipasang" : "Pilih foto untuk tampilan ini"}</small></div>
        <label class="product-image-select">Pilih foto<input type="file" accept="image/jpeg,image/png,image/webp" data-image-file="${slot}"></label>
        <button class="product-image-upload" type="button" data-image-upload="${slot}" disabled>Unggah</button>
      </div>`;
    }).join("");

    container.querySelectorAll("[data-image-file]").forEach(input => {
      input.addEventListener("change", () => {
        const button = container.querySelector(`[data-image-upload="${input.dataset.imageFile}"]`);
        const productId = options.getProductId();
        button.disabled = !input.files.length || !productId;
        if (input.files.length && !productId) {
          options.setMessage("Simpan produk terlebih dahulu, lalu pilih foto untuk diunggah.");
        }
      });
    });
    container.querySelectorAll("[data-image-upload]").forEach(button => {
      button.addEventListener("click", () => upload(Number(button.dataset.imageUpload), button));
    });
  }

  async function upload(slot, button) {
    const input = container.querySelector(`[data-image-file="${slot}"]`);
    const image = input.files[0];
    const productId = options.getProductId();
    if (!productId) {
      options.setMessage("Simpan produk terlebih dahulu sebelum mengunggah foto.", true);
      return;
    }
    if (!image) {
      options.setMessage("Pilih foto untuk tampilan ini.", true);
      return;
    }

    const body = new FormData();
    body.append("product_id", String(productId));
    body.append("slot", String(slot));
    body.append("image", image);
    button.disabled = true;
    button.textContent = "Mengunggah…";
    try {
      const response = await fetch(`${options.pathPrefix}api/product-images.php`, {
        method: "POST",
        headers: { "X-CSRF-Token": options.getCsrfToken() },
        body
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Unggah gagal (${response.status}).`);
      field.value = JSON.stringify(data.images);
      input.value = "";
      render();
      options.setMessage(`${slotNames[slot]} berhasil diunggah.`);
    } catch (error) {
      button.disabled = false;
      button.textContent = "Unggah";
      options.setMessage(error.message, true);
    }
  }

  render();
  return { render };
};
