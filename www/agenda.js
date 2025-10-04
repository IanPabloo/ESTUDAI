// --- CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyD3LvyDpHta0AYdffbpfpYbn1FvxxF3L4s",
    authDomain: "estuda-ai-app.firebaseapp.com",
    projectId: "estuda-ai-app",
    storageBucket: "estuda-ai-app.appspot.com",
    messagingSenderId: "770030744953",
    appId: "1:770030744953:web:1d79a3a0907f33fb8c6ba8"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

    const listaAtividadesDiv = document.getElementById('lista-atividades');
    const btnProximos = document.getElementById('btn-filtro-proximos');
    const btnConcluidos = document.getElementById('btn-filtro-concluidos');
    
    let lista_de_atividades = [];

    auth.onAuthStateChanged((user) => {
        if (user) {
            carregarAtividades(user.uid);
        } else {
            window.location.href = 'login.html';
        }
    });

    function carregarAtividades(userId) {
        db.collection('atividades').where('userId', '==', userId).onSnapshot((querySnapshot) => {
            lista_de_atividades = [];
            querySnapshot.forEach((doc) => {
                lista_de_atividades.push({ id: doc.id, ...doc.data() });
            });
            renderizarAgenda('proximos');
        });
    }

    function marcarComoConcluida(atividadeId) {
        db.collection('atividades').doc(atividadeId).update({ concluido: true });
    }

    function renderizarAgenda(filtro = 'proximos') {
        listaAtividadesDiv.innerHTML = '';
        
        btnProximos.classList.toggle('active', filtro === 'proximos');
        btnConcluidos.classList.toggle('active', filtro === 'concluidos');

        const atividadesFiltradas = lista_de_atividades.filter(atv => 
            (filtro === 'proximos' ? !atv.concluido : atv.concluido)
        );

        const coresPrioridade = { "Alta": "var(--cor-vermelho)", "Média": "var(--cor-verde)", "Baixa": "var(--cor-azul)" };

        if (atividadesFiltradas.length === 0) {
            listaAtividadesDiv.innerHTML = '<p style="text-align: center; color: #777;">Nenhuma atividade aqui.</p>';
            return;
        }

        atividadesFiltradas.forEach(atv => {
            const item = document.createElement('div');
            item.className = 'atividade-item';
            const caixaConcluirHTML = filtro === 'proximos' ? `<div class="caixa-concluir" data-id="${atv.id}">✔</div>` : '';
            item.innerHTML = `
                <div class="prioridade-barra" style="background-color: ${coresPrioridade[atv.prioridade] || '#ccc'}"></div>
                <div class="atividade-info">
                    <h3>${atv.titulo}</h3>
                    <p>Disciplina: ${atv.disciplina}</p>
                    <p>Entrega: ${atv.entrega}</p>
                </div>
                ${caixaConcluirHTML}
            `;
            listaAtividadesDiv.appendChild(item);
        });

        document.querySelectorAll('.caixa-concluir').forEach(caixa => {
            caixa.addEventListener('click', (e) => {
                marcarComoConcluida(e.currentTarget.dataset.id);
            });
        });
    }

    btnProximos.addEventListener('click', () => renderizarAgenda('proximos'));
    btnConcluidos.addEventListener('click', () => renderizarAgenda('concluidos'));
});