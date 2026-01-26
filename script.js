let currentUser = null;
let currentUserIndex = null; // para padre: índice de estudiante que representa
let selectedStudentIndex = null; // para enfermera: índice estudiante seleccionado

// Datos padre demo (usuario, pass, índice estudiante) - ahora cargado desde localStorage
let padres = JSON.parse(localStorage.getItem('padres')) || [
    { username: 'padre1', password: '123', studentIndex: 0 },
    { username: 'padre2', password: '234', studentIndex: 1 }
];

// Mostrar/Ocultar sección
function showSection(id) {
    const secs = document.querySelectorAll('.section');
    secs.forEach(s => s.style.display = 'none');
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

// Para controlar el botón aceptar en marco legal
const legalAcceptCheckbox = document.getElementById('legal-accept');
const acceptLegalBtn = document.getElementById('accept-legal');
legalAcceptCheckbox.addEventListener('change', () => {
    acceptLegalBtn.disabled = !legalAcceptCheckbox.checked;
});

// Mostrar modal de registro
document.getElementById('register-link').addEventListener('click', () => {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'flex';
});

// Formulario de registro
document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const errorDiv = document.getElementById('register-error');

    // Validaciones básicas
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Las contraseñas no coinciden.';
        return;
    }
    if (password.length < 3) {
        errorDiv.textContent = 'La contraseña debe tener al menos 3 caracteres.';
        return;
    }
    if (padres.some(p => p.username === username)) {
        errorDiv.textContent = 'El usuario ya existe.';
        return;
    }

    // Crear estudiante vacío
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const newStudentIndex = students.length;
    students.push({}); // Perfil vacío
    localStorage.setItem('students', JSON.stringify(students));

    // Agregar padre
    padres.push({ username, password, studentIndex: newStudentIndex });
    localStorage.setItem('padres', JSON.stringify(padres));

    errorDiv.style.color = 'green';
    errorDiv.textContent = 'Cuenta registrada exitosamente. Ahora puedes iniciar sesión.';
    setTimeout(() => {
        document.getElementById('register').style.display = 'none';
        document.getElementById('login').style.display = 'flex';
    }, 2000);
});

// Login
document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const padre = padres.find(p => p.username === username);
    if (padre && padre.password === password) {
        currentUser = 'parent';
        currentUserIndex = padre.studentIndex;
        document.getElementById('login').style.display = 'none';
        document.getElementById('legal-framework').style.display = 'flex';
        document.getElementById('user-role').textContent = `Rol: Padre de Familia (${username})`;
        // Mostrar enlace cambiar contraseña
        document.getElementById('forgot-password-container').style.display = 'block';
        return;
    }
    if (username === 'enfermera' && password === '123') {
        currentUser = 'nurse';
        currentUserIndex = null;
        document.getElementById('login').style.display = 'none';
        document.getElementById('user-role').textContent = 'Rol: Enfermería';
        document.getElementById('forgot-password-container').style.display = 'none';
        // Enfermera va directo a la app sin marco legal
        document.getElementById('app').style.display = 'block';
        document.getElementById('nav-nurse').style.display = 'block';
        document.getElementById('nurse-student-selector').style.display = 'block';
        updateStudentSelector();
        showSection('profile');
        return;
    }
    document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos.';
});

// Aceptar marco legal para padre
acceptLegalBtn.addEventListener('click', () => {
    document.getElementById('legal-framework').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('nav-parent').style.display = 'block';
    document.getElementById('nurse-student-selector').style.display = 'none';
    loadParentStudentProfile();
    showSection('profile');
});

// Cargar perfil padre (solo su estudiante)
function loadParentStudentProfile() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (currentUserIndex === null || !students[currentUserIndex]) {
        alert('Estudiante no asignado o no encontrado.');
        return;
    }
    const student = students[currentUserIndex];
    const form = document.getElementById('profile-form');
    form.style.display = 'block';

    // Set valores
    document.getElementById('full-name').value = student.fullName || '';
    document.getElementById('grade').value = student.grade || '';
    document.getElementById('identification').value = student.identification || '';
    document.getElementById('legal-rep-name').value = student.legalRepName || '';
    document.getElementById('rep-phone').value = student.repPhone || '';
    document.getElementById('aux-phone').value = student.auxPhone || '';
    document.getElementById('allergies').value = student.allergies || '';
    document.getElementById('diseases').value = student.diseases || '';
    document.getElementById('medications').value = student.medications || '';
}

