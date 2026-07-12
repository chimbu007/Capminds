let state = {
  appointments: [],
  currentDate: new Date(2023, 0, 18),
  selectedDate: new Date(2023, 0, 18),
  activeTab: 'calendar',
  sidebarCollapsed: false,
  editingId: null,
  filters: {
    patient: '',
    doctor: '',
    dateFrom: '',
    dateTo: '',
    calendarDoctor: 'James Marry'
  }
};

let DOM = {};

const DOCTORS = ['James Marry', 'Sarah Connor', 'Robert Chen', 'Lisa Ray'];

const SEED_APPOINTMENTS = [
  {
    id: 'apt-1674032400000-1',
    patient: 'Henry James',
    doctor: 'James Marry',
    hospital: 'Salus Center (General Hospital)',
    specialty: 'Dermatology',
    date: '2023-01-18',
    time: '12:00 PM - 12:15 PM',
    reason: 'Routine dermatologist review for skin condition.',
    status: 'Arrived'
  },
  {
    id: 'apt-1674032400000-2',
    patient: 'Henry James',
    doctor: 'James Marry',
    hospital: 'Ultracare (General Hospital)',
    specialty: 'Dermatology',
    date: '2023-01-18',
    time: '12:00 AM - 12:15 AM',
    reason: 'Follow-up consultation.',
    status: 'Arrived'
  },
  {
    id: 'apt-1675328400000-3',
    patient: 'Henry James',
    doctor: 'James Marry',
    hospital: 'Ultracare (General Hospital)',
    specialty: 'Dermatology',
    date: '2023-02-02',
    time: '09:00 AM - 09:15 AM',
    reason: 'Check-up on skin healing progress.',
    status: 'Arrived'
  },
  {
    id: 'apt-1674205200000-4',
    patient: 'Jane Doe',
    doctor: 'Sarah Connor',
    hospital: 'City Health Clinic',
    specialty: 'Cardiology',
    date: '2023-01-20',
    time: '10:30 AM - 10:45 AM',
    reason: 'Follow-up on ECG monitor reports.',
    status: 'Scheduled'
  },
  {
    id: 'apt-1674464400000-5',
    patient: 'Emily Watson',
    doctor: 'Robert Chen',
    hospital: 'Salus Center (General Hospital)',
    specialty: 'Neurology',
    date: '2023-01-23',
    time: '02:00 PM - 02:15 PM',
    reason: 'Chronic migraine consultation.',
    status: 'Scheduled'
  }
];

