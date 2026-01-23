import React, { useState, useEffect } from 'react';
import { Mail, ArrowDown, ExternalLink } from 'lucide-react';

const JaiPortfolio = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [sparkles, setSparkles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCV, setShowCV] = useState(false);
  
  // Randomized chrome color on load
  const [chromeColor] = useState(() => {
    const colors = [
      { name: 'silver', rgb: '192, 192, 192' },
      { name: 'platinum', rgb: '229, 228, 226' },
      { name: 'rose-gold', rgb: '183, 110, 121' },
      { name: 'copper', rgb: '184, 115, 51' }
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Determine active section
      const sections = ['home', 'newsletter', 'consultancy'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const sparkle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2
      };
      
      setSparkles(prev => [...prev.slice(-15), sparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.slice(-10));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Fetch Substack RSS feed
  useEffect(() => {
    const fetchSubstackPosts = async () => {
      try {
        // Use RSS2JSON service which is more reliable for Substack
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://productiveconfusion.substack.com/feed'));
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const parsedPosts = data.items.slice(0, 3).map(item => ({
            title: item.title || '',
            link: item.link || '',
            pubDate: item.pubDate || '',
            description: item.description || item.content || ''
          }));
          
          setPosts(parsedPosts);
        } else {
          console.error('RSS feed returned no items:', data);
        }
        setLoadingPosts(false);
      } catch (error) {
        console.error('Error fetching Substack posts:', error);
        setLoadingPosts(false);
      }
    };

    fetchSubstackPosts();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      background: '#000000',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {showCV ? (
        <CVPage chromeColor={chromeColor} onClose={() => setShowCV(false)} />
      ) : (
        <>
      {/* Subtle metallic gradient overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at ${20 + scrollY * 0.02}% ${30 + scrollY * 0.015}%, rgba(${chromeColor.rgb}, 0.03) 0%, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Sparkly cursor trail */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'sparkle 0.6s ease-out forwards',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Minimal Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
        background: 'rgba(0, 0, 0, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: '#ffffff'
        }}>
          JAI N. CLARKE-BINNS
        </div>
        
        <div style={{ display: 'flex', gap: '3rem' }}>
          {['home', 'newsletter', 'consultancy'].map(section => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === section ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.3s ease',
                textTransform: 'lowercase',
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '0.05em',
                fontWeight: 400,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section) {
                  e.target.style.color = 'rgba(255, 255, 255, 0.5)';
                }
              }}
            >
              {section}
              {activeSection === section && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)'
                }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '4rem'
      }}>
        <div style={{
          maxWidth: '1100px',
          width: '100%'
        }}>
          <h1 
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              fontWeight: 300,
              margin: 0,
              marginBottom: '2rem',
              color: '#ffffff',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              position: 'relative',
              whiteSpace: 'nowrap',
              cursor: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'silver\' stroke-width=\'2\'%3E%3Cpath d=\'m16 3 4 4-12 12-5 1 1-5Z\'/%3E%3C/svg%3E") 0 24, pointer',
              transition: 'opacity 0.3s ease'
            }}
            onClick={() => {
              setShowCV(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Jai N. Clarke-Binns
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, transparent 40%, rgba(${chromeColor.rgb}, 0.15) 50%, transparent 60%)`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'subtleShine 8s ease-in-out infinite',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}>
              Jai N. Clarke-Binns
            </div>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '6rem',
            letterSpacing: '0.01em',
            lineHeight: 1.7,
            fontWeight: 300,
            maxWidth: '700px'
          }}>
            Unconventionally rigorous thinking for organisational challenges
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <InfoCard 
              title="Senior Global Experience Partner"
              org="Google DeepMind"
              description="AI fluency frameworks, organisational development, and DE&I strategy"
            />
            <InfoCard 
              title="Board Member"
              org="Camden STEAM"
              description="Connecting young people to opportunities in digital, scientific, and creative industries"
            />
            <InfoCard 
              title="Creator"
              org="Productive Confusion"
              description="Newsletter exploring discernment in an age of artificialisation"
            />
          </div>
        </div>

        <button
          onClick={() => scrollToSection('newsletter')}
          style={{
            position: 'absolute',
            bottom: '3rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            animation: 'float 3s ease-in-out infinite',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.3)'}
        >
          <ArrowDown size={24} strokeWidth={1} />
        </button>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '8rem 4rem'
      }}>
        <div style={{
          maxWidth: '1100px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 300,
            marginBottom: '1.5rem',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1
          }}>
            Productive Confusion
          </h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '4rem',
            lineHeight: 1.7,
            fontWeight: 300,
            maxWidth: '700px'
          }}>
            A newsletter about discernment in an age of artificialisation. Exploring how we relate to technology, art, society, and community.
          </p>

          {/* Latest posts */}
          <div style={{
            marginBottom: '3rem'
          }}>
            {loadingPosts ? (
              <div style={{
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  LOADING LATEST POSTS...
                </p>
              </div>
            ) : posts.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {posts.map((post, index) => (
                  <NewsletterPost key={index} post={post} chromeColor={chromeColor} />
                ))}
              </div>
            ) : (
              <div style={{
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  NO POSTS FOUND
                </p>
              </div>
            )}
          </div>

          <a
            href="https://productiveconfusion.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.2rem 2.5rem',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View Full Archive <ExternalLink size={16} strokeWidth={2} />
          </a>
        </div>
      </section>

      {/* Consultancy Section */}
      <section id="consultancy" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '8rem 4rem'
      }}>
        <div style={{
          maxWidth: '1100px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 300,
            marginBottom: '1.5rem',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1
          }}>
            What I Offer
          </h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '5rem',
            lineHeight: 1.7,
            fontWeight: 300,
            maxWidth: '700px'
          }}>
            Consulting for organisations navigating complexity without the corporate theatre.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            marginBottom: '5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <ServiceCard
              title="AI Fluency & Organisational Development"
              unconventional="Most AI training treats people like they need to be sold on AI"
              rigorous="I develop frameworks that help people discern when and how AI actually serves their work"
              chromeColor={chromeColor}
            />
            <ServiceCard
              title="Organisational Effectiveness"
              unconventional="I study what's broken, not what's working"
              rigorous="Research-backed approaches to uncover leading behaviours and dysfunctional patterns"
              chromeColor={chromeColor}
            />
            <ServiceCard
              title="DE&I Strategy"
              unconventional="Equity work that questions performative metrics"
              rigorous="Evidence-based interventions that shift culture, not just optics"
              chromeColor={chromeColor}
            />
          </div>

          <div style={{
            background: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '3rem',
            marginBottom: '4rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '2rem',
              color: '#ffffff',
              fontWeight: 400,
              letterSpacing: '0.02em'
            }}>
              How I Work
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}>
              {[
                'I ask uncomfortable questions',
                'I cite my sources',
                'I don\'t do corporate theatre',
                'I build tools and frameworks you can actually use',
                'I care about intellectual honesty',
                'I like to have fun and continuously learn'
              ].map((item, i) => (
                <li key={i} style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.95rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  lineHeight: 1.7,
                  fontWeight: 300
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'rgba(255, 255, 255, 0.3)'
                  }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            textAlign: 'left',
            padding: '3rem',
            background: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              color: '#ffffff',
              fontWeight: 400,
              letterSpacing: '0.02em'
            }}>
              Get in Touch
            </h3>
            <a
              href="mailto:Jclarkebinns@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontWeight: 300
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              <Mail size={20} strokeWidth={1.5} /> Jclarkebinns@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Global styles and animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @keyframes subtleShine {
          0%, 100% { 
            background-position: 0% 50%;
            opacity: 0;
          }
          50% { 
            background-position: 100% 50%;
            opacity: 0.15;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-8px);
            opacity: 0.6;
          }
        }

        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
        }
        
        ::selection {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
      `}</style>
        </>
      )}
    </div>
  );
};

