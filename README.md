# CredenSync

*Syncing credibility with AI.*

CredenSync is a modern, AI-powered web application designed to combat the spread of misinformation. It provides users with a suite of powerful tools to analyze various forms of content—text, images, URLs, and audio—to detect potential falsehoods, manipulations, and deepfakes.

## ✨ Features

-   **Text Analysis**: Paste any text content to check for misinformation. The tool provides a classification (True, Fake, Misleading), detailed reasoning, and links to supporting evidence.
-   **Image Analysis**: Upload an image to determine if it's real, AI-generated, or manipulated.
-   **URL Analysis**: Enter a URL to a news article, and the app will analyze its content for credibility.
-   **Audio Analysis**: Record audio news segments directly in the browser. The app transcribes the audio and analyzes the text for potential misinformation.
-   **Deepfake Detector**: A specialized tool that performs a forensic analysis on images to detect signs of AI generation or digital tampering, complete with a confidence score and highlighted regions of manipulation.
-   **Fact-Checked News Feed**: A curated feed of recent (last 48 hours), verified news articles from India, with search and refresh capabilities.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN/UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (with Google AI)
-   **State Management**: React Hooks & Context API
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v20 or later)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key.
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Application

1.  **Start the Genkit developer UI (optional but recommended):**
    In a separate terminal, run:
    ```sh
    npm run genkit:watch
    ```
    This will start the Genkit developer UI, where you can inspect your AI flows, view traces, and debug your prompts.

2.  **Start the Next.js development server:**
    ```sh
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

