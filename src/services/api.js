const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchJobs(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/jobs/${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('خطا در دریافت لیست مشاغل');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchJobs):', error);
    return null;
  }
}

export async function fetchJobById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/`);
    if (!res.ok) throw new Error('خطا در دریافت جزئیات شغل');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchJobById):', error);
    return null;
  }
}

export async function fetchJobCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/jobs/categories/`);
    if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchJobCategories):', error);
    return [];
  }
}

export async function fetchFaqs(category = '') {
  try {
    const url = `${API_BASE_URL}/api/qa/faqs/${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('خطا در دریافت سوالات متداول');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchFaqs):', error);
    return null;
  }
}

export async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/qa/questions/`);
    if (!res.ok) throw new Error('خطا در دریافت سوالات کاربران');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchQuestions):', error);
    return null;
  }
}

export async function submitQuestion(data) {
  const res = await fetch(`${API_BASE_URL}/api/qa/questions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'خطا در ثبت سوال');
  }
  return result;
}

export async function fetchActiveQuiz() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/quiz/active/`);
    if (!res.ok) throw new Error('خطا در دریافت مسابقه');
    return await res.json();
  } catch (error) {
    console.warn('API Error (fetchActiveQuiz):', error);
    return null;
  }
}

export async function submitQuizAnswer(data) {
  const res = await fetch(`${API_BASE_URL}/api/quiz/submit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'خطا در ثبت پاسخ مسابقه');
  }
  return result;
}

export default {
  API_BASE_URL,
  fetchJobs,
  fetchFaqs,
  fetchQuestions,
  submitQuestion,
  fetchActiveQuiz,
  submitQuizAnswer,
};
