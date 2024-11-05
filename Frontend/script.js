// Função para alternar a exibição dos menus
function toggleMenu(menuId) {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
        if (menu.id === menuId) {
            menu.classList.toggle('active');
        } else {
            menu.classList.remove('active');
        }
    });
}

// Função para cadastrar paciente
document.getElementById('formCadastrarPaciente').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomePaciente').value.trim();
    const idade = document.getElementById('idadePaciente').value;
    const sexo = document.getElementById('sexoPaciente').value;
    const cidade = document.getElementById('cidadePaciente').value.trim();
    const rua = document.getElementById('ruaPaciente').value.trim();
    const numero = document.getElementById('numeroPaciente').value;
    const cep = document.getElementById('cepPaciente').value.trim();
    const cpf = document.getElementById('cpfPaciente').value.trim();

    if (!nome || !idade || !sexo || !cidade || !rua || !numero || !cep || !cpf) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Verificar se o paciente já está cadastrado pelo CPF
    const existe = pacientes.some(p => p.cpf === cpf);
    if (existe) {
        alert('Paciente já cadastrado!');
        return;
    }

    const novoPaciente = { nome, idade, sexo, endereco: { cidade, rua, numero, cep }, cpf };
    pacientes.push(novoPaciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    alert('Paciente cadastrado com sucesso!');
    document.getElementById('formCadastrarPaciente').reset();
    atualizarSelectPaciente();
    atualizarListaPacientes();
});

