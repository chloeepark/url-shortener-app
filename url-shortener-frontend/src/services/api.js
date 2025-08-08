import axios from 'axios';

// 환경 변수에서 API URL 가져오기 (fallback 포함)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://urlatch.netlify.app/' // 기본 배포 URL
    : 'http://localhost:3000'); // 기본 개발 URL

console.log('🔗 API Base URL:', API_BASE_URL);

// Axios 인스턴스 생성 (타임아웃 설정)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2분 타임아웃 (Render Cold Start 대응)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const shortenUrl = async (originalUrl) => {
  try {
    console.log('🚀 URL 단축 요청 중...');
    const response = await apiClient.post('/shorten', { originalUrl });
    
    return {
      shortUrl: response.data.shortUrl,
      displayUrl: response.data.shortId || response.data.shortUrl.split('/').pop()
    };
  } catch (error) {
    console.error('❌ URL 단축 실패:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw { message: '서버가 시작 중입니다. 잠시 후 다시 시도해주세요. (최대 2분 소요)' };
    }
    
    if (error.response?.status === 400) {
      throw { message: '잘못된 URL 형식입니다. 올바른 URL을 입력해주세요.' };
    }
    
    if (error.response?.status === 502 || error.response?.status === 503) {
      throw { message: '서버가 시작 중입니다. 1-2분 후 다시 시도해주세요.' };
    }
    
    throw { message: error.response?.data?.message || '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
};
