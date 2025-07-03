import { useState } from 'react';
import { Star, Moon, Heart, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

// 👇 Add this block before or after imports
declare global {
  interface Window {
    claude: {
      complete: (prompt: string) => Promise<string>;
    };
  }
}

const DreamWeaver = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [manualCharacters, setManualCharacters] = useState('');
  const [manualShow, setManualShow] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const storyModes = [
    {
      id: 'adventure',
      name: 'Adventure',
      icon: <Star className="w-6 h-6" />,
      description: 'A gentle adventure with favorite characters',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'friendship',
      name: 'Friendship',
      icon: <Heart className="w-6 h-6" />,
      description: 'Heartwarming stories about friendship',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'imagination',
      name: 'Imagination',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Soothing tales that inspire dreams',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const popularCharacters = [
    { name: 'Super Mario Bros', characters: ['Mario', 'Luigi', 'Princess Peach', 'Bowser'] },
    { name: 'Pokemon', characters: ['Pikachu', 'Charizard', 'Squirtle', 'Bulbasaur'] },
    { name: 'Disney Classics', characters: ['Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Goofy'] },
    { name: 'Paw Patrol', characters: ['Chase', 'Marshall', 'Skye', 'Rubble'] },
    { name: 'Frozen', characters: ['Elsa', 'Anna', 'Olaf', 'Kristoff'] },
    { name: 'Spider-Man', characters: ['Spider-Man', 'Peter Parker', 'Miles Morales', 'Gwen Stacy'] }
  ];

  const handleQuickSelect = (franchise: { name: string; characters: string[] }) => {
    setManualShow(franchise.name);
    setManualCharacters(franchise.characters.join(', '));
  };

  const handleManualInput = () => {
    if (!manualCharacters.trim()) return;
    setCurrentStep('customize');
  };

  const generatePersonalizedStory = async () => {
    if (!childName || !selectedMode || !manualCharacters.trim()) return;
    
    
    setCurrentStep('generating');

    const characters = manualCharacters.split(',').map(char => char.trim()).filter(char => char);
    const charactersText = characters.join(', ');

    try {
      const prompt = `Create a gentle bedtime story for ${childName} featuring ${charactersText} in ${selectedMode} style. Make it soothing, calming, age-appropriate for toddlers, and about 3-4 paragraphs long. Focus on friendship, comfort, and peaceful resolution. End with characters going to sleep or finding peace.`;
      const story = await window.claude.complete(prompt);
      setGeneratedStory(story);
      setCurrentStep('story');
    } catch (error) {
      console.error('Story generation error:', error);
      const fallbackStory = `Once upon a time, ${childName} met ${charactersText} in a magical, peaceful place. Together, they had a wonderful ${selectedMode} that was full of kindness and friendship. They helped each other, shared gentle laughs, and learned that the best adventures happen when friends are together. As the stars began to twinkle in the soft evening sky, ${childName} and their friends found the perfect cozy spot to rest. They said goodnight to each other with warm hugs, and ${childName} drifted off to sleep with happy dreams of their gentle adventure.`;
      setGeneratedStory(fallbackStory);
      setCurrentStep('story');
    }
  };

  const resetApp = () => {
    setCurrentStep('welcome');
    setChildName('');
    setSelectedMode('');
    setGeneratedStory('');
    setManualCharacters('');
    setManualShow('');
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Moon className="w-12 h-12 text-yellow-200" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">DreamWeaver</h1>
            <p className="text-white/80 text-lg">Gentle bedtime stories for peaceful dreams</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center mb-6">
            <div className="mb-6">
              <div className="flex justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-200" />
                <Moon className="w-8 h-8 text-blue-200" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Peaceful Stories for Sweet Dreams
              </h2>
              <p className="text-white/80 leading-relaxed">
                Create calming bedtime stories with your child's favorite characters
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('character-input')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Heart className="w-6 h-6" />
                <span>Create Bedtime Story</span>
              </div>
              <p className="text-white/80 text-sm">Soothing tales for peaceful sleep</p>
            </button>

            <div className="mt-6 p-4 bg-white/10 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-yellow-200" />
                <span className="text-white font-medium">Designed for Bedtime</span>
              </div>
              <p className="text-white/70 text-sm">
                Gentle, calming stories perfect for helping little ones drift off to sleep
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {storyModes.map((mode) => (
              <div key={mode.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className={`bg-gradient-to-r ${mode.color} rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2`}>
                  {mode.icon}
                </div>
                <p className="text-white/80 text-sm font-medium">{mode.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'character-input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-8">
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Characters</h1>
            <p className="text-white/80">Who would you like in the bedtime story?</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Popular Characters</h3>
            <div className="space-y-3 mb-6">
              {popularCharacters.map((franchise, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(franchise)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    manualShow === franchise.name
                      ? 'bg-white/20 border-white/50'
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{franchise.name}</h4>
                      <p className="text-white/70 text-sm">
                        {franchise.characters.slice(0, 3).join(', ')}
                        {franchise.characters.length > 3 && '...'}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {franchise.name === 'Super Mario Bros' && '🍄'}
                      {franchise.name === 'Pokemon' && '⚡'}
                      {franchise.name === 'Disney Classics' && '🏰'}
                      {franchise.name === 'Paw Patrol' && '🐕'}
                      {franchise.name === 'Frozen' && '❄️'}
                      {franchise.name === 'Spider-Man' && '🕷️'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-white/20 pt-6">
              <h3 className="text-white font-semibold mb-4">Or Create Your Own</h3>
              
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">Show/Franchise</label>
                <input
                  type="text"
                  value={manualShow}
                  onChange={(e) => setManualShow(e.target.value)}
                  placeholder="e.g., My Little Pony, Minecraft, etc."
                  className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Characters</label>
                <input
                  type="text"
                  value={manualCharacters}
                  onChange={(e) => setManualCharacters(e.target.value)}
                  placeholder="e.g., Rainbow Dash, Twilight Sparkle, Fluttershy"
                  className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-white/60 text-sm mt-1">Separate multiple characters with commas</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleManualInput}
                disabled={!manualCharacters.trim()}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  manualCharacters.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                Continue with These Characters
              </button>
              
              <button
                onClick={resetApp}
                className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Back to Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'customize') {
    const characters = manualCharacters.split(',').map(char => char.trim()).filter(char => char);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-8">
            <h1 className="text-3xl font-bold text-white mb-2">Perfect!</h1>
            <p className="text-white/80">Now let's customize your bedtime story</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Your Characters:</h3>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char, index) => (
                    <span key={index} className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {manualShow && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Show/Franchise:</h3>
                  <span className="bg-purple-500/30 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {manualShow}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Child's Name</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter your child's name"
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">Story Mode</label>
              <div className="space-y-3">
                {storyModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedMode === mode.id
                        ? 'bg-white/20 border-white/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-r ${mode.color} rounded-full w-12 h-12 flex items-center justify-center`}>
                        {mode.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{mode.name}</h3>
                        <p className="text-white/70 text-sm">{mode.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generatePersonalizedStory}
              disabled={!childName || !selectedMode}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                childName && selectedMode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Moon className="w-5 h-5" />
                <span>Create Bedtime Story</span>
              </div>
            </button>
          </div>

          <button
            onClick={resetApp}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'generating') {
    const characters = manualCharacters.split(',').map(char => char.trim()).filter(char => char);
    const charactersText = characters.length > 0 ? characters.slice(0, 2).join(' and ') : 'favorite characters';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <div className="mb-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-blue-400 mx-auto mb-4"></div>
                <Moon className="w-8 h-8 text-yellow-200 absolute top-4 left-1/2 transform -translate-x-1/2" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Creating {childName}'s Bedtime Story...</h2>
              <p className="text-white/80">
                Weaving a gentle {selectedMode} tale with {charactersText}
              </p>
            </div>
            
            <div className="space-y-3 text-white/70">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Writing a soothing story...
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Adding peaceful moments...
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Personalizing for {childName}...
              </p>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-2xl">
              <p className="text-white/80 text-sm">
                Featuring: {characters.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'story') {
    const characters = manualCharacters.split(',').map(char => char.trim()).filter(char => char);
    const charactersText = characters.length > 0 ? characters.slice(0, 2).join(' & ') : 'favorite characters';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 pt-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <Moon className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{childName}'s Bedtime Story</h1>
            <p className="text-white/70 capitalize text-sm">
              A gentle {selectedMode} with {charactersText}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <div className="text-white/90 leading-relaxed space-y-4 text-base">
              {generatedStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-white/80 leading-7">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleSound}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white/30"
              >
                {soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-white/80" />
                ) : (
                  <VolumeX className="w-6 h-6 text-white/80" />
                )}
              </button>
              
              <button
                onClick={togglePlayback}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlaying
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
              
              <div className="text-white/80 text-center">
                <p className="font-medium text-sm">
                  {isPlaying ? 'Reading story...' : 'Tap to hear story'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {characters.map((char, index) => (
                  <span key={index} className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-xs">
                    ✨ {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={generatePersonalizedStory}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-5 h-5" />
              Create Another Story
            </button>
            
            <button
              onClick={resetApp}
              className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DreamWeaver;