// Função para atualizar o select de pacientes no formulário de exame
function atualizarSelectPaciente() {
    const select = document.getElementById('selectPaciente');
    select.innerHTML = '<option value="">Selecione</option>';
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.forEach((p, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

// Função para preencher informações do paciente ao selecionar
function preencherInfoPaciente() {
    const select = document.getElementById('selectPaciente');
    const index = select.value;
    if (index === "") {
        document.getElementById('infoPaciente').innerHTML = "";
        return;
    }
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const p = pacientes[index];
    document.getElementById('infoIdade').textContent = p.idade;
    document.getElementById('infoSexo').textContent = p.sexo;
    document.getElementById('infoEndereco').textContent = `${p.endereco.cidade}, ${p.endereco.rua}, ${p.endereco.numero}, CEP: ${p.endereco.cep}`;
    document.getElementById('infoCPF').textContent = p.cpf;
}

// Função para criar exame
document.getElementById('formCriarExame').addEventListener('submit', function(e) {
    e.preventDefault();

    const pacienteIndex = document.getElementById('selectPaciente').value;
    const tipoExame = document.getElementById('tipoExame').value;

    if (pacienteIndex === "" || tipoExame === "") {
        alert('Por favor, selecione um paciente e o tipo de exame.');
        return;
    }

    // Coletar dados específicos do exame
    let exameData = { tipo: tipoExame };

    switch(tipoExame) {
        case 'Sangue':
            exameData = {
                ...exameData,
                hemoglobina: document.getElementById('hemoglobina').value,
                glicemia: document.getElementById('glicemia').value,
                colesterol: document.getElementById('colesterol').value
            };
            break;
        case 'Urina':
            exameData = {
                ...exameData,
                pH: document.getElementById('ph').value,
                proteínas: document.getElementById('proteinas').value
            };
            break;
        case 'Raio-X':
            exameData = {
                ...exameData,
                area: document.getElementById('area').value
            };
            break;
        case 'Ultrassom':
            exameData = {
                ...exameData,
                regiao: document.getElementById('regiao').value
            };
            break;
        case 'Eletrocardiograma':
            exameData = {
                ...exameData,
                ritmo: document.getElementById('ritmo').value
            };
            break;
        default:
            break;
    }

    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    exames.push({ pacienteIndex, ...exameData });
    localStorage.setItem('exames', JSON.stringify(exames));

    alert('Exame criado com sucesso!');
    document.getElementById('formCriarExame').reset();
    document.getElementById('formExameContainer').innerHTML = "";
    atualizarSelectExame();
});

// Função para mostrar formulário específico de exame
function mostrarFormularioExame() {
    const tipo = document.getElementById('tipoExame').value;
    const container = document.getElementById('formExameContainer');
    container.innerHTML = "";

    if (tipo === "") return;

    let html = "";
    switch(tipo) {
        case 'Sangue':
            html = `
                <label>Hemoglobina:</label>
                <input type="number" id="hemoglobina" required>
                
                <label>Glicemia:</label>
                <input type="number" id="glicemia" required>
                
                <label>Colesterol:</label>
                <input type="number" id="colesterol" required>
            `;
            break;
        case 'Urina':
            html = `
                <label>pH:</label>
                <input type="number" id="ph" required>
                
                <label>Proteínas:</label>
                <input type="text" id="proteinas" required>
            `;
            break;
        case 'Raio-X':
            html = `
                <label>Área:</label>
                <input type="text" id="area" required>
            `;
            break;
        case 'Ultrassom':
            html = `
                <label>Região:</label>
                <input type="text" id="regiao" required>
            `;
            break;
        case 'Eletrocardiograma':
            html = `
                <label>Ritmo:</label>
                <input type="text" id="ritmo" required>
            `;
            break;
        default:
            break;
    }

    container.innerHTML = html;
}

// Função para atualizar a lista de pacientes na consulta
function atualizarListaPacientes() {
    const lista = document.getElementById('listaPacientes');
    lista.innerHTML = "";
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.forEach((p, index) => {
        const li = document.createElement('li');
        li.textContent = p.nome;
        li.onclick = () => mostrarExamesDoPaciente(index);
        lista.appendChild(li);
    });
}

// Função para mostrar exames do paciente selecionado
function mostrarExamesDoPaciente(index) {
    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    const paciente = JSON.parse(localStorage.getItem('pacientes'))[index];
    const filteredExames = exames.filter(ex => ex.pacienteIndex == index);

    let info = `
        <h3>Exames de ${paciente.nome}</h3>
        <ul>
    `;
    filteredExames.forEach((ex, i) => {
        info += `<li>${ex.tipo} - ${JSON.stringify(ex)}</li>`;
    });
    info += `</ul>`;
    document.getElementById('menuConsultarPaciente').innerHTML = info;
}

// Função para atualizar o select de exames na consulta
function atualizarSelectExame() {
    const select = document.getElementById('selectExame');
    select.innerHTML = '<option value="">Selecione o Exame</option>';
    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    exames.forEach((ex, index) => {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        const paciente = pacientes[ex.pacienteIndex];
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${ex.tipo} - ${paciente ? paciente.nome : 'Desconhecido'}`;
        select.appendChild(option);
    });
}

// Função para mostrar detalhes do exame selecionado
function mostrarExame() {
    const select = document.getElementById('selectExame');
    const index = select.value;
    const detalhe = document.getElementById('detalheExame');
    if (index === "") {
        detalhe.innerHTML = "";
        return;
    }

    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    const exame = exames[index];
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[exame.pacienteIndex];

    let html = `
        <h3>Detalhes do Exame</h3>
        <label>Tipo de Exame:</label>
        <input type="text" id="editTipoExame" value="${exame.tipo}" disabled>
    `;

    // Adicionar campos específicos
    switch(exame.tipo) {
        case 'Sangue':
            html += `
                <label>Hemoglobina:</label>
                <input type="number" id="editHemoglobina" value="${exame.hemoglobina}" required>
                
                <label>Glicemia:</label>
                <input type="number" id="editGlicemia" value="${exame.glicemia}" required>
                
                <label>Colesterol:</label>
                <input type="number" id="editColesterol" value="${exame.colesterol}" required>
            `;
            break;
        case 'Urina':
            html += `
                <label>pH:</label>
                <input type="number" id="editPh" value="${exame.ph}" required>
                
                <label>Proteínas:</label>
                <input type="text" id="editProteinas" value="${exame.proteinas}" required>
            `;
            break;
        case 'Raio-X':
            html += `
                <label>Área:</label>
                <input type="text" id="editArea" value="${exame.area}" required>
            `;
            break;
        case 'Ultrassom':
            html += `
                <label>Região:</label>
                <input type="text" id="editRegiao" value="${exame.regiao}" required>
            `;
            break;
        case 'Eletrocardiograma':
            html += `
                <label>Ritmo:</label>
                <input type="text" id="editRitmo" value="${exame.ritmo}" required>
            `;
            break;
        default:
            break;
    }

    html += `<button onclick="salvarExame(${index})">Salvar</button>`;
    detalhe.innerHTML = html;
}

// Função para salvar exame editado
function salvarExame(index) {
    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    const exame = exames[index];

    switch(exame.tipo) {
        case 'Sangue':
            exame.hemoglobina = document.getElementById('editHemoglobina').value;
            exame.glicemia = document.getElementById('editGlicemia').value;
            exame.colesterol = document.getElementById('editColesterol').value;
            break;
        case 'Urina':
            exame.ph = document.getElementById('editPh').value;
            exame.proteinas = document.getElementById('editProteinas').value;
            break;
        case 'Raio-X':
            exame.area = document.getElementById('editArea').value;
            break;
        case 'Ultrassom':
            exame.regiao = document.getElementById('editRegiao').value;
            break;
        case 'Eletrocardiograma':
            exame.ritmo = document.getElementById('editRitmo').value;
            break;
        default:
            break;
    }

    exames[index] = exame;
    localStorage.setItem('exames', JSON.stringify(exames));
    alert('Exame atualizado com sucesso!');
    atualizarSelectExame();
    document.getElementById('detalheExame').innerHTML = "";
}

// Função para filtrar pacientes na consulta
function filtrarPacientes() {
    const filtro = document.getElementById('buscarPaciente').value.toLowerCase();
    const lista = document.getElementById('listaPacientes');
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    lista.innerHTML = "";

    pacientes.forEach((p, index) => {
        if (p.nome.toLowerCase().includes(filtro)) {
            const li = document.createElement('li');
            li.textContent = p.nome;
            li.onclick = () => mostrarExamesDoPaciente(index);
            lista.appendChild(li);
        }
    });
}

// Carrossel de Curiosidades
let slideIndex = 0;
function mudarSlide(n) {
    const slides = document.querySelectorAll('.carousel-item');
    slideIndex += n;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length -1;
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(${-slideIndex * 100}%)`;
}

// Inicializações
document.addEventListener('DOMContentLoaded', function() {
    atualizarSelectPaciente();
    atualizarListaPacientes();
    atualizarSelectExame();
});
