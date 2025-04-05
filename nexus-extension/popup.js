// popup.js for Python extension

document.addEventListener('DOMContentLoaded', function() {
    const checkFactsBtn = document.getElementById('checkFactsBtn');
    const statusDiv = document.getElementById('status');
    const resultsDiv = document.getElementById('results');
    
    checkFactsBtn.addEventListener('click', async () => {
      // Update status and clear previous results
      statusDiv.textContent = "Processing page...";
      statusDiv.style.backgroundColor = "#f0f8ff";
      resultsDiv.style.display = "none";
      resultsDiv.innerHTML = "";
      
      try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Extract page content
        const result = await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          function: () => {
            // Get the page title
            const title = document.title;
            
            // Get the main content (prioritizing article content)
            let content = '';
            
            // Try to get content from article elements first
            const articleElements = document.querySelectorAll('article');
            if (articleElements.length > 0) {
              articleElements.forEach(el => {
                content += el.innerText + '\n\n';
              });
            } else {
              // If no article elements, try main
              const mainElement = document.querySelector('main');
              if (mainElement) {
                content = mainElement.innerText;
              } else {
                // Fall back to body content, but try to exclude navigation, footers, etc.
                const bodyContent = document.body.innerText;
                
                // Remove common navigation and unrelated elements
                const elementsToExclude = document.querySelectorAll('nav, header, footer, aside, .sidebar, .navigation, .menu, .comments');
                let cleanContent = bodyContent;
                
                elementsToExclude.forEach(el => {
                  cleanContent = cleanContent.replace(el.innerText, '');
                });
                
                content = cleanContent;
              }
            }
            
            // Get the URL
            const url = window.location.href;
            
            return {
              title,
              content,
              url
            };
          }
        });
        
        const pageData = result[0].result;
        
        // Send data to Python backend
        statusDiv.textContent = "Sending to Python backend...";
        const response = await fetch(`${window.extensionConfig.apiUrl}/api/fact-check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pageData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Display results
        statusDiv.textContent = "Fact check complete! Downloaded page data has been cleared.";
        statusDiv.style.backgroundColor = "#e8f5e9";
        
        // Show results
        resultsDiv.style.display = "block";
        
        // Format the analysis results
        const analysis = data.analysis;
        
        // Create header
        const header = document.createElement('h3');
        header.textContent = "Fact Check Results";
        resultsDiv.appendChild(header);
        
        // Create summary section
        const summary = document.createElement('div');
        summary.innerHTML = `<p><strong>Summary:</strong> ${analysis.summary}</p>`;
        resultsDiv.appendChild(summary);
        
        // Create fact items
        const factsHeader = document.createElement('h4');
        factsHeader.textContent = "Specific Claims";
        resultsDiv.appendChild(factsHeader);
        
        if (analysis.claims && analysis.claims.length > 0) {
          analysis.claims.forEach(claim => {
            const factItem = document.createElement('div');
            factItem.className = 'fact-item';
            
            // Determine status class
            let statusClass = 'neutral';
            if (claim.accuracy === 'accurate') {
              statusClass = 'accurate';
            } else if (claim.accuracy === 'inaccurate') {
              statusClass = 'inaccurate';
            }
            
            factItem.innerHTML = `
              <p><strong>Claim:</strong> ${claim.statement}</p>
              <p class="${statusClass}"><strong>Assessment:</strong> ${claim.accuracy}</p>
              <p><strong>Explanation:</strong> ${claim.explanation}</p>
            `;
            
            resultsDiv.appendChild(factItem);
          });
        } else {
          const noFacts = document.createElement('p');
          noFacts.textContent = "No specific claims were analyzed.";
          resultsDiv.appendChild(noFacts);
        }
        
      } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.style.backgroundColor = "#ffebee";
      }
    });
  });