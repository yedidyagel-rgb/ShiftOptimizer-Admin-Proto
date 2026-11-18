import './index.css';

type ViewId = 'rules' | 'schedule' | 'approvals' | 'team';

interface BusinessRule {
  id: string;
  description: string;
  category: string;
  scope: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  maxWeeklyHours: number;
  status: 'Active' | 'Invited';
}

interface ShiftAssignment {
  id: string;
  day: DayName;
  slot: ShiftSlotName;
  employeeId: string;
  role: string;
}

interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterShift: string;
  targetId: string;
  targetShift: string;
  day: DayName;
  slot: ShiftSlotName;
}

type DayName = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type ShiftSlotName = 'Morning' | 'Afternoon' | 'Evening';

const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFT_SLOTS: { name: ShiftSlotName; hours: string }[] = [
  { name: 'Morning', hours: '08:00–14:00' },
  { name: 'Afternoon', hours: '14:00–20:00' },
  { name: 'Evening', hours: '18:00–23:00' },
];

const ROLES = ['Cashier', 'Shift Supervisor', 'Barista', 'Stocker', 'Floor Associate'];

interface ParsedConstraintPreview {
  mode: 'create' | 'edit';
  editingRuleId?: string;
  originalPrompt: string;
  description: string;
  category: string;
  scope: string;
}

interface State {
  activeView: ViewId;
  nlInput: string;
  nlError: string;
  parsedModal: ParsedConstraintPreview | null;
  publishConfirmOpen: boolean;
  addEmployeeModalOpen: boolean;
  editingShiftId: string | null;
  toastMessage: string | null;
  rules: BusinessRule[];
  employees: Employee[];
  shifts: ShiftAssignment[];
  swaps: ShiftSwapRequest[];
}

const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Michal',
    lastName: 'Cohen',
    email: 'michal.cohen@shiftopt.io',
    phone: '555-0104',
    role: 'Cashier',
    maxWeeklyHours: 24,
    status: 'Active',
  },
  {
    id: 'emp-2',
    firstName: 'Daniel',
    lastName: 'Levi',
    email: 'daniel.levi@shiftopt.io',
    phone: '555-0112',
    role: 'Shift Supervisor',
    maxWeeklyHours: 40,
    status: 'Active',
  },
  {
    id: 'emp-3',
    firstName: 'Noa',
    lastName: 'Mizrahi',
    email: 'noa.mizrahi@shiftopt.io',
    phone: '555-0118',
    role: 'Cashier',
    maxWeeklyHours: 32,
    status: 'Active',
  },
  {
    id: 'emp-4',
    firstName: 'Yael',
    lastName: 'Avraham',
    email: 'yael.avraham@shiftopt.io',
    phone: '555-0125',
    role: 'Barista',
    maxWeeklyHours: 28,
    status: 'Active',
  },
  {
    id: 'emp-5',
    firstName: 'Omer',
    lastName: 'Shapira',
    email: 'omer.shapira@shiftopt.io',
    phone: '555-0131',
    role: 'Stocker',
    maxWeeklyHours: 36,
    status: 'Active',
  },
  {
    id: 'emp-6',
    firstName: 'Tamar',
    lastName: 'Katz',
    email: 'tamar.katz@shiftopt.io',
    phone: '555-0149',
    role: 'Cashier',
    maxWeeklyHours: 24,
    status: 'Invited',
  },
];

const initialRules: BusinessRule[] = [
  {
    id: 'rule-1',
    description: 'Require at least 2 Cashiers on Tuesday Morning and Afternoon shifts',
    category: 'Coverage',
    scope: 'Tuesday',
  },
  {
    id: 'rule-2',
    description: 'Limit Cashier assignments to a maximum of 4 shifts per week',
    category: 'Workload',
    scope: 'Weekly',
  },
  {
    id: 'rule-3',
    description: 'Assign 1 Shift Supervisor to every Evening shift',
    category: 'Supervision',
    scope: 'Daily',
  },
  {
    id: 'rule-4',
    description: 'Maintain at least 10 hours of rest between Evening and next-day Morning shifts',
    category: 'Rest Period',
    scope: 'All Roles',
  },
];

