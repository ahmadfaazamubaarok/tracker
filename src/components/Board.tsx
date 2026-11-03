import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTrackerStore, useBoardCards } from '../store/useTrackerStore';
import { CardItem, Status } from '../types';
import { CardItemView } from './CardItemView';
import { FolderPlus, Layers, Plus, Filter, RotateCcw } from 'lucide-react';

interface BoardProps {
  onOpenAddProgress: () => void;
  onOpenFilter: () => void;
  onOpenDetail: (card: CardItem) => void;
  onDeleteProgress: (cardId: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  onOpenAddProgress,
  onOpenFilter,
  onOpenDetail,
  onDeleteProgress,
}) => {
  const { groups, projects, filter, resetFilter, setCurrentTab, moveProgress, archiveProgress } =
    useTrackerStore();
  const boardCards = useBoardCards();

  // Guard 1: 0 groups
  if (groups.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-canvas-soft rounded-3xl border border-hairline">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-field flex items-center justify-center text-ink">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Belum ada grup</h2>
        <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
          Untuk mulai menggunakan board, buat minimal 1 grup proyek terlebih dahulu sebagai wadah utama.
        </p>
        <button
          onClick={() => setCurrentTab('group')}
          className="btn-pill btn-primary space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Grup Pertama</span>
        </button>
      </div>
    );
  }

  // Guard 2: 0 projects
  if (projects.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-canvas-soft rounded-3xl border border-hairline">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-field flex items-center justify-center text-ink">
          <FolderPlus className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Belum ada proyek</h2>
        <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
          Grup sudah siap. Sekarang tambahkan minimal 1 proyek untuk dapat mulai mengelola progres tugas.
        </p>
        <button
          onClick={() => setCurrentTab('project')}
          className="btn-pill btn-primary space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Pertama</span>
        </button>
      </div>
    );
  }

  const columns: { id: Status; title: string; items: CardItem[] }[] = [
    { id: 'pending', title: 'Pending', items: boardCards.pending },
    { id: 'wip', title: 'WIP', items: boardCards.wip },
    { id: 'done', title: 'Selesai', items: boardCards.done },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as Status;
    const destStatus = destination.droppableId as Status;
    const cardId = parseInt(draggableId, 10);

    moveProgress(sourceStatus, destStatus, source.index, destination.index, cardId);
  };

  const activeGroupName = filter.id_group
    ? groups.find((g) => g.id === filter.id_group)?.name
    : null;
  const activeProjectName = filter.id_project
    ? projects.find((p) => p.id === filter.id_project)?.name
    : null;

  const isFiltered = Boolean(filter.id_group || filter.id_project);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-hairline mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Board</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Pantau dan kelola progres proyek melalui kanban board 3 kolom.
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onOpenFilter}
            className={`relative p-2.5 rounded-full border transition-colors ${
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
          <button
            onClick={onOpenAddProgress}
            className="btn-pill btn-primary text-sm space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Progres</span>
          </button>
        </div>
      </div>

      {/* Active Filter Notification Banner */}
      {(activeGroupName || activeProjectName) && (
        <div className="mb-6 p-3.5 rounded-2xl bg-canvas-soft border border-hairline flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-ink font-medium">
            <Filter className="w-4 h-4 text-accent" />
            <span>Memfilter board berdasarkan:</span>
            {activeGroupName && (
              <span className="bg-field px-2.5 py-0.5 rounded-full border border-hairline">
                Grup: <strong>{activeGroupName}</strong>
              </span>
            )}
            {activeProjectName && (
              <span className="bg-field px-2.5 py-0.5 rounded-full border border-hairline">
                Proyek: <strong>{activeProjectName}</strong>
              </span>
            )}
          </div>
          <button
            onClick={resetFilter}
            className="flex items-center space-x-1 text-xs text-muted hover:text-ink hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Kanban Board Columns Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => (
            <div
              key={col.id}
              className="bg-canvas-soft/80 rounded-3xl p-4 border border-hairline flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-hairline/80 px-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-ink text-sm sm:text-base tracking-tight">
                    {col.title}
                  </h2>
                  <span className="bg-field text-muted font-medium text-xs px-2 py-0.5 rounded-full border border-hairline/60">
                    {col.items.length}
                  </span>
                </div>

                {col.id === 'pending' && (
                  <button
                    onClick={onOpenAddProgress}
                    className="p-1 rounded-full text-muted hover:text-ink hover:bg-field transition-colors"
                    title="Tambah Progres Cepat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 min-h-[200px] transition-colors rounded-2xl p-1 ${
                      snapshot.isDraggingOver ? 'bg-field/70 ring-2 ring-ink/10' : ''
                    }`}
                  >
                    {col.items.map((card, index) => (
                      <Draggable
                        key={String(card.id)}
                        draggableId={String(card.id)}
                        index={index}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <CardItemView
                              card={card}
                              onOpenDetail={onOpenDetail}
                              onDelete={onDeleteProgress}
                              onArchive={archiveProgress}
                              isDragging={dragSnapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Column Empty State */}
                    {col.items.length === 0 && !snapshot.isDraggingOver && (
                      <div className="py-12 text-center text-muted/60 text-xs border border-dashed border-hairline rounded-2xl">
                        Tidak ada kartu di {col.title}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
