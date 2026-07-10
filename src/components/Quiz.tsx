import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, RefreshCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  quiz: { questions: Question[] };
  sectionId: string;
}

export function Quiz({ quiz, sectionId }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset state when section changes
  React.useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  }, [sectionId]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-indigo-900 mb-2">اكتمل الاختبار السريع!</h3>
        <p className="text-slate-600 mb-4">لقد أجبت بشكل صحيح على {score} من أصل {quiz.questions.length} أسئلة.</p>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(score / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <button 
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition-colors"
        >
          <RefreshCcw size={16} />
          إعادة الاختبار
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 mt-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
          <HelpCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">اختبر معلوماتك</h3>
          <p className="text-xs text-slate-500">سؤال {currentQuestionIndex + 1} من {quiz.questions.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm md:text-base font-bold text-slate-800 mb-4 leading-relaxed">
          {currentQuestion.question}
        </h4>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full text-right p-4 rounded-lg border text-sm transition-all ";
            
            if (!showResult) {
              buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50";
            } else {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += "bg-green-50 border-green-200 text-green-800 font-bold";
              } else if (index === selectedAnswer) {
                buttonClass += "bg-red-50 border-red-200 text-red-800";
              } else {
                buttonClass += "bg-white border-slate-200 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showResult && index === currentQuestion.correctAnswer && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && <XCircle size={18} className="text-red-500 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 bg-indigo-900 text-white rounded-lg font-bold hover:bg-indigo-800 transition-colors"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
          </button>
        </div>
      )}
    </div>
  );
}
