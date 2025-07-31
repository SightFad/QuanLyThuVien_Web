import React from 'react';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { usePaginationRange } from '../../hooks';
import Button from './Button';

/**
 * Shared Pagination Component
 * @param {object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {function} props.onPageChange - Page change handler
 * @param {number} props.siblingCount - Number of siblings shown around current page
 * @param {boolean} props.showFirstLast - Show first/last page buttons
 * @param {boolean} props.showInfo - Show pagination info
 * @param {string} props.className - Additional CSS classes
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showInfo = true,
  className = ''
}) => {
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount);

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`pagination-container ${className}`}>
      {showInfo && (
        <div className="pagination-info">
          <span className="text-sm text-gray-700">
            Hiển thị {startItem} - {endItem} của {totalItems} kết quả
          </span>
        </div>
      )}
      
      <div className="pagination-controls">
        {/* First page button */}
        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
            icon={<FaAngleDoubleLeft />}
            title="Trang đầu"
          />
        )}

        {/* Previous page button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          icon={<FaChevronLeft />}
          title="Trang trước"
        />

        {/* Page numbers */}
        <div className="pagination-numbers">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === '...') {
              return (
                <span key={index} className="pagination-dots">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={index}
                variant={pageNumber === currentPage ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="pagination-number"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next page button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          icon={<FaChevronRight />}
          title="Trang sau"
        />

        {/* Last page button */}
        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            icon={<FaAngleDoubleRight />}
            title="Trang cuối"
          />
        )}
      </div>
    </div>
  );
};

// Simple pagination với chỉ prev/next
export const SimplePagination = ({
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  className = ''
}) => {
  return (
    <div className={`simple-pagination ${className}`}>
      <Button
        variant="outline-primary"
        size="sm"
        disabled={!hasPrevPage}
        onClick={onPrevPage}
        icon={<FaChevronLeft />}
      >
        Trước
      </Button>
      
      <Button
        variant="outline-primary"
        size="sm"
        disabled={!hasNextPage}
        onClick={onNextPage}
      >
        Sau
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;