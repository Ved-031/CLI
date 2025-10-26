#!/usr/bin/env node

import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execa } from 'execa';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import stripJsonComments from 'strip-json-comments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banner
console.log(chalk.cyan.bold('\n🚀 Create My App\n'));
console.log(chalk.gray('A powerful CLI to scaffold modern web applications\n'));

const PROJECT_TYPES = [
    { name: '🎨 Frontend', value: 'frontend' },
    { name: '⚙️ Backend', value: 'backend' },
    { name: '🔥 Full Stack', value: 'fullstack' },
];

const FRONTEND_FRAMEWORKS = [
    { name: 'React (Vite) + React Router', value: 'react-router' },
    { name: 'Next.js (App Router)', value: 'nextjs-frontend' },
];

const BACKEND_FRAMEWORKS = [
    { name: 'Express', value: 'express' },
    { name: 'Next.js (API Routes)', value: 'nextjs-backend' },
];

const FULLSTACK_FRAMEWORKS = [
    { name: 'React (Vite) + Express', value: 'react-express' },
    { name: 'Next.js (Full Stack)', value: 'nextjs-fullstack' },
];

const DATABASE_OPTIONS = [
    { name: 'PostgreSQL', value: 'postgresql' },
    { name: 'MySQL', value: 'mysql' },
    { name: 'SQLite', value: 'sqlite' },
    { name: 'MongoDB', value: 'mongodb' },
];

const initialJsxContent = `const App = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                color: 'black',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    maxWidth: '80rem',
                    width: '100%',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    height: '100vh',
                    margin: '0 auto',
                    padding: '0 1rem',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '3rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                        }}
                    >
                        Welcome to Create My App
                    </h1>
                    <p
                        style={{
                            fontSize: '1.25rem',
                            color: '#374151',
                        }}
                    >
                        Start building your amazing application!
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#374151',
                    }}
                >
                    <p
                        style={{
                            fontSize: '1.125rem',
                            marginTop: '1.25rem',
                        }}
                    >
                        Created by{' '}
                        <a
                            href="https://vedtellawar.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: 'underline',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            Ved Tellawar
                        </a>
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '5px',
                        }}
                    >
                        {/* GitHub Icon */}
                        <a href="https://github.com/Ved-031" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* LinkedIn Icon */}
                        <a href="https://linkedin.com/in/ved-tellawar" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                                <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
`;

const initialJsxTailwindContent = `const App = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="max-w-5xl mx-auto w-full bg-gray-50 flex items-center justify-center text-center flex-col gap-y-5 h-screen">
                <div>
                    <h1 className="text-5xl font-bold mb-4">
                        Welcome to Create My App
                    </h1>
                    <p className="text-xl text-gray-700">
                        Start building your amazing application!
                    </p>
                </div>

                <div className="flex items-center justify-center flex-col gap-y-2 text-gray-700">
                    <p className="text-lg mt-5">
                        Created by {" "}
                        <a href="https://vedtellawar.netlify.app" target="_blank" className="underline font-medium cursor-pointer">
                            Ved Tellawar
                        </a>
                    </p>

                    <div className="flex items-center gap-x-4">
                        <a href="https://github.com/Ved-031" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        <a href="https://linkedin.com/in/ved-tellawar" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
`;

const reactRouterAppContent = `import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
`;

const homePageContent = `
const HomePage = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                color: 'black',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    maxWidth: '80rem',
                    width: '100%',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    height: '100vh',
                    margin: '0 auto',
                    padding: '0 1rem',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '3rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                        }}
                    >
                        Welcome to Create My App
                    </h1>
                    <p
                        style={{
                            fontSize: '1.25rem',
                            color: '#374151',
                        }}
                    >
                        Start building your amazing application!
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#374151',
                    }}
                >
                    <p
                        style={{
                            fontSize: '1.125rem',
                            marginTop: '1.25rem',
                        }}
                    >
                        Created by{' '}
                        <a
                            href="https://vedtellawar.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: 'underline',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            Ved Tellawar
                        </a>
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '5px',
                        }}
                    >
                        {/* GitHub Icon */}
                        <a href="https://github.com/Ved-031" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* LinkedIn Icon */}
                        <a href="https://linkedin.com/in/ved-tellawar" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                                <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
`;

const homePageContentTailwind = `
const HomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="max-w-5xl mx-auto w-full bg-gray-50 flex items-center justify-center text-center flex-col gap-y-5 h-screen">
                <div>
                    <h1 className="text-5xl font-bold mb-4">
                        Welcome to Create My App
                    </h1>
                    <p className="text-xl text-gray-700">
                        Start building your amazing application!
                    </p>
                </div>

                <div className="flex items-center justify-center flex-col gap-y-2 text-gray-700">
                    <p className="text-lg mt-5">
                        Created by {" "}
                        <a href="https://vedtellawar.netlify.app" target="_blank" className="underline font-medium cursor-pointer">
                            Ved Tellawar
                        </a>
                    </p>

                    <div className="flex items-center gap-x-4">
                        <a href="https://github.com/Ved-031" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        <a href="https://linkedin.com/in/ved-tellawar" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HomePage;
`;

