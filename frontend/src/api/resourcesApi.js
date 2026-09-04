import { SAMPLE_RESOURCES } from '../data/resources';
import { getResourceById, processResources } from '../utils/resourceUtils';
import { recommendResources as recommendLocally } from '../utils/recommendationEngine';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

async function readJson(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Request failed');
    error.status = response.status;
    error.errors = payload.errors || null;
    throw error;
  }
  return payload;
}

export async function fetchResources(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.subject) params.set('subject', filters.subject);
  if (filters.educationLevel) params.set('educationLevel', filters.educationLevel);
  if (filters.language) params.set('language', filters.language);
  if (filters.type) params.set('type', filters.type);
  if (filters.sort) params.set('sort', filters.sort);

  try {
    const response = await fetch(`${API_BASE}/resources?${params.toString()}`);
    const payload = await readJson(response);
    const apiResources = payload.data || [];
    const ids = new Set(apiResources.map((resource) => resource.id));
    const merged = [
      ...apiResources,
      ...SAMPLE_RESOURCES.filter((resource) => !ids.has(resource.id)),
    ];
    const processed = processResources(merged, filters);
    return {
      resources: processed.resources,
      resultCount: processed.resultCount,
      source: payload.meta?.source || 'api',
    };
  } catch {
    const local = processResources(SAMPLE_RESOURCES, filters);
    return { ...local, source: 'local' };
  }
}

export async function fetchResourceById(id) {
  try {
    const response = await fetch(`${API_BASE}/resources/${encodeURIComponent(id)}`);
    const payload = await readJson(response);
    return { resource: payload.data, source: 'api' };
  } catch {
    return {
      resource: getResourceById(SAMPLE_RESOURCES, id),
      source: 'local',
    };
  }
}

export async function requestRecommendations(values) {
  try {
    const response = await fetch(`${API_BASE}/resources/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const payload = await readJson(response);
    return { ...payload.data, source: 'api' };
  } catch (error) {
    if (error.errors) {
      throw error;
    }
    return { ...recommendLocally(SAMPLE_RESOURCES, values), source: 'local' };
  }
}

function sendForm(url, method, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      let payload = {};
      try {
        payload = JSON.parse(xhr.responseText || '{}') || {};
      } catch {
        // Keep an empty payload so the status-based error still has a message.
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload);
        return;
      }
      const error = new Error(payload.message || 'The resource could not be saved.');
      error.status = xhr.status;
      error.errors = payload.errors || null;
      reject(error);
    };
    xhr.onerror = () => {
      reject(new Error('The upload was interrupted. Check your connection and try again.'));
    };
    xhr.send(formData);
  });
}

function toFormData(values, file, extra = {}) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  Object.entries(extra).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (file) {
    formData.append('file', file);
  }
  return formData;
}

export async function createResource(values, file, onProgress) {
  const payload = await sendForm(
    `${API_BASE}/resources`,
    'POST',
    toFormData(values, file),
    onProgress
  );
  return payload.data;
}

export async function updateResource(id, values, file, onProgress, extra = {}) {
  const payload = await sendForm(
    `${API_BASE}/resources/${encodeURIComponent(id)}`,
    'PUT',
    toFormData(values, file, extra),
    onProgress
  );
  return payload.data;
}

export async function deleteResource(id) {
  const response = await fetch(`${API_BASE}/resources/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  await readJson(response);
  return true;
}

export function getResourceFileUrl(resource) {
  if (!resource?.id) return '';
  return `${API_BASE}/resources/${encodeURIComponent(resource.id)}/file`;
}
