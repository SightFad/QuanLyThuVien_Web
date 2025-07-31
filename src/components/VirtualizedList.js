/**
 * Virtualized List Component for better performance with large datasets
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';

const VirtualizedList = ({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, visibleRange]);

  // Handle scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Offset for visible items
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            width: '100%',
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Virtualized Table Component
export const VirtualizedTable = ({
  columns = [],
  data = [],
  rowHeight = 50,
  headerHeight = 40,
  containerHeight = 400,
  className = '',
  ...props
}) => {
  const renderRow = (row, index) => (
    <div className="virtual-table-row" style={{ display: 'flex', width: '100%' }}>
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className="virtual-table-cell"
          style={{
            width: column.width || `${100 / columns.length}%`,
            padding: '8px 12px',
            borderRight: '1px solid #e5e7eb',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {column.render 
            ? column.render(row[column.key], row, index)
            : row[column.key]
          }
        </div>
      ))}
    </div>
  );

  return (
    <div className={`virtual-table ${className}`}>
      {/* Header */}
      <div 
        className="virtual-table-header"
        style={{
          height: headerHeight,
          display: 'flex',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
        }}
      >
        {columns.map((column, index) => (
          <div
            key={index}
            className="virtual-table-header-cell"
            style={{
              width: column.width || `${100 / columns.length}%`,
              padding: '8px 12px',
              borderRight: '1px solid #e5e7eb',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* Body */}
      <VirtualizedList
        items={data}
        itemHeight={rowHeight}
        containerHeight={containerHeight - headerHeight}
        renderItem={renderRow}
        {...props}
      />
    </div>
  );
};

// Virtualized Grid Component
export const VirtualizedGrid = ({
  items = [],
  itemWidth = 200,
  itemHeight = 200,
  containerWidth = 800,
  containerHeight = 600,
  gap = 16,
  renderItem,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Calculate grid dimensions
  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const totalHeight = totalRows * (itemHeight + gap) - gap;

  // Calculate visible range
  const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - 1);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + 1
  );

  // Get visible items
  const visibleItems = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < itemsPerRow; col++) {
      const index = row * itemsPerRow + col;
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          index,
          row,
          col,
        });
      }
    }
  }

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
    setScrollLeft(e.target.scrollLeft);
  };

  return (
    <div
      className={`virtualized-grid ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: col * (itemWidth + gap),
              top: row * (itemHeight + gap),
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;