async function main() {
    try {
        // Project name
        const { projectName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                default: 'my-app',
                validate: input => {
                    if (!input || input.trim() === '') {
                        return 'Project name cannot be empty';
                    }
                    if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                    return 'Project name may only include letters, numbers, underscores and hyphens.';
                },
            },
        ]);

        // Project type
        const { projectType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'projectType',
                message: 'What type of project do you want to create?',
                choices: PROJECT_TYPES,
            },
        ]);

        // Framework selection based on project type
        let framework;
        if (projectType === 'frontend') {
            ({ framework } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'framework',
                    message: 'Select a frontend framework:',
                    choices: FRONTEND_FRAMEWORKS,
                },
            ]));
        } else if (projectType === 'backend') {
            ({ framework } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'framework',
                    message: 'Select a backend framework:',
                    choices: BACKEND_FRAMEWORKS,
                },
            ]));
        } else {
            ({ framework } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'framework',
                    message: 'Select a full stack framework:',
                    choices: FULLSTACK_FRAMEWORKS,
                },
            ]));
        }

        // Language
        const { language } = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'Select a language:',
                choices: [
                    { name: 'TypeScript', value: 'typescript' },
                    { name: 'JavaScript', value: 'javascript' },
                ],
            },
        ]);

        // Package manager
        const { packageManager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'packageManager',
                message: 'Select a package manager:',
                choices: [
                    { name: 'npm', value: 'npm' },
                    { name: 'yarn', value: 'yarn' },
                    { name: 'pnpm', value: 'pnpm' },
                ],
                default: 'npm',
            },
        ]);

        // Styling (for frontend/fullstack)
        let tailwind = false;
        let shadcn = false;

        if (projectType !== 'backend') {
            const shouldAskTailwind = framework === 'nextjs-fullstack' ? false : true;

            if (shouldAskTailwind) {
                ({ tailwind } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'tailwind',
                        message: 'Add Tailwind CSS?',
                        default: true,
                    },
                ]));
            } else {
                tailwind = true; // Next.js full stack gets Tailwind by default
            }

            if (tailwind) {
                ({ shadcn } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'shadcn',
                        message: 'Add shadcn/ui?',
                        default: true,
                    },
                ]));
            }
        }

        // Database setup (for backend/fullstack)
        let prisma = false;
        let database = null;

        if (projectType !== 'frontend') {
            ({ prisma } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'prisma',
                    message: 'Set up database with Prisma ORM?',
                    default: true,
                },
            ]));

            if (prisma) {
                ({ database } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'database',
                        message: 'Select a database:',
                        choices: DATABASE_OPTIONS,
                        default: 'postgresql',
                    },
                ]));
            }
        }

        // Additional features
        const { features } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'features',
                message: 'Select additional features:',
                choices: [
                    { name: 'ESLint + Prettier', value: 'linting', checked: true },
                    { name: 'Git initialization', value: 'git', checked: true },
                    { name: 'Environment variables (.env)', value: 'env', checked: true },
                    projectType !== 'backend' && { name: 'React Query', value: 'react-query' },
                    projectType !== 'backend' && {
                        name: 'Zustand (State Management)',
                        value: 'zustand',
                    },
                    projectType !== 'frontend' && {
                        name: 'JWT Authentication Setup',
                        value: 'auth',
                    },
                ].filter(Boolean),
            },
        ]);

        // Configuration summary
        console.log(chalk.cyan('\n📦 Configuration Summary:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.white(`  Project:         ${chalk.cyan(projectName)}`));
        console.log(chalk.white(`  Type:            ${chalk.cyan(projectType)}`));

        const frameworkName =
            [...FRONTEND_FRAMEWORKS, ...BACKEND_FRAMEWORKS, ...FULLSTACK_FRAMEWORKS].find(
                f => f.value === framework,
            )?.name || framework;
        console.log(chalk.white(`  Framework:       ${chalk.cyan(frameworkName)}`));
        console.log(
            chalk.white(
                `  Language:        ${chalk.cyan(language === 'typescript' ? 'TypeScript' : 'JavaScript')}`,
            ),
        );
        console.log(chalk.white(`  Package Manager: ${chalk.cyan(packageManager)}`));

        if (projectType !== 'backend') {
            console.log(
                chalk.white(
                    `  Tailwind CSS:    ${tailwind ? chalk.green('✓ Yes') : chalk.red('✗ No')}`,
                ),
            );
            if (tailwind) {
                console.log(
                    chalk.white(
                        `  shadcn/ui:       ${shadcn ? chalk.green('✓ Yes') : chalk.red('✗ No')}`,
                    ),
                );
            }
        }

        if (projectType !== 'frontend') {
            console.log(
                chalk.white(
                    `  Database:        ${prisma ? chalk.green(`✓ Prisma (${database})`) : chalk.red('✗ No')}`,
                ),
            );
        }

        if (features.length > 0) {
            console.log(chalk.white(`  Features:        ${chalk.cyan(features.join(', '))}`));
        }

        console.log(chalk.gray('─'.repeat(50) + '\n'));

        // Create project
        await createProject({
            projectName,
            projectType,
            framework,
            language,
            packageManager,
            tailwind,
            shadcn,
            prisma,
            database,
            features,
        });

        console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
        console.log(chalk.cyan('📚 Next steps:\n'));
        console.log(chalk.white(`  ${chalk.cyan('1.')} cd ${projectName}`));

        if (features.includes('git')) {
            console.log(
                chalk.white(`  ${chalk.cyan('2.')} git add . && git commit -m "Initial commit"`),
            );
        }

        if (framework === 'react-express') {
            console.log(
                chalk.white(
                    `  ${chalk.cyan('3.')} Start frontend: cd frontend && ${packageManager} run dev`,
                ),
            );
            console.log(
                chalk.white(
                    `  ${chalk.cyan('4.')} Start backend:  cd backend && ${packageManager} run dev`,
                ),
            );
        } else {
            console.log(chalk.white(`  ${chalk.cyan('3.')} ${packageManager} run dev`));
        }

        if (prisma) {
            console.log(
                chalk.white(
                    `\n  ${chalk.yellow('⚠️')}  Don't forget to update your .env file with database credentials`,
                ),
            );
            console.log(
                chalk.white(
                    `  ${chalk.yellow('⚠️')}  Run: ${packageManager === 'npm' ? 'npx' : packageManager} prisma generate and ${packageManager === 'npm' ? 'npx' : packageManager} prisma db push`,
                ),
            );
        }

        console.log(chalk.gray('\n' + '─'.repeat(50) + '\n'));
        console.log(chalk.cyan('💡 Happy coding!\n'));
    } catch (error) {
        if (error.isTtyError) {
            console.log(chalk.red("\n❌ Prompt couldn't be rendered in the current environment"));
        } else if (error.name === 'ExitPromptError') {
            console.log(chalk.yellow('\n👋 Setup cancelled'));
            process.exit(0);
        } else {
            console.log(chalk.red('\n❌ An error occurred:'), error.message);
            console.log(chalk.gray('\nFor help, please report this issue on GitHub\n'));
            process.exit(1);
        }
    }
}

