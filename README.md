# Dynamic ESL Immersion Platform (Method)

A modular, data-driven web application designed to assist English language tutors in delivering highly interactive, immersive classes. 

Built on the pedagogical principles of the **Method**, this platform prioritizes visual storytelling, contextual learning, and 100% target-language immersion through a "Present, Practice, Perform" cycle.

## 🚀 Key Features

* **Dynamic Slide Generation:** The UI is entirely generated on-the-fly from a JSON registry, ensuring strict separation of concerns between content and presentation.
* **Interactive "Comic Grid" Panels:** Visual scenarios are presented in a grid with "click-to-reveal" covers, allowing the teacher to guide the narrative step-by-step.
* **Auto-Generating Inputs:** Content creators simply type `{blank}` in their JSON text, and the JavaScript engine automatically converts it into styled, interactive HTML input fields for live typing during class.
* **Multiple Slide Archetypes:** Supports distinct, purpose-built layouts for:
    * Visual Storytelling (`comic_grid`)
    * Vocabulary Matching (`expression_bank`)
    * Grammar Exercises (`grammar_focus`)
    * Listening/Reading Comprehension (`listening` / `reading`)
    * Real-world Roleplay (`performance`)
* **Seamless Navigation:** Dropdown unit selector for instant class switching, plus keyboard (arrow keys) and button navigation.

## 🛠️ Tech Stack

* **HTML5 & Vanilla JavaScript:** Lightweight, lightning-fast DOM manipulation without the overhead of heavy frameworks like React or Vue.
* **Tailwind CSS (via CDN):** Rapid, utility-first styling for a clean, modern, and fully responsive UI using Flexbox and CSS Grid.
* **Python:** Used for data pipeline automation and registry management.

## 📁 Project Structure

```text
├── index.html                 # Main presentation view (Tailwind CDN, structural containers)
├── script.js                  # The presentation engine (Slide factory, navigation, DOM logic)
├── convert_to_registry.py     # Python script to compile raw JSON into the JS registry
├── raw_lessons.json           # The raw content database (Editable by human or AI)
├── BerlitzRegistry.js         # Auto-generated database consumed by the frontend
└── assets/
    └── img/                   # Image assets (named sequentially per unit, e.g., image1.png)

⚙️ How to Add New Lessons (Content Pipeline)
This project separates the role of the developer from the content creator. To add a new lesson, you do not need to touch the HTML or CSS.

Draft the Content: Create a new unit object in raw_lessons.json following the established schema. Use {blank} for any word you want the students to guess.

Add Assets: Drop the corresponding images into the assets/img/ folder, ensuring the file names match the paths in your JSON.

Compile the Registry: Run the Python script to update the database without deleting previous history: bash: python3 convert_to_registry.py

Teach: Open index.html in your browser. The new unit will automatically appear in the dropdown menu, fully styled and interactive!

💻 Installation & Usage
Clone this repository to your local machine.

Run the Python script to generate the initial BerlitzRegistry.js file:
python convert_to_registry.py

Open index.html in your preferred web browser.
(Note: If you encounter CORS errors due to loading local JS files, use a local server like VS Code's "Live Server" extension).
