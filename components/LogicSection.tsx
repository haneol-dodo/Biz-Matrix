
import React from 'react';
import { LogicBreakdown, AnalysisResult } from '../types';

interface LogicSectionProps {
  logic: LogicBreakdown;
  result: AnalysisResult;
  field: string;
}

export const LogicSection: React.FC<LogicSectionProps> = ({ logic, result, field }) => {
  const handleExportTxt = () => {
    let content = `[비즈니스 기회 발견 매트릭스 리포트 - ${field}]\n\n`;
    result.matrix.forEach(row => {
      content += `전략: ${row.strategy}\n`;
      content += `- 생존형: ${row.survival.name}\n  ${row.survival.description}\n`;
      content += `- 창업가형: ${row.entrepreneur.name}\n  ${row.entrepreneur.description}\n`;
      content += `- 전문가형: ${row.expert.name}\n  ${row.expert.description}\n\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `biz-report-${field}.txt`;
    link.click();
  };

  return (
    <div className="mt-20 space-y-12 print:mt-0 print:pt-10">
      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-grow"></div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] shrink-0">
          Appendix: Logic & Methodology
        </h2>
        <div className="h-px bg-slate-200 flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 print:grid-cols-1 print:gap-8">
        <section className="break-inside-avoid">
          <h3 className="text-[13px] font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
            Unbundling Logic
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Dimension</p>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{logic.unbundling.dimension}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Discarded Elements</p>
              <p className="text-[13px] text-slate-500 leading-relaxed italic">{logic.unbundling.discarded}</p>
            </div>
          </div>
        </section>

        <section className="break-inside-avoid">
          <h3 className="text-[13px] font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
            Decoupling Logic
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">CVC Analysis</p>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{logic.decoupling.cvc}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Pain Point</p>
              <p className="text-[13px] text-slate-500 leading-relaxed italic">{logic.decoupling.painPoint}</p>
            </div>
          </div>
        </section>

        <section className="break-inside-avoid">
          <h3 className="text-[13px] font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
            Servitization Logic
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Core Product Definition</p>
              <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{logic.servitization.product}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Future Transformation</p>
              <p className="text-[13px] text-slate-500 leading-relaxed italic">{logic.servitization.transformation}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-12 border-t border-slate-100 flex flex-col items-center gap-4 print:hidden">
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()} 
            className="text-[12px] font-semibold bg-slate-900 text-white flex items-center gap-2 px-6 py-3 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-file-pdf"></i> 리포트 PDF 저장 / 인쇄
          </button>
          <button 
            onClick={handleExportTxt} 
            className="text-[12px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center gap-2 px-6 py-3 rounded-md hover:bg-white transition-colors"
          >
            <i className="fa-solid fa-file-export"></i> TXT 아카이브 다운로드
          </button>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          * PDF 저장 시 '인쇄' 대화상자에서 대상을 'PDF로 저장'으로 선택해주세요.
        </p>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block pt-10 text-center text-[10px] text-slate-400 italic">
        This report was generated using the Strategic Analysis Matrix Framework. Confidential.
      </div>
    </div>
  );
};