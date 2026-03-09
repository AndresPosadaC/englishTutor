// Global State
let currentUnitId = null; 
let currentSlideIndex = 0;
let currentUnitData = null;
let slideStates = {}; // Memory object for teacher notes

// DOM Elements
const slideContainer = document.getElementById('slide-container');
const textArea = document.getElementById('text-area');
const unitSelector = document.getElementById('unit-selector');

// Helper: Convert "{blank}" to interactive HTML inputs
function parseBlanks(text) {
    if (!text) return '';
    const inputHtml = `<input type="text" class="bg-transparent border-b-2 border-gray-700 text-blue-800 font-bold w-32 mx-2 text-center focus:outline-none focus:border-blue-500">`;
    return text.split('{blank}').join(inputHtml);
}

// Factory: Generate HTML based on Slide Type
function buildSlideHTML(slide) {
    switch (slide.type) {
        
        case 'home_portal':
            return `
                <div class="w-full h-full flex flex-col justify-center items-center bg-slate-50 p-10">
                    <div class="mb-8 w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                        <img src="${slide.image}" class="w-full h-full object-cover" alt="Welcome">
                    </div>
                    <h1 class="text-6xl font-black text-slate-900 mb-4">${slide.title}</h1>
                    <p class="text-2xl text-slate-600 max-w-3xl text-center leading-relaxed mb-10">
                        ${slide.content}
                    </p>
                    <div class="flex items-center gap-3 text-blue-600 font-bold animate-pulse text-xl">
                        <span>Select a unit below to begin</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    </div>
                </div>
            `;

        case 'comic_grid':
            let panelsHtml = slide.panels.map((panel, index) => `
                <div class="bg-gray-200 border-4 border-gray-800 rounded-lg flex justify-center items-center overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md transition-shadow" 
                     onclick="this.querySelector('.reveal-cover').style.opacity='0'; this.querySelector('.reveal-cover').style.pointerEvents='none';">
                    
                    <img src="${panel.image}" alt="Comic Panel" class="absolute inset-0 w-full h-full object-cover">
                    
                    <div class="reveal-cover absolute inset-0 bg-slate-500 flex justify-center items-center transition-opacity duration-500 z-10">
                        <span class="text-white text-6xl font-bold opacity-50">${index + 1}</span>
                    </div>
                    
                </div>
            `).join('');
            
            return `
                <div class="w-full h-full flex flex-col p-6 bg-white">
                    <div class="grid grid-cols-2 grid-rows-2 gap-6 w-full h-full min-h-0 flex-grow">
                        ${panelsHtml}
                    </div>
                </div>
            `;

        case 'teacher_notes':
            return `
                <div class="w-full h-full p-8 bg-slate-50 flex flex-col items-center justify-center">
                    <div class="w-4/5 max-w-4xl h-full flex flex-col bg-white p-10 rounded-xl shadow-lg border-t-4 border-blue-600">
                        <h3 class="text-4xl font-bold text-blue-800 mb-4">${slide.title}</h3>
                        ${slide.content ? `<p class="text-gray-600 text-xl mb-6 italic border-l-4 border-gray-300 pl-4">${slide.content}</p>` : ''}
                        
                        <div class="flex-grow flex flex-col">
                            <label class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Teacher's Canvas</label>
                            <textarea class="flex-grow w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-400 resize-none text-gray-700 text-2xl shadow-inner leading-relaxed" placeholder="Write your notes here..."></textarea>
                        </div>
                    </div>
                </div>
            `;
                
        case 'expression_bank':
            let dialoguesHtml = slide.dialogues.map(d => `<li class="mb-4">${parseBlanks(d)}</li>`).join('');
            let bankHtml = slide.bank.map(word => `<li class="mb-3 font-bold text-gray-800 bg-gray-100 border-l-4 border-blue-600 p-2 rounded">${word}</li>`).join('');
            
            return `
                <div class="w-full h-full p-8 bg-blue-50 flex gap-8 items-start">
                    <div class="flex-2 flex flex-col w-2/3 h-full overflow-y-auto pr-4">
                        <h3 class="text-3xl font-bold text-gray-800 mb-6">${slide.title}</h3>
                        <ul class="text-xl leading-loose text-gray-800 list-none p-0">${dialoguesHtml}</ul>
                    </div>

                    <div class="flex-1 w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-200 relative overflow-hidden cursor-pointer group"
                         onclick="const cover = this.querySelector('.bank-cover'); if(cover) { cover.style.opacity='0'; setTimeout(() => cover.remove(), 500); }">
                        
                        <h3 class="text-xl font-bold text-center text-gray-800 mb-4">Expression Bank</h3>
                        <ul class="list-none p-0 m-0">${bankHtml}</ul>

                        <div class="bank-cover absolute inset-0 bg-slate-700 flex flex-col justify-center items-center transition-opacity duration-500 z-20 p-6 text-center">
                            <svg class="w-12 h-12 text-white opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <span class="text-white text-lg font-bold opacity-80 uppercase tracking-widest">Click to reveal vocabulary</span>
                        </div>
                    </div>
                </div>
            `;

        case 'grammar_focus':
            let grammarSentences = slide.sentences.map(s => `<li class="mb-5 text-xl leading-relaxed text-gray-800">${parseBlanks(s)}</li>`).join('');
            return `
                <div class="w-full h-full p-8 bg-white flex flex-col justify-center items-center">
                    <div class="w-4/5 max-w-4xl bg-blue-50 p-10 rounded-xl shadow-md border border-blue-100">
                        <h3 class="text-3xl font-bold text-gray-800 mb-2">${slide.title}</h3>
                        ${slide.instruction ? `<p class="text-gray-600 italic mb-6 text-lg">${slide.instruction}</p>` : ''}
                        <ul class="list-none p-0 m-0">${grammarSentences}</ul>
                    </div>
                </div>
            `;

        case 'listening':
        case 'reading': 
            let contentSentences = slide.sentences ? slide.sentences.map(s => `<li class="mb-6 text-xl leading-relaxed text-gray-800">${parseBlanks(s)}</li>`).join('') : '';
            let rawContent = slide.content ? `<p class="text-xl leading-loose text-gray-800">${parseBlanks(slide.content)}</p>` : '';
            
            let iconSvg = slide.type === 'listening' 
                ? `<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 18V6a2 2 0 00-3.414-1.414L4.172 9H2a2 2 0 00-2 2v2a2 2 0 002 2h2.172l4.414 4.414A2 2 0 0012 18z"></path></svg>`
                : `<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`;

            return `
                <div class="w-full h-full p-8 bg-gray-50 flex flex-col justify-center items-center">
                    <div class="w-4/5 max-w-4xl bg-white p-10 rounded-xl shadow-lg border-t-4 border-blue-600">
                        <div class="flex items-center gap-3 mb-6">
                            ${iconSvg}
                            <h3 class="text-3xl font-bold text-gray-800 capitalize">${slide.title}</h3>
                        </div>
                        <ul class="list-none p-0 m-0">${contentSentences}</ul>
                        ${rawContent}
                    </div>
                </div>
            `;

        case 'performance':
            let tasksHtml = slide.tasks ? slide.tasks.map((task, index) => `
                <li class="mb-5 flex items-start gap-4 text-lg leading-relaxed text-gray-700">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold shadow">${index + 1}</span>
                    <span class="pt-1">${parseBlanks(task)}</span>
                </li>
            `).join('') : '';

            return `
                <div class="w-full h-full p-8 bg-slate-50 flex gap-8 items-center">
                    <div class="flex-1 flex flex-col w-1/2 h-full overflow-y-auto pr-4 justify-center">
                        <h3 class="text-4xl font-bold text-blue-800 mb-4">${slide.title}</h3>
                        ${slide.content ? `<p class="text-gray-600 text-xl mb-8 italic border-l-4 border-gray-300 pl-4">${slide.content}</p>` : ''}
                        <ul class="list-none p-0 m-0">${tasksHtml}</ul>
                    </div>
                    <div class="flex-1 w-1/2 h-full flex justify-center items-center p-4">
                        <div class="w-full h-full bg-white p-3 rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                            <img src="${slide.image}" alt="Performance Scenario" class="absolute inset-0 w-full h-full object-cover rounded-xl">
                        </div>
                    </div>
                </div>
            `;
        
        case 'performance_with_notes':
            let notesTasksHtml = slide.tasks ? slide.tasks.map((task, index) => `
                <li class="mb-3 flex items-start gap-4 text-lg leading-relaxed text-gray-700">
                    <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold shadow text-sm">${index + 1}</span>
                    <span class="pt-1">${parseBlanks(task)}</span>
                </li>
            `).join('') : '';

            return `
                <div class="w-full h-full p-8 bg-slate-50 flex gap-8 items-stretch">
                    <div class="flex-1 flex flex-col w-1/2 h-full pr-4">
                        <h3 class="text-4xl font-bold text-blue-800 mb-4">${slide.title}</h3>
                        ${slide.content ? `<p class="text-gray-600 text-xl mb-4 italic border-l-4 border-gray-300 pl-4">${slide.content}</p>` : ''}
                        <ul class="list-none p-0 m-0 mb-6 overflow-y-auto max-h-48">${notesTasksHtml}</ul>
                        
                        <div class="flex-grow flex flex-col mt-auto">
                            <label class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Teacher Notes (150 words):</label>
                            <textarea class="w-full h-full min-h-[150px] p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white focus:outline-none focus:border-blue-400 resize-none text-gray-700 text-lg shadow-inner" placeholder="Use this canvas to write notes, vocabulary translations, or feedback..."></textarea>
                        </div>
                    </div>
                    
                    <div class="flex-1 w-1/2 h-full flex justify-center items-center p-4">
                        <div class="w-full h-full bg-white p-3 rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative flex justify-center items-center bg-gray-100">
                            <img src="${slide.image}" alt="${slide.image}" class="absolute inset-0 w-full h-full object-cover rounded-xl text-center p-5 text-gray-500 italic font-mono text-sm">
                        </div>
                    </div>
                </div>
            `;

        default:
            return `<div class="flex items-center justify-center h-full text-2xl text-red-500 font-bold">Slide type '${slide.type}' not yet implemented.</div>`;
    }
}

