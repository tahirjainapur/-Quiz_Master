const API_BASE = '/api';
let performanceChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const user = await checkAuth();
    
    if (!user) {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('not-authenticated').style.display = 'block';
        return;
    }

    // Update user info
    document.getElementById('user-info').textContent = `👤 ${user.username}`;
    
    // Setup logout button
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Load dashboard data
    await loadDashboardData();
});

// Load all dashboard data
async function loadDashboardData() {
    const loadingScreen = document.getElementById('loading-screen');
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (!loadingScreen || !dashboardContent) {
        console.error('Dashboard elements not found!');
        return;
    }
    
    try {
        console.log('Loading dashboard data...');
        const response = await fetch(`${API_BASE}/result/my-results`, {
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || 'Failed to load dashboard data');
        }

        const results = await response.json();
        console.log('Dashboard results received:', Array.isArray(results) ? results.length : 'not array', 'results');
        
        if (!Array.isArray(results)) {
            throw new Error('Invalid response format');
        }
        
        // Hide loading, show content
        loadingScreen.style.display = 'none';
        dashboardContent.style.display = 'block';

        // Update stats
        updateStats(results);

        // Update chart
        updateChart(results);

        // Update history
        updateHistory(results);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        if (loadingScreen) {
            loadingScreen.innerHTML = 
                `<div class="loading" style="color: #dc3545;">Error loading dashboard: ${error.message}. Please try again.</div>`;
        }
    }
}

// Update statistics
function updateStats(results) {
    const totalQuizzes = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.score, 0);
    const avgScore = totalQuizzes > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
        : 0;
    const bestScore = totalQuizzes > 0
        ? Math.max(...results.map(r => r.percentage))
        : 0;

    document.getElementById('total-quizzes').textContent = totalQuizzes;
    document.getElementById('avg-score').textContent = avgScore + '%';
    document.getElementById('best-score').textContent = bestScore + '%';
    document.getElementById('total-correct').textContent = totalCorrect;
}

// Update performance chart
function updateChart(results) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    if (results.length === 0) {
        return;
    }

    // Sort by date
    const sortedResults = [...results].sort((a, b) => 
        new Date(a.completedAt) - new Date(b.completedAt)
    );

    const labels = sortedResults.map((r, index) => 
        new Date(r.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const scores = sortedResults.map(r => r.percentage);

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score %',
                data: scores,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update quiz history
function updateHistory(results) {
    const container = document.getElementById('quiz-history-container');

    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No Quiz History Yet</h3>
                <p>Start taking quizzes to see your performance here!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">Take a Quiz</a>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(result => {
        const date = new Date(result.completedAt);
        const scoreClass = result.percentage >= 80 ? 'excellent' : 
                          result.percentage >= 60 ? 'good' :
                          result.percentage >= 40 ? 'fair' : 'poor';
        
        return `
            <div class="quiz-history-item">
                <div class="quiz-history-header">
                    <div class="quiz-history-title">${result.quizTitle}</div>
                    <div class="quiz-history-date">${date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                    <span class="score-badge ${scoreClass}">${result.percentage}%</span>
                </div>
                <div class="quiz-details">
                    <div class="detail-item">
                        <div class="detail-label">Score</div>
                        <div class="detail-value">${result.score}/${result.totalQuestions}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Correct</div>
                        <div class="detail-value" style="color: #28a745;">${result.score}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Incorrect</div>
                        <div class="detail-value" style="color: #dc3545;">${result.totalQuestions - result.score}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Accuracy</div>
                        <div class="detail-value">${Math.round((result.score / result.totalQuestions) * 100)}%</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