const NewsletterPost = ({ post, chromeColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const excerpt = stripHtml(post.description).slice(0, 200) + '...';

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: '#000000',
        padding: '2.5rem',
        textDecoration: 'none',
        display: 'block',
        transition: 'all 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'perspective(1000px) rotateX(1deg) rotateY(-1deg)' : 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle chrome shine on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: isHovered ? '-100%' : '-200%',
        width: '50%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, rgba(${chromeColor.rgb}, 0.05), transparent)`,
        transition: 'left 1s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.3)',
          marginBottom: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          {formatDate(post.pubDate)}
        </div>
        
        <h3 style={{
          fontSize: '1.3rem',
          color: '#ffffff',
          marginBottom: '1rem',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          transition: 'color 0.3s ease'
        }}>
          {post.title}
        </h3>
        
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: 1.7,
          fontWeight: 300
        }}>
          {excerpt}
        </p>

        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.85rem',
          color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Read More <ExternalLink size={14} strokeWidth={2} />
        </div>
      </div>
    </a>
  );
};

const InfoCard = ({ title, org, description }) => (
  <div style={{
    background: '#000000',
    padding: '2rem',
    transition: 'all 0.4s ease',
    cursor: 'default',
    position: 'relative'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = '#000000';
  }}>
    <div style={{
      fontSize: '1.1rem',
      fontWeight: 400,
      marginBottom: '0.5rem',
      color: '#ffffff',
      letterSpacing: '-0.01em'
    }}>
      {title}
    </div>
    <div style={{
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.4)',
      marginBottom: '0.75rem',
      letterSpacing: '0.02em'
    }}>
      {org}
    </div>
    <div style={{
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.5)',
      lineHeight: 1.6,
      fontWeight: 300
    }}>
      {description}
    </div>
  </div>
);

