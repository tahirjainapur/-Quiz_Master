// API Base URL - use shared API_BASE from window (set by auth.js)
const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '/api';

// State management
let currentQuiz = null;
let currentQuizId = null;
let userAnswers = [];
let currentQuestionIndex = 0;
let quizResults = null;

// DOM Elements - will be initialized after DOM loads
let quizSelection, quizTaking, results, quizzesContainer;
let quizTitle, quizDescription, questionContainer;
let prevBtn, nextBtn, submitBtn;
let currentQuestionSpan, totalQuestionsSpan, progressFill;
let scorePercentage, scoreValue, totalScore, resultsDetails;
let userNameInput, saveResultBtn, restartBtn;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    quizSelection = document.getElementById('quiz-selection');
    quizTaking = document.getElementById('quiz-taking');
    results = document.getElementById('results');
    quizzesContainer = document.getElementById('quizzes-container');
    quizTitle = document.getElementById('quiz-title');
    quizDescription = document.getElementById('quiz-description');
    questionContainer = document.getElementById('question-container');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    submitBtn = document.getElementById('submit-btn');
    currentQuestionSpan = document.getElementById('current-question');
    totalQuestionsSpan = document.getElementById('total-questions');
    progressFill = document.getElementById('progress-fill');
    scorePercentage = document.getElementById('score-percentage');
    scoreValue = document.getElementById('score-value');
    totalScore = document.getElementById('total-score');
    resultsDetails = document.getElementById('results-details');
    userNameInput = document.getElementById('user-name');
    saveResultBtn = document.getElementById('save-result-btn');
    restartBtn = document.getElementById('restart-btn');
    
    // Ensure DOM elements exist
    if (!quizzesContainer) {
        console.error('quizzesContainer not found in DOM!');
        return;
    }
    
    console.log('Initializing Quiz Master app...');
    setupEventListeners();
    // Load quizzes immediately
    loadQuizzes();
});

// Event Listeners
function setupEventListeners() {
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    saveResultBtn.addEventListener('click', saveResult);
    restartBtn.addEventListener('click', restartQuiz);
}

// Load all quizzes
async function loadQuizzes() {
    if (!quizzesContainer) {
        console.error('quizzesContainer not available');
        return;
    }
    
    try {
        console.log('Loading quizzes from API...');
        const response = await fetch(`${API_BASE}/quiz`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let quizzes = await response.json();
        console.log('Quizzes received:', Array.isArray(quizzes) ? quizzes.length : 'not an array', 'quizzes');
        console.log('First quiz sample:', quizzes[0]);
        
        // Ensure it's an array
        if (!Array.isArray(quizzes)) {
            console.error('Quizzes is not an array!', typeof quizzes, quizzes);
            quizzesContainer.innerHTML = '<div class="loading" style="color: #dc3545;">Error: Invalid response from server</div>';
            return;
        }
        
        if (quizzes.length === 0) {
            quizzesContainer.innerHTML = '<div class="loading">No quizzes available. Please create a quiz first.</div>';
            return;
        }

        // Clear loading message
        quizzesContainer.innerHTML = '';
        
        // Create and append quiz cards
        let displayedCount = 0;
        quizzes.forEach((quiz, index) => {
            try {
                if (!quiz || !quiz._id || !quiz.title) {
                    console.warn(`Skipping invalid quiz at index ${index}:`, quiz);
                    return;
                }
                const quizCard = createQuizCard(quiz);
                if (quizCard) {
                    quizzesContainer.appendChild(quizCard);
                    displayedCount++;
                }
            } catch (err) {
                console.error(`Error creating card for quiz ${index}:`, err, quiz);
            }
        });
        console.log(`Successfully displayed ${displayedCount} of ${quizzes.length} quiz cards`);
        
        if (displayedCount === 0) {
            quizzesContainer.innerHTML = '<div class="loading" style="color: #dc3545;">Error displaying quizzes. Check console for details.</div>';
        }
    } catch (error) {
        console.error('Error loading quizzes:', error);
        quizzesContainer.innerHTML = `<div class="loading" style="color: #dc3545;">Error loading quizzes: ${error.message}. Please refresh the page.</div>`;
    }
}

// Create quiz card element
function createQuizCard(quiz) {
    if (!quiz || !quiz._id) {
        console.error('Invalid quiz data:', quiz);
        return null;
    }
    
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = `
        <h3>${quiz.title || 'Untitled Quiz'}</h3>
        <p>${quiz.description || 'Test your knowledge!'}</p>
        <div class="question-count">${quiz.questions ? quiz.questions.length : 0} question${(quiz.questions ? quiz.questions.length : 0) !== 1 ? 's' : ''}</div>
    `;
    card.addEventListener('click', () => {
        console.log('Quiz clicked:', quiz.title);
        startQuiz(quiz._id);
    });
    return card;
}

// Start a quiz
async function startQuiz(quizId) {
    try {
        console.log('Loading quiz:', quizId);
        const response = await fetch(`${API_BASE}/quiz/${quizId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load quiz: ${response.status}`);
        }
        
        const quiz = await response.json();
        console.log('Quiz loaded:', quiz.title, 'Questions:', quiz.questions?.length);
        
        // Ensure options are arrays
        if (quiz.questions) {
            quiz.questions = quiz.questions.map(q => {
                if (!Array.isArray(q.options)) {
                    console.warn('Fixing non-array options for question:', q.question);
                    if (typeof q.options === 'string') {
                        q.options = q.options.includes(',') 
                            ? q.options.split(',').map(o => o.trim())
                            : q.options.split(/\s{2,}/).map(o => o.trim()).filter(o => o.length > 0);
                    } else {
                        q.options = [];
                    }
                }
                return q;
            });
        }
        
        currentQuiz = quiz;
        currentQuizId = quizId;
        userAnswers = new Array(quiz.questions.length).fill(null);
        currentQuestionIndex = 0;
        quizResults = null;

        showScreen('quiz-taking');
        displayQuiz();
    } catch (error) {
        console.error('Error loading quiz:', error);
        alert(`Error loading quiz: ${error.message}. Please try again.`);
    }
}

