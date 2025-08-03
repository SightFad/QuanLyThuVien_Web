import { useState, useMemo } from 'react';

/**
 * Custom hook để quản lý pagination
 * @param {array} data - Dữ liệu cần phân trang
 * @param {number} itemsPerPage - Số items mỗi trang
 * @returns {object} Pagination state và methods
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán các thông số pagination
  const pagination = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);
    
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    
    return {
      currentData,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage,
      hasPrevPage,
    };
  }, [data, currentPage, itemsPerPage]);

  // Chuyển đến trang cụ thể
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  // Trang tiếp theo
  const nextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Trang trước
  const prevPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Trang đầu
  const firstPage = () => {
    setCurrentPage(1);
  };

  // Trang cuối
  const lastPage = () => {
    setCurrentPage(pagination.totalPages);
  };

  // Reset về trang đầu khi data thay đổi
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    ...pagination,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    resetPage,
  };
};

/**
 * Custom hook để tạo page numbers cho pagination UI
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @param {number} siblingCount - Số trang hiển thị bên cạnh trang hiện tại
 * @returns {array} Array các page numbers
 */
export const usePaginationRange = (currentPage, totalPages, siblingCount = 1) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // Start, end, current, và 2 dots

    // Nếu số trang ít hơn totalPageNumbers, return tất cả
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Không hiển thị dots bên phải
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // Không hiển thị dots bên trái
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    // Hiển thị dots cả 2 bên
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount]);

  return paginationRange;
};