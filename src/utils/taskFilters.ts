import { TaskFilters, TaskStatus, Priority } from '../types';

export function parseTaskFilters(searchParams: URLSearchParams): TaskFilters {
  const statusParam = searchParams.get('status');
  const priorityParam = searchParams.get('priority');
  const projectParam = searchParams.get('projectId');
  const devParam = searchParams.get('assignedDeveloperId');
  const queryParam = searchParams.get('search');
  const dateRangeParam = searchParams.get('dateRange');
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  return {
    status: (statusParam as TaskStatus) || 'ALL',
    priority: (priorityParam as Priority) || 'ALL',
    projectId: projectParam || 'ALL',
    assignedDeveloperId: devParam || 'ALL',
    searchQuery: queryParam || '',
    dateRange: (dateRangeParam as any) || 'ALL',
    from: fromParam || undefined,
    to: toParam || undefined,
  };
}

export function serializeTaskFilters(filters: TaskFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  if (filters.priority && filters.priority !== 'ALL') {
    params.set('priority', filters.priority);
  }
  if (filters.projectId && filters.projectId !== 'ALL') {
    params.set('projectId', filters.projectId);
  }
  if (filters.assignedDeveloperId && filters.assignedDeveloperId !== 'ALL') {
    params.set('assignedDeveloperId', filters.assignedDeveloperId);
  }
  if (filters.searchQuery && filters.searchQuery.trim()) {
    params.set('search', filters.searchQuery.trim());
  }
  if (filters.dateRange && filters.dateRange !== 'ALL') {
    params.set('dateRange', filters.dateRange);
  }
  if (filters.from) {
    params.set('from', filters.from);
  }
  if (filters.to) {
    params.set('to', filters.to);
  }

  return params;
}
