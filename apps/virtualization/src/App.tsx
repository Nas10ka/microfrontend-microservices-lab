import React, { useRef } from 'react';
import { useQuery, QueryClient, QueryClientProvider  } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

const queryClient = new QueryClient();

interface Item {
  id: number;
  title: string;
}

const fetchItems = async (): Promise<Item[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  
  const extendedData: Item[] = [];

  for (let i = 0; i < 100; i++) {
    data.forEach((item: { id: number; title: string }) => {
      extendedData.push({
        id: extendedData.length + 1,
        title: `${item.title} (${extendedData.length + 1})`,
      });
    });
  }
  return extendedData;
};

const VirtualizedList: React.FC = () => {
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  // 2. Посилання на контейнер зі скролом
  const parentRef = useRef<HTMLDivElement>(null);

  // 3. Налаштування віртуалізатора
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Приблизна висота одного рядка в пікселях
    overscan: 5, // Кількість елементів для рендерингу поза межами екрана для плавного скролу
  });

  if (isLoading) return <div>Завантаження даних...</div>;
  if (error) return <div>Помилка завантаження даних</div>;
  console.log(rowVirtualizer);
  return (
      <div style={{ padding: '20px' }}>
        <h2>Віртуалізований список (Елементів: {items.length})</h2>
        
        {/* Контейнер зі скролом */}
        <div
          ref={parentRef}
          style={{
            height: '600px', 
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
            position: 'relative',
          }}
        >
          {/* Внутрішній блок, що імітує повну висоту всіх елементів */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: '10px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #eee',
                    backgroundColor: virtualRow.index % 2 === 0 ? '#fafafa' : '#fff',
                  }}
                >
                  <strong>{item.id}.</strong> {item.title}
                </div>
              );
            })}
            </div>
          </div>
        </div>
  );
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <VirtualizedList />
    </QueryClientProvider>
  );
};
export default App;