async function createProject(config) {
    const {
        projectName,
        projectType,
        framework,
        language,
        packageManager,
        tailwind,
        shadcn,
        prisma,
        database,
        features,
    } = config;

    const projectPath = path.join(process.cwd(), projectName);

    if (await fs.pathExists(projectPath)) {
        console.log(chalk.red(`\n❌ Directory "${projectName}" already exists!`));
        process.exit(1);
    }

    const mainSpinner = ora({
        text: 'Creating project structure...',
        color: 'cyan',
    }).start();

    try {
        await fs.ensureDir(projectPath);

        // Initialize framework
        mainSpinner.text = `Initializing ${chalk.cyan(framework)} project...`;
        await initializeFramework(
            projectPath,
            framework,
            language,
            packageManager,
            tailwind,
            mainSpinner,
        );

        // Create folder structure
        mainSpinner.text = 'Creating folder structure...';
        await createFolderStructure(projectPath, projectType, framework, prisma);
        mainSpinner.succeed('Folder structure created');

        // Add Tailwind CSS
        if (tailwind && !framework.includes('nextjs')) {
            const tailwindSpinner = ora('Setting up Tailwind CSS...').start();
            try {
                await addTailwind(projectPath, framework, packageManager);
                tailwindSpinner.succeed('Tailwind CSS configured');
            } catch (error) {
                tailwindSpinner.fail('Failed to setup Tailwind CSS');
                throw error;
            }
        }

        // Add shadcn
        if (shadcn) {
            try {
                await addShadcn(projectPath, framework, language, packageManager);
            } catch (error) {
                console.log(chalk.yellow('\n⚠️  Warning: Failed to setup shadcn-ui'));
                console.log(chalk.gray('You can add it manually later\n'));
            }
        }

        // Add Prisma
        if (prisma) {
            const prismaSpinner = ora('Setting up Prisma...').start();
            try {
                const pathForPrisma =
                    framework === 'react-express' ? path.join(projectPath, 'backend') : projectPath;
                await addPrisma(pathForPrisma, language, database, packageManager);
                prismaSpinner.succeed('Prisma configured');
            } catch (error) {
                prismaSpinner.fail('Failed to setup Prisma');
                throw error;
            }
        }

        // Add additional features
        if (features.length > 0) {
            await addFeatures(projectPath, framework, features, language, packageManager);
        }

        console.log(chalk.green('\n✓ All components installed successfully!\n'));
    } catch (error) {
        mainSpinner.fail(chalk.red('Failed to create project'));
        console.error(chalk.red('\nError details:'), error.message);

        try {
            await fs.remove(projectPath);
            console.log(chalk.yellow('\n🧹 Cleaned up incomplete project files'));
        } catch (cleanupError) {
            console.log(chalk.yellow('\n⚠️  Please manually remove the project directory'));
        }

        process.exit(1);
    }
}