function loadAppointments() {
  try {
    const data = localStorage.getItem('capminds_appointments');
    if (data) {
      state.appointments = JSON.parse(data);
    } else {
      state.appointments = [...SEED_APPOINTMENTS];
      saveToLocalStorage();
    }
  } catch (e) {
    console.warn("localStorage is not accessible. Using in-memory state instead.", e);
    state.appointments = [...SEED_APPOINTMENTS];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('capminds_appointments', JSON.stringify(state.appointments));
  } catch (e) {
    console.warn("Could not save to localStorage.", e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {

  DOM = {
    sidebar: document.getElementById('app-sidebar') || document.querySelector('.app-sidebar') || document.querySelector('aside'),
    sidebarToggle: document.getElementById('btn-sidebar-toggle') || document.querySelector('.sidebar-toggle') || document.querySelector('.btn-sidebar-toggle'),
    sidebarToggleIcon: document.getElementById('sidebar-toggle-icon') || document.querySelector('.sidebar-toggle-icon'),
    navCalendar: document.getElementById('nav-calendar') || document.querySelector('[data-tab="calendar"]'),
    navDashboard: document.getElementById('nav-dashboard') || document.querySelector('[data-tab="dashboard"]'),
    calendarPage: document.getElementById('calendar-page') || document.getElementById('calendar-view'),
    dashboardPage: document.getElementById('dashboard-page') || document.getElementById('dashboard-view'),

    calDateLabel: document.getElementById('cal-date-label') || document.querySelector('.cal-date-label'),
    calPrev: document.getElementById('btn-cal-prev') || document.querySelector('.btn-cal-prev'),
    calNext: document.getElementById('btn-cal-next') || document.querySelector('.btn-cal-next'),
    calToday: document.getElementById('btn-cal-today') || document.querySelector('.btn-cal-today'),
    calDoctorContext: document.getElementById('calendar-doctor-context'),
    calendarGridDays: document.getElementById('calendar-grid-days') || document.querySelector('.calendar-grid-days'),
    mobileDayDetails: document.getElementById('mobile-day-details'),
    mobileDayTitle: document.getElementById('mobile-day-title'),
    mobileAptList: document.getElementById('mobile-apt-list'),

    filterPatient: document.getElementById('filter-patient'),
    filterDoctor: document.getElementById('filter-doctor'),
    filterDateFrom: document.getElementById('filter-date-from'),
    filterDateTo: document.getElementById('filter-date-to'),
    btnFilterUpdate: document.getElementById('btn-filter-update'),
    appointmentsTableBody: document.getElementById('appointments-table-body') || document.querySelector('tbody'),

    modal: document.getElementById('appointment-modal') || document.querySelector('.modal-overlay') || document.querySelector('.modal'),
    modalTitle: document.getElementById('modal-title-text') || document.querySelector('.modal-title'),
    btnOpenBooking: document.getElementById('btn-open-booking') || document.querySelector('.btn-open-booking') || document.getElementById('btn-sidebar-booking'),
    btnCloseModal: document.getElementById('btn-close-modal') || document.querySelector('.btn-close-modal') || document.querySelector('.close-modal'),
    btnCancelBooking: document.getElementById('btn-cancel-booking') || document.querySelector('.btn-cancel') || document.querySelector('.btn-cancel-booking'),
    btnSaveBooking: document.getElementById('btn-save-booking') || document.querySelector('.btn-save') || document.querySelector('.btn-save-booking'),
    form: document.getElementById('appointment-form') || document.querySelector('.modal-form') || document.querySelector('form'),

    aptPatient: document.getElementById('apt-patient') || document.querySelector('[id*="patient"]'),
    aptDoctor: document.getElementById('apt-doctor') || document.querySelector('[id*="doctor"]'),
    aptHospital: document.getElementById('apt-hospital') || document.querySelector('[id*="hospital"]'),
    aptSpecialty: document.getElementById('apt-specialty-select') || document.getElementById('apt-specialty') || document.getElementById('apt-speciality') || document.querySelector('[id*="special"]'),
    aptDate: document.getElementById('apt-date') || document.querySelector('[type="date"]'),
    aptTime: document.getElementById('apt-time') || document.querySelector('[id*="time"]'),
    aptReason: document.getElementById('apt-reason') || document.querySelector('textarea')
  };

  const nullElements = [];
  for (const [key, value] of Object.entries(DOM)) {
    if (value === null) {
      nullElements.push(key);
    }
  }
  if (nullElements.length > 0) {
    console.warn("Capminds DOM Cache Warning: The following elements are missing from HTML: " + nullElements.join(", "));
  }

  loadAppointments();
  initUI();
  bindEvents();
  render();
}

function initUI() {

  DOM.filterDateFrom.value = state.filters.dateFrom;
  DOM.filterDateTo.value = state.filters.dateTo;

  highlightTodayWeekday();
}

function highlightTodayWeekday() {
  const FRIDAY_INDEX = 5;
  const dayHeaders = document.querySelectorAll('.calendar-day-header');
  dayHeaders.forEach((el, i) => {
    if (i === FRIDAY_INDEX) {
      el.classList.add('current-weekday');
    } else {
      el.classList.remove('current-weekday');
    }
  });
}

function bindEvents() {

  DOM.sidebarToggle.addEventListener('click', toggleSidebar);

  DOM.navCalendar.addEventListener('click', () => switchTab('calendar'));
  DOM.navDashboard.addEventListener('click', () => switchTab('dashboard'));

  DOM.calPrev.addEventListener('click', navigatePrevMonth);
  DOM.calNext.addEventListener('click', navigateNextMonth);
  DOM.calToday.addEventListener('click', navigateToday);
  DOM.calDoctorContext.addEventListener('click', rotateDoctorContext);

  DOM.btnFilterUpdate.addEventListener('click', applyDashboardFilters);

  DOM.filterPatient.addEventListener('input', () => {
    state.filters.patient = DOM.filterPatient.value.trim();
    render();
  });
  DOM.filterDoctor.addEventListener('input', () => {
    state.filters.doctor = DOM.filterDoctor.value.trim();
    render();
  });

  DOM.btnOpenBooking.addEventListener('click', () => openBookingModal());
  DOM.btnCloseModal.addEventListener('click', closeBookingModal);
  DOM.btnCancelBooking.addEventListener('click', closeBookingModal);
  DOM.btnSaveBooking.addEventListener('click', handleFormSubmit);

  DOM.modal.addEventListener('click', (e) => {
    if (e.target === DOM.modal) {
      closeBookingModal();
    }
  });

  [DOM.aptPatient, DOM.aptDoctor, DOM.aptHospital, DOM.aptSpecialty, DOM.aptDate, DOM.aptTime].forEach(input => {
    input.addEventListener('change', () => clearFieldError(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  DOM.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
}

function switchTab(tab) {
  state.activeTab = tab;
  
  DOM.navCalendar.classList.toggle('active', tab === 'calendar');
  DOM.navDashboard.classList.toggle('active', tab === 'dashboard');
  
  DOM.calendarPage.classList.toggle('active', tab === 'calendar');
  DOM.dashboardPage.classList.toggle('active', tab === 'dashboard');
  
  render();
}

function navigatePrevMonth() {
  state.currentDate.setMonth(state.currentDate.getMonth() - 1);

  const targetDay = Math.min(state.selectedDate.getDate(), new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 0).getDate());
  state.selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), targetDay);
  render();
}

function navigateNextMonth() {
  state.currentDate.setMonth(state.currentDate.getMonth() + 1);

  const targetDay = Math.min(state.selectedDate.getDate(), new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 0).getDate());
  state.selectedDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), targetDay);
  render();
}

function navigateToday() {
  state.currentDate = new Date();
  state.selectedDate = new Date();
  render();
}

function rotateDoctorContext() {

  const currentIndex = DOCTORS.indexOf(state.filters.calendarDoctor);
  if (currentIndex === -1) {
    state.filters.calendarDoctor = DOCTORS[0];
  } else if (currentIndex === DOCTORS.length - 1) {
    state.filters.calendarDoctor = 'All Doctors';
  } else {
    state.filters.calendarDoctor = DOCTORS[currentIndex + 1];
  }
  
  render();
}

function applyDashboardFilters() {
  state.filters.patient = DOM.filterPatient.value.trim();
  state.filters.doctor = DOM.filterDoctor.value.trim();
  state.filters.dateFrom = DOM.filterDateFrom.value;
  state.filters.dateTo = DOM.filterDateTo.value;
  
  render();
}

function getFilteredAppointments() {
  return state.appointments.filter(apt => {

    if (state.filters.patient && !apt.patient.toLowerCase().includes(state.filters.patient.toLowerCase())) {
      return false;
    }

    if (state.filters.doctor && !apt.doctor.toLowerCase().includes(state.filters.doctor.toLowerCase())) {
      return false;
    }

    if (state.filters.dateFrom && apt.date < state.filters.dateFrom) {
      return false;
    }
    if (state.filters.dateTo && apt.date > state.filters.dateTo) {
      return false;
    }
    
    return true;
  });
}

function openBookingModal(appointmentId = null) {
  state.editingId = appointmentId;
  DOM.form.reset();

  [DOM.aptPatient, DOM.aptDoctor, DOM.aptHospital, DOM.aptSpecialty, DOM.aptDate, DOM.aptTime].forEach(input => {
    clearFieldError(input);
  });
  
  if (appointmentId) {

    const apt = state.appointments.find(a => a.id === appointmentId);
    if (apt) {
      DOM.modalTitle.textContent = 'Edit Appointment';
      DOM.aptPatient.value = apt.patient;
      DOM.aptDoctor.value = apt.doctor;
      DOM.aptHospital.value = apt.hospital;
      DOM.aptSpecialty.value = apt.specialty;
      DOM.aptDate.value = apt.date;
      DOM.aptTime.value = apt.time;
      DOM.aptReason.value = apt.reason;
    }
  } else {

    DOM.modalTitle.textContent = 'Schedule Appointment';

    const year = state.currentDate.getFullYear();
    const month = String(state.currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(state.selectedDate.getDate()).padStart(2, '0');
    DOM.aptDate.value = `${year}-${month}-${day}`;
  }
  
  DOM.modal.classList.add('active');
}

function closeBookingModal() {
  DOM.modal.classList.remove('active');
  state.editingId = null;
}

function setFieldError(element, message) {
  element.classList.add('input-error');
  const errorContainer = document.getElementById(`error-${element.id}`) || document.getElementById(`error-${element.id.replace('specialty', 'speciality')}`);
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

function clearFieldError(element) {
  element.classList.remove('input-error');
  const errorContainer = document.getElementById(`error-${element.id}`) || document.getElementById(`error-${element.id.replace('specialty', 'speciality')}`);
  if (errorContainer) {
    errorContainer.style.display = 'none';
  }
}

function validateForm() {
  let isValid = true;

  const fields = [
    { el: DOM.aptPatient, name: 'Patient name' },
    { el: DOM.aptDoctor, name: 'Doctor name' },
    { el: DOM.aptHospital, name: 'Hospital name' },
    { el: DOM.aptSpecialty, name: 'Specialty' },
    { el: DOM.aptDate, name: 'Date' },
    { el: DOM.aptTime, name: 'Time' }
  ];
  
  fields.forEach(field => {
    if (!field.el.value || field.el.value.trim() === '') {
      setFieldError(field.el, `${field.name} is required.`);
      isValid = false;
    } else {
      clearFieldError(field.el);
    }
  });
  
  return isValid;
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const aptData = {
    patient: DOM.aptPatient.value,
    doctor: DOM.aptDoctor.value,
    hospital: DOM.aptHospital.value,
    specialty: DOM.aptSpecialty.value,
    date: DOM.aptDate.value,
    time: DOM.aptTime.value,
    reason: DOM.aptReason.value.trim()
  };
  
  if (state.editingId) {

    const index = state.appointments.findIndex(a => a.id === state.editingId);
    if (index !== -1) {
      state.appointments[index] = {
        ...state.appointments[index],
        ...aptData
      };
    }
  } else {

    const newApt = {
      id: 'apt-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      ...aptData,
      status: 'Scheduled'
    };
    state.appointments.push(newApt);
  }
  
  saveToLocalStorage();
  closeBookingModal();
  render();
}

function deleteAppointment(id) {
  if (confirm('Are you sure you want to delete this appointment?')) {
    state.appointments = state.appointments.filter(a => a.id !== id);
    saveToLocalStorage();
    render();
  }
}

function render() {
  if (state.activeTab === 'calendar') {
    renderCalendar();
  } else {
    renderDashboard();
  }
}

function renderCalendar() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const selectedDayLabel = `${monthsList[month]} ${state.selectedDate.getDate()}, ${year}`;
  DOM.calDateLabel.querySelector('span').textContent = selectedDayLabel;

  highlightTodayWeekday();

  DOM.calDoctorContext.textContent = state.filters.calendarDoctor;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();
  let dayCellsHTML = '';

  for (let i = firstDayIndex; i > 0; i--) {
    const day = prevMonthDays - i + 1;
    const dateStr = getISODateString(year, month - 1, day);
    dayCellsHTML += renderCalendarCell(day, dateStr, true);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = getISODateString(year, month, day);
    dayCellsHTML += renderCalendarCell(day, dateStr, false);
  }

  const totalCellsWritten = firstDayIndex + daysInMonth;
  const targetGridSize = totalCellsWritten <= 35 ? 35 : 42;
  const remainingCells = targetGridSize - totalCellsWritten;
  for (let day = 1; day <= remainingCells; day++) {
    const dateStr = getISODateString(year, month + 1, day);
    dayCellsHTML += renderCalendarCell(day, dateStr, true);
  }
  
  DOM.calendarGridDays.innerHTML = dayCellsHTML;

  const cells = DOM.calendarGridDays.querySelectorAll('.calendar-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (e.target.closest('.btn-quick-action') || e.target.closest('.calendar-appointment')) {
        return;
      }
      const targetDate = new Date(cell.dataset.date);
      state.selectedDate = targetDate;
      state.currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      renderCalendar();
    });
  });

  DOM.calendarGridDays.querySelectorAll('.btn-quick-action.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openBookingModal(btn.dataset.id);
    });
  });
  DOM.calendarGridDays.querySelectorAll('.btn-quick-action.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteAppointment(btn.dataset.id);
    });
  });

  renderMobileDetails();
}

