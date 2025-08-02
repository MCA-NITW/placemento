import { useCallback, useState } from 'react';

// Custom hook for managing filter state and logic
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [isFiltered, setIsFiltered] = useState(false);

  // Update a specific filter
  const updateFilter = useCallback((filterKey, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[filterKey] || [];
      const isValueIncluded = currentValues.includes(value);
      
      // Toggle the filter value
      const newValues = isValueIncluded 
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const newFilters = {
        ...prevFilters,
        [filterKey]: newValues
      };
      
      // Check if any filters are active
      const hasActiveFilters = Object.values(newFilters).some(arr => arr.length > 0);
      setIsFiltered(hasActiveFilters);
      
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setIsFiltered(false);
  }, [initialFilters]);

  // Clear a specific filter
  const clearFilter = useCallback((filterKey) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: []
    }));
  }, []);

  // Check if a specific filter is active
  const isFilterActive = useCallback((filterKey, value) => {
    return (filters[filterKey] || []).includes(value);
  }, [filters]);

  return {
    filters,
    isFiltered,
    updateFilter,
    clearFilters,
    clearFilter,
    isFilterActive
  };
};

// Hook for common filter checks
export const useFilterChecks = () => {
  // CTC range filter check
  const checkCTCRange = useCallback((ctc, selectedRanges) => {
    if (selectedRanges.length === 0) return true;
    if (selectedRanges.includes(10)) return ctc < 10;
    if (selectedRanges.includes(20)) return ctc >= 10 && ctc < 20;
    if (selectedRanges.includes(30)) return ctc >= 20 && ctc < 30;
    if (selectedRanges.includes(31)) return ctc >= 30;
    return false;
  }, []);

  // Base salary range filter check
  const checkBaseRange = useCallback((base, selectedRanges) => {
    if (selectedRanges.length === 0) return true;
    if (selectedRanges.includes(5)) return base < 5;
    if (selectedRanges.includes(10)) return base >= 5 && base < 10;
    if (selectedRanges.includes(15)) return base >= 10 && base < 15;
    if (selectedRanges.includes(16)) return base >= 15;
    return false;
  }, []);

  // CGPA range filter check
  const checkCGPARange = useCallback((cgpa, selectedRanges) => {
    if (selectedRanges.length === 0) return true;
    if (selectedRanges.includes(6.5)) return cgpa < 6.5;
    if (selectedRanges.includes(7)) return cgpa >= 6.5 && cgpa < 7;
    if (selectedRanges.includes(7.5)) return cgpa >= 7 && cgpa < 7.5;
    if (selectedRanges.includes(8)) return cgpa >= 7.5 && cgpa < 8;
    if (selectedRanges.includes(9)) return cgpa >= 8;
    return false;
  }, []);

  // Simple inclusion check (for arrays and simple values)
  const checkIncludes = useCallback((filterValues, dataValue) => {
    return filterValues.length === 0 || filterValues.includes(dataValue);
  }, []);

  // Numeric range check (for shortlists, selects, etc.)
  const checkNumericRange = useCallback((value, selectedRanges) => {
    if (selectedRanges.length === 0) return true;
    return selectedRanges.some(range => {
      if (range === 4) return value >= 4; // Handle ">3" case
      return value === range;
    });
  }, []);

  return {
    checkCTCRange,
    checkBaseRange,
    checkCGPARange,
    checkIncludes,
    checkNumericRange
  };
};

// Hook for creating table filter handlers
export const useTableFilters = (filterOptions, checkFunctions) => {
  const { filters, isFiltered, updateFilter } = useFilters();

  // Handle filter option clicks
  const handleFilterClick = useCallback((filterKey, value) => {
    updateFilter(filterKey, value);
    
    // Update UI state for filter buttons
    const element = document.getElementById(`${filterKey.toLowerCase()}-${value}`);
    if (element) {
      element.classList.toggle('active');
    }
  }, [updateFilter]);

  // Check if external filter is present
  const isExternalFilterPresent = useCallback(() => {
    return isFiltered;
  }, [isFiltered]);

  // Main filter function
  const doesExternalFilterPass = useCallback((node) => {
    if (!node.data) return true;
    
    const { data } = node;
    
    // Apply all filter checks
    return Object.entries(filters).every(([filterKey, filterValues]) => {
      if (filterValues.length === 0) return true;
      
      const checkFunction = checkFunctions[filterKey];
      if (checkFunction) {
        return checkFunction(data, filterValues);
      }
      
      // Default inclusion check
      return filterValues.includes(data[filterKey]);
    });
  }, [filters, checkFunctions]);

  return {
    filters,
    isFiltered,
    handleFilterClick,
    isExternalFilterPresent,
    doesExternalFilterPass
  };
};
