export class VoiceManager {
  static voices: SpeechSynthesisVoice[] = [];
  
  static init() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  static speak(text: string, agentName: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a premium/natural sounding voice based on agent
    let preferredVoice = this.voices.find(v => v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google UK English Female'));
    
    // Assign different pitch/rate for different agents
    if (agentName === 'Main Agent') {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    } else if (agentName === 'Alpha') {
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
    } else if (agentName === 'Beta') {
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
    } else if (agentName === 'Gamma') {
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
    }

    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  }
}