async function initializeFramework(
    projectPath,
    framework,
    language,
    packageManager,
    tailwind,
    spinner,
) {
    const isTypeScript = language === 'typescript';

    try {
        switch (framework) {
            case 'react-router':
                await createReactRouterApp(projectPath, isTypeScript, tailwind, packageManager);
                spinner.succeed('React Router project initialized');
                break;

            case 'nextjs-frontend':
            case 'nextjs-backend':
            case 'nextjs-fullstack':
                await createNextApp(projectPath, spinner, packageManager);
                break;

            case 'express':
                await createExpressServer(projectPath, isTypeScript, packageManager);
                spinner.succeed('Express server initialized');
                break;

            case 'react-express':
                const client = path.join(projectPath, 'frontend');
                const server = path.join(projectPath, 'backend');
                await fs.ensureDir(client);
                await fs.ensureDir(server);

                spinner.text = 'Setting up React frontend...';
                await createReactRouterApp(client, isTypeScript, tailwind, packageManager);

                spinner.text = 'Setting up Express backend...';
                await createExpressServer(server, isTypeScript, packageManager);

                spinner.succeed('React + Express project initialized');
                break;
        }
    } catch (error) {
        spinner.fail(`Failed to initialize ${framework}`);
        throw new Error(`Framework initialization failed: ${error.message}`);
    }
}

async function createReactRouterApp(projectPath, isTypeScript, tailwind, packageManager) {
    const pm = packageManager === 'npm' ? 'npm' : packageManager;
    const createCmd =
        packageManager === 'npm' ? 'create' : packageManager === 'yarn' ? 'create' : 'create';

    await execa(
        pm,
        [createCmd, 'vite@latest', '.', '--', '--template', isTypeScript ? 'react-ts' : 'react'],
        { cwd: projectPath },
    );

    // Install React Router
    await execa(pm, ['install', 'react-router-dom'], { cwd: projectPath });

    const ext = isTypeScript ? 'tsx' : 'jsx';
    const pagesDir = path.join(projectPath, 'src', 'pages');
    const appFile = path.join(projectPath, 'src', `App.${ext}`);
    const appCssFile = path.join(projectPath, 'src', 'App.css');

    if (await fs.pathExists(appCssFile)) {
        await fs.remove(appCssFile);
    }

    await fs.ensureDir(pagesDir);
    const homePageFile = path.join(projectPath, 'src', 'pages', `HomePage.${ext}`);
    await fs.ensureFile(homePageFile);

    const appContent = reactRouterAppContent;
    const homePage = tailwind ? homePageContentTailwind : homePageContent;
    await fs.writeFile(appFile, appContent);
    await fs.writeFile(homePageFile, homePage);
}

async function createNextApp(projectPath, spinner, packageManager) {
    spinner.stop();

    console.log(chalk.cyan('\n📦 Setting up Next.js (this may take a moment)...\n'));

    const pm = packageManager === 'npm' ? 'npx' : packageManager === 'yarn' ? 'yarn' : 'pnpm';

    try {
        await execa(pm, ['create-next-app@latest', '.'], {
            cwd: projectPath,
            stdio: 'inherit',
            env: { NEXT_TELEMETRY_DISABLED: '1' },
        });

        spinner.start('Configuring Next.js project...');

        const choices = await detectNextAppChoices(projectPath);
        const ext = choices.isTypeScript ? 'tsx' : 'jsx';
        let pageFile;

        if (choices.useAppRouterAndSrcDir) {
            pageFile = path.join(projectPath, 'src', 'app', `page.${ext}`);
        } else if (choices.usesAppRouter) {
            pageFile = path.join(projectPath, 'app', `page.${ext}`);
        } else {
            pageFile = path.join(projectPath, 'src', 'app', `page.${ext}`);
        }

        const pageContent = choices.isTailwind ? initialJsxTailwindContent : initialJsxContent;

        if (await fs.pathExists(pageFile)) {
            await fs.writeFile(pageFile, pageContent);
        }

        spinner.succeed('Next.js project initialized');
    } catch (error) {
        spinner.fail('Failed to create Next.js project');
        throw error;
    }
}

