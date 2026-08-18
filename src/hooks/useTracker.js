import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getMonths, getTracker } from "../api/tracker.js";
import { filterTracker, hasActiveFilter } from "../lib/filter.js";

const TrackerContext = createContext(null);

const EMPTY_FILTERS = { employee: "", business: "", query: "" };

const yearOf = (month) => (month ?? "").slice(0, 4);

export function TrackerProvider({ children }) {
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const cache = useRef(new Map());

  const fetchMonth = useCallback(async (target, { force = false } = {}) => {
    if (!target) return;
    if (!force && cache.current.has(target)) {
      setState({ data: cache.current.get(target), loading: false, error: null });
      return;
    }
    setState((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await getTracker(target);
      cache.current.set(target, data);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  }, []);

  useEffect(() => {
    let active = true;
    getMonths()
      .then(({ months: list, defaultMonth }) => {
        if (!active || list.length === 0) return;
        setMonths(list);
        // Open on the newest month that has records, not the newest tab.
        const initial = defaultMonth && list.includes(defaultMonth) ? defaultMonth : list[0];
        setMonth((current) => current ?? initial);
      })
      .catch((error) => active && setState({ data: null, loading: false, error: error.message }));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    fetchMonth(month);
  }, [month, fetchMonth]);

  const years = useMemo(() => [...new Set(months.map(yearOf))].sort().reverse(), [months]);
  const year = yearOf(month);

  const setYear = useCallback(
    (nextYear) => {
      const inYear = months.filter((value) => yearOf(value) === nextYear);
      if (inYear.length === 0) return;
      setMonth((current) => (inYear.includes(current) ? current : inYear[0]));
    },
    [months],
  );

  const monthsInYear = useMemo(() => months.filter((value) => yearOf(value) === year), [months, year]);

  const setFilter = useCallback((key, value) => setFilters((current) => ({ ...current, [key]: value })), []);
  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const filtered = useMemo(() => filterTracker(state.data, filters), [state.data, filters]);

  const value = {
    ...state,
    data: filtered,
    rawData: state.data,
    monthsInYear,
    month,
    setMonth,
    years,
    year,
    setYear,
    filters,
    setFilter,
    clearFilters,
    filtersActive: hasActiveFilter(filters),
    refetch: () => fetchMonth(month, { force: true }),
  };

  return createElement(TrackerContext.Provider, { value }, children);
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) throw new Error("useTracker must be used inside TrackerProvider");
  return context;
}