// Guardar perfil padre
document.getElementById('profile-form').addEventListener('submit', e => {
    e.preventDefault();
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (currentUserIndex === null || !students[currentUserIndex]) {
        alert('Error: Estudiante no encontrado.');
        return;
    }
    students[currentUserIndex] = {
        fullName: document.getElementById('full-name').value,
        grade: document.getElementById('grade').value,
        identification: document.getElementById('identification').value,
        legalRepName: document.getElementById('legal-rep-name').value,
        repPhone: document.getElementById('rep-phone').value,
        auxPhone: document.getElementById('aux-phone').value,
        allergies: document.getElementById('allergies').value,
        diseases: document.getElementById('diseases').value,
        medications: document.getElementById('medications').value
    };
    localStorage.setItem('students', JSON.stringify(students));
    alert('Perfil guardado exitosamente.');
});

// Para enfermera: actualizar selector de estudiantes
function updateStudentSelector() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const selector = document.getElementById('student-selector');
    selector.innerHTML = '<option value="">Seleccionar Estudiante</option>';
    students.forEach((student, index) => {
        const name = student.fullName || `Estudiante ${index + 1}`;
        selector.innerHTML += `<option value="${index}">${name}</option>`;
    });
}

// Cambiar estudiante seleccionado por enfermera
document.getElementById('student-selector').addEventListener('change', () => {
    selectedStudentIndex = parseInt(document.getElementById('student-selector').value);
    if (selectedStudentIndex !== null && !isNaN(selectedStudentIndex)) {
        loadNurseStudentProfile();
    } else {
        document.getElementById('selected-student-info').innerHTML = '';
        document.getElementById('profile-form').style.display = 'none';
    }
});

// Cargar perfil para enfermera (solo vista)
function loadNurseStudentProfile() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (selectedStudentIndex === null || !students[selectedStudentIndex]) {
        document.getElementById('selected-student-info').innerHTML = '<p>Estudiante no encontrado.</p>';
        return;
    }
    const student = students[selectedStudentIndex];
    document.getElementById('selected-student-info').innerHTML = `
        <h3>Información del Estudiante</h3>
        <p><strong>Nombre Completo:</strong> ${student.fullName || 'No registrado'}</p>
        <p><strong>Curso/Grado:</strong> ${student.grade || 'No registrado'}</p>
        <p><strong>Identificación:</strong> ${student.identification || 'No registrado'}</p>
        <p><strong>Representante Legal:</strong> ${student.legalRepName || 'No registrado'}</p>
        <p><strong>Teléfono Representante:</strong> ${student.repPhone || 'No registrado'}</p>
        <p><strong>Teléfono Auxiliar:</strong> ${student.auxPhone || 'No registrado'}</p>
        <p><strong>Alergias:</strong> ${student.allergies || 'Ninguna'}</p>
        <p><strong>Enfermedades:</strong> ${student.diseases || 'Ninguna'}</p>
        <p><strong>Medicamentos:</strong> ${student.medications || 'Ninguno'}</p>
    `;
    document.getElementById('profile-form').style.display = 'none';
}

// Guardar signos vitales (enfermera)
document.getElementById('vitals-form').addEventListener('submit', e => {
    e.preventDefault();
    if (selectedStudentIndex === null) {
        alert('Selecciona un estudiante primero.');
        return;
    }
    const vitals = JSON.parse(localStorage.getItem('vitals')) || [];
    vitals.push({
        studentIndex: selectedStudentIndex,
        pulse: document.getElementById('pulse').value,
        bloodPressure: document.getElementById('blood-pressure').value,
        temperature: document.getElementById('temperature').value,
        respiratoryRate: document.getElementById('respiratory-rate').value,
        symptoms: document.getElementById('symptoms').value,
        procedure: document.getElementById('procedure').value,
        date: new Date().toISOString()
    });
    localStorage.setItem('vitals', JSON.stringify(vitals));
    alert('Datos guardados.');
    // Limpiar form
    document.getElementById('vitals-form').reset();
});