const initialShifts: ShiftAssignment[] = [
  // Morning
  { id: 'sh-1', day: 'Mon', slot: 'Morning', employeeId: 'emp-1', role: 'Cashier' },
  { id: 'sh-2', day: 'Tue', slot: 'Morning', employeeId: 'emp-1', role: 'Cashier' },
  { id: 'sh-3', day: 'Tue', slot: 'Morning', employeeId: 'emp-3', role: 'Cashier' },
  { id: 'sh-4', day: 'Wed', slot: 'Morning', employeeId: 'emp-4', role: 'Barista' },
  { id: 'sh-5', day: 'Thu', slot: 'Morning', employeeId: 'emp-1', role: 'Cashier' },
  { id: 'sh-6', day: 'Fri', slot: 'Morning', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-7', day: 'Sat', slot: 'Morning', employeeId: 'emp-5', role: 'Stocker' },
  { id: 'sh-8', day: 'Sun', slot: 'Morning', employeeId: 'emp-3', role: 'Cashier' },
  // Afternoon
  { id: 'sh-9', day: 'Mon', slot: 'Afternoon', employeeId: 'emp-4', role: 'Barista' },
  { id: 'sh-10', day: 'Tue', slot: 'Afternoon', employeeId: 'emp-1', role: 'Cashier' },
  { id: 'sh-11', day: 'Wed', slot: 'Afternoon', employeeId: 'emp-3', role: 'Cashier' },
  { id: 'sh-12', day: 'Thu', slot: 'Afternoon', employeeId: 'emp-5', role: 'Stocker' },
  { id: 'sh-13', day: 'Fri', slot: 'Afternoon', employeeId: 'emp-4', role: 'Barista' },
  { id: 'sh-14', day: 'Sat', slot: 'Afternoon', employeeId: 'emp-1', role: 'Cashier' },
  { id: 'sh-15', day: 'Sun', slot: 'Afternoon', employeeId: 'emp-5', role: 'Stocker' },
  // Evening
  { id: 'sh-16', day: 'Mon', slot: 'Evening', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-17', day: 'Tue', slot: 'Evening', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-18', day: 'Wed', slot: 'Evening', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-19', day: 'Thu', slot: 'Evening', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-20', day: 'Fri', slot: 'Evening', employeeId: 'emp-3', role: 'Cashier' },
  { id: 'sh-21', day: 'Sat', slot: 'Evening', employeeId: 'emp-2', role: 'Shift Supervisor' },
  { id: 'sh-22', day: 'Sun', slot: 'Evening', employeeId: 'emp-4', role: 'Barista' },
];

const initialSwaps: ShiftSwapRequest[] = [
  {
    id: 'swap-1',
    requesterId: 'emp-1',
    requesterShift: 'Thu · Morning (08:00–14:00)',
    targetId: 'emp-3',
    targetShift: 'Wed · Afternoon (14:00–20:00)',
    day: 'Thu',
    slot: 'Morning',
  },
  {
    id: 'swap-2',
    requesterId: 'emp-4',
    requesterShift: 'Fri · Afternoon (14:00–20:00)',
    targetId: 'emp-5',
    targetShift: 'Sat · Morning (08:00–14:00)',
    day: 'Fri',
    slot: 'Afternoon',
  },
  {
    id: 'swap-3',
    requesterId: 'emp-2',
    requesterShift: 'Thu · Evening (18:00–23:00)',
    targetId: 'emp-3',
    targetShift: 'Fri · Evening (18:00–23:00)',
    day: 'Thu',
    slot: 'Evening',
  },
];

const state: State = {
  activeView: 'rules',
  nlInput: '',
  nlError: '',
  parsedModal: null,
  publishConfirmOpen: false,
  addEmployeeModalOpen: false,
  editingShiftId: null,
  toastMessage: null,
  rules: [...initialRules],
  employees: [...initialEmployees],
  shifts: [...initialShifts],
  swaps: [...initialSwaps],
};

let toastTimer: number | undefined;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderToastOnly(): void {
  const toastHost = document.getElementById('toast-host');
  if (!toastHost) return;
  toastHost.innerHTML = renderToast();
}

function showToast(message: string): void {
  state.toastMessage = message;
  render();
  if (toastTimer !== undefined) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    state.toastMessage = null;
    renderToastOnly();
  }, 3500);
}

function getEmployeeById(id: string): Employee | undefined {
  return state.employees.find((emp) => emp.id === id);
}