async function createExpressServer(serverPath, isTypeScript, packageManager) {
    const pm = packageManager === 'npm' ? 'npm' : packageManager;

    await execa(pm, ['init', '-y'], { cwd: serverPath });

    const deps = ['express', 'cors', 'dotenv'];
    const devDeps = ['nodemon'];

    if (isTypeScript) {
        deps.push('ts-node');
        devDeps.push('typescript', '@types/express', '@types/cors', '@types/node');
    }

    await execa(pm, ['install', ...deps], { cwd: serverPath });
    await execa(pm, ['install', '-D', ...devDeps], { cwd: serverPath });

    const srcPath = path.join(serverPath, 'src');
    await fs.ensureDir(srcPath);
    await fs.ensureDir(path.join(srcPath, 'controllers'));
    await fs.ensureDir(path.join(srcPath, 'routes'));
    await fs.ensureDir(path.join(srcPath, 'middlewares'));
    await fs.ensureDir(path.join(srcPath, 'lib'));

    const ext = isTypeScript ? 'ts' : 'js';
    const serverCodeJS = `import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express API!' });
});

// Server config
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;

    const serverCodeTS = `import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Express API!' });
});

// Server config
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;

    await fs.writeFile(
        path.join(srcPath, `index.${ext}`),
        isTypeScript ? serverCodeTS : serverCodeJS,
    );

    const pkgPath = path.join(serverPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.type = 'module';
    pkg.scripts = {
        dev: isTypeScript ? 'nodemon src/index.ts' : 'nodemon src/index.js',
        start: 'node dist/index.js',
        ...(isTypeScript && { build: 'tsc' }),
    };
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    await fs.writeFile(path.join(serverPath, '.env'), 'PORT=8080\nNODE_ENV=development\n');
    await fs.writeFile(path.join(serverPath, '.gitignore'), 'node_modules\ndist\n.env\n');

    if (isTypeScript) {
        const tsConfig = {
            compilerOptions: {
                target: 'ES2020',
                module: 'ESNext',
                moduleResolution: 'node',
                rootDir: './src',
                outDir: './dist',
                esModuleInterop: true,
                strict: true,
                skipLibCheck: true,
                sourceMap: true,
            },
            include: ['src/**/*'],
            exclude: ['node_modules'],
        };
        await fs.writeJson(path.join(serverPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
    }
}

async function detectNextAppChoices(projectPath) {
    const pkgPath = path.join(projectPath, 'package.json');
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');

    if (!(await fs.pathExists(pkgPath))) {
        throw new Error('package.json not found in Next.js project');
    }

    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

    const isTypeScript = await fs.pathExists(tsconfigPath);
    const useSrcDir = await fs.pathExists(path.join(projectPath, 'src'));
    const usesAppRouter = await fs.pathExists(path.join(projectPath, 'app'));
    const useAppRouterAndSrcDir =
        useSrcDir && (await fs.pathExists(path.join(projectPath, 'src', 'app')));

    const tailwindDep = pkg.dependencies?.tailwindcss || pkg.devDependencies?.tailwindcss;
    const isTailwind = tailwindDep && (tailwindDep.startsWith('^4') || tailwindDep.startsWith('4'));

    return {
        isTypeScript,
        isTailwind,
        usesAppRouter,
        useSrcDir,
        useAppRouterAndSrcDir,
    };
}

async function addTailwind(projectPath, framework, packageManager) {
    const workDir =
        framework === 'react-express' ? path.join(projectPath, 'frontend') : projectPath;
    const pm = packageManager === 'npm' ? 'npm' : packageManager;

    await execa(pm, ['install', '-D', 'tailwindcss', '@tailwindcss/vite'], { cwd: workDir });

    const viteConfigPath = path.join(workDir, 'vite.config.js');
    const viteConfigTsPath = path.join(workDir, 'vite.config.ts');
    let configPath = (await fs.pathExists(viteConfigTsPath)) ? viteConfigTsPath : viteConfigPath;

    if (await fs.pathExists(configPath)) {
        let configContent = await fs.readFile(configPath, 'utf-8');

        if (!configContent.includes('@tailwindcss/vite')) {
            configContent = `import tailwindcss from '@tailwindcss/vite';\n` + configContent;
        }

        if (!configContent.includes('tailwindcss()')) {
            if (configContent.includes('plugins: [')) {
                configContent = configContent.replace(
                    /plugins:\s*\[/,
                    match => `${match}tailwindcss(), `,
                );
            } else {
                configContent = configContent.replace(
                    /export default defineConfig\(\{/,
                    `export default defineConfig({\n  plugins: [tailwindcss()],`,
                );
            }
        }

        await fs.writeFile(configPath, configContent);
    }

    const cssPath = path.join(workDir, 'src', 'index.css');
    const tailwindImports = `@import "tailwindcss";\n`;

    if (await fs.pathExists(cssPath)) {
        await fs.writeFile(cssPath, tailwindImports);
    } else {
        await fs.ensureDir(path.dirname(cssPath));
        await fs.writeFile(cssPath, tailwindImports);
    }
}

async function addShadcn(projectPath, framework, language, packageManager) {
    const spinner = ora('Installing shadcn/ui...').start();
    const workDir =
        framework === 'react-express' ? path.join(projectPath, 'frontend') : projectPath;
    const pm = packageManager === 'npm' ? 'npm' : packageManager;
    const execCmd = packageManager === 'npm' ? 'npx' : packageManager;

    try {
        spinner.text = 'Installing shadcn dependencies...';
        await execa(pm, ['install', '-D', 'shadcn@latest'], { cwd: workDir });
        await execa(
            pm,
            ['install', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
            { cwd: workDir },
        );

        if (language === 'typescript') {
            spinner.text = 'Configuring TypeScript paths...';
            const tsPaths = [
                path.join(workDir, 'tsconfig.json'),
                path.join(workDir, 'tsconfig.app.json'),
            ];

            for (const configPath of tsPaths) {
                if (await fs.pathExists(configPath)) {
                    let content = await fs.readFile(configPath, 'utf-8');
                    const tsconfig = JSON.parse(stripJsonComments(content));
                    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
                    tsconfig.compilerOptions.baseUrl = '.';
                    tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
                    tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];
                    await fs.writeJson(configPath, tsconfig, { spaces: 2 });
                }
            }
        }

        if (!framework.includes('nextjs')) {
            spinner.text = 'Configuring Vite...';
            const ext = language === 'typescript' ? 'ts' : 'js';
            const viteConfigPath = path.join(workDir, `vite.config.${ext}`);

            if (await fs.pathExists(viteConfigPath)) {
                let viteConfig = await fs.readFile(viteConfigPath, 'utf-8');

                if (!viteConfig.includes('path')) {
                    viteConfig = `import path from "path";\n${viteConfig}`;
                }

                if (!viteConfig.includes('alias:')) {
                    if (viteConfig.includes('resolve: {')) {
                        viteConfig = viteConfig.replace(
                            /resolve:\s*\{/,
                            `resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },`,
                        );
                    } else {
                        viteConfig = viteConfig.replace(
                            /export default defineConfig\(\{/,
                            `export default defineConfig({\n  resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },`,
                        );
                    }
                }

                await fs.writeFile(viteConfigPath, viteConfig);
            }

            await execa(pm, ['install', '-D', '@types/node'], { cwd: workDir });
        }

        spinner.text = 'Initializing shadcn/ui...';
        await execa(execCmd, ['shadcn@latest', 'init', '-d', '--yes'], {
            cwd: workDir,
            timeout: 60000,
        });

        spinner.text = 'Adding button component...';
        await execa(execCmd, ['shadcn@latest', 'add', 'button', '--yes'], {
            cwd: workDir,
            timeout: 30000,
        });

        spinner.succeed('shadcn/ui installed successfully');
    } catch (error) {
        spinner.fail('Failed to install shadcn/ui');
        throw error;
    }
}

async function addPrisma(projectPath, language, database, packageManager) {
    const ext = language === 'typescript' ? 'ts' : 'js';
    const pm = packageManager === 'npm' ? 'npm' : packageManager;
    const execCmd = packageManager === 'npm' ? 'npx' : packageManager;

    await execa(pm, ['install', '-D', 'prisma'], { cwd: projectPath });
    await execa(pm, ['install', '@prisma/client'], { cwd: projectPath });
    await execa(execCmd, ['prisma', 'init', '--datasource-provider', database], {
        cwd: projectPath,
    });

    const libDir = path.join(projectPath, 'src', 'lib');
    await fs.ensureDir(libDir);

    const prismaClientContent = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = global${language === 'typescript' ? ' as unknown as { prisma: PrismaClient | undefined }' : ''};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;

    await fs.writeFile(path.join(libDir, `prisma.${ext}`), prismaClientContent);

    // Create sample schema
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    if (await fs.pathExists(schemaPath)) {
        let schema = await fs.readFile(schemaPath, 'utf-8');

        // Add a sample User model
        const sampleModel = `\n\nmodel User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;

        schema += sampleModel;
        await fs.writeFile(schemaPath, schema);
    }
}

async function addFeatures(projectPath, framework, features, language, packageManager) {
    const pm = packageManager === 'npm' ? 'npm' : packageManager;
    const workDir = framework === 'react-express' ? projectPath : projectPath;

    for (const feature of features) {
        const featureSpinner = ora(`Setting up ${feature}...`).start();

        try {
            switch (feature) {
                case 'linting':
                    await setupLinting(workDir, framework, language, pm);
                    featureSpinner.succeed('ESLint + Prettier configured');
                    break;

                case 'git':
                    await setupGit(workDir);
                    featureSpinner.succeed('Git initialized');
                    break;

                case 'env':
                    await setupEnv(workDir, framework);
                    featureSpinner.succeed('Environment variables configured');
                    break;

                case 'react-query':
                    await setupReactQuery(workDir, framework, pm);
                    featureSpinner.succeed('React Query installed');
                    break;

                case 'zustand':
                    await setupZustand(workDir, framework, language, pm);
                    featureSpinner.succeed('Zustand installed');
                    break;

                case 'auth':
                    await setupAuth(workDir, framework, language, pm);
                    featureSpinner.succeed('JWT Authentication setup completed');
                    break;
            }
        } catch (error) {
            featureSpinner.warn(`Failed to setup ${feature} (you can add it manually later)`);
        }
    }
}

async function setupLinting(projectPath, framework, language, pm) {
    const frontendPath =
        framework === 'react-express' ? path.join(projectPath, 'frontend') : projectPath;
    const backendPath = framework === 'react-express' ? path.join(projectPath, 'backend') : null;

    // Install ESLint and Prettier
    await execa(
        pm,
        ['install', '-D', 'eslint', 'prettier', 'eslint-config-prettier', 'eslint-plugin-prettier'],
        {
            cwd: frontendPath,
        },
    );

    // Create .prettierrc
    const prettierConfig = {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 4,
    };
    await fs.writeJson(path.join(frontendPath, '.prettierrc'), prettierConfig, { spaces: 2 });

    // Create .prettierignore
    await fs.writeFile(
        path.join(frontendPath, '.prettierignore'),
        'node_modules\ndist\nbuild\n.next\ncoverage\n',
    );

    if (backendPath) {
        await execa(pm, ['install', '-D', 'eslint', 'prettier', 'eslint-config-prettier'], {
            cwd: backendPath,
        });
        await fs.writeJson(path.join(backendPath, '.prettierrc'), prettierConfig, { spaces: 2 });
        await fs.writeFile(
            path.join(backendPath, '.prettierignore'),
            'node_modules\ndist\nbuild\n',
        );
    }
}

async function setupGit(projectPath) {
    await execa('git', ['init'], { cwd: projectPath });

    const gitignore = `# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist
.next
out

# Misc
.DS_Store
*.log
.env
.env.local
.env.*.local

# Editor
.vscode
.idea
*.swp
*.swo
*~
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

async function setupEnv(projectPath, framework) {
    if (framework === 'react-express') {
        // Frontend .env
        const frontendEnv = `VITE_API_URL=http://localhost:8080
VITE_APP_NAME=My App
`;
        await fs.writeFile(path.join(projectPath, 'frontend', '.env'), frontendEnv);
        await fs.writeFile(path.join(projectPath, 'frontend', '.env.example'), frontendEnv);

        // Backend .env already created in createExpressServer
        const backendEnvPath = path.join(projectPath, 'backend', '.env');
        if (await fs.pathExists(backendEnvPath)) {
            let backendEnv = await fs.readFile(backendEnvPath, 'utf-8');
            backendEnv += `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nJWT_SECRET=your-secret-key-here\n`;
            await fs.writeFile(backendEnvPath, backendEnv);
            await fs.writeFile(
                path.join(projectPath, 'backend', '.env.example'),
                backendEnv.replace(/=.+/g, '='),
            );
        }
    } else if (framework.includes('nextjs')) {
        const env = `NEXT_PUBLIC_APP_NAME=My App
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
`;
        await fs.writeFile(path.join(projectPath, '.env'), env);
        await fs.writeFile(path.join(projectPath, '.env.example'), env.replace(/=.+/g, '='));
    } else if (framework === 'react-router') {
        const env = `VITE_API_URL=http://localhost:8080
VITE_APP_NAME=My App
`;
        await fs.writeFile(path.join(projectPath, '.env'), env);
        await fs.writeFile(path.join(projectPath, '.env.example'), env);
    } else if (framework === 'express') {
        const envPath = path.join(projectPath, '.env');
        if (await fs.pathExists(envPath)) {
            let env = await fs.readFile(envPath, 'utf-8');
            env += `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nJWT_SECRET=your-secret-key-here\n`;
            await fs.writeFile(envPath, env);
            await fs.writeFile(path.join(projectPath, '.env.example'), env.replace(/=.+/g, '='));
        }
    }
}

async function setupReactQuery(projectPath, framework, pm) {
    const workDir =
        framework === 'react-express' ? path.join(projectPath, 'frontend') : projectPath;
    await execa(pm, ['install', '@tanstack/react-query', '@tanstack/react-query-devtools'], {
        cwd: workDir,
    });

    // Create query client setup
    const libDir = path.join(workDir, 'src', 'lib');
    await fs.ensureDir(libDir);

    const queryClientSetup = `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});
`;

    await fs.writeFile(path.join(libDir, 'queryClient.ts'), queryClientSetup);
}

async function setupZustand(projectPath, framework, language, pm) {
    const workDir =
        framework === 'react-express' ? path.join(projectPath, 'frontend') : projectPath;
    await execa(pm, ['install', 'zustand'], { cwd: workDir });

    // Create sample store
    const storeDir = path.join(workDir, 'src', 'store');
    await fs.ensureDir(storeDir);

    const ext = language === 'typescript' ? 'ts' : 'js';
    const storeContent =
        language === 'typescript'
            ? `import { create } from 'zustand';

interface AppState {
    count: number;
    increment: () => void;
    decrement: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}));
`
            : `import { create } from 'zustand';

export const useAppStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}));
`;

    await fs.writeFile(path.join(storeDir, `appStore.${ext}`), storeContent);
}

async function setupAuth(projectPath, framework, language, pm) {
    const workDir =
        framework === 'react-express'
            ? path.join(projectPath, 'backend')
            : framework === 'express'
              ? projectPath
              : projectPath;

    // Install JWT packages
    await execa(pm, ['install', 'jsonwebtoken', 'bcryptjs'], { cwd: workDir });

    if (language === 'typescript') {
        await execa(pm, ['install', '-D', '@types/jsonwebtoken', '@types/bcryptjs'], {
            cwd: workDir,
        });
    }

    // Create auth middleware
    const middlewareDir = path.join(workDir, 'src', 'middlewares');
    await fs.ensureDir(middlewareDir);

    const ext = language === 'typescript' ? 'ts' : 'js';
    const authMiddleware =
        language === 'typescript'
            ? `import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

interface JwtPayload {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
`
            : `import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
`;

    await fs.writeFile(path.join(middlewareDir, `auth.${ext}`), authMiddleware);

    // Create auth helper utilities
    const libDir = path.join(workDir, 'src', 'lib');
    await fs.ensureDir(libDir);

    const authUtils =
        language === 'typescript'
            ? `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
`
            : `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
`;

    await fs.writeFile(path.join(libDir, `auth.${ext}`), authUtils);
}

async function createFolderStructure(projectPath, projectType, framework, prisma) {
    if (framework === 'react-express') {
        const frontendSrc = path.join(projectPath, 'frontend', 'src');
        const backendSrc = path.join(projectPath, 'backend', 'src');

        // Frontend folders
        await fs.ensureDir(path.join(frontendSrc, 'components', 'ui'));
        await fs.ensureDir(path.join(frontendSrc, 'components', 'layout'));
        await fs.ensureDir(path.join(frontendSrc, 'pages'));
        await fs.ensureDir(path.join(frontendSrc, 'hooks'));
        await fs.ensureDir(path.join(frontendSrc, 'lib'));
        await fs.ensureDir(path.join(frontendSrc, 'utils'));
        await fs.ensureDir(path.join(frontendSrc, 'store'));

        // Backend folders already created in createExpressServer
        if (!prisma) {
            await fs.ensureDir(path.join(backendSrc, 'models'));
        }
    } else if (framework.includes('nextjs')) {
        const srcPath = (await fs.pathExists(path.join(projectPath, 'src')))
            ? path.join(projectPath, 'src')
            : projectPath;

        await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
        await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
        await fs.ensureDir(path.join(srcPath, 'lib'));
        await fs.ensureDir(path.join(srcPath, 'utils'));

        if (await fs.pathExists(path.join(srcPath, 'app'))) {
            await fs.ensureDir(path.join(srcPath, 'app', 'api'));
        }
    } else if (framework === 'react-router') {
        const srcPath = path.join(projectPath, 'src');
        await fs.ensureDir(path.join(srcPath, 'components', 'ui'));
        await fs.ensureDir(path.join(srcPath, 'components', 'layout'));
        await fs.ensureDir(path.join(srcPath, 'pages'));
        await fs.ensureDir(path.join(srcPath, 'hooks'));
        await fs.ensureDir(path.join(srcPath, 'lib'));
        await fs.ensureDir(path.join(srcPath, 'utils'));
        await fs.ensureDir(path.join(srcPath, 'store'));
    } else if (framework === 'express') {
        // Folders already created in createExpressServer
        if (!prisma) {
            const srcPath = path.join(projectPath, 'src');
            await fs.ensureDir(path.join(srcPath, 'models'));
        }
    }
}

main();
