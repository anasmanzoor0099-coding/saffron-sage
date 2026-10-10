/* ============================================
   ADMIN DASHBOARD LOGIC — Saffron & Sage
   ============================================ */

const API_URL = 'https://saffron-sage-api.vercel.app/api/reservations';
const ADMIN_PASSWORD = 'saffron2025';

// ===== STATE =====
let allReservations = [];
let currentFilter = 'all';
let searchQuery = '';
let deleteTargetId = null;

// ===== ELEMENTS =====
const loginScreen = document.getElementById('adminLogin');
const dashboard = document.getElementById('adminDash');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');

const statsTotal = document.getElementById('statTotal');
const statsToday = document.getElementById('statToday');
const statsConfirmed = document.getElementById('statConfirmed');
const statsPending = document.getElementById('statPending');

const filterTabs = document.querySelectorAll('.admin-filter');
const searchInput = document.getElementById('searchInput');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const tableWrapper = document.getElementById('tableWrapper');
const tableBody = document.getElementById('reservationTableBody');

const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');


// ============================================
// AUTH CHECK
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('saffron_admin_session');

    if (session === 'active') {
        showDashboard();
    } else {
        showLogin();
    }
});

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    loadReservations();
}


// ============================================
// LOGIN
// ============================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('saffron_admin_session', 'active');
        loginMessage.style.color = '#2f855a';
        loginMessage.textContent = 'Access granted...';

        setTimeout(() => {
            loginMessage.textContent = '';
            document.getElementById('adminPassword').value = '';
            showDashboard();
        }, 600);
    } else {
        loginMessage.style.color = '#c53030';
        loginMessage.textContent = 'Incorrect password. Please try again.';
    }
});


// ============================================
// LOGOUT
// ============================================
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('saffron_admin_session');
    showLogin();
});


// ============================================
// REFRESH
// ============================================
refreshBtn.addEventListener('click', () => {
    loadReservations();
});


// ============================================
// LOAD RESERVATIONS
// ============================================
async function loadReservations() {
    try {
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        tableWrapper.style.display = 'none';

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to load reservations');
        }

        allReservations = data.reservations || [];

        updateStats();
        renderTable();
    } catch (error) {
        console.error('Load error:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <div class="admin-empty__icon">⚠️</div>
            <h3>Failed to load</h3>
            <p>${error.message}</p>
        `;
    }
}


// ============================================
// STATS
// ============================================
function updateStats() {
    const today = new Date().toISOString().split('T')[0];

    statsTotal.textContent = allReservations.length;
    statsToday.textContent = allReservations.filter(r => r.date === today).length;
    statsConfirmed.textContent = allReservations.filter(r => r.status === 'confirmed').length;
    statsPending.textContent = allReservations.filter(r => r.status === 'pending').length;
}


// ============================================
// FILTERS
// ============================================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderTable();
    });
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTable();
});


// ============================================
// RENDER TABLE
// ============================================
function renderTable() {
    loadingState.style.display = 'none';

    let filtered = [...allReservations];

    // Apply filter
    if (currentFilter !== 'all') {
        if (currentFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(r => r.date === today);
        } else {
            filtered = filtered.filter(r => r.status === currentFilter);
        }
    }

    // Apply search
    if (searchQuery) {
        filtered = filtered.filter(r => {
            const searchable = `${r.name} ${r.email} ${r.phone}`.toLowerCase();
            return searchable.includes(searchQuery);
        });
    }

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        tableWrapper.style.display = 'none';
        emptyState.innerHTML = `
            <div class="admin-empty__icon">📭</div>
            <h3>No reservations found</h3>
            <p>Try a different filter or search term.</p>
        `;
        return;
    }

    emptyState.style.display = 'none';
    tableWrapper.style.display = 'block';

    tableBody.innerHTML = filtered.map(r => createRow(r)).join('');
}


// ============================================
// CREATE TABLE ROW
// ============================================
function createRow(r) {
    const formattedDate = formatDate(r.date);
    const formattedTime = formatTime(r.time);

    return `
        <tr>
            <td>
                <div class="admin-guest__name">${escapeHtml(r.name)}</div>
                ${r.occasion ? `<div class="admin-guest__occasion">🎉 ${escapeHtml(r.occasion)}</div>` : ''}
            </td>
            <td>
                <a href="mailto:${escapeHtml(r.email)}" class="admin-contact__item">${escapeHtml(r.email)}</a>
                <a href="tel:${escapeHtml(r.phone)}" class="admin-contact__item">${escapeHtml(r.phone)}</a>
            </td>
            <td>
                <div class="admin-datetime__date">${formattedDate}</div>
                <div class="admin-datetime__time">${formattedTime}</div>
            </td>
            <td>
                <span class="admin-party__count">👥 ${r.guests}</span>
            </td>
            <td>
                <span class="admin-status admin-status--${r.status}">${r.status}</span>
            </td>
            <td>
                <div class="admin-actions">
                    ${r.status !== 'confirmed' ? `<button class="admin-action admin-action--confirm" onclick="updateStatus('${r._id}', 'confirmed')">Confirm</button>` : ''}
                    ${r.status !== 'completed' ? `<button class="admin-action admin-action--complete" onclick="updateStatus('${r._id}', 'completed')">Complete</button>` : ''}
                    ${r.status !== 'cancelled' ? `<button class="admin-action admin-action--cancel" onclick="updateStatus('${r._id}', 'cancelled')">Cancel</button>` : ''}
                    <button class="admin-action admin-action--delete" onclick="openDeleteModal('${r._id}')">Delete</button>
                </div>
            </td>
        </tr>
    `;
}


// ============================================
// UPDATE STATUS
// ============================================
window.updateStatus = async function(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to update');
        }

        // Update local state
        const reservation = allReservations.find(r => r._id === id);
        if (reservation) reservation.status = status;

        updateStats();
        renderTable();
    } catch (error) {
        console.error('Update error:', error);
        alert('Error: ' + error.message);
    }
};


// ============================================
// DELETE
// ============================================
window.openDeleteModal = function(id) {
    deleteTargetId = id;
    deleteModal.classList.add('active');
};

cancelDelete.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteTargetId = null;
});

deleteModal.querySelector('.admin-modal__overlay').addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteTargetId = null;
});

confirmDelete.addEventListener('click', async () => {
    if (!deleteTargetId) return;

    try {
        confirmDelete.disabled = true;
        confirmDelete.textContent = 'Deleting...';

        const response = await fetch(`${API_URL}/${deleteTargetId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete');
        }

        allReservations = allReservations.filter(r => r._id !== deleteTargetId);
        updateStats();
        renderTable();

        deleteModal.classList.remove('active');
        deleteTargetId = null;
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error: ' + error.message);
    } finally {
        confirmDelete.disabled = false;
        confirmDelete.textContent = 'Delete';
    }
});


// ============================================
// HELPERS
// ============================================
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(timeStr) {
    if (!timeStr) return 'N/A';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}


// ============================================
// INIT
// ============================================
console.log('✅ Saffron & Sage — Admin Dashboard loaded');