// Display quiz
function displayQuiz() {
    quizTitle.textContent = currentQuiz.title;
    quizDescription.textContent = currentQuiz.description || '';
    totalQuestionsSpan.textContent = currentQuiz.questions.length;
    
    displayQuestion();
    updateProgress();
}

// Display current question
function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    questionContainer.innerHTML = `
        <div class="question-text">${question.question}</div>
        <ul class="options-list">
            ${question.options.map((option, index) => `
                <li class="option-item ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}">
                    <input type="radio" 
                           id="option-${index}" 
                           name="answer" 
                           value="${index}"
                           ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}
                           onchange="selectAnswer(${index})">
                    <label for="option-${index}">${option}</label>
                </li>
            `).join('')}
        </ul>
    `;

    updateNavigationButtons();
}

// Select an answer
function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    displayQuestion(); // Re-render to update selected state
}

// Make selectAnswer available globally
window.selectAnswer = selectAnswer;

// Update navigation buttons
function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Go to previous question
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
    }
}

// Go to next question
function goToNextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
    }
}

// Submit quiz
async function submitQuiz() {
    // Check if all questions are answered
    const unanswered = userAnswers.some(answer => answer === null);
    if (unanswered) {
        if (!confirm('You have unanswered questions. Do you want to submit anyway?')) {
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE}/quiz/${currentQuizId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: userAnswers })
        });

        quizResults = await response.json();
        showResults();
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Error submitting quiz. Please try again.');
    }
}

// Show results
function showResults() {
    showScreen('results');
    
    scorePercentage.textContent = quizResults.percentage;
    scoreValue.textContent = quizResults.score;
    totalScore.textContent = quizResults.totalQuestions;
    
    // Auto-save if logged in
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
        // Hide user input for logged in users (auto-saved)
        document.querySelector('.user-input').style.display = 'none';
        // Auto-save after a short delay
        setTimeout(() => saveResult(), 500);
    }

    // Update score circle color based on percentage
    const scoreCircle = document.querySelector('.score-circle');
    if (quizResults.percentage >= 80) {
        scoreCircle.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    } else if (quizResults.percentage >= 50) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    }

    // Display detailed results
    resultsDetails.innerHTML = '';
    quizResults.results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        const status = result.isCorrect ? '✓ Correct' : '✗ Incorrect';
        resultItem.innerHTML = `
            <h4>Question ${index + 1}: ${result.question}</h4>
            <p style="margin-bottom: 15px; font-weight: 600; color: ${result.isCorrect ? '#28a745' : '#dc3545'}">
                ${status}
            </p>
            <div class="result-options">
                ${result.options.map((option, optIndex) => {
                    let classes = 'result-option';
                    let label = option;
                    
                    if (optIndex === result.correctAnswer) {
                        classes += ' correct-answer';
                        label += ' (Correct Answer)';
                    }
                    
                    if (result.userAnswer !== null && optIndex === result.userAnswer) {
                        classes += ' user-answer';
                        if (optIndex !== result.correctAnswer) {
                            label += ' (Your Answer)';
                        }
                    }
                    
                    return `<div class="${classes}">${label}</div>`;
                }).join('')}
            </div>
        `;
        
        resultsDetails.appendChild(resultItem);
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Save result to database
async function saveResult() {
    // Check if user is logged in
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userName = user ? user.username : (userNameInput.value.trim() || 'Anonymous');
    
    try {
        const response = await fetch(`${API_BASE}/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                quizId: currentQuizId,
                quizTitle: currentQuiz.title,
                userName: userName,
                userAnswers: userAnswers,
                score: quizResults.score,
                totalQuestions: quizResults.totalQuestions,
                percentage: quizResults.percentage
            })
        });

        if (response.ok) {
            saveResultBtn.textContent = '✓ Saved!';
            saveResultBtn.disabled = true;
            saveResultBtn.style.background = '#28a745';
            
            // Hide input if logged in (auto-saved)
            if (user) {
                document.querySelector('.user-input').style.display = 'none';
            }
            
            setTimeout(() => {
                saveResultBtn.textContent = 'Save Result';
                saveResultBtn.disabled = false;
                saveResultBtn.style.background = '';
            }, 2000);
        } else {
            throw new Error('Failed to save result');
        }
    } catch (error) {
        console.error('Error saving result:', error);
        alert('Error saving result. Please try again.');
    }
}

// Auto-save result if user is logged in
async function checkAutoSave() {
    const userStr = sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user && quizResults) {
        // Auto-save for logged in users
        await saveResult();
    }
}

// Restart quiz (go back to selection)
function restartQuiz() {
    showScreen('quiz-selection');
    currentQuiz = null;
    currentQuizId = null;
    userAnswers = [];
    currentQuestionIndex = 0;
    quizResults = null;
    userNameInput.value = '';
    saveResultBtn.textContent = 'Save Result';
    saveResultBtn.disabled = false;
    saveResultBtn.style.background = '';
    loadQuizzes();
}

// Show specific screen
function showScreen(screenName) {
    quizSelection.classList.remove('active');
    quizTaking.classList.remove('active');
    results.classList.remove('active');

    if (screenName === 'quiz-selection') {
        quizSelection.classList.add('active');
    } else if (screenName === 'quiz-taking') {
        quizTaking.classList.add('active');
    } else if (screenName === 'results') {
        results.classList.add('active');
    }
}

