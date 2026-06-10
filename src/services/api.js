import { apiClient, setToken, clearToken } from './apiClient.js';
import { storage } from '../utils/storage.js';

const AUTH_USER_KEY = 'authUser';

export const api = {
  async register(payload) {
    const data = await apiClient.post('/auth/register', payload);
    setToken(data.token);
    storage.set(AUTH_USER_KEY, data.user);
    return data.user;
  },

  async login(credentials) {
    const data = await apiClient.post('/auth/login', credentials);
    setToken(data.token);
    storage.set(AUTH_USER_KEY, data.user);
    return data.user;
  },

  logout() {
    clearToken();
    storage.remove(AUTH_USER_KEY);
  },

  getCurrentUser() {
    return storage.get(AUTH_USER_KEY);
  },

  async refreshCurrentUser() {
    if (!apiClient.isAuthenticated()) return null;
    try {
      const data = await apiClient.get('/auth/me', { auth: true });
      storage.set(AUTH_USER_KEY, data.user);
      return data.user;
    } catch {
      return null;
    }
  },

  async updateProfile(profile) {
    const data = await apiClient.put('/auth/me', profile, { auth: true });
    storage.set(AUTH_USER_KEY, data.user);
    return data.user;
  },

  async getJobs(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    const data = await apiClient.get(
      `/jobs${qs.toString() ? `?${qs}` : ''}`,
    );
    return data.jobs;
  },

  async getJob(id) {
    const data = await apiClient.get(`/jobs/${id}`);
    return data.job;
  },

  async addJob(job) {
    const data = await apiClient.post('/jobs', job, { auth: true });
    return data.job;
  },

  async updateJob(job) {
    const data = await apiClient.put(`/jobs/${job.id}`, job, { auth: true });
    return data.job;
  },

  async deleteJob(id) {
    await apiClient.del(`/jobs/${id}`, { auth: true });
    return id;
  },

  async getSavedJobs() {
    const data = await apiClient.get('/saved', { auth: true });
    return data.saved;
  },

  async saveJob(job) {
    await apiClient.post('/saved', { job }, { auth: true });
    return job;
  },

  async removeSavedJob(jobId) {
    await apiClient.del(`/saved/${jobId}`, { auth: true });
    return jobId;
  },

  async getApplications() {
    const data = await apiClient.get('/applications', { auth: true });
    return data.applications;
  },

  async submitApplication(payload) {
    await apiClient.post('/applications', payload, { auth: true });
    return payload;
  },

  async updateApplicationStatus(jobId, status) {
    await apiClient.put(`/applications/${jobId}/status`, { status }, { auth: true });
    return { jobId, status };
  },

  async withdrawApplication(jobId) {
    await apiClient.del(`/applications/${jobId}`, { auth: true });
    return jobId;
  },

  async getJobApplicants(jobId) {
    const data = await apiClient.get(`/applications/job/${jobId}`, { auth: true });
    return data.applicants;
  },
};
