import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://zplink.netlify.app'
    : `http://localhost:${PORT}`);

// 메모리 저장소 (실제 운영에서는 데이터베이스 사용)
const urlDatabase = new Map();
const analytics = new Map(); // 클릭 수 추적

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://zplink.netlify.app',
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - IP당 분당 30회 요청 제한
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 30, // IP당 최대 30회 요청
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/shorten', limiter);

// URL 유효성 검사 함수
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// 고유한 nanoid 생성 (충돌 방지)
const generateUniqueId = (length = 7) => {
  let id;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    id = nanoid(length);
    attempts++;
    
    if (attempts >= maxAttempts) {
      // 7글자로 충돌이 계속 발생하면 8글자로 시도
      id = nanoid(8);
      break;
    }
  } while (urlDatabase.has(id));
  
  return id;
};

// 루트 경로 - API 상태 확인
app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener API is running!',
    version: '1.0.0',
    endpoints: {
      shorten: 'POST /shorten',
      redirect: 'GET /:shortId',
      stats: 'GET /stats/:shortId'
    },
    totalUrls: urlDatabase.size
  });
});

// URL 단축 API
app.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // 입력 검증
    if (!originalUrl) {
      return res.status(400).json({
        error: 'originalUrl is required'
      });
    }

    if (typeof originalUrl !== 'string') {
      return res.status(400).json({
        error: 'originalUrl must be a string'
      });
    }

    // URL 길이 제한
    if (originalUrl.length > 2048) {
      return res.status(400).json({
        error: 'URL is too long (max 2048 characters)'
      });
    }

    // URL 유효성 검사
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        error: 'Invalid URL format. URL must start with http:// or https://'
      });
    }

    // 기존 URL이 이미 단축되었는지 확인
    for (const [shortId, data] of urlDatabase.entries()) {
      if (data.originalUrl === originalUrl) {
        return res.json({
          shortUrl: `${BASE_URL}/${shortId}`,
          originalUrl: originalUrl,
          shortId: shortId,
          createdAt: data.createdAt,
          message: 'URL already shortened'
        });
      }
    }

    // 새로운 단축 ID 생성 (nanoid 7글자)
    const shortId = generateUniqueId(7);

    // 데이터베이스에 저장
    const urlData = {
      originalUrl: originalUrl,
      shortId: shortId,
      createdAt: new Date().toISOString(),
      clicks: 0,
      lastAccessed: null
    };

    urlDatabase.set(shortId, urlData);
    analytics.set(shortId, { clicks: 0, clickHistory: [] });

    // 응답 반환
    res.status(201).json({
      shortUrl: `${BASE_URL}/${shortId}`,
      originalUrl: originalUrl,
      shortId: shortId,
      createdAt: urlData.createdAt,
      message: 'URL shortened successfully'
    });

    console.log(`✅ URL shortened: ${originalUrl} → ${shortId} (${shortId.length} chars)`);

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to shorten URL'
    });
  }
});

// 단축 URL 리다이렉션
app.get('/:shortId', (req, res) => {
  try {
    const { shortId } = req.params;

    // shortId 유효성 검사
    if (!shortId || shortId.length < 6 || shortId.length > 10) {
      return res.status(400).json({
        error: 'Invalid short ID format',
        message: '잘못된 단축 URL 형식입니다.'
      });
    }

    const urlData = urlDatabase.get(shortId);
    
    if (!urlData) {
      return res.status(404).json({
        error: 'Short URL not found',
        message: 'This short URL does not exist or may have expired'
      });
    }

    // 클릭 수 증가 및 분석 데이터 업데이트
    urlData.clicks++;
    urlData.lastAccessed = new Date().toISOString();
    
    const analyticsData = analytics.get(shortId);
    if (analyticsData) {
      analyticsData.clicks++;
      analyticsData.clickHistory.push({
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent') || 'Unknown',
        ip: req.ip || req.connection.remoteAddress
      });
    }

    console.log(`🔗 Redirecting: ${shortId} → ${urlData.originalUrl} (${urlData.clicks} clicks)`);

    // 원본 URL로 리다이렉션
    console.log(`🔄 Redirecting to: ${urlData.originalUrl}`);
    return res.redirect(302, urlData.originalUrl);

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to redirect'
    });
  }
});

// URL 통계 조회 API
app.get('/stats/:shortId', (req, res) => {
  try {
    const { shortId } = req.params;
    
    const urlData = urlDatabase.get(shortId);
    const analyticsData = analytics.get(shortId);
    
    if (!urlData) {
      return res.status(404).json({
        error: 'Short URL not found'
      });
    }

    res.json({
      shortId: shortId,
      originalUrl: urlData.originalUrl,
      shortUrl: `${BASE_URL}/${shortId}`,
      createdAt: urlData.createdAt,
      lastAccessed: urlData.lastAccessed,
      totalClicks: urlData.clicks,
      analytics: {
        clicks: analyticsData?.clicks || 0,
        recentClicks: analyticsData?.clickHistory?.slice(-10) || []
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// 전체 통계 API
app.get('/api/stats', (req, res) => {
  try {
    const totalUrls = urlDatabase.size;
    const totalClicks = Array.from(urlDatabase.values()).reduce((sum, data) => sum + data.clicks, 0);
    
    res.json({
      totalUrls,
      totalClicks,
      activeUrls: Array.from(urlDatabase.values()).filter(data => data.clicks > 0).length
    });
  } catch (error) {
    console.error('Error getting global stats:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

// 에러 핸들러
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener server is running on ${BASE_URL}`);
  console.log(`📊 Dashboard: ${BASE_URL}/api/stats`);
  console.log(`🔗 Using nanoid for 7-character short URLs`);
  console.log('📝 Ready to shorten URLs!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});
