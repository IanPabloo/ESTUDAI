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

    // --- ELEMENTOS HTML ---
    const listaHorariosDiv = document.getElementById('lista-horarios');
    const modal = document.getElementById('modal-aula');
    const modalTitulo = document.getElementById('modal-titulo');
    const formAula = document.getElementById('form-aula');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-aula');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const aulaIdInput = document.getElementById('aula-id'); // Usaremos ID em vez de índice

    let lista_de_aulas = [];
    let usuarioAtual = null;

    // --- VERIFICA AUTENTICAÇÃO E CARREGA DADOS ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            usuarioAtual = user;
            carregarAulas(user.uid);
        } else {
            window.location.href = 'login.html';
        }
    });
    
    function carregarAulas(userId) {
        db.collection('horarios').where('userId', '==', userId).onSnapshot((querySnapshot) => {
            lista_de_aulas = [];
            querySnapshot.forEach((doc) => {
                lista_de_aulas.push({ id: doc.id, ...doc.data() });
            });
            renderizarHorarios();
        });
    }

    function renderizarHorarios() {
        listaHorariosDiv.innerHTML = '';

        const diasOrdem = {"Segunda-feira": 1, "Terça-feira": 2, "Quarta-feira": 3, "Quinta-feira": 4, "Sexta-feira": 5, "Sábado": 6, "Domingo": 7};
        lista_de_aulas.sort((a, b) => diasOrdem[a.dia] - diasOrdem[b.dia]);
        
        if (lista_de_aulas.length === 0) {
            listaHorariosDiv.innerHTML = '<p style="text-align: center; color: #777;">Nenhum horário cadastrado.</p>';
            return;
        }

        lista_de_aulas.forEach((aula) => {
            const item = document.createElement('div');
            item.className = 'horario-item';
            item.innerHTML = `
                <div class="horario-info">
                    <h3>${aula.disciplina}</h3>
                    <p><span class="detalhe">Dia:</span> ${aula.dia}</p>
                    <p><span class="detalhe">Horário:</span> ${aula.inicio} - ${aula.fim}</p>
                    <p><span class="detalhe">Local:</span> ${aula.local}</p>
                    <p><span class="detalhe">Professor:</span> ${aula.professor}</p>
                </div>
                <div class="horario-botoes">
                    <button class="btn-editar" data-id="${aula.id}">Editar</button>
                    <button class="btn-excluir" data-id="${aula.id}">Excluir</button>
                </div>
            `;
            listaHorariosDiv.appendChild(item);
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => abrirModal(e.currentTarget.dataset.id));
        });
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => excluirAula(e.currentTarget.dataset.id));
        });
    }

    function abrirModal(aulaId = null) {
        formAula.reset();
        if (aulaId) {
            modalTitulo.textContent = 'Editar Aula';
            const aula = lista_de_aulas.find(a => a.id === aulaId);
            if(aula) {
                document.getElementById('aula-disciplina').value = aula.disciplina;
                document.getElementById('aula-dia').value = aula.dia;
                document.getElementById('aula-inicio').value = aula.inicio;
                document.getElementById('aula-fim').value = aula.fim;
                document.getElementById('aula-local').value = aula.local;
                document.getElementById('aula-professor').value = aula.professor;
                aulaIdInput.value = aulaId;
            }
        } else {
            modalTitulo.textContent = 'Adicionar Nova Aula';
            aulaIdInput.value = '';
        }
        modal.style.display = 'flex';
    }

    function fecharModal() {
        modal.style.display = 'none';
    }

    function excluirAula(aulaId) {
        const aula = lista_de_aulas.find(a => a.id === aulaId);
        if (confirm(`Tem certeza que deseja excluir a aula de ${aula.disciplina}?`)) {
            db.collection('horarios').doc(aulaId).delete();
        }
    }

    btnAbrirModal.addEventListener('click', () => abrirModal());
    btnCancelarModal.addEventListener('click', fecharModal);

    formAula.addEventListener('submit', (e) => {
        e.preventDefault();
        const aulaId = aulaIdInput.value;
        const aulaData = {
            disciplina: document.getElementById('aula-disciplina').value,
            dia: document.getElementById('aula-dia').value,
            inicio: document.getElementById('aula-inicio').value,
            fim: document.getElementById('aula-fim').value,
            local: document.getElementById('aula-local').value,
            professor: document.getElementById('aula-professor').value,
            userId: usuarioAtual.uid // Sempre associa ao usuário logado
        };

        if (aulaId) {
            db.collection('horarios').doc(aulaId).update(aulaData);
        } else {
            db.collection('horarios').add(aulaData);
        }
        fecharModal();
    });

    renderizarHorarios();
});