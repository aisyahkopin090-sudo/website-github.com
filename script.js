
const produk = [
  {
    id: 1,
    nama: "Tas Selempang Wanita",
    kategori: "Tas",
    harga: 85000,
    warna: ["Hitam", "Putih", "Pink", "Cream"],
    gambar: "gambar/tas selempang wanita.jpeg"
  },
  {
    id: 2,
    nama: "Tas Ransel Fashion",
    kategori: "Tas",
    harga: 150000,
    warna: ["Hitam", "Pink", "Coklat", "Cream"],
    gambar: "gambar/tas ransel.jpeg"
  },
  {
    id: 3,
    nama: "Tas Tote Bag",
    kategori: "Tas",
    harga: 75000,
    warna: ["Putih", "Hitam", "Cream", "Coklat"],
    gambar: "gambar/tas tote bag.jpeg"
  },
  {
    id: 4,
    nama: "Sepatu Sneakers Wanita",
    kategori: "Sepatu",
    harga: 180000,
    ukuran: [36, 37, 38, 39, 40],
    gambar: "gambar/sepatu sneakers wanita.jpeg"
  },
  {
    id: 5,
    nama: "Sepatu Heels Elegant",
    kategori: "Sepatu",
    harga: 200000,
    ukuran: [36, 37, 38, 39, 40],
    gambar: "gambar/sepatu heels fashion.jpeg"
  },
  {
    id: 6,
    nama: "Sepatu Flat Shoes",
    kategori: "Sepatu",
    harga: 120000,
    ukuran: [36, 37, 38, 39, 40],
    gambar: "gambar/sepatu flat shoes.jpeg"
  }
];

let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
let ulasan = JSON.parse(localStorage.getItem("ulasan")) || [];

function rupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// TAMPILKAN PRODUK
function tampilkanProduk() {
  const cari = document.getElementById("pencarian").value.toLowerCase();
  const kategori = document.getElementById("kategori").value;

  const hasil = produk.filter(p =>
    p.nama.toLowerCase().includes(cari) &&
    (kategori === "semua" || p.kategori === kategori)
  );

  document.getElementById("daftarProduk").innerHTML =
    hasil.map(p => `
      <div class="produk-card">
        <img src="${p.gambar}" alt="${p.nama}">
        <h3>${p.nama}</h3>
        <p>${p.kategori}</p>
        <h3 class="harga">${rupiah(p.harga)}</h3>

        <label>
          ${p.kategori === "Sepatu" ? "Pilih Ukuran" : "Pilih Warna"}
        </label>

        <select id="varian-${p.id}" class="pilih-varian">
          <option value="">-- Pilih --</option>
          ${(p.kategori === "Sepatu" ? p.ukuran : p.warna)
            .map(v => `<option value="${v}">${v}</option>`)
            .join("")}
        </select>

        <button class="btn" onclick="tambahKeranjang(${p.id})">
          🛒 Tambah ke Keranjang
        </button>
      </div>
    `).join("") || "<p>Produk tidak ditemukan.</p>";
}

// TAMBAH KERANJANG
function tambahKeranjang(id) {
  const p = produk.find(item => item.id === id);
  const varian = document.getElementById("varian-" + id).value;

  if (!varian) {
    alert("Pilih ukuran atau warna terlebih dahulu!");
    return;
  }

  const ada = keranjang.find(item =>
    item.id === id && item.varian === varian
  );

  if (ada) {
    ada.jumlah++;
  } else {
    keranjang.push({...p, varian, jumlah: 1});
  }

  simpanKeranjang();
  alert("Produk berhasil ditambahkan ke keranjang!");
}

function simpanKeranjang() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  document.getElementById("jumlahKeranjang").textContent =
    keranjang.reduce((total, p) => total + p.jumlah, 0);
}