function renderCalendarCell(day, dateStr, isOtherMonth) {
  const cellDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  
  const isToday = cellDate.getDate() === today.getDate() &&
                  cellDate.getMonth() === today.getMonth() &&
                  cellDate.getFullYear() === today.getFullYear();
                  
  const isSelected = cellDate.getDate() === state.selectedDate.getDate() &&
                      cellDate.getMonth() === state.selectedDate.getMonth() &&
                      cellDate.getFullYear() === state.selectedDate.getFullYear();

  let cellApts = state.appointments.filter(a => a.date === dateStr);

  if (state.filters.calendarDoctor !== 'All Doctors') {
    cellApts = cellApts.filter(a => a.doctor === state.filters.calendarDoctor);
  }

  let classes = 'calendar-cell';
  if (isOtherMonth) classes += ' other-month';
  if (isToday) classes += ' today-cell';
  if (isSelected) classes += ' selected-cell';

  let displayDay = String(day);
  if (day === 1 || (isToday && day === today.getDate() && cellDate.getMonth() === today.getMonth() && cellDate.getDate() === 1)) {
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    displayDay = `${monthsShort[cellDate.getMonth()]} ${day}`;
  }
  
  let aptsHTML = '';
  cellApts.forEach(apt => {
    aptsHTML += `
      <div class="calendar-appointment" title="${apt.patient} (${apt.status}) ${apt.time}">
        <div class="appointment-meta-top">
          <span class="apt-walk-icon">
            <img src="images/walk.png" class="walk-icon-img" alt="Walk" width="12" height="12">
          </span>
          <span class="apt-label">${apt.patient} (${apt.status}) ${apt.time} -</span>
        </div>
        <div class="appointment-actions-overlay">
          <button class="btn-quick-action edit" data-id="${apt.id}" title="Edit">
            <svg width="16" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13.5 2.5a2.121 2.121 0 1 1 3 3L7 15l-4 1 1-4 9.5-9.5z"></path>
              <line x1="3" y1="21" x2="21" y2="21"></line>
            </svg>
          </button>
          <button class="btn-quick-action delete" data-id="${apt.id}" title="Delete">
            <svg width="16" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
          <button class="btn-quick-action view-detail" data-id="${apt.id}" title="View Detail">
            <svg width="16" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  
  return `
    <div class="${classes}" data-date="${dateStr}">
      <span class="day-number">${displayDay}</span>
      ${aptsHTML}
    </div>
  `;
}

function getISODateString(year, month, day) {
  const d = new Date(year, month, day);
  const yStr = d.getFullYear();
  const mStr = String(d.getMonth() + 1).padStart(2, '0');
  const dStr = String(d.getDate()).padStart(2, '0');
  return `${yStr}-${mStr}-${dStr}`;
}

function renderMobileDetails() {
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dateStr = getISODateString(state.selectedDate.getFullYear(), state.selectedDate.getMonth(), state.selectedDate.getDate());
  DOM.mobileDayTitle.textContent = `Appointments on ${monthsList[state.selectedDate.getMonth()]} ${state.selectedDate.getDate()}, ${state.selectedDate.getFullYear()}`;
  
  let cellApts = state.appointments.filter(a => a.date === dateStr);
  if (state.filters.calendarDoctor !== 'All Doctors') {
    cellApts = cellApts.filter(a => a.doctor === state.filters.calendarDoctor);
  }
  
  if (cellApts.length === 0) {
    DOM.mobileAptList.innerHTML = `<div class="empty-table-text">No appointments scheduled for this date.</div>`;
    return;
  }
  
  let listHTML = '';
  cellApts.forEach(apt => {
    listHTML += `
      <div class="mobile-apt-item">
        <div class="apt-row">
          <span class="apt-label">Patient:</span>
          <span class="apt-val" style="color:var(--primary-color); font-weight:600">${apt.patient}</span>
        </div>
        <div class="apt-row">
          <span class="apt-label">Doctor:</span>
          <span class="apt-val" style="color:var(--primary-color)">${apt.doctor}</span>
        </div>
        <div class="apt-row">
          <span class="apt-label">Hospital:</span>
          <span class="apt-val">${apt.hospital}</span>
        </div>
        <div class="apt-row">
          <span class="apt-label">Specialty:</span>
          <span class="apt-val">${apt.specialty}</span>
        </div>
        <div class="apt-row">
          <span class="apt-label">Time:</span>
          <span class="apt-val" style="font-weight:500; color:var(--success-color)">${apt.time}</span>
        </div>
        <div class="apt-row">
          <span class="apt-label">Reason:</span>
          <span class="apt-val">${apt.reason || 'None provided'}</span>
        </div>
        <div class="apt-actions">
          <button class="btn-quick-action edit" data-id="${apt.id}" style="color:var(--primary-color)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button class="btn-quick-action delete" data-id="${apt.id}" style="color:var(--danger-color)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    `;
  });
  
  DOM.mobileAptList.innerHTML = listHTML;

  DOM.mobileAptList.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => openBookingModal(btn.dataset.id));
  });
  DOM.mobileAptList.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => deleteAppointment(btn.dataset.id));
  });
}

function renderDashboard() {
  const filtered = getFilteredAppointments();
  
  if (filtered.length === 0) {
    DOM.appointmentsTableBody.innerHTML = `
      <tr class="empty-table-row">
        <td colspan="7" class="empty-table-text">No appointments match the selected search criteria.</td>
      </tr>
    `;
    return;
  }
  
  let rowsHTML = '';
  filtered.forEach(apt => {

    const parts = apt.date.split('-');
    const formattedDate = (parts.length === 3) ? `${parts[2]}/${parts[1]}/${parts[0]}` : apt.date;
    
    rowsHTML += `
      <tr>
        <td><a href="#" class="patient-link" data-id="${apt.id}">${apt.patient}</a></td>
        <td><a href="#" class="doctor-link" data-id="${apt.id}">${apt.doctor}</a></td>
        <td>${apt.hospital}</td>
        <td>${apt.specialty}</td>
        <td>${formattedDate}</td>
        <td style="color: #1e70e6; font-weight: 500;">${apt.time}</td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action edit" data-id="${apt.id}" title="Edit Appointment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13.5 2.5a2.121 2.121 0 1 1 3 3L7 15l-4 1 1-4 9.5-9.5z"></path>
                <line x1="3" y1="21" x2="21" y2="21"></line>
              </svg>
            </button>
            <button class="btn-table-action delete" data-id="${apt.id}" title="Delete Appointment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  const MIN_ROWS = 8;
  const emptyRowsNeeded = Math.max(0, MIN_ROWS - filtered.length);
  for (let i = 0; i < emptyRowsNeeded; i++) {
    rowsHTML += `<tr class="empty-filler-row"><td colspan="7"></td></tr>`;
  }

  DOM.appointmentsTableBody.innerHTML = rowsHTML;

  DOM.appointmentsTableBody.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', () => openBookingModal(btn.dataset.id));
  });
  DOM.appointmentsTableBody.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => deleteAppointment(btn.dataset.id));
  });

  DOM.appointmentsTableBody.querySelectorAll('.patient-link, .doctor-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal(link.dataset.id);
    });
  });
}
