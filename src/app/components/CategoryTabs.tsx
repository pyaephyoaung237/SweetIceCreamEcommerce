'use client';

import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  selected: number | 'all';
  onSelect: (id: number | 'all') => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: Props) {
  const tab = (active: boolean) =>
    `px-4 sm:px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition border ${
      active
        ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20'
        : 'bg-white text-slate-600 border-pink-100 hover:bg-pink-50 hover:text-pink-600'
    }`;

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button onClick={() => onSelect('all')} className={tab(selected === 'all')}>All Collection</button>
      {categories.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)} className={tab(selected === c.id)}>{c.name}</button>
      ))}
    </div>
  );
}