/* ── Project Manager ── */
/* すべてのデータはlocalStorageに保存 */

const STORAGE_KEY = 'devtools_projects';

/* ── データ管理 ── */
function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── 状態 ── */
let projects = loadProjects();
let currentFilter = 'all';
let searchQuery = '';
let currentTaskProjectId = null;
let deleteTargetId = null;
let draggedTaskEl = null;

/* ── DOM参照 ── */
const projectsList = document.getElementById('projectsList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const addProjectBtn = document.getElementById('addProjectBtn');

// 統計
const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statPlanning = document.getElementById('statPlanning');
const statCompleted = document.getElementById('statCompleted');

// プロジェクトモーダル
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const projectIdField = document.getElementById('projectId');
const projectNameField = document.getElementById('projectName');
const projectDescField = document.getElementById('projectDesc');
const projectStatusField = document.getElementById('projectStatus');
const projectPriorityField = document.getElementById('projectPriority');
const projectTechField = document.getElementById('projectTech');
const projectRepoField = document.getElementById('projectRepo');

// タスクモーダル
const taskModal = document.getElementById('taskModal');
const taskModalTitle = document.getElementById('taskModalTitle');
const taskModalClose = document.getElementById('taskModalClose');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const kanbanTodo = document.getElementById('kanbanTodo');
const kanbanProgress = document.getElementById('kanbanProgress');
const kanbanDone = document.getElementById('kanbanDone');
const countTodo = document.getElementById('countTodo');
const countProgress = document.getElementById('countProgress');
const countDone = document.getElementById('countDone');

// 削除モーダル
const deleteModal = document.getElementById('deleteModal');
const deleteModalClose = document.getElementById('deleteModalClose');
const deleteCancelBtn = document.getElementById('deleteCancelBtn');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

/* ── ステータス表示名 ── */
const statusLabels = {
  planning: '企画中',
  active: '進行中',
  paused: '一時停止',
  completed: '完了'
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高'
};

/* ── フィルタリング ── */
function getFilteredProjects() {
  return projects.filter(p => {
    // ステータスフィルタ
    if (currentFilter !== 'all' && p.status !== currentFilter) return false;
    // 検索
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const techMatch = (p.tech || []).some(t => t.toLowerCase().includes(q));
      if (!nameMatch && !descMatch && !techMatch) return false;
    }
    return true;
  });
}

/* ── 統計更新 ── */
function updateStats() {
  statTotal.textContent = projects.length;
  statActive.textContent = projects.filter(p => p.status === 'active').length;
  statPlanning.textContent = projects.filter(p => p.status === 'planning').length;
  statCompleted.textContent = projects.filter(p => p.status === 'completed').length;
}

/* ── タスク進捗計算 ── */
function getTaskProgress(project) {
  const tasks = project.tasks || [];
  if (tasks.length === 0) return { total: 0, done: 0, inProgress: 0, todo: 0, percent: 0 };
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  return {
    total: tasks.length,
    done,
    inProgress,
    todo,
    percent: Math.round((done / tasks.length) * 100)
  };
}

