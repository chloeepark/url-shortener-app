import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shortenUrl } from './services/api';
import LanguageToggle from './components/LanguageToggle';
import { Link, Zap, Shield, Users, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl) {
      setError(t('error.enterUrl'));
      return;
    }

    // 기본적인 URL 형식 검사
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      setError('URL은 http:// 또는 https://로 시작해야 합니다.');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const data = await shortenUrl(originalUrl);
      const shortId = data.shortUrl.split('/').pop();
      setShortUrl({
        shortUrl: data.shortUrl,
        displayUrl: shortId
      });
    } catch (err) {
      console.error('단축 실패:', err);
      setError(err.message || t('error.failedToShorten'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleShorten();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const clearInput = () => {
    setOriginalUrl('');
    setShortUrl(null);
    setError('');
    setCopied(false);
  };

  return (
    <div className="container">
      <LanguageToggle />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="title">{t('title')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          
          <div className="input-section">
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  className="url-input"
                  type="text"
                  placeholder={t('placeholder')}
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {originalUrl && (
                  <button className="clear-button" onClick={clearInput}>
                    ×
                  </button>
                )}
              </div>
              <button 
                className={`shorten-button ${loading ? 'loading' : ''}`}
                onClick={handleShorten}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-content">
                    <div className="spinner"></div>
                    {t('shortening')}
                  </span>
                ) : (
                  t('shortenButton')
                )}
              </button>
            </div>

            {shortUrl && (
              <div className="result">
                <p className="result-label">
                  <CheckCircle size={16} />
                  {t('result')}
                </p>
                <div className="url-result-container">
                  <div className="shortened-url-wrapper">
                    <a 
                      href={shortUrl.shortUrl}
                      className="shortened-url" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {shortUrl.displayUrl}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <button 
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={14} />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        {t('copyButton')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="error">{error}</p>}
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <Users size={18} />
              </div>
              <span>{t('features.free')}</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Zap size={18} />
              </div>
              <span>{t('features.fast')}</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Shield size={18} />
              </div>
              <span>{t('features.secure')}</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Link size={18} />
              </div>
              <span>{t('features.noSignup')}</span>
            </div>
          </div>
        </div>
        
        <div className="footer">
          <p>© 2025 ZPLink. Built with ❤️ using React & Vite</p>
        </div>
      </div>
    </div>
  );
}

export default App;
