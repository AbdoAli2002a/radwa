import React, { useState, useEffect } from 'react';
import { sections } from './data';
import { Menu, X, ChevronLeft, GraduationCap, ChevronRight, BookOpen, ListChecks, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Quiz } from './components/Quiz';

export default function App() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showSummary, setShowSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeContent = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans text-right selection:bg-orange-200" dir="rtl">
      {/* Header */}
      <header className="bg-indigo-900 text-white p-4 md:p-6 flex justify-between items-center shrink-0 border-b-4 border-orange-500 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
          </div>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight uppercase">دليل المتدرب الرقمي لنظام Moodle</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsReadingMode(!isReadingMode)}
            className={`hidden md:flex px-4 py-2 rounded-lg items-center gap-2 text-sm font-bold transition-colors ${
              isReadingMode ? 'bg-orange-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen size={16} />
            <span>{isReadingMode ? 'إلغاء وضع القراءة' : 'وضع القراءة'}</span>
          </button>
          <button className="md:hidden p-2 rounded-lg bg-white/10 text-white" onClick={() => setIsReadingMode(!isReadingMode)}>
            <BookOpen size={20} className={isReadingMode ? 'text-orange-400' : ''} />
          </button>
          <button className="md:hidden p-2 rounded-lg bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className={`flex-grow p-4 md:p-6 flex flex-col md:flex-row gap-4 overflow-hidden relative mx-auto w-full ${isReadingMode ? 'max-w-4xl' : 'max-w-[1400px]'}`}>
        {/* Sidebar */}
        <AnimatePresence>
          {(isMobileMenuOpen || (!isReadingMode && isDesktop)) && (
            <motion.aside
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`
                fixed md:static inset-y-0 right-0 z-10
                w-72 bg-white rounded-xl shadow-sm border border-slate-200
                flex flex-col h-[calc(100vh-80px)] md:h-full shrink-0
                ${isMobileMenuOpen ? 'top-[70px]' : 'top-0'}
              `}
            >
              <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="ابحث في الدليل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 block pr-10 p-2.5 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 border-b pb-2">
                    استكشاف المحتوى
                  </div>
                  {sections.filter(section => 
                    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    section.content.some(c => 'text' in c && c.text?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (section.summary && section.summary.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
                  ).length > 0 ? (
                    sections.filter(section => 
                      section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      section.content.some(c => 'text' in c && c.text?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (section.summary && section.summary.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
                    ).map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setIsMobileMenuOpen(false);
                            setShowSummary(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg text-right transition-all text-xs font-bold border
                            ${isActive 
                              ? 'bg-indigo-900 text-white shadow-sm border-transparent' 
                              : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300'}
                          `}
                        >
                          <Icon size={16} className={isActive ? 'text-orange-400' : 'text-slate-400'} />
                          <span>{section.title}</span>
                          {isActive && <ChevronLeft size={14} className="mr-auto text-orange-400" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      لم يتم العثور على نتائج للبحث "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-0 md:hidden top-[70px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className={`flex-1 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 overflow-y-auto relative h-full w-full ${isReadingMode ? 'md:p-12' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col min-h-full"
            >
              <h2 className={`${isReadingMode ? 'text-3xl mt-4 mb-8 text-indigo-950 font-black border-b-2 border-orange-500 pb-4' : 'text-xl font-black text-indigo-900 mb-6 border-b border-slate-100 pb-3'} flex items-center gap-3`}>
                <activeContent.icon size={isReadingMode ? 32 : 24} className="text-orange-500" />
                {activeContent.title}
              </h2>
              
              <div className="space-y-4 text-slate-700 flex-grow">
                {activeContent.content.map((block, idx) => {
                  if (block.type === 'heading') {
                    return <h3 key={idx} className={`${isReadingMode ? 'text-2xl font-bold text-indigo-900 mt-10 mb-4' : 'text-sm font-bold text-indigo-600 mb-2 mt-6'}`}>{block.text}</h3>;
                  }
                  if (block.type === 'paragraph') {
                    return (
                      <div key={idx} className={isReadingMode ? "my-6" : "p-3 bg-slate-50 rounded-lg border border-slate-100"}>
                        <p className={`${isReadingMode ? 'text-xl leading-loose text-slate-800' : 'text-[12px] leading-relaxed text-slate-600'}`}>{block.text}</p>
                      </div>
                    );
                  }
                  if (block.type === 'image') {
                    return (
                      <div key={idx} className={`mt-6 mb-4 overflow-hidden rounded-xl border border-slate-200 shadow-sm ${isReadingMode ? 'max-w-3xl mx-auto my-8' : ''}`}>
                        <img src={block.src} alt={block.alt} className={`w-full h-auto object-cover ${isReadingMode ? 'max-h-[500px]' : 'max-h-[300px]'}`} referrerPolicy="no-referrer" />
                      </div>
                    );
                  }
                  if (block.type === 'list') {
                    return (
                      <div key={idx} className={isReadingMode ? "my-6" : "p-4 bg-slate-50 rounded-lg border border-slate-100 mt-2"}>
                        <ul className={isReadingMode ? "space-y-4 pl-4" : "space-y-2"}>
                          {block.items?.map((item, i) => (
                            <li key={i} className={`${isReadingMode ? 'text-xl leading-relaxed text-slate-800' : 'text-[12px] text-slate-600'} flex items-start gap-3`}>
                              <span className={`w-2 h-2 bg-orange-500 rounded-full shrink-0 ${isReadingMode ? 'mt-2.5' : 'mt-1.5'}`}></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  if (block.type === 'warning') {
                    return (
                      <div key={idx} className={`bg-red-50 rounded-lg flex flex-col gap-2 mt-6 ${isReadingMode ? 'p-6 border-r-4 border-red-500' : 'p-3 border border-red-100'}`}>
                        <p className={`${isReadingMode ? 'text-lg text-red-800' : 'text-[10px] text-red-700'} font-bold flex items-center gap-2`}>
                          {isReadingMode && <span>⚠️</span>}
                          تحذير هام!
                        </p>
                        <p className={`${isReadingMode ? 'text-lg text-red-700' : 'text-[10px] text-red-600'}`}>{block.text}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Summary Section */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                    showSummary 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${showSummary ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      <ListChecks size={20} />
                    </div>
                    <span className="font-bold text-sm md:text-base">ملخص القسم (النقاط الرئيسية)</span>
                  </div>
                  {showSummary ? <ChevronUp size={20} className="text-indigo-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {showSummary && activeContent.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 mt-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <ul className="space-y-3">
                          {activeContent.summary.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0"></span>
                              <span className="text-sm md:text-base text-indigo-900/80 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quiz Section */}
              {activeContent.quiz && (
                <Quiz quiz={activeContent.quiz} sectionId={activeContent.id} />
              )}

              {/* Navigation Buttons */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                {(() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  const prev = sections[currentIndex - 1];
                  const next = sections[currentIndex + 1];
                  
                  return (
                    <>
                      {prev ? (
                        <button 
                          onClick={() => {
                            setActiveSection(prev.id);
                            setShowSummary(false);
                          }}
                          className={`px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 ${isReadingMode ? 'text-base px-6 py-3' : ''}`}
                        >
                          <ChevronRight size={isReadingMode ? 20 : 16} />
                          <span>السابق: {prev.title}</span>
                        </button>
                      ) : <div></div>}

                      {next ? (
                        <button 
                          onClick={() => {
                            setActiveSection(next.id);
                            setShowSummary(false);
                          }}
                          className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 ${isReadingMode ? 'text-base px-6 py-3' : ''}`}
                        >
                          <span>التالي: {next.title}</span>
                          <ChevronLeft size={isReadingMode ? 20 : 16} />
                        </button>
                      ) : <div></div>}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
