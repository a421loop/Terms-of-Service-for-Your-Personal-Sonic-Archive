// All 10 terms with their text
// Each term has: number, text, audioFile, gifFile, circlePosition
const terms = [
    {
        number: 1,
        text: "A sonic archive is something you actively assemble, rather than something you passively accrue. Your sonic archive grows with you; you can add to it, prune from it, or reimagine it at any time.",
        audioFile: "audio/term-1.mp3", 
        gifFile: "gifs/term-1.gif",     
        circlePosition: "left",
        offset: "offset-1"
    },
    {
        number: 2,
        text: "Listening is both an act of making and un-making. Listening to your sonic archive will change it and will change you.",
        audioFile: "audio/term-2.mp3", 
        gifFile: "gifs/term-2.gif",      
        circlePosition: "right",
        offset: "offset-3"
    },
    {
        number: 3,
        text: "Sonic archives are created for personal association and serendipitous connections, and their interfaces should reflect that. By tending your sonic archive, you amplify the linkages between sounds, and between sounds and ideas.",
        audioFile: "audio/term-3.mp3", 
        gifFile: "gifs/term-3.gif",     
        circlePosition: "left",
        offset: "offset-2"
    },
    {
        number: 4,
        text: "By keeping your sonic materials at hand, you can patch together a new sonic experience whenever the need arises.",
        audioFile: "audio/term-4.mp3", 
        gifFile: "gifs/term-4.gif",     
        circlePosition: "right",
        offset: "offset-4"
    },
    {
        number: 5,
        text: "A sonic experience need not be a polished sound composition — it could be savoring a fleeting speck of sound, or enjoying a shared moment of reflective listening.",
        audioFile: "audio/term-5.mp3",  
        gifFile: "gifs/term-5.gif",      
        circlePosition: "top",
        offset: "offset-1"
    },
    {
        number: 6,
        text: "Sonic archives unfold at the pace of sound.",
        audioFile: "audio/term-6.mp3", 
        gifFile: "gifs/term-6.gif",     
        circlePosition: "left",
        offset: "offset-5"
    },
    {
        number: 7,
        text: "Your sonic archive is not simply nostalgia: It is an act of exercising your own power and agency.",
        audioFile: "audio/term-7.mp3",  
        gifFile: "gifs/term-7.gif",      
        circlePosition: "right",
        offset: "offset-2"
    },
    {
        number: 8,
        text: "Sound is always intertwined with other modalities. We encourage you to patch visuals into your sonic archive and tend to them by letting sound and visuals inform each other, rather than allow the visual to dominate.",
        audioFile: "audio/term-8.mp3", 
        gifFile: "gifs/term-8.gif",     
        circlePosition: "left",
        offset: "offset-3"
    },
    {
        number: 9,
        text: "Chronological order can be useful, as sound is temporal, but it should not be constraining.",
        audioFile: "audio/term-9.mp3", 
        gifFile: "gifs/term-9.gif",      /
        circlePosition: "bottom",
        offset: "offset-4"
    },
    {
        number: 10,
        text: "It is important to distinguish between \"me\" and \"my\" in your sonic archive: Your sonic archive reflects parts of you, but is not you.",
        audioFile: "audio/term-10.mp3",  
        gifFile: "gifs/term-10.gif",      
        circlePosition: "right",
        offset: "offset-1"
    }
];

// Track state
let currentTermIndex = 0;
let currentlyPlayingAudio = null;
let fadeInterval = null;

// DOM elements
const revealButton = document.getElementById('revealButton');
const termsContainer = document.getElementById('termsContainer');
const closingSection = document.getElementById('closingSection');

// Create a term element
function createTermElement(term) {
    const termDiv = document.createElement('div');
    termDiv.className = `term circle-${term.circlePosition} ${term.offset}`;
    
    // Create the sound circle
    const circleDiv = document.createElement('div');
    circleDiv.className = 'sound-circle';
    circleDiv.setAttribute('data-term', term.number);
    
    // Create the gif image
    const img = document.createElement('img');
    img.src = term.gifFile;
    img.alt = `Visual for term ${term.number}`;
    // Fallback for missing images
    img.onerror = function() {
        this.style.display = 'none';
        circleDiv.style.backgroundColor = '#4d4436';
    };
    circleDiv.appendChild(img);
    
    // Create the audio element
    const audio = document.createElement('audio');
    audio.src = term.audioFile;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    termDiv.appendChild(audio);
    
    // Create the text
    const textDiv = document.createElement('div');
    textDiv.className = 'term-text';
    textDiv.innerHTML = `<span class="term-number">${term.number}.</span> ${term.text}`;
    
    // Add hover events for sound
    circleDiv.addEventListener('mouseenter', () => handleCircleHover(audio, circleDiv));
    circleDiv.addEventListener('mouseleave', () => handleCircleLeave(audio));
    
    // Assemble
    termDiv.appendChild(circleDiv);
    termDiv.appendChild(textDiv);
    
    return termDiv;
}

// Handle circle hover - start audio with fade in
function handleCircleHover(audio, circleDiv) {
    // Stop any currently playing audio first
    if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
        fadeOutAudio(currentlyPlayingAudio);
    }
    
    // Clear any existing fade interval
    if (fadeInterval) {
        clearInterval(fadeInterval);
    }
    
    currentlyPlayingAudio = audio;
    audio.volume = 0;
    
    // Try to play (may fail if audio file doesn't exist yet)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Fade in
            fadeInAudio(audio);
        }).catch(error => {
            console.log('Audio not yet available:', error);
        });
    }
}

// Handle circle leave - fade out audio
function handleCircleLeave(audio) {
    if (audio) {
        fadeOutAudio(audio);
    }
}

// Fade in audio over 400ms
function fadeInAudio(audio) {
    const targetVolume = 0.7;
    const duration = 400;
    const steps = 20;
    const volumeStep = targetVolume / steps;
    const intervalTime = duration / steps;
    
    let currentStep = 0;
    
    if (fadeInterval) {
        clearInterval(fadeInterval);
    }
    
    fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(volumeStep * currentStep, targetVolume);
        
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
    }, intervalTime);
}

// Fade out audio over 400ms
function fadeOutAudio(audio) {
    const duration = 400;
    const steps = 20;
    const volumeStep = audio.volume / steps;
    const intervalTime = duration / steps;
    
    let currentStep = 0;
    const startVolume = audio.volume;
    
    if (fadeInterval) {
        clearInterval(fadeInterval);
    }
    
    fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
        
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            fadeInterval = null;
            audio.pause();
            audio.currentTime = 0;
            if (currentlyPlayingAudio === audio) {
                currentlyPlayingAudio = null;
            }
        }
    }, intervalTime);
}

// Reveal next term
function revealNextTerm() {
    if (currentTermIndex < terms.length) {
        const term = terms[currentTermIndex];
        const termElement = createTermElement(term);
        termsContainer.appendChild(termElement);
        
        // Scroll to the new term smoothly
        setTimeout(() => {
            termElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        currentTermIndex++;
        
        // Update button text
        if (currentTermIndex < terms.length) {
            revealButton.querySelector('.button-text').textContent = `reveal term ${currentTermIndex + 1}`;
        } else {
            // All terms revealed
            revealButton.disabled = true;
            revealButton.querySelector('.button-text').textContent = 'all terms revealed';
            
            // Show closing section
            setTimeout(() => {
                closingSection.classList.add('visible');
            }, 600);
        }
    }
}

// Initialize
revealButton.addEventListener('click', revealNextTerm);
