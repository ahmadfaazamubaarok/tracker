import { useState, useEffect } from 'react';
import { useTrackerStore } from './store/useTrackerStore';
import { CardItem, Group, Project } from './types';
import { Navbar } from './components/Navbar';
import { Board } from './components/Board';
import { GroupView } from './components/GroupView';
import { ProjectView } from './components/ProjectView';
import { ArchiveView } from './components/ArchiveView';
import { ProgressAddModal } from './components/modals/ProgressAddModal';
import { ProgressDetailModal } from './components/modals/ProgressDetailModal';
import { GroupModal } from './components/modals/GroupModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { FilterModal } from './components/modals/FilterModal';
import { BackupModal } from './components/modals/BackupModal';
import { Kanban, Layers, FolderKanban, Archive } from 'lucide-react';

export function App() {
  const { currentTab, setCurrentTab, groups, projects, loadSampleData, deleteProgress } = useTrackerStore();

  // Modals state
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);
  const [detailCard, setDetailCard] = useState<CardItem | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // If initial load and empty, optionally load sample data on first run
  useEffect(() => {
    const hasVisited = localStorage.getItem('project_tracker_initialized');
    if (!hasVisited) {
      localStorage.setItem('project_tracker_initialized', 'true');
      if (groups.length === 0 && projects.length === 0) {
        loadSampleData();
      }
    }
  }, []);

  const handleOpenAddGroup = () => {
    setGroupToEdit(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (grp: Group) => {
    setGroupToEdit(grp);
    setIsGroupModalOpen(true);
  };

  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setProjectToEdit(proj);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col selection:bg-ink selection:text-white pb-20 md:pb-6">
      {/* Top Navbar */}
      <Navbar
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'board' && (
          <Board
            onOpenAddProgress={() => setIsAddProgressOpen(true)}
            onOpenFilter={() => setIsFilterModalOpen(true)}
            onOpenDetail={(card) => setDetailCard(card)}
            onDeleteProgress={(cardId) => {
              if (window.confirm('Yakin ingin menghapus progres ini?')) {
                deleteProgress(cardId);
              }
            }}
          />
        )}

        {currentTab === 'project' && (
          <ProjectView
            onOpenAddProject={handleOpenAddProject}
            onOpenEditProject={handleOpenEditProject}
            onNavigateToGroup={() => setCurrentTab('group')}
          />
        )}

        {currentTab === 'group' && (
          <GroupView
            onOpenAddGroup={handleOpenAddGroup}
            onOpenEditGroup={handleOpenEditGroup}
          />
        )}

        {currentTab === 'archive' && <ArchiveView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-hairline px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('board')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'board' ? 'text-ink font-bold' : 'text-muted'
          }`}
        >
          <Kanban className="w-5 h-5 mb-0.5" />
          <span>Board</span>
        </button>

        <button
          onClick={() => setCurrentTab('project')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'project' ? 'text-ink font-bold' : 'text-muted'
          }`}
        >
          <FolderKanban className="w-5 h-5 mb-0.5" />
          <span>Proyek</span>
        </button>

        <button
          onClick={() => setCurrentTab('group')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'group' ? 'text-ink font-bold' : 'text-muted'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Grup</span>
        </button>

        <button
          onClick={() => setCurrentTab('archive')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'archive' ? 'text-ink font-bold' : 'text-muted'
          }`}
        >
          <Archive className="w-5 h-5 mb-0.5" />
          <span>Arsip</span>
        </button>
      </div>

      {/* Modals */}
      <ProgressAddModal
        isOpen={isAddProgressOpen}
        onClose={() => setIsAddProgressOpen(false)}
      />

      <ProgressDetailModal
        card={detailCard}
        isOpen={Boolean(detailCard)}
        onClose={() => setDetailCard(null)}
        onDeleteProgress={(cardId) => {
          deleteProgress(cardId);
          setDetailCard(null);
        }}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        groupToEdit={groupToEdit}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
}

export default App;
