import React, { useState, useEffect } from ‘react’;
import { Brain, Calendar, Clock, FileText, Users, MessageSquare, TrendingUp, BookOpen, Zap, Target, CheckCircle, AlertTriangle, Upload, Video } from ‘lucide-react’;

export default function UniVerse() {
const [activeTab, setActiveTab] = useState(‘dashboard’);
const [assignments, setAssignments] = useState([]);
const [studyGroups, setStudyGroups] = useState([]);
const [bulkInput, setBulkInput] = useState(’’);
const [loading, setLoading] = useState(false);
const [doodles, setDoodles] = useState([]);

useEffect(() => {
// Generate random doodle positions
const newDoodles = Array.from({ length: 30 }, (_, i) => ({
id: i,
x: Math.random() * 100,
y: Math.random() * 100,
type: [‘star’, ‘circle’, ‘zigzag’, ‘spiral’, ‘drip’][Math.floor(Math.random() * 5)],
rotation: Math.random() * 360,
scale: 0.5 + Math.random() * 1.5
}));
setDoodles(newDoodles);
}, []);

const quickAddAssignment = async () => {
if (!bulkInput.trim()) return;
setLoading(true);


const prompt = `Extract assignment information from this text and return ONLY valid JSON (no markdown, no explanations):


TEXT: ${bulkInput}

Return this exact structure:
{
“assignments”: [
{
“subject”: “extracted subject name”,
“title”: “extracted assignment title”,
“deadline”: “YYYY-MM-DD”,
“time”: “HH:MM”,
“description”: “any additional details”,
“estimatedHours”: number
}
]
}`;


try {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const result = JSON.parse(data.content[0].text);
  
  const newAssignments = result.assignments.map((a, i) => ({
    id: Date.now() + i,
    ...a,
    completed: false
  }));

  setAssignments([...assignments, ...newAssignments]);
  setBulkInput('');
  alert(`✅ ADDED ${newAssignments.length} ASSIGNMENTS!`);
} catch (error) {
  console.error('Error:', error);
  alert('OOPS! TRY AGAIN WITH MORE DETAILS');
} finally {
  setLoading(false);
}


};

const getRiskLevel = (deadline, time) => {
const deadlineDate = new Date(${deadline}T${time});
const now = new Date();
const hoursLeft = (deadlineDate - now) / (1000 * 60 * 60);


if (hoursLeft < 24) return 'CRITICAL';
if (hoursLeft < 72) return 'WARNING';
return 'SAFE';


};

const activeAssignments = assignments.filter(a => !a.completed);
const criticalCount = activeAssignments.filter(a => getRiskLevel(a.deadline, a.time) === ‘CRITICAL’).length;

const DoodleStar = ({ style }) => (
<svg style={style} width="40" height="40" viewBox="0 0 40 40" className="absolute">
<path d="M20 5 L23 17 L35 17 L25 25 L28 37 L20 29 L12 37 L15 25 L5 17 L17 17 Z" 
fill="none" stroke="#ff69b4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const DoodleCircle = ({ style }) => (
<svg style={style} width="50" height="50" viewBox="0 0 50 50" className="absolute">
<circle cx="25" cy="25" r="20" fill="none" stroke="#ff69b4" strokeWidth="3" 
strokeDasharray="5,5" strokeLinecap="round"/>
</svg>
);

const DoodleZigzag = ({ style }) => (
<svg style={style} width="60" height="30" viewBox="0 0 60 30" className="absolute">
<path d="M5 15 L15 5 L25 15 L35 5 L45 15 L55 5" 
fill="none" stroke="#ff69b4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const DoodleSpiral = ({ style }) => (
<svg style={style} width="40" height="40" viewBox="0 0 40 40" className="absolute">
<path d="M20 20 Q30 20 30 30 Q30 35 25 35 Q15 35 15 25 Q15 10 30 10" 
fill="none" stroke="#ff69b4" strokeWidth="2.5" strokeLinecap="round"/>
</svg>
);

const DoodleDrip = ({ style }) => (
<svg style={style} width="20" height="40" viewBox="0 0 20 40" className="absolute">
<path d="M10 0 L10 25 Q10 35 5 35 Q10 35 10 30 L10 25" 
fill="none" stroke="#ff69b4" strokeWidth="3" strokeLinecap="round"/>
<circle cx="10" cy="35" r="3" fill="#ff69b4"/>
</svg>
);

const renderDoodle = (doodle) => {
const style = {
left: ${doodle.x}%,
top: ${doodle.y}%,
transform: rotate(${doodle.rotation}deg) scale(${doodle.scale}),
opacity: 0.15
};


switch (doodle.type) {
  case 'star': return <DoodleStar key={doodle.id} style={style} />;
  case 'circle': return <DoodleCircle key={doodle.id} style={style} />;
  case 'zigzag': return <DoodleZigzag key={doodle.id} style={style} />;
  case 'spiral': return <DoodleSpiral key={doodle.id} style={style} />;
  case 'drip': return <DoodleDrip key={doodle.id} style={style} />;
  default: return null;
}


};

return (
<div className="min-h-screen bg-black text-white relative overflow-hidden">
<style>{`
@font-face {
font-family: ‘Blocko’;
src: local(‘Impact’), local(‘Arial Black’);
font-weight: 900;
}


    .blocko-font {
      font-family: 'Blocko', Impact, 'Arial Black', sans-serif;
      font-weight: 900;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    .doodle-card {
      background: #1a1a1a;
      border: 4px solid #ff69b4;
      border-radius: 0;
      position: relative;
      transform: rotate(-1deg);
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .doodle-card:hover {
      transform: rotate(1deg) scale(1.02);
      border-color: #ff1493;
      box-shadow: 8px 8px 0px #ff69b4;
    }

    .doodle-card::before {
      content: '';
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      background: linear-gradient(45deg, #ff69b4 0%, #ff1493 50%, #ff69b4 100%);
      z-index: -1;
      opacity: 0.3;
      filter: blur(20px);
    }

    .melting-text {
      position: relative;
      display: inline-block;
    }

    .melting-text::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 10%;
      width: 80%;
      height: 20px;
      background: linear-gradient(to bottom, #ff69b4, transparent);
      border-radius: 50%;
      opacity: 0.6;
    }

    .drip-animation {
      animation: drip 3s ease-in-out infinite;
    }

    @keyframes drip {
      0%, 100% { transform: translateY(0) scaleY(1); }
      50% { transform: translateY(5px) scaleY(1.1); }
    }

    .wiggle {
      animation: wiggle 2s ease-in-out infinite;
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(-2deg); }
      50% { transform: rotate(2deg); }
    }

    .tab-button {
      background: #1a1a1a;
      border: 3px solid #ff69b4;
      padding: 12px 24px;
      font-family: 'Blocko', Impact, sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      position: relative;
      transition: all 0.2s;
    }

    .tab-button:hover {
      background: #ff69b4;
      transform: translateY(-3px);
      box-shadow: 4px 4px 0px rgba(255, 105, 180, 0.5);
    }

    .tab-button.active {
      background: #ff69b4;
      color: #000;
      box-shadow: 5px 5px 0px #ff1493;
    }

    .skull-logo {
      width: 60px;
      height: 60px;
      background: #ff69b4;
      border-radius: 40% 40% 50% 50%;
      position: relative;
      animation: float 3s ease-in-out infinite;
    }

    .skull-logo::before {
      content: '♥';
      position: absolute;
      top: 20%;
      left: 25%;
      font-size: 12px;
      color: #000;
    }

    .skull-logo::after {
      content: '✕';
      position: absolute;
      top: 20%;
      right: 25%;
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }

    .skull-teeth {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 8px;
      background: repeating-linear-gradient(
        90deg,
        #000 0px,
        #000 5px,
        transparent 5px,
        transparent 10px
      );
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .chunky-input {
      background: #000;
      border: 4px solid #ff69b4;
      color: #fff;
      font-size: 16px;
      padding: 16px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }

    .chunky-input:focus {
      outline: none;
      border-color: #ff1493;
      box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
    }

    .chunky-button {
      background: #ff69b4;
      color: #000;
      border: 4px solid #ff1493;
      padding: 16px 32px;
      font-family: 'Blocko', Impact, sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .chunky-button:hover {
      background: #ff1493;
      transform: translate(-4px, -4px);
      box-shadow: 6px 6px 0px #000;
    }

    .chunky-button:active {
      transform: translate(0, 0);
      box-shadow: 2px 2px 0px #000;
    }

    .risk-critical {
      background: #ff0000;
      color: #000;
      animation: pulse-red 1s infinite;
    }

    @keyframes pulse-red {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .risk-warning {
      background: #ffd700;
      color: #000;
    }

    .risk-safe {
      background: #00ff00;
      color: #000;
    }
  `}</style>

  {/* Doodle Background */}
  <div className="fixed inset-0 pointer-events-none">
    {doodles.map(renderDoodle)}
  </div>

  {/* Header */}
  <div className="relative z-10 border-b-4 border-pink-500 bg-black">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="skull-logo">
            <div className="skull-teeth"></div>
          </div>
          <div>
            <h1 className="blocko-font text-4xl md:text-6xl text-pink-500 melting-text drip-animation">
              UNIVERSE
            </h1>
            <p className="blocko-font text-sm text-gray-400">STUDENT SURVIVAL KIT</p>
          </div>
        </div>
        
        {criticalCount > 0 && (
          <div className="risk-critical px-6 py-3 blocko-font text-xl border-4 border-red-600">
            ⚠ {criticalCount} CRITICAL!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {[
          { id: 'dashboard', label: 'HOME', icon: '🏠' },
          { id: 'assignments', label: 'TASKS', icon: '📝' },
          { id: 'study-groups', label: 'SQUAD', icon: '👥' },
          { id: 'ai', label: 'AI BRAIN', icon: '🧠' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
    {/* Dashboard */}
    {activeTab === 'dashboard' && (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'ACTIVE', value: activeAssignments.length, color: '#ff69b4' },
            { label: 'DONE', value: assignments.filter(a => a.completed).length, color: '#00ff00' },
            { label: 'CRITICAL', value: criticalCount, color: '#ff0000' },
            { label: 'GROUPS', value: studyGroups.length, color: '#00bfff' }
          ].map((stat, i) => (
            <div key={i} className="doodle-card p-6 text-center wiggle" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="blocko-font text-5xl mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="blocko-font text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="doodle-card p-8">
          <h2 className="blocko-font text-3xl text-pink-500 mb-6">⚡ QUICK ACTIONS</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('assignments')}
              className="chunky-button w-full"
            >
              📝 ADD TASK
            </button>
            <button
              className="chunky-button w-full"
              style={{ background: '#00bfff', borderColor: '#0080ff' }}
            >
              🧠 AI PLAN
            </button>
            <button
              onClick={() => setActiveTab('study-groups')}
              className="chunky-button w-full"
              style={{ background: '#00ff00', borderColor: '#00cc00' }}
            >
              👥 FIND SQUAD
            </button>
          </div>
        </div>

        {/* Urgent Deadlines */}
        {activeAssignments.length > 0 && (
          <div className="doodle-card p-8">
            <h2 className="blocko-font text-3xl text-pink-500 mb-6">🔥 URGENT STUFF</h2>
            <div className="space-y-4">
              {activeAssignments.slice(0, 3).map(assignment => {
                const risk = getRiskLevel(assignment.deadline, assignment.time);
                return (
                  <div
                    key={assignment.id}
                    className={`p-6 border-4 ${
                      risk === 'CRITICAL' ? 'border-red-500 bg-red-500/20' :
                      risk === 'WARNING' ? 'border-yellow-500 bg-yellow-500/20' :
                      'border-green-500 bg-green-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`blocko-font text-xl mb-2 ${
                          risk === 'CRITICAL' ? 'text-red-400' :
                          risk === 'WARNING' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {assignment.subject}
                        </div>
                        <div className="text-white font-bold mb-2">{assignment.title}</div>
                        <div className="text-gray-400 text-sm">
                          DUE: {assignment.deadline} @ {assignment.time}
                        </div>
                      </div>
                      <div className={`blocko-font px-4 py-2 border-3 ${
                        risk === 'CRITICAL' ? 'risk-critical border-red-600' :
                        risk === 'WARNING' ? 'risk-warning border-yellow-600' :
                        'risk-safe border-green-600'
                      }`}>
                        {risk}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}

    {/* Assignments Tab */}
    {activeTab === 'assignments' && (
      <div className="space-y-6">
        <div className="doodle-card p-8">
          <h2 className="blocko-font text-3xl text-pink-500 mb-6">📝 PASTE FROM MOODLE</h2>
          <p className="text-gray-400 mb-4 font-bold">
            COPY ANYTHING FROM MOODLE AND PASTE IT HERE. AI DOES THE REST!
          </p>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Math Assignment - Due Dec 25, 2025 11:59 PM


Physics Lab - Due Dec 28, 5:00 PM
Chemistry Homework - Problems 1-20…”
rows=“8”
className=“chunky-input w-full mb-4”
/>
<button
onClick={quickAddAssignment}
disabled={loading}
className="chunky-button w-full"
> 
{loading? ‘⏳ LOADING…’ : ‘⚡ ADD ALL TASKS’}
</button>
</div>


        {/* Assignment List */}
        {activeAssignments.length > 0 && (
          <div className="doodle-card p-8">
            <h2 className="blocko-font text-3xl text-pink-500 mb-6">ALL TASKS</h2>
            <div className="space-y-4">
              {activeAssignments.map(assignment => {
                const risk = getRiskLevel(assignment.deadline, assignment.time);
                return (
                  <div
                    key={assignment.id}
                    className={`p-6 border-4 ${
                      risk === 'CRITICAL' ? 'border-red-500 bg-red-500/10' :
                      risk === 'WARNING' ? 'border-yellow-500 bg-yellow-500/10' :
                      'border-green-500 bg-green-500/10'
                    }`}
                  >
                    <div className="mb-4">
                      <div className={`blocko-font text-2xl mb-2 ${
                        risk === 'CRITICAL' ? 'text-red-400' :
                        risk === 'WARNING' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {assignment.subject}
                      </div>
                      <div className="text-white text-lg font-bold mb-2">{assignment.title}</div>
                      {assignment.description && (
                        <div className="text-gray-400 mb-2">{assignment.description}</div>
                      )}
                      <div className="text-gray-500 text-sm">
                        DUE: {assignment.deadline} @ {assignment.time} • ~{assignment.estimatedHours}H
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAssignments(assignments.map(a => 
                            a.id === assignment.id ? { ...a, completed: true } : a
                          ));
                        }}
                        className="chunky-button flex-1"
                        style={{ background: '#00ff00', borderColor: '#00cc00', fontSize: '14px', padding: '12px' }}
                      >
                        ✓ DONE
                      </button>
                      <button
                        onClick={() => setAssignments(assignments.filter(a => a.id !== assignment.id))}
                        className="chunky-button"
                        style={{ background: '#ff0000', borderColor: '#cc0000', fontSize: '14px', padding: '12px' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}

    {/* Study Groups */}
    {activeTab === 'study-groups' && (
      <div className="doodle-card p-8">
        <h2 className="blocko-font text-3xl text-pink-500 mb-6">👥 STUDY SQUADS</h2>
        <p className="text-gray-400 mb-6 font-bold">
          FIND PEOPLE TO STUDY WITH. CLICK TO CREATE INSTANT VIDEO ROOM!
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {['MATH', 'PHYSICS', 'CHEMISTRY', 'PROGRAMMING', 'BIOLOGY', 'HISTORY'].map(subject => (
            <button
              key={subject}
              onClick={() => {
                const group = {
                  id: Date.now(),
                  subject,
                  meetLink: 'https://meet.google.com/new'
                };
                setStudyGroups([...studyGroups, group]);
              }}
              className="chunky-button w-full"
            >
              {subject} SQUAD
            </button>
          ))}
        </div>

        {studyGroups.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="blocko-font text-2xl text-pink-500">YOUR GROUPS</h3>
            {studyGroups.map(group => (
              <div key={group.id} className="p-6 bg-pink-500/20 border-4 border-pink-500">
                <div className="flex items-center justify-between">
                  <div className="blocko-font text-xl">{group.subject} SQUAD</div>
                  <a
                    href={group.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chunky-button"
                    style={{ fontSize: '14px', padding: '12px 24px' }}
                  >
                    🎥 JOIN NOW
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* AI Tab */}
    {activeTab === 'ai' && (
      <div className="doodle-card p-8">
        <h2 className="blocko-font text-3xl text-pink-500 mb-6">🧠 AI BRAIN</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-purple-500/20 border-4 border-purple-500">
            <div className="blocko-font text-2xl mb-4 text-purple-400">STUDY PLAN</div>
            <p className="text-gray-300 mb-6 font-bold">
              AI CREATES YOUR PERFECT WEEKLY SCHEDULE
            </p>
            <button className="chunky-button w-full" style={{ background: '#9333ea', borderColor: '#7e22ce' }}>
              GENERATE PLAN
            </button>
          </div>

          <div className="p-8 bg-blue-500/20 border-4 border-blue-500">
            <div className="blocko-font text-2xl mb-4 text-blue-400">ASK ANYTHING</div>
            <p className="text-gray-300 mb-6 font-bold">
              GET HELP WITH HOMEWORK & CONCEPTS
            </p>
            <button className="chunky-button w-full" style={{ background: '#0080ff', borderColor: '#0060cc' }}>
              CHAT NOW
            </button>
          </div>

          <div className="p-8 bg-green-500/20 border-4 border-green-500">
            <div className="blocko-font text-2xl mb-4 text-green-400">PRACTICE</div>
            <p className="text-gray-300 mb-6 font-bold">
              GENERATE CUSTOM PRACTICE PROBLEMS
            </p>
            <button className="chunky-button w-full" style={{ background: '#00ff00', borderColor: '#00cc00' }}>
              MAKE PROBLEMS
            </button>
          </div>

          <div className="p-8 bg-orange-500/20 border-4 border-orange-500">
            <div className="blocko-font text-2xl mb-4 text-orange-400">NOTES</div>
            <p className="text-gray-300 mb-6 font-bold">
              TURN LECTURES INTO FLASHCARDS
            </p>
            <button className="chunky-button w-full" style={{ background: '#ff8800', borderColor: '#cc6600' }}>
              UPLOAD NOTES
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Empty State */}
    {activeTab === 'dashboard' && assignments.length === 0 && (
      <div className="doodle-card p-16 text-center">
        <div className="text-6xl mb-4">💀</div>
        <div className="blocko-font text-4xl text-pink-500 mb-4">NO TASKS YET</div>
        <p className="text-gray-400 mb-6 font-bold">ADD YOUR FIRST ASSIGNMENT TO GET STARTED!</p>
        <button
          onClick={() => setActiveTab('assignments')}
          className="chunky-button"
        >
          ADD TASK NOW
        </button>
      </div>
    )}
  </div>
</div>


);
}
