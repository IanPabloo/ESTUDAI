// --- CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE ---
// Esta parte agora é executada imediatamente
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

// --- LÓGICA DA PÁGINA ---
// Esta parte espera o HTML carregar para manipular os elementos
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS HTML ---
    const telaLogin = document.getElementById('tela-login');
    const telaCadastro = document.getElementById('tela-cadastro');
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const linkParaCadastro = document.getElementById('link-para-cadastro');
    const linkParaLogin = document.getElementById('link-para-login');

    // --- NAVEGAÇÃO ENTRE TELAS DE AUTH ---
    linkParaCadastro.addEventListener('click', (e) => {
        e.preventDefault();
        telaLogin.style.display = 'none';
        telaCadastro.style.display = 'flex';
    });

    linkParaLogin.addEventListener('click', (e) => {
        e.preventDefault();
        telaCadastro.style.display = 'none';
        telaLogin.style.display = 'flex';
    });

    // --- LÓGICA DE LOGIN ---
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        auth.signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(`Erro ao fazer login: ${error.message}`);
            });
    });

    // --- LÓGICA DE CADASTRO ---
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('cadastro-email').value;
        const senha = document.getElementById('cadastro-senha').value;

        auth.createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                alert('Conta criada com sucesso! A entrar...');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(`Erro ao criar conta: ${error.message}`);
            });
    });

});

// --- VERIFICA SE O USUÁRIO JÁ ESTÁ LOGADO ---
// Esta verificação também pode ocorrer a qualquer momento
auth.onAuthStateChanged((user) => {
    if (user) {
        if(window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
});