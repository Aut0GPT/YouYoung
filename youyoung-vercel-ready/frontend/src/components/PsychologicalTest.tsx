import React, { useState } from 'react';
import { TestQuestion, TestResult } from '../utils/types';

interface PsychologicalTestProps {
  onTestComplete: (results: TestResult[]) => void;
}

const PsychologicalTest: React.FC<PsychologicalTestProps> = ({ onTestComplete }) => {
  // Define the test questions
  const personalityQuestions: TestQuestion[] = [
    {
      id: 'openness_1',
      question: 'I am curious about many different things.',
      type: 'scale',
      min: 1,
      max: 5
    },
    {
      id: 'conscientiousness_1',
      question: 'I am always prepared and organized.',
      type: 'scale',
      min: 1,
      max: 5
    },
    {
      id: 'extraversion_1',
      question: 'I get energy from being around other people.',
      type: 'scale',
      min: 1,
      max: 5
    },
    {
      id: 'agreeableness_1',
      question: 'I am sympathetic to how others feel.',
      type: 'scale',
      min: 1,
      max: 5
    },
    {
      id: 'neuroticism_1',
      question: 'I worry about things often.',
      type: 'scale',
      min: 1,
      max: 5
    }
  ];

  const memoryQuestions: TestQuestion[] = [
    {
      id: 'childhood_memory_1',
      question: 'What is one of your fondest childhood memories?',
      type: 'text'
    },
    {
      id: 'childhood_memory_2',
      question: 'What was your favorite subject in school when you were younger?',
      type: 'text'
    }
  ];

  const aspirationQuestions: TestQuestion[] = [
    {
      id: 'aspiration_1',
      question: 'What did you dream of becoming when you were younger?',
      type: 'text'
    },
    {
      id: 'fear_1',
      question: 'What was one of your biggest fears when you were younger?',
      type: 'text'
    }
  ];

  // Combine all questions
  const allQuestions = [...personalityQuestions, ...memoryQuestions, ...aspirationQuestions];

  // State to track current question and answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestResult[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | number>('');

  const handleNextQuestion = () => {
    // Save current answer
    if (currentAnswer !== '') {
      const newAnswers = [...answers, {
        questionId: allQuestions[currentQuestionIndex].id,
        answer: currentAnswer
      }];
      
      setAnswers(newAnswers);
      setCurrentAnswer('');
      
      // Move to next question or complete test
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Test is complete
        onTestComplete(newAnswers);
      }
    }
  };

  const handleInputChange = (value: string | number) => {
    setCurrentAnswer(value);
  };

  const renderQuestionInput = () => {
    const question = allQuestions[currentQuestionIndex];
    
    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer as string}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="text-input"
          />
        );
      
      case 'scale':
        return (
          <div className="scale-container">
            {Array.from({ length: (question.max || 5) - (question.min || 1) + 1 }, (_, i) => i + (question.min || 1)).map(num => (
              <button
                key={num}
                className={`scale-button ${Number(currentAnswer) === num ? 'selected' : ''}`}
                onClick={() => handleInputChange(num)}
              >
                {num}
              </button>
            ))}
            <div className="scale-labels">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        );
      
      case 'multiple_choice':
        return (
          <div className="options-container">
            {question.options?.map((option, index) => (
              <button
                key={index}
                className={`option-button ${currentAnswer === option ? 'selected' : ''}`}
                onClick={() => handleInputChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const progressPercentage = (currentQuestionIndex / allQuestions.length) * 100;

  return (
    <div className="psychological-test">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {allQuestions.length}
      </div>
      
      <div className="question-container">
        <h3>{allQuestions[currentQuestionIndex].question}</h3>
        {renderQuestionInput()}
      </div>
      
      <button 
        onClick={handleNextQuestion}
        disabled={currentAnswer === ''}
        className="next-button"
      >
        {currentQuestionIndex < allQuestions.length - 1 ? 'Next Question' : 'Complete Test'}
      </button>
      
      <style jsx>{`
        .psychological-test {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .progress-bar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #784be8;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .question-counter {
          text-align: center;
          margin-bottom: 20px;
          color: #666;
        }
        
        .question-container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .text-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-top: 10px;
        }
        
        .scale-container {
          display: flex;
          flex-direction: column;
          margin-top: 15px;
        }
        
        .scale-button {
          padding: 10px;
          margin: 0 5px;
          border: 1px solid #ddd;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .scale-button.selected {
          background-color: #784be8;
          color: white;
          border-color: #784be8;
        }
        
        .scale-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          font-size: 14px;
          color: #666;
        }
        
        .options-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
        
        .option-button {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .option-button.selected {
          background-color: #784be8;
          color: white;
          border-color: #784be8;
        }
        
        .next-button {
          background-color: #784be8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }
        
        .next-button:disabled {
          background-color: #b3a3e0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PsychologicalTest;
