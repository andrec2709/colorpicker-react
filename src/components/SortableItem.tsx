import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ITEM } from '../App';

export function SortableItem({ id, data }: { id: string, data: ITEM }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const [isActive, setIsActive] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isActive ? 'rgb(255,255,140)' : `rgb(${data.color.join(',')})`,

  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`touch-pan-y w-20 h-10`}>
      <div 
      onPointerDown={() => setIsActive(true)} 
      onPointerUp={() => setIsActive(false)}
      className='w-full h-full'
      >
        {id}
      </div>
    </div>
  );
}