import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import { demoData } from '../../../utils/demoData';

const CreditScoreView = () => {
  const currentScore = 742;
  const previousScore = 680;
  const scoreImprovement = currentScore - previousScore;

  const creditHistory = demoData.creditScoreHistory.map(item => ({
    month: `${item.month} 2024`,
    score: item.score,
    factors: getFactorsForScore(item.score)
  }));

  const loanEligibility = demoData.loanEligibility;

  function getFactorsForScore(score) {
    if (score >= 740) return 'Excellent credit utilization';
    if (score >= 700) return 'Good payment history';
    if (score >= 680) return 'Regular transactions';
    return 'Initial assessment';
  }

  const scoringFactors = [
    {
      factor: 'Transaction Consistency',
      score: 85,
      impact: 'High',
      description: 'Regular daily transactions showing business activity',
      color: 'bg-green-500'
    },
    {
      factor: 'Payment Method Diversity',
      score: 78,
      impact: 'Medium',
      description: 'Using multiple payment methods (UPI, Cash, Cards)',
      color: 'bg-blue-500'
    },
    {
      factor: 'Revenue Growth',
      score: 92,
      impact: 'High',
      description: 'Consistent month-over-month revenue increase',
      color: 'bg-green-500'
    },
    {
      factor: 'Digital Adoption',
      score: 70,
      impact: 'Medium',
      description: 'Active use of digital payment systems',
      color: 'bg-yellow-500'
    },
    {
      factor: 'Business Documentation',
      score: 65,
      impact: 'Low',
      description: 'Invoice generation and record keeping',
      color: 'bg-orange-500'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-400';
    if (score >= 700) return 'text-blue-400';
    if (score >= 650) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 750) return 'bg-green-500/10 border-green-500/20';
    if (score >= 700) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 650) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const CircularProgress = ({ score, maxScore = 850 }) => {
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={score >= 750 ? '#10b981' : score >= 700 ? '#3b82f6' : '#f59e0b'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
            <div className="text-xs text-dark-text-muted">/{maxScore}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl border p-6 ${getScoreBackground(currentScore)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Current Credit Score</h3>
            <Icon name="Award" size={24} color="var(--primary)" />
          </div>
          <div className="flex items-center justify-center mb-4">
            <CircularProgress score={currentScore} />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-green-400 font-medium">
              <Icon name="TrendingUp" size={16} />
              <span>+{scoreImprovement} points</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Since January 2024</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Score Range</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Excellent (750+)</span>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Good (700-749)</span>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fair (650-699)</span>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Poor (&lt;650)</span>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
            <p className="text-sm text-blue-400 font-medium">Your Score: Good Range</p>
            <p className="text-xs text-blue-300 mt-1">You're close to excellent! Keep up the good work.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Next Milestone</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">750</div>
            <p className="text-sm text-muted-foreground mb-4">Excellent Credit Score</p>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentScore - 700) / (750 - 700)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">8 points to go</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={14} color="var(--success)" />
              <span>Maintain transaction consistency</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={14} color="var(--success)" />
              <span>Increase digital payment usage</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Credit Score History</h3>
          <div className="flex items-center space-x-2 text-sm text-success font-medium">
            <Icon name="TrendingUp" size={16} />
            <span>+{scoreImprovement} points improvement</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={creditHistory}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis domain={[650, 800]} stroke="var(--muted-foreground)" />
              <Tooltip 
                formatter={(value) => [value, 'Credit Score']}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Scoring Factors</h3>
        <div className="space-y-4">
          {scoringFactors?.map((factor, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{factor?.factor}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    factor?.impact === 'High' ? 'bg-destructive/10 text-destructive' :
                    factor?.impact === 'Medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {factor?.impact} Impact
                  </span>
                  <span className="font-bold text-foreground">{factor?.score}/100</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${factor?.color} transition-all duration-1000`}
                  style={{ width: `${factor?.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{factor?.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Loan Eligibility</h3>
          <div className="flex items-center space-x-2 text-primary">
            <Icon name="Info" size={16} />
            <span>Based on current credit score</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loanEligibility?.map((loan, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={loan?.icon} size={20} color="var(--primary)" />
                  </div>
                  <h4 className="font-medium text-foreground">{loan?.type}</h4>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan?.status === 'eligible' ? 'bg-success/10 text-success' :
                  loan?.status === 'under-review' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>
                  {loan?.status === 'eligible' ? 'Eligible' :
                   loan?.status === 'under-review' ? 'Under Review' : 'Not Eligible'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium text-foreground">₹{loan?.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Interest Rate:</span>
                  <span className="font-medium text-foreground">{loan?.interest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tenure:</span>
                  <span className="font-medium text-foreground">{loan?.tenure}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditScoreView;
