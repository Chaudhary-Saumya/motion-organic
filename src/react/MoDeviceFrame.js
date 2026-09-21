import { useRef, useState, useEffect, createElement } from 'react';
import { Spring } from '../core/spring.js';

/**
 * MoDeviceFrame — Interactive 3D Smartphone Mockup Rig.
 * Features realistic aluminum bezel, camera island, cursor hover spring physics,
 * and seamless integration with MoChatFeed or any custom app screen.
 */
export function MoDeviceFrame({
  children,
  width = 340,
  height = 680,
  bezelRadius = 46,
  borderColor = '#232630',
  accentColor = '#38bdf8',
  maxTilt = 16,
  interactive = true,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const springX = useRef(new Spring({ stiffness: 140, damping: 16 }));
  const springY = useRef(new Spring({ stiffness: 140, damping: 16 }));
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    let animId;
    const tick = () => {
      const sx = springX.current;
      const sy = springY.current;
      sx.step(0.016);
      sy.step(0.016);

      setTiltStyle({
        transform: `rotateX(${sx.value.toFixed(2)}deg) rotateY(${sy.value.toFixed(2)}deg)`,
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const dx = (e.clientX - cx) / (rect.width * 0.5);
    const dy = (e.clientY - cy) / (rect.height * 0.5);

    springX.current.set(-dy * maxTilt);
    springY.current.set(dx * maxTilt);
  };

  const handleMouseLeave = () => {
    springX.current.set(0);
    springY.current.set(0);
  };

  const dynamicIsland = createElement(
    'div',
    {
      style: {
        position: 'absolute',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '84px',
        height: '20px',
        borderRadius: '999px',
        background: '#000000',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
      },
    },
    createElement('div', {
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#161922',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
      },
    })
  );

  const screenContent = createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        paddingTop: '40px',
      },
    },
    children
  );

  const chassis = createElement(
    'div',
    {
      className: 'mo-device-chassis',
      style: {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: `${bezelRadius}px`,
        background: '#0a0c10',
        border: `4px solid ${borderColor}`,
        boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 0 2px rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'box-shadow 0.3s ease',
        ...tiltStyle,
      },
    },
    dynamicIsland,
    screenContent
  );

  return createElement(
    'div',
    {
      ref: containerRef,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      className: `mo-device-container ${className}`,
      style: {
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      },
    },
    chassis
  );
}

/**
 * MoChatFeed — Container for animated conversational UI in MoDeviceFrame.
 */
export function MoChatFeed({ children, className = '', style = {} }) {
  return createElement(
    'div',
    {
      className: `mo-chat-feed ${className}`,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px 14px',
        ...style,
      },
    },
    children
  );
}

/**
 * MoChatBubble — Individual conversational message bubble with avatars.
 */
export function MoChatBubble({
  text,
  sender = 'agent', // 'user' (right) | 'agent' (left)
  avatar,
  timestamp,
  accentColor = '#38bdf8',
  onClick,
  style = {},
}) {
  const isUser = sender === 'user';

  const avatarNode = createElement(
    'div',
    {
      style: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: isUser ? '#f59e0b' : '#3b82f6',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#ffffff',
        overflow: 'hidden',
      },
    },
    avatar ? (typeof avatar === 'string' ? createElement('img', { src: avatar, alt: 'avatar', style: { width: '100%', height: '100%', objectFit: 'cover' } }) : avatar) : isUser ? 'U' : 'AI'
  );

  const bubblePill = createElement(
    'div',
    {
      style: {
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#1e293b' : '#ffffff',
        color: isUser ? '#f8fafc' : '#0f172a',
        fontSize: '13px',
        lineHeight: '1.45',
        boxShadow: isUser ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: isUser ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      },
    },
    createElement('div', null, text),
    timestamp
      ? createElement(
          'div',
          {
            style: {
              fontSize: '10px',
              color: isUser ? '#94a3b8' : '#64748b',
              marginTop: '4px',
              textAlign: isUser ? 'right' : 'left',
            },
          },
          timestamp
        )
      : null
  );

  return createElement(
    'div',
    {
      onClick,
      style: {
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      },
    },
    avatarNode,
    bubblePill
  );
}

/**
 * MoCurvedPortal — Asymmetric sweeping curved card container with glowing border.
 */
export function MoCurvedPortal({
  children,
  curveRadius = '48px 240px 48px 48px',
  borderColor = '#38bdf8',
  glowColor = 'rgba(56, 189, 248, 0.3)',
  className = '',
  style = {},
}) {
  return createElement(
    'div',
    {
      className: `mo-curved-portal ${className}`,
      style: {
        borderRadius: curveRadius,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 20px 60px -10px ${glowColor}, inset 0 0 30px rgba(255, 255, 255, 0.04)`,
        background: '#0a0d14',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      },
    },
    children
  );
}
