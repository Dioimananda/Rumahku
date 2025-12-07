// Optimized script.js - all-in-one (localStorage based)
// Features: register/login, role-based UI, upgrade request & admin approval, CRUD localProperties, chat with unread counter, toggles

// script.js — versi perbaikan & robust
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ script.js loaded');

  // --- NAVIGATION (single page sections) ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  function hideAllSections() {
    sections.forEach(s => s.classList.add('hidden'));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.page;
      if (!target) return;

      hideAllSections();
      const sec = document.getElementById(target);
      if (sec) sec.classList.remove('hidden');

      // styling active
      navLinks.forEach(l => l.classList.remove('text-blue-600', 'font-bold'));
      link.classList.add('text-blue-600', 'font-bold');

      // if navigating away from login page, keep app hidden until login
      // Hanya sembunyikan app kalau user belum login
if (target !== 'login' && !localStorage.getItem('user')) {
  document.getElementById('app')?.classList.add('hidden');
}

    });
  });

  // show home by default
  hideAllSections();
  const homeSec = document.getElementById('home');
  if (homeSec) homeSec.classList.remove('hidden');

  // --- ELEMENTS (may be null if not present on page) ---
  const app = document.getElementById('app');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleForm = document.getElementById('toggle-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const loginLink = document.getElementById('login-link'); // nav login/register
  const upgradeBtn = document.getElementById('upgrade-btn');
  const requestToggle = document.getElementById('request-toggle');
  const requestSection = document.getElementById('request-section');
  const requestList = document.getElementById('request-list');

  const filterToggle = document.getElementById('filter-toggle');
  const addToggle = document.getElementById('add-toggle');
  const filterSection = document.getElementById('filter-section');
  const addSection = document.getElementById('add-section');

  const upgradeVerifyToggle = document.getElementById("upgradeVerify-toggle");
const verifySection = document.getElementById("verify-section");

const verifyToggle = document.getElementById("verify-toggle");
    if (verifyToggle) {
        verifyToggle.addEventListener("click", () => {
            verifySection.classList.toggle("hidden");
        });
    }

  const searchInput = document.getElementById('search');
  const locationInput = document.getElementById('location');
  const typeSelect = document.getElementById('type');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const filterBtn = document.getElementById('filter-btn');
  const propertyList = document.getElementById('property-list');

  const chatToggle = document.getElementById('chat-toggle');
  const chatNotif = document.getElementById('chat-notif');
  const chatSection = document.getElementById('chat-section');
  const chatBox = document.getElementById('chat-box');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  if (upgradeVerifyToggle) {
    upgradeVerifyToggle.addEventListener("click", () => {
        const isVisible = !verifySection.classList.contains("hidden");
        hideAllPanels();
        if (!isVisible) verifySection.classList.remove("hidden");
    });
}



  // state
  let currentUser = null;
  let activePanel = null;
  let properties = [];

  // --- storage utilities ---
  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem('users')) || [
        { username: 'Dio', password: '123', role: 'admin' },
        { username: 'budi', password: '456', role: 'customer' },
        { username: 'sari', password: '789', role: 'penjual' }
      ];
    } catch (e) {
      return [
        { username: 'Dio', password: '123', role: 'admin' },
        { username: 'budi', password: '456', role: 'customer' },
        { username: 'sari', password: '789', role: 'penjual' }
      ];
    }
  }
  function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }
  function loadUpgradeRequests(){ return JSON.parse(localStorage.getItem('upgradeRequests')) || []; }
  function saveUpgradeRequests(r){ localStorage.setItem('upgradeRequests', JSON.stringify(r)); }
  function loadMessages(){ return JSON.parse(localStorage.getItem('messages')) || []; }
  function saveMessages(m){ localStorage.setItem('messages', JSON.stringify(m)); }
  function loadLocalProperties(){ return JSON.parse(localStorage.getItem('localProperties')) || []; }
  function saveLocalProperties(l){ localStorage.setItem('localProperties', JSON.stringify(l)); }

  // helper: safe element toggles
  function hideAllPanels() {
  hide(filterSection);
  hide(addSection);
  hide(chatSection);
  hide(requestSection);
  activePanel = null;
}

  function show(el){ if(!el) return; el.classList.remove('hidden'); }
  function hide(el){ if(!el) return; el.classList.add('hidden'); }

  // --- AUTH UI: toggle register/login ---
  if (toggleForm) {
    toggleForm.addEventListener('click', () => {
      if (!loginForm || !registerForm) return;
      const isLoginVisible = !loginForm.classList.contains('hidden');
      loginForm.classList.toggle('hidden', isLoginVisible);
      registerForm.classList.toggle('hidden', !isLoginVisible);

      const title = document.getElementById('form-title');
      if (title) title.textContent = isLoginVisible ? 'Daftar' : 'Masuk';
      toggleForm.textContent = isLoginVisible ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar';
    });
  }

  // register handler
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username')?.value?.trim();
      const password = document.getElementById('reg-password')?.value?.trim();
      if (!username || !password) { alert('Isi username & password'); return; }
      const users = loadUsers();
      if (users.some(u => u.username === username)) { alert('Username sudah terpakai'); return; }
      users.push({ username, password, role: 'customer' });
      saveUsers(users);
      alert('Registrasi berhasil. Silakan login.');
      registerForm.reset();
      registerForm.classList.add('hidden');
      loginForm?.classList.remove('hidden');
    });
  }

  // login handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username')?.value?.trim();
      const password = document.getElementById('password')?.value?.trim();
      const users = loadUsers();
      const found = users.find(u => u.username === username && u.password === password);
      if (!found) { alert('Login gagal. Cek username/password'); return; }
      localStorage.setItem('user', JSON.stringify(found));
      showApp(found);
    });
  }

  // logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const userMenu = document.getElementById("user-menu");
