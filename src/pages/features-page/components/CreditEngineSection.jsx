import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { calculateCreditScore } from '../../../utils/creditScoreCalculator.js';

const CreditEngineSection = () => {
  const [simulatorData, setSimulatorData] = useState({
    monthlyRevenue: '',
    transactionCount: '',
    businessAge: ''
  });
  const [creditScore, setCreditScore] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const creditFactors = [
    {
      icon: 'TrendingUp',
      title: 'Transaction Consistency',
      description: 'Regular transaction patterns demonstrate business stability and reliability.',
      weight: '35%',
      impact: 'High'
    },
    {
      icon: 'DollarSign',
      title: 'Revenue Growth',
      description: 'Month-over-month revenue growth indicates business expansion potential.',
      weight: '30%',
      impact: 'High'
    },
    {
      icon: 'Users',
      title: 'Customer Diversity',
      description: 'Diverse customer base reduces dependency risk and improves creditworthiness.',
      weight: '20%',
      impact: 'Medium'
    },
    {
      icon: 'Clock',
      title: 'Payment Timing',
      description: 'Consistent payment collection patterns show operational efficiency.',
      weight: '15%',
      impact: 'Medium'
    }
  ];

  const calculateCreditScoreLocal = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for UX
    setTimeout(() => {
      try {
        const revenue = parseFloat(simulatorData?.monthlyRevenue) || 0;
        const transactions = parseFloat(simulatorData?.transactionCount) || 0;
        const age = parseFloat(simulatorData?.businessAge) || 0;
        
        // Use the correct formula from our utility
        const score = calculateCreditScore(transactions, revenue, age);
        
        setCreditScore(score);
      } catch (error) {
        console.error('Credit score calculation error:', error);
        setCreditScore(null);
      }
      setIsCalculating(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-accent';
    if (score >= 650) return 'text-warning';
    if (score >= 550) return 'text-orange-500';
    return 'text-error';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  return (
    <section id="credit-engine" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto content-spacing">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="TrendingUp" size={16} strokeWidth={2} />
            <span>AI Credit Engine</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Transform Transactions into
            <span className="text-primary block">Credit Opportunities</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proprietary AI engine analyzes your transaction patterns to build a comprehensive credit profile, opening doors to better loan terms and financial opportunities.
          </p>
        </div>

        {/* Credit Score Simulator */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Credit Score Simulator</h3>
              <p className="text-muted-foreground mb-8">
                Enter your business details to see how NoteNetra's AI engine would calculate your credit score.
              </p>
              
              <div className="space-y-6">
                <Input
                  label="Monthly Revenue (₹)"
                  type="number"
                  placeholder="e.g., 2,50,000"
                  value={simulatorData?.monthlyRevenue}
                  onChange={(e) => setSimulatorData({...simulatorData, monthlyRevenue: e?.target?.value})}
                />
                
                <Input
                  label="Monthly Transactions"
                  type="number"
                  placeholder="e.g., 150"
                  value={simulatorData?.transactionCount}
                  onChange={(e) => setSimulatorData({...simulatorData, transactionCount: e?.target?.value})}
                />
                
                <Input
                  label="Business Age (Years)"
                  type="number"
                  placeholder="e.g., 3.5"
                  step="0.5"
                  value={simulatorData?.businessAge}
                  onChange={(e) => setSimulatorData({...simulatorData, businessAge: e?.target?.value})}
                />
                
                <Button
                  variant="default"
                  fullWidth
                  loading={isCalculating}
                  onClick={calculateCreditScoreLocal}
                  iconName="Calculator"
                  iconPosition="left"
                  disabled={!simulatorData?.monthlyRevenue || !simulatorData?.transactionCount || !simulatorData?.businessAge}
                >
                  {isCalculating ? 'Calculating Score...' : 'Calculate Credit Score'}
                </Button>
              </div>
            </div>

            {/* Results Display */}
            <div className="flex items-center justify-center">
              {creditScore ? (
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full"></div>
                    <div className="absolute inset-4 bg-card rounded-full shadow-interactive flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(creditScore)}`}>
                          {creditScore}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {getScoreLabel(creditScore)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Estimated Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Loan approval probability: {creditScore >= 650 ? '85%' : '45%'}</li>
                      <li>• Interest rate reduction: {creditScore >= 750 ? '2-3%' : '1-2%'}</li>
                      <li>• Credit limit increase: {creditScore >= 700 ? '40%' : '20%'}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Icon name="Calculator" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Enter your business details to calculate your credit score</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credit Factors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            How We Calculate Your Credit Score
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditFactors?.map((factor, index) => (
              <div key={index} className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-interactive transition-smooth hover-lift">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={factor?.icon} size={24} color="var(--color-primary)" strokeWidth={2} />
                </div>
                
                <h4 className="text-lg font-semibold text-foreground mb-2">{factor?.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{factor?.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    Weight: {factor?.weight}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    factor?.impact === 'High' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'
                  }`}>
                    {factor?.impact} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">
              Traditional vs NoteNetra Credit Assessment
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Criteria</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Traditional Banks</th>
                    <th className="text-center py-4 px-6 font-semibold text-primary">NoteNetra Engine</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 font-medium text-foreground">Data Sources</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">Bank statements, Tax returns</td>
                    <td className="py-4 px-6 text-center text-primary">Real-time transactions, Behavioral patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 font-medium text-foreground">Assessment Time</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">7-15 days</td>
                    <td className="py-4 px-6 text-center text-primary">Real-time</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-6 font-medium text-foreground">Documentation</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">Extensive paperwork</td>
                    <td className="py-4 px-6 text-center text-primary">Automated data collection</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-foreground">Accuracy</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">Historical data based</td>
                    <td className="py-4 px-6 text-center text-primary">AI-powered predictive analysis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditEngineSection;