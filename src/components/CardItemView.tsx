import React from 'react';
import { CardItem } from '../types';
import { formatDateID, getPriorityLabel, getPriorityBadgeClass } from '../utils/helpers';
import { Calendar, CheckSquare, FileText, X, Archive, AlertCircle } from 'lucide-react';

interface CardItemViewProps {
  card: CardItem;
  onOpenDetail: (card: CardItem) => void;
  onDelete: (cardId: number) => void;
  onArchive: (cardId: number) => void;
  isDragging?: boolean;
}

export const CardItemView: React.FC<CardItemViewProps> = ({
  card,
  onOpenDetail,
  onDelete,
  onArchive,
  isDragging = false,
}) => {
  return (
    <div
      onClick={() => onOpenDetail(card)}
      className={`group relative bg-canvas rounded-2xl p-4 border transition-all duration-150 cursor-pointer select-none ${
        isDragging
          ? 'shadow-xl border-ink rotate-1 scale-[1.02]'
          : 'border-hairline hover:border-ink/40 hover:bg-canvas-soft/40 shadow-sm'
      }`}
    >
      {/* Top row: Project Dot + Name, and Quick Delete */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span
            className="dot flex-shrink-0"
            style={{ backgroundColor: card.project_color || '#3B82F6' }}
          />
          <span className="text-xs font-semibold text-ink truncate max-w-[140px]" title={card.project_name}>
            {card.project_name}
          </span>
          <span className="text-xs text-muted">/</span>
          <span className="text-xs text-muted truncate max-w-[100px]" title={card.group_name}>
            {card.group_name}
          </span>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center space-x-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {card.status === 'done' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(card.id);
              }}
              title="Arsipkan progres ini"
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-canvas-soft border border-hairline hover:bg-ink hover:text-white transition-colors"
            >
              <Archive className="w-3 h-3 inline mr-1" />
              Arsipkan
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            title="Hapus progres"
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Name */}
      <h3 className="font-semibold text-ink text-sm sm:text-base leading-snug mb-1.5 break-words">
        {card.name}
      </h3>

      {/* Description preview (if exists) */}
      {card.description && (
        <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed break-words">
          {card.description}
        </p>
      )}

      {/* Bottom row: Priority, Deadline / Overdue, Subtasks & Notes */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline/60 text-xs">
        {/* Left: Priority and Overdue */}
        <div className="flex items-center space-x-1.5">
          <span className={`chip text-[11px] font-medium ${getPriorityBadgeClass(card.priority)}`}>
            {getPriorityLabel(card.priority)}
          </span>

          {card.is_overdue && (
            <span className="chip text-[11px] font-semibold bg-red-100 text-overdue border border-red-200 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Terlambat</span>
            </span>
          )}
        </div>

        {/* Right: Date, Subtasks, Notes */}
        <div className="flex items-center space-x-2 text-muted text-[11px]">
          {card.subtask_total > 0 && (
            <span
              className={`flex items-center space-x-1 ${
                card.subtask_done === card.subtask_total ? 'text-emerald-600 font-medium' : ''
              }`}
              title={`${card.subtask_done} dari ${card.subtask_total} sub tugas selesai`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>
                {card.subtask_done}/{card.subtask_total}
              </span>
            </span>
          )}

          {card.notes && (
            <span title="Memiliki catatan" className="text-muted hover:text-ink">
              <FileText className="w-3 h-3" />
            </span>
          )}

          <div
            className={`flex items-center space-x-1 ${
              card.is_overdue ? 'text-overdue font-medium' : 'text-muted'
            }`}
            title={`Deadline: ${card.deadline}`}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDateID(card.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
