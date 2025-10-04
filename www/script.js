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

// --- LÓGICA DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    
    const telaPainel = document.getElementById('tela-painel');
    const telaAdicionar = document.getElementById('tela-adicionar-atividade');
    const formAdicionar = document.getElementById('form-add-atividade');
    const btnAdicionar = document.getElementById('btn-adicionar-atividade');
    const btnVoltarPainel = document.querySelector('.btn-voltar-painel');
    const btnSair = document.getElementById('btn-sair');
    
    let usuarioAtual = null;

    auth.onAuthStateChanged((user) => {
        if (user) {
            usuarioAtual = user;
        } else {
            window.location.href = 'login.html';
        }
    });

    btnSair.addEventListener('click', () => {
        auth.signOut().then(() => { window.location.href = 'login.html'; });
    });

    function mostrarTela(tela) {
        telaPainel.style.display = 'none';
        telaAdicionar.style.display = 'none';
        tela.style.display = 'flex';
    }
    
    btnAdicionar.addEventListener('click', () => mostrarTela(telaAdicionar));
    btnVoltarPainel.addEventListener('click', () => mostrarTela(telaPainel));

    formAdicionar.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!usuarioAtual) return;
        const [ano, mes, dia] = document.getElementById('add-data').value.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;
        const prioridades = { '1': 'Baixa', '2': 'Média', '3': 'Alta' };
        
        const novaAtividade = {
            titulo: document.getElementById('add-titulo').value,
            disciplina: document.getElementById('add-disciplina').value,
            entrega: dataFormatada,
            prioridade: prioridades[document.getElementById('add-prioridade').value],
            concluido: false,
            userId: usuarioAtual.uid 
        };

        db.collection('atividades').add(novaAtividade)
            .then(() => {
                formAdicionar.reset();
                alert('Atividade adicionada com sucesso!');
                mostrarTela(telaPainel);
            })
            .catch((error) => { alert('Ocorreu um erro ao salvar a atividade.'); });
    });

    mostrarTela(telaPainel);
});