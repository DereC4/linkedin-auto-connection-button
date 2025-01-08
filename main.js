// ==UserScript==
// @name         LinkedIn Connect Toggle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically connect with LinkedIn search results with a toggle button
// @author       You
// @match        https://www.linkedin.com/search/results/people/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;

    async function linkedInBot() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < 1000 && isRunning; i++) {
            try {
                console.log("Starting");
                const connectButton = document.querySelector('button[aria-label*="Invite"][aria-label*="connect"]');
                if (connectButton) {
                    connectButton.click();
                    await sleep(1500);
                    const sendButton = document.querySelector('button[aria-label="Send without a note"]');
                    if (sendButton) {
                        sendButton.click();
                        await sleep(1500);
                    }
                } else {
                    const nextButton = document.querySelector('button[aria-label="Next"]');
                    if (nextButton && !nextButton.classList.contains('artdeco-button--disabled')) {
                        nextButton.click();
                        await sleep(3000);
                        console.log("Moving to the next page...");
                    } else {
                        console.log("No more connections available.");
                        break;
                    }
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    }

    function toggleAutoConnect() {
        isRunning = !isRunning;
        if (isRunning) {
            button.textContent = 'Stop Auto Connect';
            linkedInBot();
        } else {
            button.textContent = 'Start Auto Connect';
        }
    }

    const button = document.createElement('button');
    button.textContent = 'Start Auto Connect';
    button.style = 'margin: 10px; padding: 10px; background-color: #0073b1; color: white; border: none; border-radius: 5px; cursor: pointer;';
    button.onclick = toggleAutoConnect;

    function appendButton() {
        const toolbar = document.querySelector('[aria-label="Search filters"]');
        if (toolbar) {
            toolbar.appendChild(button);
        } else {
            console.warn('Search filters toolbar not found, retrying...');
            setTimeout(appendButton, 1000);
        }
    }

    window.addEventListener('load', appendButton);
})();