/* ── プロジェクト一覧描画 ── */
function renderProjects() {
  const filtered = getFilteredProjects();
  projectsList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    projectsList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    projectsList.style.display = 'flex';
  }

  // 優先度順（high > medium > low）、さらに更新日時順
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 1;
    const pb = priorityOrder[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

  filtered.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.status = project.status;

    const progress = getTaskProgress(project);
    const techHtml = (project.tech || [])
      .map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`)
      .join('');

    const repoLink = project.repo
      ? `<a href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer" class="action-btn" title="リポジトリを開く" onclick="event.stopPropagation()">
           <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
         </a>`
      : '';

    const progressSection = progress.total > 0
      ? `<div class="progress-section">
           <div class="progress-header">
             <span class="progress-label">タスク進捗</span>
             <span class="progress-percent">${progress.percent}%</span>
           </div>
           <div class="progress-bar">
             <div class="progress-fill" style="width: ${progress.percent}%"></div>
           </div>
           <div class="task-summary">
             <span class="task-count">TODO: ${progress.todo}</span>
             <span class="task-count">進行中: ${progress.inProgress}</span>
             <span class="task-count">完了: ${progress.done}</span>
           </div>
         </div>`
      : `<div class="progress-section">
           <span class="progress-label" style="font-family:'Space Mono',monospace;font-size:10px;color:var(--muted)">タスク未登録</span>
         </div>`;

    card.innerHTML = `
      <div class="project-top">
        <div class="project-info">
          <div class="project-name">${escapeHtml(project.name)}</div>
          ${project.description ? `<div class="project-desc">${escapeHtml(project.description)}</div>` : ''}
          <div class="project-meta">
            <span class="status-badge" data-status="${project.status}">${statusLabels[project.status]}</span>
            <span class="priority-badge" data-priority="${project.priority}">優先度: ${priorityLabels[project.priority]}</span>
            ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ''}
          </div>
        </div>
        <div class="project-actions">
          <button class="action-btn" title="タスク管理" onclick="openTaskModal('${project.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 14l2 2 4-4"/>
            </svg>
          </button>
          <button class="action-btn" title="編集" onclick="openEditModal('${project.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          ${repoLink}
          <button class="action-btn delete" title="削除" onclick="openDeleteModal('${project.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>
      ${progressSection}
    `;

    projectsList.appendChild(card);
  });

  updateStats();
}

/* ── HTMLエスケープ ── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── プロジェクトモーダル ── */
function openModal() {
  projectModal.classList.add('open');
  projectNameField.focus();
}

function closeModal() {
  projectModal.classList.remove('open');
  projectForm.reset();
  projectIdField.value = '';
}

addProjectBtn.addEventListener('click', () => {
  modalTitle.textContent = '新規プロジェクト';
  projectIdField.value = '';
  projectForm.reset();
  projectPriorityField.value = 'medium';
  openModal();
});

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) closeModal();
});

// 編集モーダルを開く
function openEditModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  modalTitle.textContent = 'プロジェクトを編集';
  projectIdField.value = project.id;
  projectNameField.value = project.name;
  projectDescField.value = project.description || '';
  projectStatusField.value = project.status;
  projectPriorityField.value = project.priority;
  projectTechField.value = (project.tech || []).join(', ');
  projectRepoField.value = project.repo || '';
  openModal();
}

// フォーム送信
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = projectIdField.value;
  const tech = projectTechField.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (id) {
    // 編集
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx].name = projectNameField.value.trim();
      projects[idx].description = projectDescField.value.trim();
      projects[idx].status = projectStatusField.value;
      projects[idx].priority = projectPriorityField.value;
      projects[idx].tech = tech;
      projects[idx].repo = projectRepoField.value.trim();
      projects[idx].updatedAt = Date.now();
    }
  } else {
    // 新規
    projects.push({
      id: generateId(),
      name: projectNameField.value.trim(),
      description: projectDescField.value.trim(),
      status: projectStatusField.value,
      priority: projectPriorityField.value,
      tech,
      repo: projectRepoField.value.trim(),
      tasks: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  saveProjects(projects);
  renderProjects();
  closeModal();
});

/* ── 削除モーダル ── */
function openDeleteModal(id) {
  deleteTargetId = id;
  deleteModal.classList.add('open');
}

function closeDeleteModal() {
  deleteModal.classList.remove('open');
  deleteTargetId = null;
}

deleteModalClose.addEventListener('click', closeDeleteModal);
deleteCancelBtn.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

deleteConfirmBtn.addEventListener('click', () => {
  if (deleteTargetId) {
    projects = projects.filter(p => p.id !== deleteTargetId);
    saveProjects(projects);
    renderProjects();
  }
  closeDeleteModal();
});

/* ── タスクモーダル ── */
function openTaskModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  currentTaskProjectId = id;
  taskModalTitle.textContent = `${project.name} — タスク管理`;
  taskModal.classList.add('open');
  newTaskInput.value = '';
  renderKanban();
  newTaskInput.focus();
}

function closeTaskModal() {
  taskModal.classList.remove('open');
  currentTaskProjectId = null;
}

taskModalClose.addEventListener('click', closeTaskModal);
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) closeTaskModal();
});

// タスク追加
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text || !currentTaskProjectId) return;

  const project = projects.find(p => p.id === currentTaskProjectId);
  if (!project) return;

  if (!project.tasks) project.tasks = [];
  project.tasks.push({
    id: generateId(),
    text,
    status: 'todo',
    createdAt: Date.now()
  });

  project.updatedAt = Date.now();
  saveProjects(projects);
  renderKanban();
  renderProjects();
  newTaskInput.value = '';
  newTaskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

// カンバン描画
function renderKanban() {
  const project = projects.find(p => p.id === currentTaskProjectId);
  if (!project) return;

  const tasks = project.tasks || [];
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const progressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  countTodo.textContent = todoTasks.length;
  countProgress.textContent = progressTasks.length;
  countDone.textContent = doneTasks.length;

  kanbanTodo.innerHTML = todoTasks.map(t => createTaskItem(t)).join('');
  kanbanProgress.innerHTML = progressTasks.map(t => createTaskItem(t)).join('');
  kanbanDone.innerHTML = doneTasks.map(t => createTaskItem(t)).join('');

  // ドラッグ&ドロップを設定
  setupDragAndDrop();
}

function createTaskItem(task) {
  const moveLeftBtn = task.status !== 'todo'
    ? `<button class="kanban-item-btn" onclick="moveTask('${task.id}','left')" title="左に移動">&larr;</button>`
    : '';
  const moveRightBtn = task.status !== 'done'
    ? `<button class="kanban-item-btn" onclick="moveTask('${task.id}','right')" title="右に移動">&rarr;</button>`
    : '';

  return `
    <div class="kanban-item" draggable="true" data-task-id="${task.id}">
      <span class="kanban-item-text">${escapeHtml(task.text)}</span>
      <div class="kanban-item-actions">
        ${moveLeftBtn}
        ${moveRightBtn}
        <button class="kanban-item-btn delete-task" onclick="deleteTask('${task.id}')" title="削除">&times;</button>
      </div>
    </div>
  `;
}

// タスク移動
function moveTask(taskId, direction) {
  const project = projects.find(p => p.id === currentTaskProjectId);
  if (!project) return;

  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return;

  const flow = ['todo', 'in_progress', 'done'];
  const currentIdx = flow.indexOf(task.status);
  const newIdx = direction === 'right' ? currentIdx + 1 : currentIdx - 1;

  if (newIdx >= 0 && newIdx < flow.length) {
    task.status = flow[newIdx];
    project.updatedAt = Date.now();
    saveProjects(projects);
    renderKanban();
    renderProjects();
  }
}

// タスク削除
function deleteTask(taskId) {
  const project = projects.find(p => p.id === currentTaskProjectId);
  if (!project) return;

  project.tasks = project.tasks.filter(t => t.id !== taskId);
  project.updatedAt = Date.now();
  saveProjects(projects);
  renderKanban();
  renderProjects();
}

// ドラッグ&ドロップ
function setupDragAndDrop() {
  const items = document.querySelectorAll('.kanban-item');
  const columns = document.querySelectorAll('.kanban-items');

  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedTaskEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.taskId);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggedTaskEl = null;
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
      });
    });
  });

  columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.closest('.kanban-column').classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
      if (!column.contains(e.relatedTarget)) {
        column.closest('.kanban-column').classList.remove('drag-over');
      }
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = column.closest('.kanban-column').dataset.status;
      column.closest('.kanban-column').classList.remove('drag-over');

      const project = projects.find(p => p.id === currentTaskProjectId);
      if (!project) return;

      const task = project.tasks.find(t => t.id === taskId);
      if (!task) return;

      task.status = newStatus;
      project.updatedAt = Date.now();
      saveProjects(projects);
      renderKanban();
      renderProjects();
    });
  });
}

/* ── 検索 ── */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderProjects();
});

/* ── フィルタ ── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProjects();
  });
});

/* ── キーボードショートカット ── */
document.addEventListener('keydown', (e) => {
  // Escでモーダルを閉じる
  if (e.key === 'Escape') {
    if (deleteModal.classList.contains('open')) {
      closeDeleteModal();
    } else if (taskModal.classList.contains('open')) {
      closeTaskModal();
    } else if (projectModal.classList.contains('open')) {
      closeModal();
    }
  }
  // Ctrl+N で新規プロジェクト（モーダルが開いていない時）
  if (e.ctrlKey && e.key === 'n' &&
      !projectModal.classList.contains('open') &&
      !taskModal.classList.contains('open') &&
      !deleteModal.classList.contains('open')) {
    e.preventDefault();
    addProjectBtn.click();
  }
});

/* ── 初期描画 ── */
renderProjects();