// Helper: Save the text from inputs and textareas before leaving a slide
function saveSlideState() {
    if (currentUnitId === null) return; 
    
    const inputs = slideContainer.querySelectorAll('input[type="text"], textarea');
    const state = [];
    
    inputs.forEach(input => {
        state.push(input.value);
    });
    
    slideStates[currentSlideIndex] = state;
}

// Helper: Restore the text when returning to a slide
function restoreSlideState() {
    if (!slideStates[currentSlideIndex]) return; 
    
    const inputs = slideContainer.querySelectorAll('input[type="text"], textarea');
    const state = slideStates[currentSlideIndex];
    
    inputs.forEach((input, index) => {
        if (state[index] !== undefined) {
            input.value = state[index];
        }
    });
}

// Main Render Function
function renderCurrentSlide() {
    if (!currentUnitData) return;
    
    const slide = currentUnitData.slides[currentSlideIndex];
    slideContainer.innerHTML = buildSlideHTML(slide);
    textArea.innerHTML = slide.question || slide.title || "Discuss";
    
    restoreSlideState(); 
}

// Navigation Logic
function nextSlide() {
    if (currentSlideIndex < currentUnitData.slides.length - 1) {
        saveSlideState(); 
        currentSlideIndex++;
        renderCurrentSlide();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        saveSlideState(); 
        currentSlideIndex--;
        renderCurrentSlide();
    }
}