if (userMenu) userMenu.classList.add("hidden");
      localStorage.removeItem('user');
      currentUser = null;
      hideAllPanels();
      if (app) app.classList.add('hidden');

      // reset nav: show login link and hide user info
      if (loginLink) { loginLink.classList.remove('hidden'); loginLink.textContent = 'Login / Register'; }
      if (userInfo) userInfo.textContent = '';
      // go back to homepage
      hideAllSections();
      const h = document.getElementById('home'); if (h) h.classList.remove('hidden');
    });
  }

  // --- showApp: display dashboard & adjust UI by role ---
function showApp(user) {
  if (!user) return;
  currentUser = user;

  // hide page sections
  hideAllSections();

  // show app
  if (app) app.classList.remove('hidden');
  hideAllPanels();

  // hide login link
  if (loginLink) loginLink.classList.add("hidden");

  // show user menu
  const userMenu = document.getElementById("user-menu");
  const userLabel = document.getElementById("user-label");

  if (userMenu && userLabel) {
    userLabel.textContent = `${user.username} (${user.role})`;
    userMenu.classList.remove("hidden");
  }

  // clear old user info placement
  if (userInfo) userInfo.textContent = '';

  // role controls
  if (user.role === 'customer') {
    hide(addToggle); 
    hide(addSection);
    show(upgradeVerifyToggle);
    hide(requestToggle);
    hide(requestSection);

  } else if (user.role === 'penjual') {
    show(addToggle);
    hide(upgradeVerifyToggle);
    hide(requestToggle);
    hide(requestSection);

  } else if (user.role === 'admin') {
    show(addToggle);
    hide(upgradeVerifyToggle);
    show(requestToggle);
    show(requestSection);
  }

  // --- Atur menu verifikasi akun (hanya customer) ---
const verifyToggle = document.getElementById("verify-toggle");
const verifySection = document.getElementById("verify-section");

// Customer boleh lihat
if (user.role === "customer") {
    if (verifyToggle) verifyToggle.classList.remove("hidden");
}

// Admin & Penjual tidak boleh lihat
else {
    if (verifyToggle) verifyToggle.classList.add("hidden");
    if (verifySection) verifySection.classList.add("hidden");
}

  // enable toggles
  if (filterToggle) filterToggle.disabled = false;
  if (addToggle) addToggle.disabled = false;
  if (chatToggle) chatToggle.disabled = false;

  loadProperties();
  updateUnreadCount();
}


  // --- PROPERTIES (load/render) ---
  async function loadProperties() {
    try {
      const res = await fetch('properties.json');
      const data = await res.json();
      properties = [...(data || []), ...loadLocalProperties()];
    } catch (e) {
      properties = loadLocalProperties();
    }
    renderProperties(properties);
  }

  function renderProperties(list) {
    if (!propertyList) return;
    propertyList.innerHTML = '';
    if (!list || list.length === 0) {
      propertyList.innerHTML = '<p class="text-gray-500">Tidak ada properti ditemukan.</p>';
      return;
    }

const requestList = document.getElementById("request-list");

function renderVerifyRequests() {
  requestList.innerHTML = "";

  verifyRequests.forEach((req, i) => {
    const div = document.createElement("div");
    div.className = "border p-3 rounded shadow bg-gray-50";

    div.innerHTML = `
      <p><b>Nama:</b> ${req.fullname}</p>
      <img src="${req.fileData}" class="w-32 rounded my-2 border" />
      <p><b>Status:</b> ${req.status}</p>
      <div class="flex gap-2 mt-2">
        <button class="approve bg-green-600 text-white px-3 py-1 rounded">Setujui</button>
        <button class="reject bg-red-600 text-white px-3 py-1 rounded">Tolak</button>
      </div>
    `;

   div.querySelector(".approve").onclick = () => {
  approveVerification(req.username);
};


    div.querySelector(".reject").onclick = () => {
      verifyRequests[i].status = "rejected";
      localStorage.setItem("verifyRequests", JSON.stringify(verifyRequests));
      renderVerifyRequests();
    };

    requestList.appendChild(div);
  });
}

document.getElementById("request-toggle").addEventListener("click", () => {
  renderVerifyRequests();
});


    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" class="w-full h-40 object-cover rounded-xl mb-3" />
        <h3 class="text-lg font-semibold">${p.title}</h3>
        <p class="text-sm text-gray-600">${p.location}</p>
        <p class="text-blue-600 font-bold mt-1">Rp ${Number(p.price).toLocaleString()}</p>
        <p class="text-sm text-gray-500 mb-3">${p.type}</p>
        <div class="flex gap-2">${userActionButtons(p)}</div>
      `;
      // attach handlers safely
      const editBtn = card.querySelector('.edit-btn');
      const deleteBtn = card.querySelector('.delete-btn');
      if (editBtn) editBtn.addEventListener('click', () => alert('Edit (implementasi ada di versi berikutnya)'));
      if (deleteBtn) deleteBtn.addEventListener('click', () => {
        if (!currentUser) return alert('Harap login'); 
        if (confirm('Yakin ingin menghapus?')) deleteProperty(p.id);
      });

      propertyList.appendChild(card);
    });
  }

  
  function userActionButtons(p) {
    if (!currentUser || currentUser.role === 'customer') return '';
    return `<button class="edit-btn bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
            <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Hapus</button>`;
  }

  function deleteProperty(id) {
    let saved = loadLocalProperties();
    saved = saved.filter(x => x.id !== id);
    saveLocalProperties(saved);
    properties = properties.filter(x => x.id !== id);
    renderProperties(properties);
  }

  // add property (form)
  const addPropertyForm = document.getElementById('add-property-form');
  if (addPropertyForm) {
    addPropertyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentUser || currentUser.role === 'customer') { alert('Hanya penjual yang dapat menambah properti'); return; }
      const title = document.getElementById('newTitle')?.value || '';
      const location = document.getElementById('newLocation')?.value || '';
      const price = Number(document.getElementById('newPrice')?.value || 0);
      const type = document.getElementById('newType')?.value || '';
      const image = document.getElementById('newImage')?.value || '';
      const newProp = { id: Date.now(), title, location, price, type, image };
      const saved = loadLocalProperties();
      saved.push(newProp);
      saveLocalProperties(saved);
      properties.push(newProp);
      renderProperties(properties);
      addPropertyForm.reset();
      alert('Properti berhasil ditambahkan!');
    });
  }

  // --- FILTER ---
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const search = (searchInput?.value || '').toLowerCase();
      const loc = (locationInput?.value || '').toLowerCase();
      const type = typeSelect?.value || '';
      const min = Number(minPriceInput?.value || 0);
      const max = Number(maxPriceInput?.value || Infinity);
      const filtered = properties.filter(p => p.title.toLowerCase().includes(search)
        && (!loc || p.location.toLowerCase().includes(loc))
        && (!type || p.type === type)
        && p.price >= min && p.price <= max);
      renderProperties(filtered);
    });
  }

  // --- TOGGLES (filter/add/chat/request) ---
  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      const isVisible = !filterSection.classList.contains('hidden');
      hideAllPanels();
      if (!isVisible) { filterSection.classList.remove('hidden'); activePanel = 'filter'; }
    });
  }
  if (addToggle) {
    addToggle.addEventListener('click', () => {
      const isVisible = !addSection.classList.contains('hidden');
      hideAllPanels();
      if (!isVisible) { addSection.classList.remove('hidden'); activePanel = 'add'; }
    });
  }
  if (requestToggle) {
    requestToggle.addEventListener('click', () => {
      const isVisible = !requestSection.classList.contains('hidden');
      hideAllPanels();
      if (!isVisible) { requestSection.classList.remove('hidden'); activePanel = 'request'; renderUpgradeRequests(); }
    });
  }
  if (chatToggle) {
    chatToggle.addEventListener('click', () => {
      const isVisible = !chatSection.classList.contains('hidden');
      hideAllPanels();
      if (!isVisible) { chatSection.classList.remove('hidden'); activePanel = 'chat'; renderMessages(); }
    });
  }

  // --- UPGRADE REQUESTS (customer -> admin) ---
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      if (!currentUser) return alert('Silakan login terlebih dahulu');
      if (currentUser.role === 'penjual') return alert('Akun sudah penjual');
      const reqs = loadUpgradeRequests();
      if (reqs.some(r => r.username === currentUser.username)) return alert('Anda sudah mengirim permintaan. Tunggu admin.');
      reqs.push({ username: currentUser.username, time: new Date().toLocaleString(), status: 'pending' });
      saveUpgradeRequests(reqs);
      alert('Permintaan upgrade dikirim. Admin akan meninjau.');
      renderUpgradeRequests();
    });
  }

  function renderUpgradeRequests() {
    if (!requestList) return;
    const reqs = loadUpgradeRequests();
    requestList.innerHTML = '';
    if (!reqs.length) { requestList.innerHTML = '<p class="text-gray-500">Tidak ada permintaan.</p>'; return; }
    reqs.forEach(r => {
      const div = document.createElement('div');
      div.className = 'border p-3 rounded flex justify-between items-center';
      div.innerHTML = `
        <div>
          <p><strong>${r.username}</strong></p>
          <p class="text-sm text-gray-600">${r.time}</p>
          <p class="text-sm ${r.status==='pending' ? 'text-yellow-500' : 'text-green-500'}">Status: ${r.status}</p>
        </div>
        ${r.status==='pending' ? '<div class="flex gap-2"><button class="approve bg-green-500 text-white px-3 py-1 rounded">Setujui</button><button class="reject bg-red-500 text-white px-3 py-1 rounded">Tolak</button></div>' : ''}
      `;
      const approve = div.querySelector('.approve');
      const reject = div.querySelector('.reject');
      if (approve) approve.addEventListener('click', () => approveUpgrade(r.username));
      if (reject) reject.addEventListener('click', () => rejectUpgrade(r.username));
      requestList.appendChild(div);
    });
  }

  function approveUpgrade(username) {
        const users = loadUsers().map(u =>
            u.username === username ? { ...u, role: "penjual" } : u
        );
        saveUsers(users);

        const reqs = loadUpgradeRequests().filter(r => r.username !== username);
        saveUpgradeRequests(reqs);

        alert(username + " disetujui menjadi penjual");
        renderUpgradeRequests();
    }

  function rejectUpgrade(username) {
        const reqs = loadUpgradeRequests().filter(r => r.username !== username);
        saveUpgradeRequests(reqs);
        alert(username + " ditolak");
        renderUpgradeRequests();
    }

  // --- CHAT (basic messages + unread) ---
  function updateUnreadCount() {
    if (!currentUser || !chatNotif) return;
    const msgs = loadMessages();
    let count = 0;
    if (currentUser.role === 'penjual') count = msgs.filter(m => !m.readByAdmin).length;
    else count = msgs.filter(m => m.receiver === currentUser.username && !m.readByCustomer).length;
    if (count > 0) { chatNotif.textContent = count; chatNotif.classList.remove('hidden'); } else { chatNotif.classList.add('hidden'); }
  }

  function renderMessages() {
    if (!currentUser || !chatBox) return;
    const msgs = loadMessages();
    chatBox.innerHTML = '';
    msgs.forEach(m => {
      if (currentUser.role === 'penjual' || m.sender === currentUser.username || m.receiver === currentUser.username) {
        const div = document.createElement('div');
        div.className = `mb-2 p-2 rounded ${m.sender === currentUser.username ? 'bg-green-100 text-right' : 'bg-gray-200 text-left'}`;
        div.innerHTML = `<strong>${m.sender}:</strong> ${m.text}`;
        chatBox.appendChild(div);
      }
    });
    chatBox.scrollTop = chatBox.scrollHeight;
    // mark read
    const updated = msgs.map(m => {
      if (currentUser.role === 'penjual' && !m.readByAdmin) m.readByAdmin = true;
      if (currentUser.role === 'customer' && m.receiver === currentUser.username && !m.readByCustomer) m.readByCustomer = true;
      return m;
    });
    saveMessages(updated);
    updateUnreadCount();
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentUser) return alert('Silakan login untuk mengirim pesan');
      const text = chatInput?.value?.trim();
      if (!text) return;
      const msgs = loadMessages();
      const newMsg = {
        id: Date.now(),
        sender: currentUser.username,
        receiver: currentUser.role === 'penjual' ? 'customer' : 'penjual',
        text, time: new Date().toLocaleString(),
        readByAdmin: currentUser.role === 'penjual',
        readByCustomer: currentUser.role === 'customer'
      };
      msgs.push(newMsg); saveMessages(msgs);
      if (chatInput) chatInput.value = '';
      renderMessages(); updateUnreadCount();
    });
  }

  setInterval(() => updateUnreadCount(), 2000);

  // --- Auto-login if user saved ---
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser) {
    // find up-to-date user object in store (in case role updated)
    const fresh = loadUsers().find(u => u.username === savedUser.username) || savedUser;
    showApp(fresh);

const logoutBtn = document.getElementById('logoutBtn');

// --- USER MENU HOVER EFFECT ---
const userMenu = document.getElementById("user-menu");
const userLabel = document.getElementById("user-label");
const logoutHover = document.getElementById("logout-hover");

if (userMenu) {
    userMenu.addEventListener("mouseenter", () => {
        userLabel.classList.add("opacity-0");
        logoutHover.classList.remove("opacity-0");
    });

    userMenu.addEventListener("mouseleave", () => {
        userLabel.classList.remove("opacity-0");
        logoutHover.classList.add("opacity-0");
    });

    userMenu.addEventListener("click", () => {
        localStorage.removeItem("user");
        location.reload();
    });
}


  }
}); // end DOMContentLoaded

