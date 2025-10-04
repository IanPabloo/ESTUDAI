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

    const mesAnoAtualLabel = document.getElementById('mes-ano-atual');
    const calendarioGrid = document.getElementById('calendario-grid');
    const btnMesAnterior = document.getElementById('btn-mes-anterior');
    const btnProximoMes = document.getElementById('btn-proximo-mes');
    const listaDetalhesDiv = document.getElementById('lista-detalhes');

    let lista_de_atividades = [];
    let dataExibida = new Date();

    // --- VERIFICA AUTENTICAÇÃO E CARREGA DADOS ---
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
                lista_de_atividades.push(doc.data());
            });
            renderizarCalendario();
        }, (error) => {
            console.error("Erro ao carregar atividades: ", error);
        });
    }

    function renderizarCalendario() {
        calendarioGrid.innerHTML = '';
        const ano = dataExibida.getFullYear();
        const mes = dataExibida.getMonth();

        const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(dataExibida);
        mesAnoAtualLabel.textContent = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} ${ano}`;

        const primeiroDiaMes = new Date(ano, mes, 1).getDay();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        for (let i = 0; i < primeiroDiaMes; i++) {
            calendarioGrid.innerHTML += `<div class="dia-calendario dia-outro-mes"></div>`;
        }

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const diaDiv = document.createElement('div');
            diaDiv.className = 'dia-calendario';
            diaDiv.textContent = dia;
            diaDiv.dataset.dia = dia;

            const dataCompleta = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;
            const temEvento = lista_de_atividades.some(atv => atv.entrega === dataCompleta && !atv.concluido);
            
            if (temEvento) {
                diaDiv.innerHTML += `<div class="marcador-evento"></div>`;
            }

            const hoje = new Date();
            if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                diaDiv.classList.add('hoje');
            }

            calendarioGrid.appendChild(diaDiv);
        }

        document.querySelectorAll('.dia-calendario[data-dia]').forEach(diaDiv => {
            diaDiv.addEventListener('click', (e) => {
                document.querySelectorAll('.dia-selecionado').forEach(d => d.classList.remove('dia-selecionado'));
                e.currentTarget.classList.add('dia-selecionado');
                mostrarDetalhesDia(e.currentTarget.dataset.dia);
            });
        });
        
        const diaAtual = new Date().getDate();
        const mesAtual = new Date().getMonth();

        if (mes === mesAtual) {
            mostrarDetalhesDia(diaAtual);
            document.querySelector(`.dia-calendario[data-dia="${diaAtual}"]`)?.classList.add('dia-selecionado');
        } else {
             mostrarDetalhesDia(1);
             document.querySelector('.dia-calendario[data-dia="1"]')?.classList.add('dia-selecionado');
        }
    }

    function mostrarDetalhesDia(dia) {
        listaDetalhesDiv.innerHTML = '';
        const ano = dataExibida.getFullYear();
        const mes = dataExibida.getMonth();
        const dataSelecionada = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;

        const eventosDoDia = lista_de_atividades.filter(atv => atv.entrega === dataSelecionada && !atv.concluido);

        if (eventosDoDia.length > 0) {
            eventosDoDia.forEach(atv => {
                listaDetalhesDiv.innerHTML += `<div class="detalhe-item">${atv.titulo}</div>`;
            });
        } else {
            listaDetalhesDiv.innerHTML = '<p>Nenhum evento para este dia.</p>';
        }
    }

    btnMesAnterior.addEventListener('click', () => {
        dataExibida.setMonth(dataExibida.getMonth() - 1);
        renderizarCalendario();
    });

    btnProximoMes.addEventListener('click', () => {
        dataExibida.setMonth(dataExibida.getMonth() + 1);
        renderizarCalendario();
    });
});