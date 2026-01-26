let currentUser = null;
let currentUserIndex = null; // para padre: índice de estudiante que representa
let selectedStudentIndex = null; // para enfermera: índice estudiante seleccionado

// Datos padre demo (usuario, pass, índice estudiante)
const padres = [
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

    selectedStudentIndex = currentUserIndex;
}

// Guardar perfil padre
document.getElementById('profile-form').addEventListener('submit', e => {
    e.preventDefault();
    if (currentUser !== 'parent') return;

    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (currentUserIndex === null) return;

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
    alert('Perfil actualizado exitosamente.');
});

// Cargar selector para enfermera
function updateStudentSelector() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const selector = document.getElementById('student-selector');
    selector.innerHTML = '<option value="">Seleccionar Estudiante</option>';
    students.forEach((student, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = student.fullName || `Estudiante ${idx + 1}`;
        selector.appendChild(option);
    });
}

// Enfermera selecciona estudiante
document.getElementById('student-selector').addEventListener('change', e => {
    selectedStudentIndex = e.target.value;
    if (selectedStudentIndex === '') {
        document.getElementById('profile-form').style.display = 'none';
        document.getElementById('selected-student-info').innerHTML = '';
        return;
    }
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[selectedStudentIndex];
    if (!student) return;

    // Mostrar perfil ENFERMERA solo vista (oculta form editable)
    document.getElementById('profile-form').style.display = 'none';

    document.getElementById('selected-student-info').innerHTML = `
        <p><strong>Nombre:</strong> ${student.fullName}</p>
        <p><strong>Curso:</strong> ${student.grade}</p>
        <p><strong>Identificación:</strong> ${student.identification}</p>
        <p><strong>Representante:</strong> ${student.legalRepName}</p>
        <p><strong>Teléfono Representante:</strong> ${student.repPhone} <a href="tel:${student.repPhone}"><button class="call-btn">Llamar</button></a></p>
        <p><strong>Número Auxiliar:</strong> ${student.auxPhone} <a href="tel:${student.auxPhone}"><button class="call-btn">Llamar</button></a></p>
        <p><strong>Números Emergencia:</strong><br>
           Bomberos: 04-276-2342 / 04-276-0095 <a href="tel:042762342"><button class="call-btn">Llamar</button></a><br>
           Hospital: 0985568992 <a href="tel:0985568992"><button class="call-btn">Llamar</button></a>
        </p>
        <p><strong>Alergias:</strong> ${student.allergies}</p>
        <p><strong>Enfermedades:</strong> ${student.diseases}</p>
        <p><strong>Medicamentos:</strong> ${student.medications}</p>
    `;

    // Muestra e inicializa otras secciones dependientes del estudiante
    updateVisitHistory();
    updateAlerts();
});

// Guardar signos vitales (solo enfermera)
document.getElementById('vitals-form').addEventListener('submit', e => {
    e.preventDefault();
    if (currentUser !== 'nurse' || selectedStudentIndex === null) return;
    const vitals = {
        pulse: document.getElementById('pulse').value,
        bloodPressure: document.getElementById('blood-pressure').value,
        temperature: document.getElementById('temperature').value,
        respiratoryRate: document.getElementById('respiratory-rate').value,
        symptoms: document.getElementById('symptoms').value,
        procedure: document.getElementById('procedure').value,
        date: new Date().toLocaleString(),
        type: 'vitals',
        studentIndex: selectedStudentIndex
    };
    const history = JSON.parse(localStorage.getItem('visitHistory')) || [];
    history.push(vitals);
    localStorage.setItem('visitHistory', JSON.stringify(history));
    updateVisitHistory();
    alert('Datos guardados exitosamente.');
    e.target.reset();
});

// Mensajería interna (solo enfermera)
document.getElementById('report-withdrawal').addEventListener('click', () => {
    if (currentUser !== 'nurse' || selectedStudentIndex === null) return;
    const message = document.getElementById('withdrawal-message').value;
    if (message.trim() === '') {
        alert('Por favor, escriba el motivo del retiro.');
        return;
    }
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
    alerts.push({
        message: message,
        date: new Date().toLocaleString(),
        studentIndex: selectedStudentIndex
    });
    localStorage.setItem('alerts', JSON.stringify(alerts));
    document.getElementById('message-status').innerText = `Mensaje enviado al representante: "${message}". El estudiante debe ser retirado.`;
    document.getElementById('withdrawal-message').value = '';
    updateAlerts();
});

// Registrar ingreso/egreso (solo enfermera)
document.getElementById('entry-exit-form').addEventListener('submit', e => {
    e.preventDefault();
    if (currentUser !== 'nurse' || selectedStudentIndex === null) return;
    const entryExit = {
        entryDateTime: document.getElementById('entry-datetime').value,
        exitDateTime: document.getElementById('exit-datetime').value,
        withdrawnBy: document.getElementById('withdrawn-by').value,
        date: new Date().toLocaleString(),
        type: 'entry-exit',
        studentIndex: selectedStudentIndex
    };
    const history = JSON.parse(localStorage.getItem('visitHistory')) || [];
    history.push(entryExit);
    localStorage.setItem('visitHistory', JSON.stringify(history));
    updateVisitHistory();
    document.getElementById('exit-status').innerText = 'Ingreso/Egreso registrado exitosamente.';
    e.target.reset();
});