const ServiceCard = ({ title, unconventional, rigorous, chromeColor }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: '#000000',
        padding: '3rem',
        transition: 'all 0.4s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle chrome shine on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: isHovered ? '-100%' : '-200%',
        width: '50%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, rgba(${chromeColor.rgb}, 0.05), transparent)`,
        transition: 'left 1s ease',
        pointerEvents: 'none'
      }} />
      
      <h3 style={{
        fontSize: '1.3rem',
        marginBottom: '2rem',
        color: '#ffffff',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        position: 'relative'
      }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.3)',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500
          }}>
            The Unconventional
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            {unconventional}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.3)',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500
          }}>
            The Rigorous
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            {rigorous}
          </div>
        </div>
      </div>
    </div>
  );
};

const CVPage = ({ chromeColor, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownload = () => {
    const cvText = `JAI N. CLARKE-BINNS
CV / Portfolio

Contact: hello@jclarkebinns.com | Tel: 07788724069
Newsletter: productiveconfusion.substack.com

Organisational strategist specialising in applied research, AI fluency, and organisational design.

For full detailed CV, please visit jclarkebinns.com`;
    
    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jai_Clarke-Binns_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '4rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.15)';
          e.target.style.borderColor = `rgba(${chromeColor.rgb}, 0.5)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: '4rem', animation: 'fadeIn 0.6s ease' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 300,
          marginBottom: '1rem',
          letterSpacing: '-0.03em',
          background: `linear-gradient(135deg, #ffffff, rgba(${chromeColor.rgb}, 0.8))`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Jai N. Clarke-Binns
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '1rem',
          fontWeight: 300,
          fontStyle: 'italic'
        }}>
          Organisational strategist | Surfacing root causes, building capability, enabling scalable change
        </p>
        <div style={{
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.5)',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <span>07788724069</span>
          <span>hello@jclarkebinns.com</span>
          <a href="https://productiveconfusion.substack.com" target="_blank" rel="noopener noreferrer" style={{
            color: `rgba(${chromeColor.rgb}, 0.8)`,
            textDecoration: 'none'
          }}>
            productiveconfusion.substack.com
          </a>
        </div>
      </div>

      <CVSection title="Professional Profile" chromeColor={chromeColor}>
        <p style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300 }}>
          Organisational strategist specialising in applied research, AI fluency, and organisational design. I bridge the gap between leadership assumptions and operational reality by diagnosing root causes and designing scalable, evidence-based interventions. Through my 3L Framework, I reframe "people problems" as design problems to enable high-performance outcomes.
        </p>
      </CVSection>

      <CVSection title="The 3L Framework: Organisational Diagnosis That Delivers Results" chromeColor={chromeColor}>
        <p style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300, marginBottom: '1rem' }}>
          Performance gaps are often systems, clarity, or friction problems rather than talent issues. My framework surfaces root causes by integrating:
        </p>
        <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ffffff' }}>Leadership:</strong> Stakeholder beliefs regarding performance drivers</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ffffff' }}>Literature:</strong> Academic research and evidence-based insights</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ffffff' }}>Lived Experience:</strong> The reality of the employee experience</li>
        </ul>
        <p style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 300 }}>
          Using TEAM (Task Experience Architecture Mapping), I identify the delta between perception and reality to build scalable solutions.
        </p>
      </CVSection>

      <CVSection title="Experience" chromeColor={chromeColor}>
        <ExperienceItem
          title="Senior Employee Experience Partner"
          company="Google DeepMind"
          dates="Feb 2025 - Present"
          expanded={expandedSections['deepmind1']}
          onToggle={() => toggleSection('deepmind1')}
          chromeColor={chromeColor}
          bullets={[
            "Deployed 3L Framework to diagnose performance gaps, using TEAM methodology to identify teachable behaviors and deliver evidence-based playbooks",
            "Architected AI-powered learning resource using NotebookLM to scale fairness framework via conversational AI, audio, and video",
            "Developing AI fluency framework to transition organization toward strategic AI integration while maintaining human discernment"
          ]}
        />

        <ExperienceItem
          title="Senior DE&I Partner"
          company="Google DeepMind"
          dates="Jul 2022 - Feb 2025"
          expanded={expandedSections['deepmind2']}
          onToggle={() => toggleSection('deepmind2')}
          chromeColor={chromeColor}
          bullets={[
            "Directed £800k+ global DE&I budget across programming and community engagement",
            "Engineered organization-wide DE&I data dashboard navigating international legal and privacy requirements for leadership accountability",
            "Established governance framework for DE&I Working Groups, standardizing processes across distributed efforts",
            "Facilitated strategic leadership coaching using IDI data, co-creating development plans aligned with leaders' priorities"
          ]}
        />

        <ExperienceItem
          title="People and Culture Partner"
          company="Google DeepMind"
          dates="Jul 2020 - Jul 2022"
          expanded={expandedSections['deepmind3']}
          onToggle={() => toggleSection('deepmind3')}
          chromeColor={chromeColor}
          bullets={[
            "Spearheaded first organizational health review for Research Engineering (200+ FTEs), integrating quantitative and qualitative data",
            "Directed company-wide Fairness Framework implementation, auditing all P&C processes to eliminate bias",
            "Partnered with Director of Research Engineering through multiple restructures, maintaining 85%+ engagement scores"
          ]}
        />
      </CVSection>

      <CVSection title="Board & Entrepreneurial Leadership" chromeColor={chromeColor}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#ffffff' }}>
            Board Member | Camden STEAM (2023 - Present)
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Driving youth engagement initiatives through tech employer partnerships and educational institutions
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#ffffff' }}>
            Founder & CEO | People of Creativity (2015 - 2021)
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Built platform connecting 500+ professionals of color in creative and technology sectors
          </p>
        </div>
      </CVSection>

      <CVSection title="Executive Consulting" chromeColor={chromeColor}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 500, marginBottom: '0.3rem', color: '#ffffff' }}>
            Strategic OD Consultant
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.3rem' }}>
            Feb 2019 - May 2021
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1rem', fontStyle: 'italic' }}>
            Bakken & Baeck (Digital Innovation Agency), SPACE10 (IKEA Future Living Lab)
          </div>
          <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, listStyle: 'none' }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: `rgba(${chromeColor.rgb}, 0.6)` }}>→</span>
              Conducted diagnostic research to surface organizational friction points, co-creating scalable solutions and culture interventions
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: `rgba(${chromeColor.rgb}, 0.6)` }}>→</span>
              Developed evidence-based DE&I strategies integrating stakeholder research with organizational data
            </li>
          </ul>
        </div>
      </CVSection>

      <CVSection title="Scale-Up Leadership" chromeColor={chromeColor}>
        <ExperienceItem
          title="People and Culture Partner"
          company="Satalia (AI Startup)"
          dates="Feb 2017 - Jul 2020"
          expanded={expandedSections['satalia']}
          onToggle={() => toggleSection('satalia')}
          chromeColor={chromeColor}
          bullets={[
            "Built comprehensive HR function from ground up in partnership with CEO during accelerated growth phase",
            "Designed skills-based performance and compensation framework to enable greater organizational flexibility",
            "Increased hiring velocity by 300% while maintaining rigorous quality standards"
          ]}
        />
      </CVSection>

      <CVSection title="Thought Leadership & Recognition" chromeColor={chromeColor}>
        <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <li>Judge: RSA Student Design Award (AI Category), 2024</li>
          <li>Keynote Speaker: D&I Leaders LGBTQ+ at Work Conference, 2024</li>
          <li>Published Authority: "AI has the Potential to Raise HR's Profile" (People Management Magazine)</li>
        </ul>
      </CVSection>

      <CVSection title="Qualifications" chromeColor={chromeColor}>
        <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <li>Ethics of AI: London School of Economics</li>
          <li>B.A. Criticism, Communication & Curation: Central Saint Martins</li>
          <li>Professional Accreditations: IDI Qualified Assessor; Diploma in NLP; ILM Workplace Coaching; CIPD Employment Law</li>
        </ul>
      </CVSection>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <button
          onClick={handleDownload}
          style={{
            padding: '1.2rem 3rem',
            background: `linear-gradient(135deg, rgba(${chromeColor.rgb}, 0.2), rgba(${chromeColor.rgb}, 0.1))`,
            border: `1px solid rgba(${chromeColor.rgb}, 0.3)`,
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `linear-gradient(135deg, rgba(${chromeColor.rgb}, 0.3), rgba(${chromeColor.rgb}, 0.2))`;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `linear-gradient(135deg, rgba(${chromeColor.rgb}, 0.2), rgba(${chromeColor.rgb}, 0.1))`;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Download CV
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const CVSection = ({ title, children, chromeColor }) => (
  <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.6s ease' }}>
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: 400,
      marginBottom: '1.5rem',
      color: `rgba(${chromeColor.rgb}, 0.9)`,
      letterSpacing: '0.02em',
      borderBottom: `1px solid rgba(${chromeColor.rgb}, 0.2)`,
      paddingBottom: '0.5rem'
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const ExperienceItem = ({ title, company, dates, expanded, onToggle, chromeColor, bullets }) => (
  <div style={{
    marginBottom: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    background: expanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
  }}
  onClick={onToggle}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = `rgba(${chromeColor.rgb}, 0.3)`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: expanded ? '1rem' : '0'
    }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.25rem', color: '#ffffff' }}>
          {title}
        </h3>
        <div style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
          {company}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
          {dates}
        </div>
      </div>
      <div style={{
        fontSize: '1.5rem',
        color: `rgba(${chromeColor.rgb}, 0.6)`,
        transition: 'transform 0.3s ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
      }}>
        ↓
      </div>
    </div>
    {expanded && (
      <ul style={{
        paddingLeft: '1.5rem',
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 1.8,
        listStyle: 'none',
        marginTop: '1rem'
      }}>
        {bullets.map((bullet, i) => (
          <li key={i} style={{
            marginBottom: '0.75rem',
            paddingLeft: '1rem',
            position: 'relative',
            transition: 'color 0.3s ease',
            fontSize: '0.95rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <span style={{
              position: 'absolute',
              left: 0,
              color: `rgba(${chromeColor.rgb}, 0.6)`
            }}>→</span>
            {bullet}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default JaiPortfolio;
