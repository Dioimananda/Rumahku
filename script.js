// Optimized script.js - all-in-one (localStorage based)
// Features: register/login, role-based UI, upgrade request & admin approval, CRUD localProperties, chat with unread counter, toggles

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ App script loaded');

  // ====== NAVIGATION HANDLER ======
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  // fungsi untuk menyembunyikan semua section
  function hideAllSections() {
    sections.forEach(sec => sec.classList.add('hidden'));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const target = link.getAttribute('data-page');
      hideAllSections();

      // tampilkan section target
      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      } else {
        console.warn('⚠️ Section tidak ditemukan:', target);
      }

      // ubah warna link aktif
      navLinks.forEach(l => l.classList.remove('text-blue-600', 'font-bold'));
      link.classList.add('text-blue-600', 'font-bold');

      // khusus jika bukan halaman login, sembunyikan form login (app tetap hidden)
      const app = document.getElementById('app');
      if (target !== 'login') {
        app.classList.add('hidden');
      }
    });
  });

  // tampilkan Home secara default
  hideAllSections();
  document.getElementById('home').classList.remove('hidden');


// Tampilkan halaman target
if (target === 'login') {
  document.getElementById('login-screen').classList.remove('hidden');
} else {
  document.getElementById(target).classList.remove('hidden');
}


    // highlight link aktif
    navLinks.forEach(l => l.classList.remove('text-blue-600', 'font-bold'));
    link.classList.add('text-blue-600', 'font-bold');
  });
});

// tampilkan Home secara default
document.getElementById('home').classList.remove('hidden');



  // Elements
  const loginScreen = document.getElementById('login-screen');
  const app = document.getElementById('app');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleForm = document.getElementById('toggle-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const upgradeBtn = document.getElementById('upgrade-btn');
  const requestToggle = document.getElementById('request-toggle');
  const requestSection = document.getElementById('request-section');
  const requestList = document.getElementById('request-list');

  const filterSection = document.getElementById('filter-section');
  const addSection = document.getElementById('add-section');
  const filterToggle = document.getElementById('filter-toggle');
  const addToggle = document.getElementById('add-toggle');

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

  // State
  let currentUser = null;
  let activePanel = null;
  let properties = [];

// Utilities: users storage
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem('users')) || [
      { username: 'Dio', password: '123', role: 'admin' },
      { username: 'budi', password: '456', role: 'customer' },
      { username: 'sari', password: '789', role: 'penjual' } // contoh akun seller
    ];
  } catch (e) {
    return [
      { username: 'admin', password: '123', role: 'admin' },
      { username: 'budi', password: '456', role: 'customer' },
      { username: 'sari', password: '789', role: 'penjual' }
    ];
  }
}

  function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }

  // Utilities: upgrade requests storage
  function loadUpgradeRequests() { return JSON.parse(localStorage.getItem('upgradeRequests')) || []; }
  function saveUpgradeRequests(reqs) { localStorage.setItem('upgradeRequests', JSON.stringify(reqs)); }

  // Utilities: messages
  function loadMessages(){ return JSON.parse(localStorage.getItem('messages')) || []; }
  function saveMessages(msgs){ localStorage.setItem('messages', JSON.stringify(msgs)); }

  // Utilities: local properties
  function loadLocalProperties(){ return JSON.parse(localStorage.getItem('localProperties')) || []; }
  function saveLocalProperties(list){ localStorage.setItem('localProperties', JSON.stringify(list)); }

  // Toggle helper
  function hideAllPanels(){ if(filterSection) filterSection.classList.add('hidden'); if(addSection) addSection.classList.add('hidden'); if(chatSection) chatSection.classList.add('hidden'); if(requestSection) requestSection.classList.add('hidden'); activePanel = null; }

  // --------- AUTH: register / login / logout / toggle forms ----------
  toggleForm.addEventListener('click', () => {
  const isLoginVisible = !loginForm.classList.contains('hidden');
  const title = document.getElementById('form-title');

  // Ganti tampilan form
  loginForm.classList.toggle('hidden', isLoginVisible);
  registerForm.classList.toggle('hidden', !isLoginVisible);

  // Ganti teks tombol toggle dan judul form
  if (isLoginVisible) {
    toggleForm.textContent = 'Sudah punya akun? Login';
    title.textContent = 'Daftar';
  } else {
    toggleForm.textContent = 'Belum punya akun? Daftar';
    title.textContent = 'Masuk';
  }
});


  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    if(!username || !password){ alert('Isi username & password'); return; }
    const users = loadUsers();
    if(users.some(u => u.username === username)){ alert('Username sudah terpakai'); return; }
    users.push({ username, password, role: 'customer' });
    saveUsers(users);
    alert('Registrasi berhasil. Silakan login.');
    registerForm.reset();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const users = loadUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if(!found){ alert('Login gagal. Cek username/password'); return; }
    localStorage.setItem('user', JSON.stringify(found));
    showApp(found);
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    currentUser = null;
    hideAllPanels();
    app.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  });

  // --------- UI: showApp (role based) ----------
