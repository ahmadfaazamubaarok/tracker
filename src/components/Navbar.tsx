import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { ViewTab } from '../types';
import { 
  Kanban, 
  FolderKanban, 
  Layers, 
  Archive, 
  Plus, 
  Filter, 
  DownloadCloud, 
  Menu, 
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenAddProgress: () => void;
  onOpenFilter: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddProgress,
  onOpenFilter,
  onOpenBackup,
}) => {
  const { currentTab, setCurrentTab, groups, projects, progresses, filter } = useTrackerStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const archivedCount = progresses.filter((p) => p.archived).length;
  const isFiltered = Boolean(filter.id_group || filter.id_project);

  const canAddProgress = groups.length > 0 && projects.length > 0;

  const handleTabClick = (tab: ViewTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('board')}>
            <img src="./assets/logo.svg" alt="Project Tracker" className="w-8 h-8 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-ink text-base tracking-tight leading-none">Project Tracker</span>
              <span className="text-[11px] text-muted tracking-tight mt-0.5 hidden sm:inline">Kanban Proyek Mandiri</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleTabClick('board')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentTab === 'board'
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-canvas-soft'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Board</span>
            </button>

            <button
              onClick={() => handleTabClick('project')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentTab === 'project'
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-canvas-soft'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Proyek</span>
              {projects.length > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${currentTab === 'project' ? 'bg-white/20 text-white' : 'bg-field text-muted'}`}>
                  {projects.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('group')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentTab === 'group'
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-canvas-soft'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Grup</span>
              {groups.length > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${currentTab === 'group' ? 'bg-white/20 text-white' : 'bg-field text-muted'}`}>
                  {groups.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('archive')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentTab === 'archive'
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink hover:bg-canvas-soft'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Arsip</span>
              {archivedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${currentTab === 'archive' ? 'bg-white/20 text-white' : 'bg-field text-muted'}`}>
                  {archivedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Filter Button (Board only) */}
            {currentTab === 'board' && canAddProgress && (
              <button
                onClick={onOpenFilter}
                className={`relative p-2 rounded-full border transition-colors ${
                  isFiltered
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:text-ink hover:bg-canvas-soft'
                }`}
                title="Filter Board"
              >
                <Filter className="w-4 h-4" />
                {isFiltered && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-canvas" />
                )}
              </button>
            )}

            {/* Backup / Export-Import */}
            <button
              onClick={onOpenBackup}
              className="p-2 rounded-full border border-hairline text-muted hover:text-ink hover:bg-canvas-soft transition-colors"
              title="Backup & Restore (JSON)"
            >
              <DownloadCloud className="w-4 h-4" />
            </button>

            {/* Add Progress Button */}
            {currentTab === 'board' && (
              <button
                onClick={onOpenAddProgress}
                disabled={!canAddProgress}
                className="btn-pill btn-primary text-xs sm:text-sm py-1.5 px-3.5 space-x-1.5"
                title={!canAddProgress ? 'Perlu membuat grup & proyek terlebih dahulu' : 'Tambah progres baru'}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Progres</span>
                <span className="sm:hidden">Progres</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-hairline text-muted hover:text-ink"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleTabClick('board')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
              currentTab === 'board' ? 'bg-canvas-soft text-ink font-semibold' : 'text-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Kanban className="w-4 h-4" />
              <span>Board</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('project')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
              currentTab === 'project' ? 'bg-canvas-soft text-ink font-semibold' : 'text-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FolderKanban className="w-4 h-4" />
              <span>Proyek</span>
            </div>
            {projects.length > 0 && (
              <span className="text-xs bg-field px-2 py-0.5 rounded-full text-muted">{projects.length}</span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('group')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
              currentTab === 'group' ? 'bg-canvas-soft text-ink font-semibold' : 'text-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4" />
              <span>Grup</span>
            </div>
            {groups.length > 0 && (
              <span className="text-xs bg-field px-2 py-0.5 rounded-full text-muted">{groups.length}</span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('archive')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
              currentTab === 'archive' ? 'bg-canvas-soft text-ink font-semibold' : 'text-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Archive className="w-4 h-4" />
              <span>Arsip</span>
            </div>
            {archivedCount > 0 && (
              <span className="text-xs bg-field px-2 py-0.5 rounded-full text-muted">{archivedCount}</span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