function parseNaturalLanguageConstraint(rawInput: string): ParsedConstraintPreview {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  const dayMap: Record<string, string> = {
    monday: 'Monday',
    mon: 'Monday',
    tuesday: 'Tuesday',
    tue: 'Tuesday',
    wednesday: 'Wednesday',
    wed: 'Wednesday',
    thursday: 'Thursday',
    thu: 'Thursday',
    friday: 'Friday',
    fri: 'Friday',
    saturday: 'Saturday',
    sat: 'Saturday',
    sunday: 'Sunday',
    sun: 'Sunday',
    weekend: 'Sat & Sun',
    weekends: 'Sat & Sun',
  };

  let detectedScope = 'Weekly';
  for (const [token, label] of Object.entries(dayMap)) {
    if (new RegExp(`\\b${token}\\b`, 'i').test(lower)) {
      detectedScope = label;
      break;
    }
  }

  let detectedCategory = 'Coverage';
  if (/\b(max|limit|hours|shifts|overtime|cap|no more than)\b/i.test(lower)) {
    detectedCategory = 'Workload';
  } else if (/\b(rest|turnaround|between|break|consecutive)\b/i.test(lower)) {
    detectedCategory = 'Rest Period';
  } else if (/\b(supervisor|manager|lead)\b/i.test(lower)) {
    detectedCategory = 'Supervision';
  }

  const countMatch = text.match(/\b(\d+)\b/);
  const roleMatch = ROLES.find((r) => lower.includes(r.toLowerCase()));

  let formattedDescription = text;
  if (countMatch && roleMatch && detectedCategory === 'Coverage') {
    const count = Number(countMatch[1]);
    const plural = count === 1 ? roleMatch : `${roleMatch}s`;
    formattedDescription = `Require ${count} ${plural} scheduled on ${detectedScope} shifts`;
  } else if (!text.endsWith('.')) {
    formattedDescription = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return {
    mode: 'create',
    originalPrompt: text,
    description: formattedDescription,
    category: detectedCategory,
    scope: detectedScope,
  };
}

function computeSchedulingAlerts(): string[] {
  const alerts: string[] = [];

  // Check shift counts against 4-shift soft limit for Cashiers (and max weekly hours)
  const shiftCounts = new Map<string, number>();
  for (const shift of state.shifts) {
    shiftCounts.set(shift.employeeId, (shiftCounts.get(shift.employeeId) || 0) + 1);
  }

  for (const emp of state.employees) {
    if (emp.status !== 'Active') continue;
    const count = shiftCounts.get(emp.id) || 0;
    if (emp.id === 'emp-1' && count > 4) {
      alerts.push(`Employee ${emp.firstName} assigned ${count} shifts instead of 4`);
    } else if (emp.id !== 'emp-1' && count > 5) {
      alerts.push(`Employee ${emp.firstName} ${emp.lastName} assigned ${count} shifts (exceeds target of 5)`);
    }
  }

  // Check consecutive Evening -> next-day Morning turnaround
  for (let i = 0; i < DAYS.length - 1; i++) {
    const today = DAYS[i];
    const tomorrow = DAYS[i + 1];
    const eveningWorkers = state.shifts.filter((s) => s.day === today && s.slot === 'Evening');
    const morningWorkers = state.shifts.filter((s) => s.day === tomorrow && s.slot === 'Morning');

    for (const ev of eveningWorkers) {
      const clash = morningWorkers.find((m) => m.employeeId === ev.employeeId);
      if (clash) {
        const emp = getEmployeeById(ev.employeeId);
        if (emp) {
          alerts.push(
            `Employee ${emp.firstName} scheduled back-to-back Evening (${today}) and Morning (${tomorrow}) shifts`
          );
        }
      }
    }
  }

  return alerts;
}

function runScheduleOptimization(): void {
  // Resolve Michal's 5th shift by reassigning Sat Afternoon to Noa,
  // and resolve Daniel's Thu Evening -> Fri Morning turnaround by reassigning Fri Morning to Omer.
  state.shifts = state.shifts.map((shift) => {
    if (shift.id === 'sh-14' && shift.employeeId === 'emp-1') {
      return { ...shift, employeeId: 'emp-3', role: 'Cashier' };
    }
    if (shift.id === 'sh-6' && shift.employeeId === 'emp-2') {
      return { ...shift, employeeId: 'emp-5', role: 'Stocker' };
    }
    return shift;
  });

  state.editingShiftId = null;
  showToast('Optimized schedule generated');
}

function renderSidebar(): string {
  const navItems: { id: ViewId; label: string }[] = [
    { id: 'rules', label: 'AI Constraint Configuration' },
    { id: 'schedule', label: 'Schedule Generation & Editing' },
    { id: 'approvals', label: 'Pending Approvals' },
    { id: 'team', label: 'Team Management' },
  ];

  return `
    <aside class="w-full md:w-64 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
      <div class="px-5 py-4 md:px-6 md:py-6 border-b border-slate-200">
        <span class="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
          ShiftOptimizer
        </span>
      </div>
      <nav aria-label="Primary" class="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto">
        ${navItems
          .map((item) => {
            const isActive = state.activeView === item.id;
            return `
              <button
                type="button"
                data-nav-view="${item.id}"
                aria-current="${isActive ? 'page' : 'false'}"
                class="text-left px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }"
              >
                ${escapeHtml(item.label)}
              </button>
            `;
          })
          .join('')}
      </nav>
    </aside>
  `;
}

function renderRulesView(): string {
  return `
    <section class="space-y-8">
      <header>
        <h1 class="font-display text-2xl font-bold tracking-tight text-slate-900">
          AI Constraint Configuration
        </h1>
        <p class="mt-1 text-sm text-slate-600">
          Enter scheduling rules in plain language and review active business rules.
        </p>
      </header>

      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <form id="nl-constraint-form" class="flex flex-col sm:flex-row gap-3">
          <label for="nl-constraint-input" class="sr-only">Natural language constraint request</label>
          <input
            id="nl-constraint-input"
            type="text"
            value="${escapeHtml(state.nlInput)}"
            placeholder="I need 2 cashiers on Tuesday"
            class="flex-1 min-w-0 px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
          />
          <button
            type="submit"
            id="parse-constraint-btn"
            class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Parse Constraint
          </button>
        </form>
        ${
          state.nlError
            ? `<p id="nl-error" class="mt-2 text-xs text-red-700" role="alert">${escapeHtml(state.nlError)}</p>`
            : ''
        }
      </div>

      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200">
          <h2 class="font-display text-base font-semibold text-slate-900">Business Rules</h2>
        </div>
        ${
          state.rules.length === 0
            ? `
              <div class="px-5 py-10 text-center text-sm text-slate-500">
                No active business rules configured. Enter a natural language request above to add one.
              </div>
            `
            : `
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th class="py-3 px-5">Rule</th>
                      <th class="py-3 px-4">Category</th>
                      <th class="py-3 px-4">Scope</th>
                      <th class="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 text-sm">
                    ${state.rules
                      .map(
                        (rule) => `
                          <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-3.5 px-5 text-slate-900">${escapeHtml(rule.description)}</td>
                            <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">${escapeHtml(rule.category)}</td>
                            <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">${escapeHtml(rule.scope)}</td>
                            <td class="py-3.5 px-5 text-right whitespace-nowrap">
                              <div class="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  data-edit-rule="${rule.id}"
                                  class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  data-delete-rule="${rule.id}"
                                  class="px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `
        }
      </div>
    </section>
  `;
}

function renderScheduleView(): string {
  const alerts = computeSchedulingAlerts();
  const activeEmployees = state.employees.filter((e) => e.status === 'Active');

  return `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-slate-900">
            Schedule Generation &amp; Editing
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Generate an optimized weekly roster or select any shift cell to manually reassign.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            id="generate-schedule-btn"
            class="px-4 py-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Generate Optimized Schedule
          </button>
          <button
            type="button"
            id="publish-schedule-btn"
            class="px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Publish Schedule
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div class="xl:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[780px] text-left border-collapse table-fixed">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th class="py-3 px-4 w-36">Shift</th>
                  ${DAYS.map((day) => `<th class="py-3 px-3">${day}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-xs">
                ${SHIFT_SLOTS.map(
                  (slot) => `
                    <tr>
                      <td class="py-3 px-4 align-top bg-slate-50/50 border-r border-slate-200">
                        <div class="font-semibold text-slate-900">${slot.name}</div>
                        <div class="font-mono-tabular text-[11px] text-slate-500 mt-0.5">${slot.hours}</div>
                      </td>
                      ${DAYS.map((day) => {
                        const cellShifts = state.shifts.filter(
                          (s) => s.day === day && s.slot === slot.name
                        );
                        return `
                          <td class="p-2 align-top border-r border-slate-100 last:border-r-0">
                            <div class="space-y-1.5">
                              ${
                                cellShifts.length === 0
                                  ? `<div class="py-2 px-2 text-[11px] text-slate-400">Unassigned</div>`
                                  : cellShifts
                                      .map((shift) => {
                                        const emp = getEmployeeById(shift.employeeId);
                                        const empName = emp
                                          ? `${emp.firstName} ${emp.lastName}`
                                          : 'Unassigned';
                                        const isEditing = state.editingShiftId === shift.id;

                                        if (isEditing) {
                                          return `
                                            <div class="p-1.5 rounded-lg border border-blue-600 bg-blue-50/40">
                                              <label for="reassign-${shift.id}" class="sr-only">Reassign employee</label>
                                              <select
                                                id="reassign-${shift.id}"
                                                data-reassign-select="${shift.id}"
                                                class="w-full text-xs bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                                              >
                                                ${activeEmployees
                                                  .map(
                                                    (candidate) => `
                                                      <option value="${candidate.id}" ${
                                                        candidate.id === shift.employeeId ? 'selected' : ''
                                                      }>
                                                        ${escapeHtml(candidate.firstName)} ${escapeHtml(candidate.lastName)} (${escapeHtml(candidate.role)})
                                                      </option>
                                                    `
                                                  )
                                                  .join('')}
                                              </select>
                                            </div>
                                          `;
                                        }

                                        return `
                                          <button
                                            type="button"
                                            data-shift-cell="${shift.id}"
                                            title="Click to reassign shift"
                                            class="w-full text-left p-2 rounded-lg border border-slate-200 border-dashed hover:border-solid hover:border-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
                                          >
                                            <div class="font-medium text-slate-900 truncate">${escapeHtml(empName)}</div>
                                            <div class="text-[11px] text-slate-500 truncate">${escapeHtml(shift.role)}</div>
                                          </button>
                                        `;
                                      })
                                      .join('')
                              }
                            </div>
                          </td>
                        `;
                      }).join('')}
                    </tr>
                  `
                ).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <aside class="bg-white border border-slate-200 rounded-xl p-5">
          <h2 class="font-display text-base font-semibold text-slate-900">Scheduling Alerts</h2>
          <div class="mt-4 space-y-3">
            ${
              alerts.length === 0
                ? `<p class="text-sm text-emerald-700">No soft constraint violations detected.</p>`
                : alerts
                    .map(
                      (alert) => `
                        <div class="p-3 rounded-lg border border-amber-200 bg-amber-50/60">
                          <div class="text-[11px] font-semibold text-amber-800">Soft Constraint</div>
                          <p class="mt-1 text-sm text-slate-800">${escapeHtml(alert)}</p>
                        </div>
                      `
                    )
                    .join('')
            }
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderApprovalsView(): string {
  return `
    <section class="space-y-6">
      <header>
        <h1 class="font-display text-2xl font-bold tracking-tight text-slate-900">
          Pending Approvals
        </h1>
        <p class="mt-1 text-sm text-slate-600">
          Review employee shift swap requests waiting for final manager sign-off.
        </p>
      </header>

      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        ${
          state.swaps.length === 0
            ? `
              <div class="px-5 py-12 text-center text-sm text-slate-500">
                No pending shift swaps waiting for manager sign-off.
              </div>
            `
            : `
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th class="py-3 px-5">Requesting Employee</th>
                      <th class="py-3 px-4">Original Shift</th>
                      <th class="py-3 px-4">Swap With</th>
                      <th class="py-3 px-4">Target Shift</th>
                      <th class="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 text-sm">
                    ${state.swaps
                      .map((swap) => {
                        const reqEmp = getEmployeeById(swap.requesterId);
                        const tgtEmp = getEmployeeById(swap.targetId);
                        const reqName = reqEmp ? `${reqEmp.firstName} ${reqEmp.lastName}` : 'Employee';
                        const tgtName = tgtEmp ? `${tgtEmp.firstName} ${tgtEmp.lastName}` : 'Employee';

                        return `
                          <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                              <div>${escapeHtml(reqName)}</div>
                              <div class="text-xs font-normal text-slate-500">${escapeHtml(reqEmp?.role || '')}</div>
                            </td>
                            <td class="py-3.5 px-4 font-mono-tabular text-xs text-slate-700 whitespace-nowrap">
                              ${escapeHtml(swap.requesterShift)}
                            </td>
                            <td class="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                              <div>${escapeHtml(tgtName)}</div>
                              <div class="text-xs font-normal text-slate-500">${escapeHtml(tgtEmp?.role || '')}</div>
                            </td>
                            <td class="py-3.5 px-4 font-mono-tabular text-xs text-slate-700 whitespace-nowrap">
                              ${escapeHtml(swap.targetShift)}
                            </td>
                            <td class="py-3.5 px-5 text-right whitespace-nowrap">
                              <div class="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  data-approve-swap="${swap.id}"
                                  class="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  data-reject-swap="${swap.id}"
                                  class="px-3.5 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        `;
                      })
                      .join('')}
                  </tbody>
                </table>
              </div>
            `
        }
      </div>
    </section>
  `;
}

function renderTeamView(): string {
  return `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-slate-900">
            Team Management
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Manage team members, roles, and weekly hour limits.
          </p>
        </div>
        <button
          type="button"
          id="add-employee-btn"
          class="px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Add Employee
        </button>
      </header>

      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200">
          <h2 class="font-display text-base font-semibold text-slate-900">Team Directory</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th class="py-3 px-5">Name</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Phone</th>
                <th class="py-3 px-4 text-right">Max Weekly Hours</th>
                <th class="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm">
              ${state.employees
                .map((emp) => {
                  const statusClass =
                    emp.status === 'Active' ? 'text-emerald-700' : 'text-amber-700';
                  return `
                    <tr class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                        ${escapeHtml(emp.firstName)} ${escapeHtml(emp.lastName)}
                      </td>
                      <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">${escapeHtml(emp.role)}</td>
                      <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">${escapeHtml(emp.email)}</td>
                      <td class="py-3.5 px-4 font-mono-tabular text-xs text-slate-600 whitespace-nowrap">${escapeHtml(emp.phone)}</td>
                      <td class="py-3.5 px-4 font-mono-tabular text-slate-700 text-right whitespace-nowrap">${emp.maxWeeklyHours} hrs</td>
                      <td class="py-3.5 px-5 font-medium text-right whitespace-nowrap ${statusClass}">
                        ${emp.status}
                      </td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderConstraintApprovalModal(): string {
  if (!state.parsedModal) return '';
  const modal = state.parsedModal;

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="constraint-modal-title"
    >
      <div class="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 id="constraint-modal-title" class="font-display text-lg font-bold text-slate-900">
          Constraint Approval Modal
        </h2>
        <p class="mt-1 text-sm text-slate-600">
          Review the parsed rule before adding it to active Business Rules.
        </p>

        <div class="mt-5 space-y-4">
          ${
            modal.originalPrompt
              ? `
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div class="text-xs font-medium text-slate-500">Natural Language Input</div>
                  <div class="mt-1 text-sm text-slate-800">"${escapeHtml(modal.originalPrompt)}"</div>
                </div>
              `
              : ''
          }
          <div>
            <label for="parsed-rule-description" class="block text-xs font-medium text-slate-700 mb-1">
              Parsed Rule
            </label>
            <textarea
              id="parsed-rule-description"
              rows="2"
              class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            >${escapeHtml(modal.description)}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="p-3 border border-slate-200 rounded-lg">
              <div class="text-xs text-slate-500">Category</div>
              <div class="mt-0.5 font-medium text-slate-900">${escapeHtml(modal.category)}</div>
            </div>
            <div class="p-3 border border-slate-200 rounded-lg">
              <div class="text-xs text-slate-500">Scope</div>
              <div class="mt-0.5 font-medium text-slate-900">${escapeHtml(modal.scope)}</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            id="modal-cancel-edit-btn"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cancel/Edit
          </button>
          <button
            type="button"
            id="modal-approve-rules-btn"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Approve Rules
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPublishConfirmModal(): string {
  if (!state.publishConfirmOpen) return '';

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
    >
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 id="publish-modal-title" class="font-display text-lg font-bold text-slate-900">
          Publish Schedule
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          Are you sure you want to publish?
        </p>
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            id="publish-cancel-btn"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="publish-confirm-btn"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Confirm Publish
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAddEmployeeModal(): string {
  if (!state.addEmployeeModalOpen) return '';

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
    >
      <div class="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 id="employee-modal-title" class="font-display text-lg font-bold text-slate-900">
          Employee Profile Form
        </h2>
        <form id="employee-profile-form" class="mt-5 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="emp-first-name" class="block text-xs font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                id="emp-first-name"
                name="firstName"
                type="text"
                required
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <div>
              <label for="emp-last-name" class="block text-xs font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                id="emp-last-name"
                name="lastName"
                type="text"
                required
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          <div>
            <label for="emp-email" class="block text-xs font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="emp-email"
              name="email"
              type="email"
              required
              class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div>
            <label for="emp-phone" class="block text-xs font-medium text-slate-700 mb-1">
              Phone
            </label>
            <input
              id="emp-phone"
              name="phone"
              type="tel"
              required
              class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="emp-role" class="block text-xs font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                id="emp-role"
                name="role"
                required
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                ${ROLES.map((role) => `<option value="${escapeHtml(role)}">${escapeHtml(role)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label for="emp-max-hours" class="block text-xs font-medium text-slate-700 mb-1">
                Max weekly hours
              </label>
              <input
                id="emp-max-hours"
                name="maxWeeklyHours"
                type="number"
                min="1"
                max="80"
                value="40"
                required
                class="w-full px-3 py-2 text-sm font-mono-tabular text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          <div class="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              id="employee-cancel-btn"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="employee-save-btn"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderToast(): string {
  if (!state.toastMessage) return '';

  return `
    <div
      role="status"
      aria-live="polite"
      class="fixed bottom-5 right-5 z-50 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-lg"
    >
      ${escapeHtml(state.toastMessage)}
    </div>
  `;
}

function attachEventListeners(): void {
  // Navigation tabs
  document.querySelectorAll<HTMLButtonElement>('[data-nav-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.navView as ViewId;
      if (targetView) {
        state.activeView = targetView;
        state.editingShiftId = null;
        render();
      }
    });
  });

  // View 1: Natural Language Constraint Input & Parse
  const nlInputEl = document.getElementById('nl-constraint-input') as HTMLInputElement | null;
  if (nlInputEl) {
    nlInputEl.addEventListener('input', () => {
      state.nlInput = nlInputEl.value;
      if (state.nlError) {
        state.nlError = '';
        document.getElementById('nl-error')?.remove();
      }
    });
  }

  const nlForm = document.getElementById('nl-constraint-form') as HTMLFormElement | null;
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const trimmed = state.nlInput.trim();
      if (!trimmed) {
        state.nlError = 'Please enter a scheduling constraint request before parsing.';
        render();
        document.getElementById('nl-constraint-input')?.focus();
        return;
      }
      state.nlError = '';
      state.parsedModal = parseNaturalLanguageConstraint(trimmed);
      render();
    });
  }

  // View 1: Business Rules Edit & Delete
  document.querySelectorAll<HTMLButtonElement>('[data-edit-rule]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.editRule;
      const rule = state.rules.find((r) => r.id === id);
      if (!rule) return;
      state.parsedModal = {
        mode: 'edit',
        editingRuleId: rule.id,
        originalPrompt: '',
        description: rule.description,
        category: rule.category,
        scope: rule.scope,
      };
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-delete-rule]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.deleteRule;
      state.rules = state.rules.filter((r) => r.id !== id);
      showToast('Business rule deleted');
    });
  });

  // View 1 Modal: Approve Rules / Cancel/Edit
  const modalCancelBtn = document.getElementById('modal-cancel-edit-btn');
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      const wasCreate = state.parsedModal?.mode === 'create';
      state.parsedModal = null;
      render();
      if (wasCreate) {
        const input = document.getElementById('nl-constraint-input') as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    });
  }

  const modalApproveBtn = document.getElementById('modal-approve-rules-btn');
  if (modalApproveBtn) {
    modalApproveBtn.addEventListener('click', () => {
      if (!state.parsedModal) return;
      const descEl = document.getElementById('parsed-rule-description') as HTMLTextAreaElement | null;
      const updatedDesc = (descEl?.value || state.parsedModal.description).trim();
      if (!updatedDesc) return;

      if (state.parsedModal.mode === 'edit' && state.parsedModal.editingRuleId) {
        state.rules = state.rules.map((r) =>
          r.id === state.parsedModal?.editingRuleId ? { ...r, description: updatedDesc } : r
        );
        state.parsedModal = null;
        showToast('Business rule updated');
      } else {
        state.rules = [
          {
            id: `rule-${Date.now()}`,
            description: updatedDesc,
            category: state.parsedModal.category,
            scope: state.parsedModal.scope,
          },
          ...state.rules,
        ];
        state.nlInput = '';
        state.parsedModal = null;
        showToast('Business rule approved and added');
      }
    });
  }

  // View 2: Generate Optimized Schedule & Publish Schedule
  const generateBtn = document.getElementById('generate-schedule-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      runScheduleOptimization();
    });
  }

  const publishBtn = document.getElementById('publish-schedule-btn');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      state.publishConfirmOpen = true;
      render();
    });
  }

  const publishCancelBtn = document.getElementById('publish-cancel-btn');
  if (publishCancelBtn) {
    publishCancelBtn.addEventListener('click', () => {
      state.publishConfirmOpen = false;
      render();
    });
  }

  const publishConfirmBtn = document.getElementById('publish-confirm-btn');
  if (publishConfirmBtn) {
    publishConfirmBtn.addEventListener('click', () => {
      state.publishConfirmOpen = false;
      showToast('Schedule published to team');
    });
  }

  // View 2: Shift cell manual reassignment
  document.querySelectorAll<HTMLButtonElement>('[data-shift-cell]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.editingShiftId = btn.dataset.shiftCell || null;
      render();
      const selectEl = document.querySelector<HTMLSelectElement>(
        `[data-reassign-select="${state.editingShiftId}"]`
      );
      selectEl?.focus();
    });
  });

  document.querySelectorAll<HTMLSelectElement>('[data-reassign-select]').forEach((selectEl) => {
    selectEl.addEventListener('change', () => {
      const shiftId = selectEl.dataset.reassignSelect;
      const nextEmployeeId = selectEl.value;
      const emp = getEmployeeById(nextEmployeeId);
      if (shiftId && emp) {
        state.shifts = state.shifts.map((s) =>
          s.id === shiftId ? { ...s, employeeId: emp.id, role: emp.role } : s
        );
      }
      state.editingShiftId = null;
      render();
    });
    selectEl.addEventListener('blur', () => {
      if (state.editingShiftId === selectEl.dataset.reassignSelect) {
        state.editingShiftId = null;
        render();
      }
    });
  });

  // View 3: Shift Swaps Approve & Reject
  document.querySelectorAll<HTMLButtonElement>('[data-approve-swap]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const swapId = btn.dataset.approveSwap;
      const swap = state.swaps.find((s) => s.id === swapId);
      if (swap) {
        // Reflect approved swap on matching shift if present
        state.shifts = state.shifts.map((shift) => {
          if (shift.day === swap.day && shift.slot === swap.slot && shift.employeeId === swap.requesterId) {
            const targetEmp = getEmployeeById(swap.targetId);
            return {
              ...shift,
              employeeId: swap.targetId,
              role: targetEmp ? targetEmp.role : shift.role,
            };
          }
          return shift;
        });
      }
      state.swaps = state.swaps.filter((s) => s.id !== swapId);
      showToast('Shift swap approved');
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-reject-swap]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const swapId = btn.dataset.rejectSwap;
      state.swaps = state.swaps.filter((s) => s.id !== swapId);
      showToast('Shift swap rejected');
    });
  });

  // View 4: Add Employee & Form Modal
  const addEmpBtn = document.getElementById('add-employee-btn');
  if (addEmpBtn) {
    addEmpBtn.addEventListener('click', () => {
      state.addEmployeeModalOpen = true;
      render();
      document.getElementById('emp-first-name')?.focus();
    });
  }

  const empCancelBtn = document.getElementById('employee-cancel-btn');
  if (empCancelBtn) {
    empCancelBtn.addEventListener('click', () => {
      state.addEmployeeModalOpen = false;
      render();
    });
  }

  const empForm = document.getElementById('employee-profile-form') as HTMLFormElement | null;
  if (empForm) {
    empForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(empForm);
      const firstName = String(formData.get('firstName') || '').trim();
      const lastName = String(formData.get('lastName') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const role = String(formData.get('role') || ROLES[0]);
      const maxWeeklyHours = Number(formData.get('maxWeeklyHours') || 40);

      if (!firstName || !lastName || !email || !phone || !maxWeeklyHours) return;

      state.employees = [
        ...state.employees,
        {
          id: `emp-${Date.now()}`,
          firstName,
          lastName,
          email,
          phone,
          role,
          maxWeeklyHours,
          status: 'Invited',
        },
      ];
      state.addEmployeeModalOpen = false;
      showToast('Employee created and invitation sent');
    });
  }
}

function render(): void {
  const root = document.getElementById('root');
  if (!root) return;

  let activeContent = '';
  switch (state.activeView) {
    case 'rules':
      activeContent = renderRulesView();
      break;
    case 'schedule':
      activeContent = renderScheduleView();
      break;
    case 'approvals':
      activeContent = renderApprovalsView();
      break;
    case 'team':
      activeContent = renderTeamView();
      break;
  }

  root.innerHTML = `
    <div class="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      ${renderSidebar()}
      <main class="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 max-w-7xl">
        ${activeContent}
      </main>
    </div>
    ${renderConstraintApprovalModal()}
    ${renderPublishConfirmModal()}
    ${renderAddEmployeeModal()}
    <div id="toast-host">${renderToast()}</div>
  `;

  attachEventListeners();
}

render();