function showApp(user){
  currentUser = user;
  loginScreen.classList.add('hidden');
  app.classList.remove('hidden');

  // Teks sapaan beda untuk tiap role
  if (user.role === 'customer') {
    userInfo.textContent = `${user.username}`;
  } else if (user.role === 'penjual') {
    userInfo.textContent = `${user.username} (Penjual)`;
  } else if (user.role === 'admin') {
    userInfo.textContent = `${user.username} (Admin)`;
  }

  // Kontrol tampilan berdasarkan role
  if (user.role === 'customer') {
    // customer hanya bisa lihat properti & kirim pesan
    addToggle.classList.add('hidden');
    addSection.classList.add('hidden');
    upgradeBtn.classList.remove('hidden');
    requestToggle.classList.add('hidden');
    requestSection.classList.add('hidden');
  } 
  else if (user.role === 'penjual') {
    // penjual bisa tambah properti, chat, tapi tidak bisa approve
    addToggle.classList.remove('hidden');
    upgradeBtn.classList.add('hidden');
    requestToggle.classList.add('hidden');
    requestSection.classList.add('hidden');
  } 
  else if (user.role === 'admin') {
    // admin bisa semuanya + verifikasi upgrade
    addToggle.classList.remove('hidden');
    upgradeBtn.classList.add('hidden');
    requestToggle.classList.remove('hidden');
    requestSection.classList.remove('hidden');
  }

  // Load properti & pesan
  loadProperties();
  updateUnreadCount();
}


  // --------- PROPERTIES: load/render/add/update/delete ---------
  async function loadProperties(){
    try{
      const res = await fetch('properties.json');
      const data = await res.json();
      const localData = loadLocalProperties();
      properties = [...data, ...localData];
      renderProperties(properties);
    }catch(err){
      properties = loadLocalProperties();
      renderProperties(properties);
    }
  }

  function renderProperties(list){
    propertyList.innerHTML = '';
    if(!list.length){ propertyList.innerHTML = '<p class="text-gray-500">Tidak ada properti ditemukan.</p>'; return; }
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
        <form class="edit-form hidden mt-3 grid grid-cols-1 gap-2">
          <input type="text" name="title" value="${p.title}" class="border p-2 rounded" required>
          <input type="text" name="location" value="${p.location}" class="border p-2 rounded" required>
          <input type="number" name="price" value="${p.price}" class="border p-2 rounded" required>
          <input type="text" name="type" value="${p.type}" class="border p-2 rounded" required>
          <input type="text" name="image" value="${p.image}" class="border p-2 rounded" required>
          <button type="submit" class="bg-green-500 text-white py-1 rounded hover:bg-green-600">Simpan</button>
        </form>
      `;
      // attach handlers
      const editBtn = card.querySelector('.edit-btn');
      const deleteBtn = card.querySelector('.delete-btn');
      const editForm = card.querySelector('.edit-form');

      if(editBtn) editBtn.addEventListener('click', ()=> editForm.classList.toggle('hidden'));
      if(deleteBtn) deleteBtn.addEventListener('click', ()=> { if(confirm('Yakin ingin menghapus?')) deleteProperty(p.id); });

      if(editForm){
        editForm.addEventListener('submit', e=>{
          e.preventDefault();
          const fd = new FormData(editForm);
          const updated = {...p,
            title: fd.get('title'),
            location: fd.get('location'),
            price: Number(fd.get('price')),
            type: fd.get('type'),
            image: fd.get('image')
          };
          updateProperty(updated);
          editForm.classList.add('hidden');
          alert('Properti diperbarui');
        });
      }

      propertyList.appendChild(card);
    });
  }

  function userActionButtons(p){
    // if currentUser is customer -> no edit/delete
    if(currentUser && currentUser.role === 'customer'){
      return '';
    } else {
      return `<button class="edit-btn bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
              <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Hapus</button>`;
    }
  }

  function deleteProperty(id){
    // remove from local saved props and in-memory
    let saved = loadLocalProperties();
    saved = saved.filter(p=> p.id !== id);
    saveLocalProperties(saved);
    properties = properties.filter(p=> p.id !== id);
    renderProperties(properties);
  }

  function updateProperty(updated){
    // update local saved if exists else ignore (only local props editable)
    let saved = loadLocalProperties();
    const exists = saved.some(p=> p.id === updated.id);
    if(exists){ saved = saved.map(p=> p.id === updated.id ? updated : p); saveLocalProperties(saved); }
    properties = properties.map(p=> p.id === updated.id ? updated : p);
    renderProperties(properties);
  }

  const addPropertyForm = document.getElementById('add-property-form');
  if(addPropertyForm){
    addPropertyForm.addEventListener('submit', e=>{
      e.preventDefault();
      if(!currentUser || currentUser.role === 'customer'){ alert('Hanya penjual yang dapat menambah properti'); return; }
      const title = document.getElementById('newTitle').value;
      const location = document.getElementById('newLocation').value;
      const price = Number(document.getElementById('newPrice').value);
      const type = document.getElementById('newType').value;
      const image = document.getElementById('newImage').value;
      const newProp = { id: Date.now(), title, location, price, type, image };
      const saved = loadLocalProperties(); saved.push(newProp); saveLocalProperties(saved);
      properties.push(newProp); renderProperties(properties); addPropertyForm.reset(); alert('Properti berhasil ditambahkan!');
    });
  }

  // --------- FILTER ----------
  filterBtn.addEventListener('click', ()=>{
    const search = (searchInput.value||'').toLowerCase();
    const loc = (locationInput.value||'').toLowerCase();
    const type = typeSelect.value;
    const min = Number(minPriceInput.value) || 0;
    const max = Number(maxPriceInput.value) || Infinity;
    const filtered = properties.filter(p=> p.title.toLowerCase().includes(search) && (!loc || p.location.toLowerCase().includes(loc)) && (!type || p.type === type) && p.price >= min && p.price <= max);
    renderProperties(filtered);
  });

  // --------- TOGGLES ----------
  filterToggle.addEventListener('click', ()=>{
    const isVisible = !filterSection.classList.contains('hidden');
    hideAllPanels();
    if(!isVisible) { filterSection.classList.remove('hidden'); activePanel='filter'; }
  });
  addToggle.addEventListener('click', ()=>{
    const isVisible = !addSection.classList.contains('hidden');
    hideAllPanels();
    if(!isVisible) { addSection.classList.remove('hidden'); activePanel='add'; }
  });
  requestToggle.addEventListener('click', ()=>{
    const isVisible = !requestSection.classList.contains('hidden');
    hideAllPanels();
    if(!isVisible) { requestSection.classList.remove('hidden'); activePanel='request'; renderUpgradeRequests(); }
  });
  chatToggle.addEventListener('click', ()=>{
    const isVisible = !chatSection.classList.contains('hidden');
    hideAllPanels();
    if(!isVisible){ chatSection.classList.remove('hidden'); activePanel='chat'; renderMessages(); }
  });

  // --------- UPGRADE REQUESTS (customer -> admin verify) ----------
  upgradeBtn.addEventListener('click', ()=>{
    if(!currentUser) return alert('Silakan login terlebih dahulu');
    if(currentUser.role === 'penjual') return alert('Akun sudah penjual');
    const requests = loadUpgradeRequests();
    if(requests.some(r=> r.username === currentUser.username)) return alert('Anda sudah mengirim permintaan. Tunggu admin.');
    requests.push({ username: currentUser.username, time: new Date().toLocaleString(), status: 'pending' });
    saveUpgradeRequests(requests);
    alert('Permintaan upgrade dikirim. Admin akan meninjau.');
  });

  function renderUpgradeRequests(){
    const requests = loadUpgradeRequests();
    requestList.innerHTML = '';
    if(!requests.length){ requestList.innerHTML = '<p class="text-gray-500">Tidak ada permintaan.</p>'; return; }
    requests.forEach(req=>{
      const div = document.createElement('div');
      div.className = 'border p-3 rounded flex justify-between items-center';
      div.innerHTML = `
        <div>
          <p><strong>${req.username}</strong></p>
          <p class="text-sm text-gray-600">${req.time}</p>
          <p class="text-sm ${req.status==='pending' ? 'text-yellow-500':'text-green-500'}">Status: ${req.status}</p>
        </div>
        ${req.status==='pending' ? '<div class="flex gap-2"><button class="approve bg-green-500 text-white px-3 py-1 rounded">Setujui</button><button class="reject bg-red-500 text-white px-3 py-1 rounded">Tolak</button></div>' : ''}
      `;
      const approveBtn = div.querySelector('.approve');
      const rejectBtn = div.querySelector('.reject');
      if(approveBtn) approveBtn.addEventListener('click', ()=> approveUpgrade(req.username));
      if(rejectBtn) rejectBtn.addEventListener('click', ()=> rejectUpgrade(req.username));
      requestList.appendChild(div);
    });
  }

  function approveUpgrade(username){
    let users = loadUsers();
    users = users.map(u=> u.username===username ? {...u, role:'penjual'} : u);
    saveUsers(users);
    let reqs = loadUpgradeRequests().filter(r=> r.username!==username);
    saveUpgradeRequests(reqs);
    alert(username + ' disetujui menjadi penjual');
    renderUpgradeRequests();
  }
  function rejectUpgrade(username){
    let reqs = loadUpgradeRequests().filter(r=> r.username!==username);
    saveUpgradeRequests(reqs);
    alert(username + ' ditolak');
    renderUpgradeRequests();
  }

  // --------- CHAT (messages + unread counter) ----------
  function updateUnreadCount(){
    if(!currentUser) return;
    const msgs = loadMessages();
    let count = 0;
    if(currentUser.role === 'penjual') count = msgs.filter(m=> !m.readByAdmin).length;
    else count = msgs.filter(m=> m.receiver===currentUser.username && !m.readByCustomer).length;
    if(count>0){ chatNotif.textContent = count; chatNotif.classList.remove('hidden'); } else { chatNotif.classList.add('hidden'); }
  }

  function renderMessages(){
    if(!currentUser) return;
    const msgs = loadMessages();
    chatBox.innerHTML = '';
    msgs.forEach(m=>{
      if(currentUser.role === 'penjual' || m.sender===currentUser.username || m.receiver===currentUser.username){
        const div = document.createElement('div');
        div.className = `mb-2 p-2 rounded ${m.sender===currentUser.username ? 'bg-green-100 text-right':'bg-gray-200 text-left'}`;
        div.innerHTML = `<strong>${m.sender}:</strong> ${m.text}`;
        chatBox.appendChild(div);
      }
    });
    chatBox.scrollTop = chatBox.scrollHeight;
    // mark as read
    const updated = msgs.map(m=>{
      if(currentUser.role==='penjual' && !m.readByAdmin) m.readByAdmin = true;
      if(currentUser.role==='customer' && m.receiver===currentUser.username && !m.readByCustomer) m.readByCustomer = true;
      return m;
    });
    saveMessages(updated);
    updateUnreadCount();
  }

  if(chatForm){
    chatForm.addEventListener('submit', e=>{
      e.preventDefault();
      if(!currentUser) return alert('Silakan login untuk mengirim pesan');
      const text = chatInput.value.trim();
      if(!text) return;
      const msgs = loadMessages();
      const newMsg = { id: Date.now(), sender: currentUser.username, receiver: currentUser.role==='penjual' ? 'customer' : 'penjual', text, time: new Date().toLocaleString(), readByAdmin: currentUser.role==='penjual', readByCustomer: currentUser.role==='customer' };
      msgs.push(newMsg); saveMessages(msgs); chatInput.value=''; renderMessages(); updateUnreadCount();
    });
  }

  // periodic unread update
  setInterval(()=>{ updateUnreadCount(); }, 2000);

  // --------- Auto-login if saved ----------
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if(savedUser) showApp(savedUser);

}); // end DOMContentLoaded
