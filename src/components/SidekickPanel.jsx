import { useState, useCallback } from 'react';
import {
  Text,
  Button,
  Icon,
  Popover,
  ActionList,
} from '@shopify/polaris';
import {
  XIcon,
  MaximizeIcon,
  ExternalIcon,
  PersonIcon,
  SettingsIcon,
  LinkIcon,
  ChartLineIcon,
} from '@shopify/polaris-icons';

function SidekickPanel({ isOpen, onClose, userName = 'Shafeen', onExpandedChange }) {
  const [message, setMessage] = useState('');
  const [conversationDropdownActive, setConversationDropdownActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  const handleExpandToggle = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (onExpandedChange) {
      onExpandedChange(newExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  const toggleConversationDropdown = useCallback(
    () => setConversationDropdownActive((active) => !active),
    []
  );

  const handleMessageChange = useCallback((e) => setMessage(e.target.value), []);

  const toggleRecording = useCallback(() => {
    setIsRecording((recording) => !recording);
  }, []);

  const suggestedPrompts = [
    'Understand low conversion rate despite high sessions',
    'Optimize Clear Complexion Ayurvedic Body Lotion',
    'Set up regional marketing campaign for Karnataka',
    'Create countdown badge for Lip Stain',
  ];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .sidekick-panel {
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .sidekick-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #e1e3e5;
          background: #ffffff;
        }
        
        .sidekick-header-left {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .sidekick-header-right {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .sidekick-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
          overflow-y: auto;
        }
        
        .sidekick-mascot {
          width: 48px;
          height: 48px;
          margin-bottom: 8px;
        }
        
        .sidekick-mascot img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .sidekick-greeting {
          text-align: center;
          margin-bottom: 12px;
        }
        
        .whats-new-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #f6f6f7;
          border: 1px solid #e1e3e5;
          border-radius: 12px;
          cursor: pointer;
          font-size: 11px;
          color: #6d7175;
          transition: background 0.2s ease;
        }
        
        .whats-new-button:hover {
          background: #edeeef;
        }
        
        .whats-new-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8b5cf6;
        }
        
        .sidekick-prompts {
          width: 100%;
          padding: 4px 8px;
          border-top: 1px solid #e1e3e5;
        }
        
        .prompt-chip {
          display: inline-block;
          padding: 6px 10px;
          background: #f6f6f7;
          border: 1px solid #e1e3e5;
          border-radius: 6px;
          margin: 2px;
          cursor: pointer;
          font-size: 12px;
          color: #202223;
          transition: all 0.2s ease;
        }
        
        .prompt-chip:hover {
          background: #edeeef;
          border-color: #d1d5db;
        }
        
        .sidekick-input-area {
          padding: 8px;
          background: #ffffff;
        }
        
        .input-container-wrapper {
          position: relative;
          border-radius: 10px;
          padding: 1px;
          background: #e1e3e5;
          transition: all 0.3s ease;
        }
        
        .input-container-wrapper.focused {
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b, #22c55e, #3b82f6, #8b5cf6);
          background-size: 300% 100%;
          animation: gradient-rotate 3s linear infinite;
          box-shadow: 
            0 0 8px rgba(139, 92, 246, 0.4),
            0 0 16px rgba(236, 72, 153, 0.3),
            0 0 24px rgba(59, 130, 246, 0.2);
        }
        
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        
        .input-container {
          background: #ffffff;
          border-radius: 9px;
          padding: 8px 10px;
        }
        
        .input-field {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #202223;
          outline: none;
          resize: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          height: 20px;
          line-height: 20px;
        }
        
        .input-field::placeholder {
          color: #8c9196;
        }
        
        .input-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }
        
        .input-actions-left {
          display: flex;
          align-items: center;
          gap: 0;
        }
        
        .input-actions-right {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .action-icon-btn {
          padding: 4px;
          border-radius: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d7175;
          transition: background 0.2s ease;
        }
        
        .action-icon-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .voice-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d7175;
          transition: all 0.2s ease;
        }
        
        .voice-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .voice-btn.recording {
          background: #fee2e2;
          color: #ef4444;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .send-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #e1e3e5;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .send-btn.active {
          background: #22c55e;
          color: white;
        }
        
        .header-icon-btn {
          padding: 6px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d7175;
          transition: background 0.2s ease;
        }
        
        .header-icon-btn:hover {
          background: #f6f6f7;
        }
        
        .recording-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #fef2f2;
          border-radius: 6px;
          margin-bottom: 6px;
        }
        
        .recording-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulse 1s infinite;
        }
        
        .recording-text {
          font-size: 12px;
          color: #ef4444;
        }
        
        .recording-time {
          font-size: 12px;
          color: #6d7175;
          margin-left: auto;
        }
      `}</style>
      
      <div className="sidekick-panel">
        {/* Header */}
        <div className="sidekick-header">
          <div className="sidekick-header-left">
            <Popover
              active={conversationDropdownActive}
              activator={
                <Button
                  variant="tertiary"
                  onClick={toggleConversationDropdown}
                  disclosure={conversationDropdownActive ? 'up' : 'down'}
                >
                  <Text variant="bodyMd" fontWeight="semibold">
                    New conversation
                  </Text>
                </Button>
              }
              onClose={toggleConversationDropdown}
              preferredAlignment="left"
            >
              <ActionList
                items={[
                  { content: 'New conversation', onAction: () => setConversationDropdownActive(false) },
                  { content: 'View history', onAction: () => setConversationDropdownActive(false) },
                ]}
              />
            </Popover>
          </div>
          
          <div className="sidekick-header-right">
            <button className="header-icon-btn" title="Open in new window">
              <Icon source={ExternalIcon} tone="subdued" />
            </button>
            <button 
              className="header-icon-btn" 
              title={isExpanded ? 'Minimize' : 'Maximize'}
              onClick={handleExpandToggle}
            >
              <Icon source={MaximizeIcon} tone="subdued" />
            </button>
            <button className="header-icon-btn" title="Close" onClick={onClose}>
              <Icon source={XIcon} tone="subdued" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="sidekick-content">
          {/* Mascot - Reference to asset */}
          <div className="sidekick-mascot">
            <img src="/src/assets/sidekick.svg" alt="Sidekick" />
          </div>
          
          {/* Greeting */}
          <div className="sidekick-greeting">
            <Text variant="bodyMd" as="p" tone="subdued">
              Hey {userName}
            </Text>
            <Text variant="headingMd" as="h2" fontWeight="bold">
              How can I help?
            </Text>
          </div>
          
          {/* What's new button */}
          <button className="whats-new-button">
            <span className="whats-new-dot"></span>
            <span>What's new?</span>
          </button>
        </div>
        
        {/* Suggested Prompts */}
        <div className="sidekick-prompts">
          {suggestedPrompts.map((prompt, index) => (
            <span 
              key={index} 
              className="prompt-chip"
              onClick={() => setMessage(prompt)}
            >
              {prompt}
            </span>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="sidekick-input-area">
          {/* Recording indicator */}
          {isRecording && (
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              <span className="recording-text">Recording...</span>
              <span className="recording-time">0:00</span>
            </div>
          )}
          
          <div className={`input-container-wrapper ${inputFocused ? 'focused' : ''}`}>
            <div className="input-container">
              <input
                type="text"
                className="input-field"
                value={message}
                onChange={handleMessageChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask anything..."
                autoComplete="off"
              />
              <div className="input-actions">
                <div className="input-actions-left">
                  <button className="action-icon-btn" title="Mention">
                    <Icon source={PersonIcon} />
                  </button>
                  <button className="action-icon-btn" title="Quick actions">
                    <Icon source={SettingsIcon} />
                  </button>
                  <button className="action-icon-btn" title="Add link">
                    <Icon source={LinkIcon} />
                  </button>
                </div>
                <div className="input-actions-right">
                  <button className="action-icon-btn" title="Analytics">
                    <Icon source={ChartLineIcon} />
                  </button>
                  {/* Voice recording button */}
                  <button 
                    className={`voice-btn ${isRecording ? 'recording' : ''}`} 
                    title={isRecording ? 'Stop recording' : 'Start voice recording'}
                    onClick={toggleRecording}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </button>
                  <button className={`send-btn ${message ? 'active' : ''}`} title="Send">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SidekickPanel;