// TAMPILKAN KERANJANG
function bukaKeranjang() {
  document.getElementById("isiKeranjang").innerHTML =
    keranjang.length
      ? keranjang.map((p, index) => `
          <div class="item-keranjang">
            <h4>${p.nama}</h4>
            <p>${p.kategori === "Sepatu" ? "Ukuran" : "Warna"}:
               ${p.varian || "-"}</p>
            <p>${rupiah(p.harga)} x ${p.jumlah}</p>
            <button onclick="hapusKeranjang(${index})">Hapus</button>
          </div>
        `).join("")
      : "<p>Keranjang masih kosong.</p>";

  document.getElementById("totalHarga").textContent = rupiah(totalBelanja());
  document.getElementById("modalKeranjang").style.display = "flex";
}

function tutupKeranjang() {
  document.getElementById("modalKeranjang").style.display = "none";
}

function hapusKeranjang(index) {
  keranjang.splice(index, 1);
  simpanKeranjang();
  bukaKeranjang();
}

function totalBelanja() {
  return keranjang.reduce(
    (total, p) => total + p.harga * p.jumlah, 0
  );
}

// CHECKOUT
function bukaCheckout() {
  if (!keranjang.length) {
    alert("Keranjang masih kosong!");
    return;
  }

  tutupKeranjang();

  document.getElementById("totalCheckout").textContent =
    rupiah(totalBelanja());

  document.getElementById("modalCheckout").style.display = "flex";
}

function tutupCheckout() {
  document.getElementById("modalCheckout").style.display = "none";
}

document.getElementById("formCheckout").addEventListener("submit", function(e) {
  e.preventDefault();

  const nama = document.getElementById("namaPembeli").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  const alamat = document.getElementById("alamat").value.trim();

  const daftar = keranjang.map(p => `
${p.nama}
${p.kategori === "Sepatu" ? "Ukuran" : "Warna"}: ${p.varian || "-"}
Jumlah: ${p.jumlah}
Subtotal: ${rupiah(p.harga * p.jumlah)}
  `).join("\n");

  const pesan = `Halo RAUZA_BAGSHOES, saya ingin memesan:
${daftar}
Total: ${rupiah(totalBelanja())}

Nama: ${nama}
No. WhatsApp: ${telepon}
Alamat: ${alamat}`;

  // Ganti dengan nomor WhatsApp admin toko
  const nomorAdmin = "6282273120311";

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
});

// ULASAN PELANGGAN
function kirimUlasan() {
  const nama = document.getElementById("namaUlasan").value.trim();
  const id = document.getElementById("produkUlasan").value;
  const rating = Number(document.getElementById("rating").value);
  const komentar = document.getElementById("komentar").value.trim();

  if (!nama || !id || !komentar) {
    alert("Harap lengkapi ulasan!");
    return;
  }

  const p = produk.find(item => item.id === Number(id));

  ulasan.push({
    nama,
    produk: p.nama,
    rating,
    komentar
  });

  localStorage.setItem("ulasan", JSON.stringify(ulasan));
  tampilkanUlasan();

  document.getElementById("namaUlasan").value = "";
  document.getElementById("produkUlasan").value = "";
  document.getElementById("komentar").value = "";
}

function tampilkanUlasan() {
  const daftar = document.getElementById("daftarUlasan");
  daftar.replaceChildren();

  ulasan.forEach(u => {
    const card = document.createElement("div");
    card.className = "ulasan-card";

    const judul = document.createElement("h4");
    judul.textContent = u.nama + " - " + u.produk;

    const bintang = document.createElement("p");
    bintang.textContent = "⭐".repeat(u.rating);

    const komentar = document.createElement("p");
    komentar.textContent = u.komentar;

    card.append(judul, bintang, komentar);
    daftar.appendChild(card);
  });
}

// JALANKAN WEBSITE
document.getElementById("produkUlasan").innerHTML +=
  produk.map(p => `<option value="${p.id}">${p.nama}</option>`).join("");

tampilkanProduk();
tampilkanUlasan();
simpanKeranjang();
