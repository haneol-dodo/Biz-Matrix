
import React, { useState, useEffect, useRef } from 'react';
import { generateBusinessIdeas } from './services/geminiService';
import { AnalysisResult } from './types';
import { LogicSection } from './components/LogicSection';

const EXAMPLES = [
  "1인창업가 카페운영 구독모델",
  "프리랜서 디자이너 뉴스레터 유료회원",
  "직장인 사이드프로젝트 노션템플릿 판매",
  "자영업자 리뷰관리 자동화 SaaS",
  "콘텐츠 크리에이터 숏폼 제작 대행",
  "스마트스토어 셀러 해외구매대행 자동화",
  "강사 커뮤니티 빌딩 멤버십",
  "스타트업 마케팅 툴 사용료 기반"
];

const App: React.FC = () => {
  const [field, setField] = useState(EXAMPLES[0]);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedField, setLastAnalyzedField] = useState('');

  const shuffleIndexRef = useRef(0);

  // Safe Shuffle Logic
  useEffect(() => {
    if (isInteracted || isFocused || loading || result) return;

    const interval = setInterval(() => {
      shuffleIndexRef.current = (shuffleIndexRef.current + 1) % EXAMPLES.length;
      setField(EXAMPLES[shuffleIndexRef.current]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isInteracted, isFocused, loading, result]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!field.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLastAnalyzedField(field.trim());

    try {
      const data = await generateBusinessIdeas(field.trim());
      setResult(data);
    } catch (err) {
      setError('분석 과정에서 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField(e.target.value);
    setIsInteracted(true);
  };

  const handleClear = () => {
    setField('');
    setIsInteracted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header & Input: Hidden in Print */}
      <header className="pt-24 pb-20 px-6 max-w-4xl mx-auto print:hidden">
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-4">Strategic Analysis Tool</p>
          <h1 className="text-4xl font-medium tracking-tight text-slate-900 mb-4">
            비즈니스 기회 발견 매트릭스
          </h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            타겟, 도메인, 모델을 조합하여 혁신 전략을 도출합니다. <br />
            전문적인 분석 리포트를 확인하세요.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="relative group">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            
            {/* Clear Button (Left-aligned) */}
            <div className="flex items-center justify-center w-12 shrink-0">
              {field.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer select-none"
                  title="지우기"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              )}
            </div>

            {/* Main Input */}
            <input
              type="text"
              value={field}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-grow py-5 text-lg font-medium bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
              spellCheck={false}
            />

            {/* Search Button (Right) */}
            <button
              type="submit"
              disabled={loading || !field.trim()}
              className="mr-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold rounded-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                "분석 실행"
              )}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 font-medium">
            예시: {EXAMPLES[2]}
          </p>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-32 print:pb-10 print:px-0">
        {error && (
          <div className="bg-white border border-slate-200 text-slate-600 p-6 rounded-lg mb-12 text-sm flex items-center gap-3 print:hidden">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            {error}
          </div>
        )}

        {loading && !result && (
          <div className="py-24 text-center print:hidden">
            <div className="inline-block w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 text-sm font-medium tracking-wide">데이터 분석 및 리포트 생성 중...</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Print-only Report Header */}
            <div className="hidden print:block mb-10 border-b-2 border-slate-900 pb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-2">Internal Strategic Document</p>
              <h1 className="text-3xl font-bold text-slate-900">Business Opportunity Matrix Analysis</h1>
              <p className="text-slate-500 text-sm mt-2">Strategic combinations based on Domain, Target, and Innovation Methodology.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm print:shadow-none print:border-none print:overflow-visible">
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 print:bg-white print:p-0 print:pb-8 print:border-slate-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 print:mb-2">Strategic Framework Result</h2>
                    <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">비즈니스 기회 매트릭스 리포트</h3>
                    <div className="mt-6 flex items-center gap-4 text-[13px] print:mt-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-bold">분석 대상:</span>
                        <span className="text-slate-700 font-medium">{lastAnalyzedField}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium tabular-nums">
                    Issue Date: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 print:border-slate-200">
                      <th className="w-40 py-8 px-6 text-[10px] font-bold text-slate-400 text-left uppercase tracking-widest border-r border-slate-50 print:border-slate-100">Innovation Strategy</th>
                      <th className="py-8 px-6 text-left border-r border-slate-50 print:border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Survival Type</span>
                      </th>
                      <th className="py-8 px-6 text-left border-r border-slate-50 print:border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Entrepreneur Type</span>
                      </th>
                      <th className="py-8 px-6 text-left">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expert Type</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matrix.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-50 last:border-0 align-top print:border-slate-100 break-inside-avoid">
                        <td className="p-6 border-r border-slate-50 print:border-slate-100">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-900">{row.strategy}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                              {row.strategy === 'Unbundling' ? '해체형 혁신' : row.strategy === 'Decoupling' ? '단계형 혁신' : '서비스형 혁신'}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 border-r border-slate-50 print:border-slate-100">
                          <div className="max-w-[200px] print:max-w-none">
                            <h4 className="text-[13px] font-bold text-slate-900 mb-2 leading-tight">{row.survival.name}</h4>
                            <p className="text-[12px] text-slate-500 leading-relaxed font-normal">{row.survival.description}</p>
                          </div>
                        </td>
                        <td className="p-6 border-r border-slate-50 print:border-slate-100">
                          <div className="max-w-[200px] print:max-w-none">
                            <h4 className="text-[13px] font-bold text-slate-900 mb-2 leading-tight">{row.entrepreneur.name}</h4>
                            <p className="text-[12px] text-slate-500 leading-relaxed font-normal">{row.entrepreneur.description}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="max-w-[200px] print:max-w-none">
                            <h4 className="text-[13px] font-bold text-slate-900 mb-2 leading-tight">{row.expert.name}</h4>
                            <p className="text-[12px] text-slate-500 leading-relaxed font-normal">{row.expert.description}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="page-break-before">
              <LogicSection logic={result.logicBreakdown} result={result} field={lastAnalyzedField} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;