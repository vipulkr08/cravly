import Header from '../components/Header';
import { getMealGreeting, getMealTimeDisplay } from '../utils/timeUtils';

function InputScreen({ dietType, setDietType, mode, setMode, mealTime, onFeedMe }) {
    const isLateNight = mealTime === 'late-night';
    const isMorning = mealTime === 'breakfast';

    const getGreeting = () => {
        if (isLateNight) return { title: "Still awake, Chief?", sub: "Let's find you a midnight snack." };
        if (isMorning) return { title: "Rise & Shine!", sub: "Let's find you a breakfast of champions." };
        return { title: "Hungry?", sub: "Let's find you something delicious." };
    };

    const greeting = getGreeting();

    const dietOptions = [
        {
            id: 'veg',
            label: 'Pure Veg',
            desc: 'Purely Delicious',
            icon: '🥬',
            type: 'veg'
        },
        {
            id: 'non-veg',
            label: 'Non-Veg',
            desc: 'Protein Packed',
            icon: '🍗',
            type: 'non-veg'
        },
        {
            id: 'egg',
            label: 'Eggetarian',
            desc: 'Simply Perfect',
            icon: '🥚',
            type: 'egg'
        }
    ];

    return (
        <div className="landing-screen" data-time={isLateNight ? 'late-night' : ''}>
            {/* Branding Header */}
            <Header />

            {/* Greeting */}
            <header className="header-greeting">
                <h2 className="greeting-text">{greeting.title}</h2>
                <p className="greeting-sub">
                    {greeting.sub} <br />
                    <span
                        className="greeting-city"
                        onClick={() => alert("KhaoPi is currently exclusive to Bengaluru! 🧡\n\nExpansion to other cities coming soon.")}
                        style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                        title="Click to change location"
                    >
                    </span>
                </p>
            </header>

            {/* The Massive Switch */}
            <div className="mode-switch-container">
                <div className="mode-switch">
                    <div className={`mode-switch-slider ${mode === 'cook' ? 'cook' : ''}`}></div>

                    <button
                        className={`mode-switch-btn ${mode === 'order' ? 'active' : ''}`}
                        onClick={() => setMode('order')}
                    >
                        <span className="mode-icon">🛵</span>
                        Order
                    </button>

                    <button
                        className={`mode-switch-btn ${mode === 'cook' ? 'active' : ''}`}
                        onClick={() => setMode('cook')}
                    >
                        <span className="mode-icon">👨‍🍳</span>
                        Cook
                    </button>
                </div>
            </div>

            {/* Identity Grid */}
            <div className="identity-grid">
                {dietOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`identity-card ${option.type} ${dietType === option.id ? 'active' : ''}`}
                        onClick={() => setDietType(option.id)}
                    >
                        <div className="identity-icon">
                            {option.icon}
                        </div>
                        <div className="identity-content">
                            <h3 className="identity-title">{option.label}</h3>
                            <p className="identity-desc">{option.desc}</p>
                        </div>
                        <div className="identity-check">
                            {dietType === option.id && '✓'}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className="cta-container">
                <button className="cta-btn" onClick={onFeedMe}>
                    What should I eat?
                </button>
            </div>
        </div>
    );
}

export default InputScreen;