// Load a specific unit
function loadUnit(unitId) {
    currentUnitId = unitId;
    currentUnitData = UnitsRegistry[currentUnitId]; 
    currentSlideIndex = 0; 
    slideStates = {}; // Erase memory when switching units
    renderCurrentSlide();
}

// Initialization
function initApp() {
    // FIX 2: Corrected to UnitsRegistry
    const unitKeys = Object.keys(UnitsRegistry);
    if (unitKeys.length === 0) return;

    // Populate the dropdown selector
    unitKeys.forEach(key => {
        const unit = UnitsRegistry[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = unit.metadata.subtitle || unit.metadata.title;
        unitSelector.appendChild(option);
    });

    // Handle dropdown changes
    unitSelector.addEventListener('change', (e) => loadUnit(e.target.value));

    // Load UNIT_00 by default, or the first available unit
    if (UnitsRegistry["UNIT_00"]) {
        loadUnit("UNIT_00");
    } else {
        loadUnit(unitKeys[0]);
    }
    
    // Event Listeners for slide navigation
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    
    document.addEventListener('keydown', (e) => {
        // FIX 3: Added 'textarea' to the ignore list so the teacher can use arrow keys while typing notes!
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'select') return;
        
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
}

// --- Discrete Class Timer Logic ---
function startClassTimer() {
    const timerElement = document.getElementById('class-timer');
    const classDurationSeconds = 60 * 60; // 60 minutes max
    let secondsPassed = 0;

    setInterval(() => {
        secondsPassed++;
        let percentage = (secondsPassed / classDurationSeconds) * 100;
        if (percentage > 100) percentage = 100; 
        timerElement.style.width = percentage + '%';
        
        if (percentage > 83) {
            timerElement.classList.replace('bg-blue-500', 'bg-orange-500');
        }
    }, 1000); 
}

// Start the app and the timer
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    startClassTimer();
});