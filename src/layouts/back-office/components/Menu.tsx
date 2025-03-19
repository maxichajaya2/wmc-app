import { cn } from '@/lib/utils';
import { ChevronUp, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Group, MenuItem as MenuItemModel } from '@/models';
import { ScrollArea, ScrollBar } from '@/components';

interface MenuProps {
  group: Group;
}

const MenuItem: React.FC<{ item: MenuItemModel; level: number; isLast: boolean; margin?: number }> = ({ item, level, isLast, margin = 6 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [height, setHeight] = useState<number | 'auto'>(0);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isExpanded && ref.current) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded, item.items]);

  return (
    <li className={`relative transition-all duration-300`}>
      <div className={`flex items-center py-2 ml-6`}>
        {level > 0 && (
          <span className="absolute left-0 top-0 h-full w-6">
            <span className={`absolute left-0 ${isLast ? 'h-1/2' : 'h-full'} w-px bg-gray-300`}></span>
            <span className="absolute top-1/2 h-px w-5 bg-gray-300"></span>
          </span>
        )}
        <div className={`mr-${margin}`}>
          <span className="absolute left-0 top-0 h-full w-6">
            <span className={`absolute left-0 ${isLast ? 'h-1/2' : 'h-full'} w-px bg-gray-300`}></span>
            <span className="absolute left-0 top-1/2 h-px w-5 bg-gray-300"></span>
          </span>
        </div>
        <div className="flex justify-between items-center p-0 w-48">
          <Link to={item.url || '#'} className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">{item.name}</h2>
          </Link>
          {item.items && (
            <button onClick={() => setIsExpanded((prev) => !prev)} className="text-gray-600 hover:text-gray-800 w-6 h-6 bg-transparent rounded-full flex items-center justify-center">
              <ChevronUp size={16} strokeWidth={2} className={cn('transition-all duration-500', { 'transform rotate-180': isExpanded })} />
            </button>
          )}
        </div>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
            {item.badge}
          </span>
        )}
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          { 'opacity-0': !isExpanded }
        )}
        style={{ height: `${height}px` }}
      >
        <ul
          ref={ref}
          className={cn(
            "ml-6 transition-all duration-300 ease-in-out",
            { 'translate-y-[-10px]': !isExpanded }
          )}
        >
          {item.items?.map((subItem, index) => (
            <MenuItem
              key={`${item.name}-${subItem.name}-${index}`}
              item={subItem}
              level={level + 1}
              isLast={index === item.items!.length - 1}
              margin={margin + 1}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

export const Menu: React.FC<MenuProps> = ({ group }) => {
  return (
    <div className="w-48 bg-transparent rounded-lg">
      <div className="flex justify-between items-center p-0">
        <h2 className="text-lg font-semibold">{group.name}</h2>
        <button className="text-gray-600 hover:text-gray-800 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
      <ScrollArea className='h-[calc(100vh-150px)] w-[240px]'>
        <ul className="py-2">
          {group.menus.map((item, index) => (
            <MenuItem key={`${group.name}-${item.name}-${index}`} item={item} level={0} isLast={index === group.menus.length - 1} />
          ))}
          <ScrollBar orientation='horizontal' />
        </ul>
      </ScrollArea>
    </div>
  );
};
