import React from 'react';
import './Plans.css';

const plans = [
  {
    name: 'Gold Plan',
    price: '$9.99',
    period: '/month',
    features: [
      'No Ads',
      'Team watching up to 10 members',
      '720p Resolution',
      '30 Downloading',
    ],
    highlight: false,
  },
  {
    name: 'Platinum Plan',
    price: '$29.99',
    period: '/year',
    features: [
      'Unlimited movies',
      'No Ads',
      'Team watching up to 50 members',
      '4K+HDR Resolution',
      '300 Downloading',
    ],
    highlight: true,
  },
  {
    name: 'Diamond Plan',
    price: '$19.99',
    period: '/year',
    features: [
      'Unlimited movies',
      'No Ads',
      'Team watching up to 20 members',
      '1080p Resolution',
      '100 Downloading',
    ],
    highlight: false,
  },
];

function Plans() {
  return (
    <section className="plans-section">
      <h2 className="plans-title">Choose your plan</h2>
      <div className="plans-grid">
        {plans.map(plan => (
          <div className={`plan-card${plan.highlight ? ' highlight' : ''}`} key={plan.name}>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price}<span>{plan.period}</span></div>
            <ul className="plan-features">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="plan-cta">Choose</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Plans; 