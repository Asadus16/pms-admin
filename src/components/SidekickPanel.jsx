'use client';

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
import './styles/SidekickPanel.css';

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
            <img src="/logos/sidekick.svg" alt="Sidekick" />
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
            <span>What&apos;s new?</span>
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
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                  <button className={`send-btn ${message ? 'active' : ''}`} title="Send">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
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