// Mensajería (enfermera)
document.getElementById('report-withdrawal').addEventListener('click', () => {
    const message = document.getElementById('withdrawal-message').value.trim();
    if (!message) {
        alert('Escribe un motivo.');
        return;
    }
    if (selectedStudentIndex === null) {
        alert('Selecciona un estudiante.');
        return;
    }
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
    alerts.push({
        studentIndex: selectedStudentIndex,
        message,
        date: new Date().toISOString()
    });
    localStorage.setItem('alerts', JSON.stringify(alerts));
    document.getElementById('message-status').textContent = 'Mensaje enviado y retiro reportado.';
    document.getElementById('withdrawal-message').value = '';
});

// Ingreso/Egreso (enfermera)
document.getElementById('entry-exit-form').addEventListener('submit', e => {
    e.preventDefault();
    if (selectedStudentIndex === null) {
        alert('Selecciona un estudiante.');
        return;
    }
    const visits = JSON.parse(localStorage.getItem('visits')) || [];
    visits.push({
        studentIndex: selectedStudentIndex,
        entry: document.getElementById('entry-datetime').value,
        exit: document.getElementById('exit-datetime').value,
        withdrawnBy: document.getElementById('withdrawn-by').value,
        date: new Date().toISOString()
    });
    localStorage.setItem('visits', JSON.stringify(visits));
    document.getElementById('exit-status').textContent = 'Registro guardado.';
    updateVisitHistory();
    document.getElementById('entry-exit-form').reset();
});

// Actualizar historial de visitas (enfermera)
function updateVisitHistory() {
    const visits = JSON.parse(localStorage.getItem('visits')) || [];
    const list = document.getElementById('visit-history');
    list.innerHTML = '';
    visits.filter(v => v.studentIndex === selectedStudentIndex).forEach(v => {
        list.innerHTML += `<li>Ingreso: ${v.entry}, Egreso: ${v.exit}, Retirado por: ${v.withdrawnBy}</li>`;
    });
}

// Alertas padre
function loadAlerts() {
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';
    alerts.filter(a => a.studentIndex === currentUserIndex).forEach(a => {
        list.innerHTML += `<p>${a.message} (Fecha: ${new Date(a.date).toLocaleString()})</p>`;
    });
}

// Historial padre
function loadHistory() {
    const visits = JSON.parse(localStorage.getItem('visits')) || [];
    const list = document.getElementById('parent-history');
    list.innerHTML = '';
    visits.filter(v => v.studentIndex === currentUserIndex).forEach(v => {
        list.innerHTML += `<li>Ingreso: ${v.entry}, Egreso: ${v.exit}, Retirado por: ${v.withdrawnBy}</li>`;
    });
}

// Cambiar contraseña padre
document.getElementById('forgot-password-link').addEventListener('click', () => {
    document.getElementById('forgot-password-form').style.display = 'block';
});

document.getElementById('change-password-btn').addEventListener('click', () => {
    const newPass = document.getElementById('new-password').value;
    if (newPass.length < 3) {
        document.getElementById('password-change-status').textContent = 'Contraseña demasiado corta.';
        return;
    }
    const padre = padres.find(p => p.username === document.getElementById('username').value);
    if (padre) {
        padre.password = newPass;
        localStorage.setItem('padres', JSON.stringify(padres));
        document.getElementById('password-change-status').textContent = 'Contraseña cambiada.';
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register').style.display = 'none';
    document.getElementById('legal-framework').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('nav-parent').style.display = 'none';
    document.getElementById('nav-nurse').style.display = 'none';
    document.getElementById('nurse-student-selector').style.display = 'none';
    document.getElementById('forgot-password-form').style.display = 'none';
});