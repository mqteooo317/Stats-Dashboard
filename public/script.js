const viewContainer = document.getElementById('view-container');
let currentView = 'kills';

async function fetchLeaderboard(type, page = 1) {
    const res = await fetch(`/api/leaderboard/${type}?page=${page}`);
    return await res.json();
}

async function fetchPlayer(id) {
    const res = await fetch(`/api/player/${id}`);
    return await res.json();
}

async function changeView(type, page = 1) {
    currentView = type;
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    const result = await fetchLeaderboard(type, page);
    renderTable(result, type);
}

function renderTable(result, type) {
    let html = `
        <div class="fade-in">
            <table>
                <thead>
                    <tr>
                        <th># Rank</th>
                        <th>Jugador</th>
                        <th>${type.toUpperCase()}</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.data.map((p, i) => `
                        <tr>
                            <td>${((result.currentPage - 1) * 10) + i + 1}</td>
                            <td class="player-name" onclick="showProfile('${p.id}')">${p.name}</td>
                            <td style="font-size: 1.2rem; color: #fff">${type === 'kills' ? p.kills : p.deaths}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="pagination">
                ${renderPagination(result)}
            </div>
        </div>
    `;
    viewContainer.innerHTML = html;
}

function renderPagination(result) {
    let btns = '';
    for (let i = 1; i <= result.totalPages; i++) {
        btns += `<button class="page-btn ${result.currentPage === i ? 'active' : ''}"
                 onclick="changeView('${currentView}', ${i})">${i}</button>`;
    }
    return btns;
}

async function showProfile(id) {
    const player = await fetchPlayer(id);
    const kd = (player.kills / (player.deaths || 1)).toFixed(2);

    viewContainer.innerHTML = `
        <div class="profile-card fade-in">
            <h2 style="font-size: 3rem; margin: 0">${player.name}</h2>
            <p style="color: var(--accent)">ID: #00${player.id}</p>
            <div style="display: flex; justify-content: space-around; margin: 2rem 0; border-top: 1px solid #333; padding-top: 2rem">
                <div><h3 style="color: var(--accent)">${player.kills}</h3><p>KILLS</p></div>
                <div><h3 style="color: var(--accent)">${player.deaths}</h3><p>DEATHS</p></div>
                <div><h3 style="color: #fff">${kd}</h3><p>K/D RATIO</p></div>
            </div>
            <button onclick="changeView('${currentView}')">VOLVER AL RANKING</button>
        </div>
    `;
}

function renderHome() {
    location.reload();
}