// Actualizar historial de visitas enfermera (filtrado por estudiante)
function updateVisitHistory() {
    if (currentUser !== 'nurse' || selectedStudentIndex === null) return;
    const history = JSON.parse(localStorage.getItem('visitHistory')) || [];
    const list = document.getElementById('visit-history');
    list.innerHTML = '';
    history.filter(h => h.studentIndex == selectedStudentIndex).forEach(visit => {
        const li = document.createElement('li');
        if (visit.type === 'vitals') {
            li.textContent = `${visit.date} - Pulso: ${visit.pulse} bpm, Presión: ${visit.bloodPressure}, Temp: ${visit.temperature}°C, Resp: ${visit.respiratoryRate} rpm. Síntomas: ${visit.symptoms}. Procedimiento: ${visit.procedure}`;
        } else if (visit.type === 'entry-exit') {
            li.textContent = `${visit.date} - Ingreso: ${visit.entryDateTime}, Egreso: ${visit.exitDateTime}, Retirado por: ${visit.withdrawnBy}`;
        }
        list.appendChild(li);
    });
}

// Actualizar alertas para padre o enfermera (filtrado por estudiante)
function updateAlerts() {
    const alertsCont = document.getElementById('alerts-list');
    alertsCont.innerHTML = '';
    const alerts = JSON.parse(localStorage.getItem('alerts')) || [];

    let studentIdx = null;
    if (currentUser === 'parent') studentIdx = currentUserIndex;
    else if (currentUser === 'nurse') studentIdx = selectedStudentIndex;

    if (studentIdx === null) return;

    const filteredAlerts = alerts.filter(a => a.studentIndex == studentIdx);
    filteredAlerts.forEach(alert => {
        const div = document.createElement('div');
        div.style.background = '#fdd';
        div.style.margin = '5px 0';
        div.style.padding = '8px';
        div.style.border = '1px solid #f99';
        div.textContent = `${alert.date}: ${alert.message}`;
        alertsCont.appendChild(div);
    });
}

// Actualizar historial padre (básico y sólo su estudiante)
function updateParentHistory() {
    if (currentUser !== 'parent') return;
    const history = JSON.parse(localStorage.getItem('visitHistory')) || [];
    const list = document.getElementById('parent-history');
    list.innerHTML = '';
    history.filter(h => h.studentIndex == currentUserIndex).forEach(visit => {
        const li = document.createElement('li');
        if (visit.type === 'vitals') {
            li.textContent = `${visit.date} - Síntomas: ${visit.symptoms}. Procedimiento: ${visit.procedure}`;
        } else if (visit.type === 'entry-exit') {
            li.textContent = `${visit.date} - Ingreso: ${visit.entryDateTime}, Egreso: ${visit.exitDateTime}, Retirado por: ${visit.withdrawnBy}`;
        }
        list.appendChild(li);
    });
}

// Olvidaste contraseña (solo Padre)
const forgotPasswordContainer = document.getElementById('forgot-password-container');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const changePasswordBtn = document.getElementById('change-password-btn');
const passwordChangeStatus = document.getElementById('password-change-status');

forgotPasswordLink.addEventListener('click', e => {
    e.preventDefault();
    forgotPasswordForm.style.display =
        forgotPasswordForm.style.display === 'none' ? 'block' : 'none';
});

changePasswordBtn.addEventListener('click', () => {
    const newPass = document.getElementById('new-password').value.trim();
    if (newPass.length < 3) {
        passwordChangeStatus.textContent = 'La contraseña debe tener al menos 3 caracteres.';
        passwordChangeStatus.style.color = 'red';
        return;
    }
    if (currentUser !== 'parent') {
        passwordChangeStatus.textContent = 'Solo el padre puede cambiar su contraseña.';
        passwordChangeStatus.style.color = 'red';
        return;
    }
    const username = document.getElementById('username').value.trim();
    const padre = padres.find(p => p.username === username);
    if (padre) {
        padre.password = newPass;
        passwordChangeStatus.textContent = 'Contraseña actualizada correctamente.';
        passwordChangeStatus.style.color = 'green';
        document.getElementById('new-password').value = '';
    } else {
        passwordChangeStatus.textContent = 'Error al actualizar contraseña.';
        passwordChangeStatus.style.color = 'red';
    }
});

// Inicialización varias
function init() {
    // Ocultar todo app y mostrar sólo login al inicio
    document.getElementById('app').style.display = 'none';
    document.getElementById('nav-parent').style.display = 'none';
    document.getElementById('nav-nurse').style.display = 'none';
    document.getElementById('legal-framework').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('vitals').style.display = 'none';
    document.getElementById('messaging').style.display = 'none';
    document.getElementById('entry-exit').style.display = 'none';
    document.getElementById('alerts').style.display = 'none';
    document.getElementById('history').style.display = 'none';
    document.getElementById('profile-form').style.display = 'none';
    document.getElementById('selected-student-info').innerHTML = '';

    // Eventos de navegación padre
    document.querySelectorAll('#nav-parent button').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('onclick').match(/'(.*?)'/)[1];
            showSection(id);
            if (id === 'profile') loadParentStudentProfile();
            if (id === 'alerts') updateAlerts();
            if (id === 'history') updateParentHistory();
        });
    });

    // Eventos navegación nurse
    document.querySelectorAll('#nav-nurse button').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('onclick').match(/'(.*?)'/)[1];
            showSection(id);
        });
    });
}

init();