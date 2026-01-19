import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Circle, Plus, X, Zap } from 'lucide-react';

export default function VibeProd() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q2 marketing strategy', priority: 'high', completed: false, dueDate: '2026-01-20' },
    { id: 2, title: 'Update website copy', priority: 'medium', completed: false, dueDate: '2026-01-22' },
    { id: 3, title: 'Team sync meeting prep', priority: 'low', completed: true, dueDate: '2026-01-18' }
  ]);
  
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusModeType, setFocusModeType] = useState('pomodoro');
  const [showAiLoading, setShowAiLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [focusSessions, setFocusSessions] = useState([]);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const canvasRef = useRef(null);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    let animationFrame;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.fillStyle = `rgba(0, 113, 227, ${0.3 + Math.sin(Date.now() * 0.001 + p.x) * 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0, 113, 227, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    let interval;
    if (timerRunning && focusTimer > 0) {
      interval = setInterval(() => setFocusTimer(prev => prev - 1), 1000);
    } else if (focusTimer === 0) {
      // Session completed!
      const sessionDuration = focusModeType === 'pomodoro' ? 25 : 50;
      const newSession = {
        id: Date.now(),
        type: focusModeType,
        duration: sessionDuration,
        completedAt: new Date().toISOString()
      };
      setFocusSessions(prev => [...prev, newSession]);
      setTotalFocusTime(prev => prev + sessionDuration);
      
      setTimerRunning(false);
      setFocusMode(false);
      setFocusTimer(25 * 60);
    }
    return () => clearInterval(interval);
  }, [timerRunning, focusTimer, focusModeType]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      title: newTaskInput,
      priority: 'medium',
      completed: false,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    }]);
    setNewTaskInput('');
  };

  const generateContextualTasks = (prompt) => {
    const lower = prompt.toLowerCase();
    
    // Cooking/Recipe tasks
    if (lower.includes('cook') || lower.includes('recipe') || lower.includes('bake') || lower.includes('meal')) {
      const food = prompt.replace(/cook|make|prepare|bake|a|an|the/gi, '').trim();
      return [
        { title: `Gather ingredients for ${food}`, priority: 'high' },
        { title: `Prep vegetables, herbs and spices needed`, priority: 'high' },
        { title: `Marinate or season the ${food.includes('fish') ? 'fish' : 'main ingredient'}`, priority: 'medium' },
        { title: `Cook ${food} at proper temperature`, priority: 'high' },
        { title: `Plate and garnish the dish`, priority: 'low' }
      ];
    }
    
    // Fitness/Exercise tasks
    if (lower.includes('workout') || lower.includes('exercise') || lower.includes('fitness') || lower.includes('gym')) {
      return [
        { title: `Set fitness goals and target metrics`, priority: 'high' },
        { title: `Create weekly workout schedule`, priority: 'high' },
        { title: `Prepare workout gear and nutrition plan`, priority: 'medium' },
        { title: `Track first week's progress and adjust`, priority: 'medium' },
        { title: `Review results and optimize routine`, priority: 'low' }
      ];
    }
    
    // Learning/Study tasks
    if (lower.includes('learn') || lower.includes('study') || lower.includes('course')) {
      const subject = prompt.replace(/learn|study|course|about|a|an|the/gi, '').trim();
      return [
        { title: `Find best resources and courses for ${subject}`, priority: 'high' },
        { title: `Set up study schedule and learning goals`, priority: 'high' },
        { title: `Complete first module/chapter`, priority: 'medium' },
        { title: `Practice exercises and build projects`, priority: 'medium' },
        { title: `Review and test knowledge retention`, priority: 'low' }
      ];
    }
    
    // App/Software Development
    if (lower.includes('app') || lower.includes('website') || lower.includes('software') || lower.includes('build')) {
      return [
        { title: `Define app features and user requirements`, priority: 'high' },
        { title: `Design UI/UX mockups and wireframes`, priority: 'high' },
        { title: `Set up development environment and tech stack`, priority: 'medium' },
        { title: `Build MVP with core features`, priority: 'high' },
        { title: `Test, debug and deploy beta version`, priority: 'medium' }
      ];
    }
    
    // Business/Startup tasks
    if (lower.includes('business') || lower.includes('startup') || lower.includes('company') || lower.includes('launch')) {
      return [
        { title: `Validate business idea and target market`, priority: 'high' },
        { title: `Create business plan and financial projections`, priority: 'high' },
        { title: `Register business and set up legal structure`, priority: 'medium' },
        { title: `Build MVP or first product version`, priority: 'high' },
        { title: `Launch marketing campaign and acquire first customers`, priority: 'medium' }
      ];
    }
    
    // Writing/Content tasks
    if (lower.includes('write') || lower.includes('article') || lower.includes('blog') || lower.includes('book')) {
      const content = prompt.replace(/write|article|blog|book|about|a|an|the/gi, '').trim();
      return [
        { title: `Research and outline main topics for ${content}`, priority: 'high' },
        { title: `Write first draft without editing`, priority: 'high' },
        { title: `Revise and refine the content structure`, priority: 'medium' },
        { title: `Edit for grammar, clarity and flow`, priority: 'medium' },
        { title: `Proofread and publish/submit final version`, priority: 'low' }
      ];
    }
    
    // Travel/Trip planning
    if (lower.includes('trip') || lower.includes('travel') || lower.includes('vacation') || lower.includes('visit')) {
      const destination = prompt.replace(/trip|travel|vacation|visit|to|a|an|the/gi, '').trim();
      return [
        { title: `Research ${destination} attractions and activities`, priority: 'high' },
        { title: `Book flights and accommodation`, priority: 'high' },
        { title: `Create daily itinerary and must-see spots`, priority: 'medium' },
        { title: `Pack essentials and prepare travel documents`, priority: 'medium' },
        { title: `Arrange local transportation and reservations`, priority: 'low' }
      ];
    }
    
    // Event Planning
    if (lower.includes('event') || lower.includes('party') || lower.includes('wedding') || lower.includes('conference')) {
      return [
        { title: `Set budget and create guest list`, priority: 'high' },
        { title: `Book venue and send out invitations`, priority: 'high' },
        { title: `Plan menu, entertainment and decorations`, priority: 'medium' },
        { title: `Coordinate vendors and finalize timeline`, priority: 'medium' },
        { title: `Do final walkthrough and day-of coordination`, priority: 'high' }
      ];
    }
    
    // Job Search
    if (lower.includes('job') || lower.includes('career') || lower.includes('interview')) {
      return [
        { title: `Update resume and LinkedIn profile`, priority: 'high' },
        { title: `Research target companies and roles`, priority: 'high' },
        { title: `Apply to 10-15 relevant positions`, priority: 'medium' },
        { title: `Prepare for interviews and practice answers`, priority: 'medium' },
        { title: `Follow up and negotiate offers`, priority: 'low' }
      ];
    }
    
    // Home/DIY Projects
    if (lower.includes('home') || lower.includes('diy') || lower.includes('build') || lower.includes('fix') || lower.includes('renovate')) {
      return [
        { title: `Measure space and create project plan`, priority: 'high' },
        { title: `Purchase materials and tools needed`, priority: 'high' },
        { title: `Prepare work area and safety equipment`, priority: 'medium' },
        { title: `Execute main construction/installation work`, priority: 'high' },
        { title: `Add finishing touches and clean up`, priority: 'low' }
      ];
    }
    
    // Default fallback for any other prompt
    return [
      { title: `Research and understand requirements for ${prompt}`, priority: 'high' },
      { title: `Create detailed action plan and set milestones`, priority: 'high' },
      { title: `Gather necessary resources and tools`, priority: 'medium' },
      { title: `Execute the main work for ${prompt}`, priority: 'high' },
      { title: `Review results and make improvements`, priority: 'low' }
    ];
  };

  const handleAiTaskGeneration = (e) => {
    if (e) e.preventDefault();
    
    const promptValue = aiPrompt.trim();
    if (!promptValue) return;
    
    setShowAiLoading(true);
    
    // Generate contextual tasks based on prompt
    setTimeout(() => {
      const baseDate = Date.now();
      const taskTemplates = generateContextualTasks(promptValue);
      
      const aiTasks = taskTemplates.map((template, index) => ({
        id: baseDate + index,
        title: template.title,
        priority: template.priority,
        completed: false,
        dueDate: new Date(baseDate + (86400000 * (index + 1))).toISOString().split('T')[0]
      }));
      
      setTasks(prevTasks => [...prevTasks, ...aiTasks]);
      setAiPrompt('');
      setShowAiLoading(false);
    }, 1500);
  };

  const toggleTask = (id) => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));
  const startFocusMode = () => {
    setFocusMode(true);
    setTimerRunning(true);
    setFocusTimer(focusModeType === 'pomodoro' ? 25 * 60 : 50 * 60);
  };
  
  const startTestMode = () => {
    setFocusMode(true);
    setTimerRunning(true);
    setFocusTimer(10); // 10 seconds for testing
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 3D tilt effect calculation
  const tiltX = (mousePos.y / window.innerHeight - 0.5) * 10;
  const tiltY = (mousePos.x / window.innerWidth - 0.5) * -10;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Gradient orbs */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 113, 227, 0.4), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite',
        transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
        zIndex: 0
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.3), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 25s ease-in-out infinite reverse',
        transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.03}px)`,
        zIndex: 0
      }} />

      {/* Focus Mode Overlay */}
      {focusMode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.98)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ textAlign: 'center', transform: `perspective(1000px) rotateX(${tiltX * 0.3}deg) rotateY(${tiltY * 0.3}deg)`, transition: 'transform 0.1s ease-out' }}>
            <div style={{ fontSize: '120px', fontWeight: '700', background: 'linear-gradient(135deg, #0071e3, #8a2be2, #ff1493)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '24px', letterSpacing: '-0.02em', fontFeatureSettings: '"tnum"', animation: 'pulse 2s ease-in-out infinite' }}>{formatTime(focusTimer)}</div>
            <div style={{ fontSize: '21px', color: '#86868b', marginBottom: '48px', fontWeight: '400', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{focusModeType === 'pomodoro' ? 'Pomodoro Focus' : 'Deep Work Session'}</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setTimerRunning(!timerRunning)} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #0071e3, #8a2be2)', border: 'none', borderRadius: '50px', color: '#fff', cursor: 'pointer', fontSize: '17px', fontWeight: '600', boxShadow: '0 10px 40px rgba(0, 113, 227, 0.5)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', letterSpacing: '0.05em' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 113, 227, 0.7)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 113, 227, 0.5)'; }}>{timerRunning ? 'PAUSE' : 'RESUME'}</button>
              <button onClick={() => { setFocusMode(false); setTimerRunning(false); setFocusTimer(25 * 60); }} style={{ padding: '14px 28px', background: 'rgba(255, 255, 255, 0.1)', border: '2px solid rgba(255, 255, 255, 0.3)', borderRadius: '50px', color: '#fff', cursor: 'pointer', fontSize: '17px', fontWeight: '600', backdropFilter: 'blur(10px)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', letterSpacing: '0.05em' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}>EXIT</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        {/* Navigation with 3D logo */}
        <nav style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 3D Animated Logo */}
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0071e3, #8a2be2, #ff1493)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0, 113, 227, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.3)',
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`,
              transition: 'transform 0.1s ease-out',
              animation: 'float 6s ease-in-out infinite, glow 3s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-2px',
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                animation: 'shimmer 3s linear infinite'
              }} />
              <Zap size={32} color="#fff" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))', position: 'relative', zIndex: 1 }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff, #0071e3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VibeProd</div>
          </div>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {['Tasks', 'Focus'].map((tab, i) => (
              <button key={tab.toLowerCase()} onClick={() => setActiveTab(tab.toLowerCase())} style={{ background: 'none', border: 'none', color: activeTab === tab.toLowerCase() ? '#fff' : '#666', cursor: 'pointer', fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em', padding: '0', transition: 'all 0.3s ease', textTransform: 'uppercase', position: 'relative', animation: `slideDown 0.6s ease-out ${i * 0.1}s backwards` }} onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { if (activeTab !== tab.toLowerCase()) e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {tab}
                {activeTab === tab.toLowerCase() && <div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, #0071e3, #8a2be2)', animation: 'expandWidth 0.3s ease-out' }} />}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero Section with 3D text */}
        <section style={{ textAlign: 'center', padding: '100px 0 120px', marginBottom: '60px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 113, 227, 0.2), transparent)',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
            zIndex: -1
          }} />
          <h1 style={{
            fontSize: '96px',
            fontWeight: '900',
            margin: '0 0 16px 0',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #fff 0%, #0071e3 50%, #8a2be2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1',
            textShadow: '0 0 80px rgba(0, 113, 227, 0.5)',
            animation: 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), textGlow 3s ease-in-out infinite',
            transform: `perspective(1000px) rotateX(${tiltX * 0.2}deg) rotateY(${tiltY * 0.2}deg)`,
            transition: 'transform 0.1s ease-out'
          }}>
            {activeTab === 'tasks' && 'Productivity\nUnleashed'}
            {activeTab === 'focus' && 'Focus\nIntensified'}
          </h1>
          <p style={{
            fontSize: '24px',
            color: '#999',
            margin: '0',
            fontWeight: '500',
            letterSpacing: '0.05em',
            lineHeight: '1.6',
            animation: 'fadeIn 1s ease-out 0.3s backwards',
            textTransform: 'uppercase'
          }}>
            {activeTab === 'tasks' && 'AI-Powered Task Domination'}
            {activeTab === 'focus' && 'Maximum Deep Work Flow'}
          </p>
        </section>

        {/* Stats Cards - Only in Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '100px' }}>
            {[
              { label: 'Completion Rate', value: `${completionRate}%`, color: '#0071e3' },
              { label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}`, color: '#8a2be2' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px 32px',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideUp 0.6s ease-out ${i * 0.1}s backwards`
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 30px 80px ${stat.color}40`;
                e.currentTarget.style.borderColor = stat.color;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${stat.color}20, transparent)`,
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }} />
                <div style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginBottom: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>{stat.label}</div>
                <div style={{ fontSize: '56px', fontWeight: '800', color: stat.color, letterSpacing: '-0.02em', fontFeatureSettings: '"tnum"', position: 'relative', zIndex: 1, textShadow: `0 0 40px ${stat.color}60` }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{ paddingBottom: '100px', animation: 'fadeIn 0.5s ease-out' }}>
            {/* AI Prompt Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '48px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              animation: 'slideUp 0.6s ease-out'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 113, 227, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px',
                background: 'radial-gradient(ellipse at top, rgba(0, 113, 227, 0.15), transparent)',
                pointerEvents: 'none'
              }} />
              <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>AI Task Generator</h3>
                <p style={{ margin: 0, fontSize: '16px', color: '#999', fontWeight: '400', letterSpacing: '0.02em' }}>Describe your goal and watch AI build your perfect workflow</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                <input 
                  type="text" 
                  value={aiPrompt} 
                  onChange={(e) => setAiPrompt(e.target.value)} 
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAiTaskGeneration();
                    }
                  }}
                  placeholder="e.g., Launch a new mobile app, Write a research paper..." 
                  disabled={showAiLoading}
                  style={{
                    flex: 1,
                    padding: '18px 24px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '18px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.3s ease'
                  }} 
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0071e3';
                    e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 113, 227, 0.1)';
                  }} 
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                    e.target.style.boxShadow = 'none';
                  }} 
                />
                <button 
                  type="button"
                  onClick={handleAiTaskGeneration}
                  disabled={showAiLoading || !aiPrompt.trim()}
                  style={{
                    padding: '18px 40px',
                    background: (showAiLoading || !aiPrompt.trim()) ? '#666' : 'linear-gradient(135deg, #0071e3, #8a2be2)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    cursor: (showAiLoading || !aiPrompt.trim()) ? 'not-allowed' : 'pointer',
                    fontSize: '18px',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    opacity: (showAiLoading || !aiPrompt.trim()) ? 0.6 : 1,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    whiteSpace: 'nowrap',
                    boxShadow: (showAiLoading || !aiPrompt.trim()) ? 'none' : '0 10px 40px rgba(0, 113, 227, 0.5)'
                  }} 
                  onMouseEnter={(e) => {
                    if (!showAiLoading && aiPrompt.trim()) {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 113, 227, 0.7)';
                    }
                  }} 
                  onMouseLeave={(e) => {
                    if (!showAiLoading && aiPrompt.trim()) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 113, 227, 0.5)';
                    }
                  }}
                >
                  {showAiLoading ? 'Generating...' : '⚡ Generate'}
                </button>
              </div>
            </div>

            {/* Quick Add Task */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px 32px',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
              animation: 'slideUp 0.6s ease-out 0.1s backwards'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.5)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(138, 43, 226, 0.2)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '2px solid rgba(138, 43, 226, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: 'rgba(138, 43, 226, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <Plus size={16} color="#8a2be2" strokeWidth={3} />
                </div>
                <input type="text" value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} placeholder="Quick add task..." style={{
                  flex: 1,
                  padding: '12px 0',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  outline: 'none',
                  letterSpacing: '-0.01em'
                }} />
                <button type="submit" style={{
                  padding: '10px 24px',
                  background: newTaskInput ? 'linear-gradient(135deg, #8a2be2, #ff1493)' : 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: newTaskInput ? 1 : 0.5,
                  textTransform: 'uppercase'
                }} onMouseEnter={(e) => {
                  if (newTaskInput) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(138, 43, 226, 0.5)';
                  }
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>Add</button>
              </form>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task, idx) => (
                <div key={task.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: task.completed ? 0.5 : 1,
                  animation: `slideUp 0.4s ease-out ${idx * 0.05}s backwards`,
                  position: 'relative',
                  overflow: 'hidden'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 20, 147, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 20, 147, 0.5)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: task.priority === 'high' ? 'linear-gradient(180deg, #ff1493, #ff6347)' :
                               task.priority === 'medium' ? 'linear-gradient(180deg, #ffa500, #ffd700)' :
                               'linear-gradient(180deg, #32cd32, #00fa9a)'
                  }} />
                  <button onClick={() => toggleTask(task.id)} style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2) rotate(10deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}>
                    {task.completed ? (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0071e3, #00d4ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 113, 227, 0.6)'
                      }}>
                        <CheckCircle size={18} color="#fff" strokeWidth={3} />
                      </div>
                    ) : (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }} />
                    )}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '500',
                      color: task.completed ? '#666' : '#fff',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      marginBottom: '6px',
                      letterSpacing: '-0.01em'
                    }}>{task.title}</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#666', letterSpacing: '0.02em' }}>{task.dueDate}</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        background: task.priority === 'high' ? 'rgba(255, 59, 48, 0.2)' :
                                   task.priority === 'medium' ? 'rgba(255, 159, 10, 0.2)' :
                                   'rgba(52, 199, 89, 0.2)',
                        color: task.priority === 'high' ? '#ff3b30' :
                               task.priority === 'medium' ? '#ff9f0a' :
                               '#34c759',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}>{task.priority}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} style={{
                    background: 'rgba(255, 59, 48, 0.1)',
                    border: '1px solid rgba(255, 59, 48, 0.3)',
                    borderRadius: '12px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.4,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.2) rotate(90deg)';
                    e.currentTarget.style.background = 'rgba(255, 59, 48, 0.3)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.4';
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
                  }}>
                    <X size={18} color="#ff3b30" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '100px 20px',
                  color: '#666',
                  fontSize: '18px',
                  letterSpacing: '0.05em',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  ✨ No tasks yet. Create your first masterpiece above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Focus Tab */}
        {activeTab === 'focus' && (
          <div style={{ paddingBottom: '100px', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Focus Session Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
              {[
                { label: 'Sessions Completed', value: focusSessions.length, color: '#0071e3' },
                { label: 'Total Focus Time', value: `${totalFocusTime}min`, color: '#8a2be2' },
                { label: 'Last Session', value: focusSessions.length > 0 ? (focusSessions[focusSessions.length - 1].type === 'pomodoro' ? 'Pomodoro' : 'Deep Work') : 'None', color: '#ff1493' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: window.innerWidth < 768 ? '32px 24px' : '40px 32px',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideUp 0.6s ease-out ${i * 0.1}s backwards`,
                  textAlign: 'center'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 30px 80px ${stat.color}40`;
                  e.currentTarget.style.borderColor = stat.color;
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${stat.color}20, transparent)`,
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                  }} />
                  <div style={{ fontSize: window.innerWidth < 768 ? '12px' : '14px', color: '#666', fontWeight: '600', marginBottom: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>{stat.label}</div>
                  <div style={{ fontSize: window.innerWidth < 768 ? '42px' : '56px', fontWeight: '800', color: stat.color, letterSpacing: '-0.02em', fontFeatureSettings: '"tnum"', position: 'relative', zIndex: 1, textShadow: `0 0 40px ${stat.color}60` }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Focus Mode Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: window.innerWidth < 768 ? '40px 24px' : '80px 60px',
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
              animation: 'slideUp 0.6s ease-out'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.2), transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              <h2 style={{
                fontSize: window.innerWidth < 768 ? '32px' : '48px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #8a2be2, #ff1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
                position: 'relative',
                zIndex: 1
              }}>Focus Mode</h2>
              <p style={{
                fontSize: window.innerWidth < 768 ? '14px' : '18px',
                color: '#999',
                marginBottom: window.innerWidth < 768 ? '32px' : '48px',
                lineHeight: '1.6',
                letterSpacing: '0.02em',
                position: 'relative',
                zIndex: 1,
                padding: window.innerWidth < 768 ? '0 8px' : '0'
              }}>Block distractions and enter maximum productivity flow with timed deep work sessions</p>
              <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '16px', marginBottom: window.innerWidth < 768 ? '32px' : '48px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                {['pomodoro', 'deepwork'].map(mode => (
                  <button key={mode} onClick={() => setFocusModeType(mode)} style={{
                    padding: window.innerWidth < 768 ? '14px 24px' : '16px 32px',
                    background: focusModeType === mode ? 'linear-gradient(135deg, #0071e3, #8a2be2)' : 'rgba(255, 255, 255, 0.05)',
                    border: focusModeType === mode ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: window.innerWidth < 768 ? '14px' : '16px',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    textTransform: 'uppercase',
                    boxShadow: focusModeType === mode ? '0 10px 40px rgba(0, 113, 227, 0.5)' : 'none'
                  }} onMouseEnter={(e) => {
                    if (focusModeType !== mode) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }} onMouseLeave={(e) => {
                    if (focusModeType !== mode) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {mode === 'pomodoro' ? 'Pomodoro · 25min' : 'Deep Work · 50min'}
                  </button>
                ))}
              </div>
              <button onClick={startFocusMode} style={{
                padding: window.innerWidth < 768 ? '16px 40px' : '20px 60px',
                background: 'linear-gradient(135deg, #0071e3, #8a2be2)',
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: window.innerWidth < 768 ? '16px' : '20px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textTransform: 'uppercase',
                boxShadow: '0 15px 50px rgba(0, 113, 227, 0.6)',
                position: 'relative',
                zIndex: 1,
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 113, 227, 0.8)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 113, 227, 0.6)';
              }}>⚡ Start Session</button>
              
              <button onClick={startTestMode} style={{
                padding: window.innerWidth < 768 ? '12px 32px' : '16px 40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: window.innerWidth < 768 ? '14px' : '16px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                textTransform: 'uppercase',
                marginTop: '16px',
                position: 'relative',
                zIndex: 1,
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}>🧪 Test Mode (10s)</button>
            </div>

            {/* Session History */}
            {focusSessions.length > 0 && (
              <div style={{ marginTop: '60px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px', letterSpacing: '-0.02em' }}>Session History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {focusSessions.slice().reverse().map((session, idx) => {
                    const sessionDate = new Date(session.completedAt);
                    const timeAgo = Math.floor((Date.now() - sessionDate.getTime()) / 60000); // minutes ago
                    const displayTime = timeAgo < 60 ? `${timeAgo}m ago` : 
                                       timeAgo < 1440 ? `${Math.floor(timeAgo / 60)}h ago` :
                                       `${Math.floor(timeAgo / 1440)}d ago`;
                    
                    return (
                      <div key={session.id} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                        animation: `slideUp 0.4s ease-out ${idx * 0.05}s backwards`
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px)';
                        e.currentTarget.style.borderColor = session.type === 'pomodoro' ? '#0071e3' : '#8a2be2';
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: session.type === 'pomodoro' ? 'linear-gradient(135deg, #0071e3, #00d4ff)' : 'linear-gradient(135deg, #8a2be2, #ff1493)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#fff',
                            boxShadow: session.type === 'pomodoro' ? '0 4px 20px rgba(0, 113, 227, 0.4)' : '0 4px 20px rgba(138, 43, 226, 0.4)'
                          }}>#{focusSessions.length - idx}</div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                              {session.type === 'pomodoro' ? 'Pomodoro Session' : 'Deep Work Session'}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>{session.duration} minutes · {displayTime}</div>
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 16px',
                          borderRadius: '8px',
                          background: 'rgba(52, 199, 89, 0.2)',
                          color: '#34c759',
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase'
                        }}>Completed</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 20px 60px rgba(0, 113, 227, 0.6), inset 0 -5px 20px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 25px 80px rgba(138, 43, 226, 0.8), inset 0 -5px 20px rgba(0, 0, 0, 0.3); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 80px rgba(0, 113, 227, 0.5); }
          50% { text-shadow: 0 0 120px rgba(138, 43, 226, 0.8); }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::selection {
          background: rgba(0, 113, 227, 0.3);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
