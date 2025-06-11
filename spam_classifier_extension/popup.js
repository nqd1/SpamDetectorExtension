document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('checkBtn');
  const emailContent = document.getElementById('emailContent');
  const resultDiv = document.getElementById('result');
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: getEmailContent
    }, (results) => {
      if (results && results[0] && results[0].result) {
        emailContent.value = results[0].result;
      }
    });
  });
  
  checkBtn.addEventListener('click', function() {
    const text = emailContent.value.trim();
    
    if (text.length === 0) {
      alert('Please enter email content!');
      return;
    }
    
    fetch('http://localhost:42069/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text: text})
    })
    .then(response => response.json())
    .then(data => {
      resultDiv.classList.remove('hidden', 'spam', 'ham');
      
      if (data.is_spam) {
        resultDiv.classList.add('spam');
        resultDiv.textContent = `SPAM (Confidence: ${Math.round(data.confidence * 10000)/100}%)`;
      } else {
        resultDiv.classList.add('ham');
        resultDiv.textContent = `NOT SPAM (Confidence: ${Math.round(data.confidence * 10000)/100}%)`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.classList.remove('hidden', 'spam', 'ham');
      resultDiv.textContent = 'Error connecting to server. Ensure Flask API is running. Port: 42069';
    });
  });

  const plotConfidenceBtn = document.getElementById('plotConfidenceBtn');
  const phraseInput = document.getElementById('phraseInput');
  // const totalWordsInput = document.getElementById('totalWordsInput'); // Không còn dùng trực tiếp trong logic này
  const textPlotResultsDiv = document.getElementById('textPlotResults');

  plotConfidenceBtn.addEventListener('click', async function() {
    const phrase = phraseInput.value.trim();

    if (phrase.length === 0) {
      alert('Please enter a phrase to check.');
      return;
    }

    plotConfidenceBtn.disabled = true;
    plotConfidenceBtn.textContent = 'Generating...';
    textPlotResultsDiv.innerHTML = ''; // Xóa kết quả cũ

    const resultsData = []; // Lưu trữ {n, confidence}
    const maxN = 20; // Số lần lặp tối đa cho cụm từ

    for (let n = 0; n <= maxN; n++) {
      let testText = Array(n).fill(phrase).join(' ').trim();
      if (n === 0) { 
          // Tạo một văn bản cơ sở trung tính khi n=0
          testText = "This is a sample sentence for baseline check."; 
      }
      // Đảm bảo testText không bao giờ rỗng để tránh lỗi từ API nếu có
      if (testText.length === 0 && n > 0) { 
          testText = `placeholder_text_for_empty_phrase_n_${n}`;
      }

      try {
        const response = await fetch('http://localhost:42069/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: testText })
        });
        
        if (!response.ok) {
            console.error(`API request failed for n=${n} with status ${response.status}`);
            resultsData.push({ n, confidence: null, error: `API Error: ${response.statusText}` });
            continue; 
        }
        const data = await response.json();

        let currentSpamConfidence = 0;
        if (data.label === 'spam') {
            currentSpamConfidence = data.confidence;
        } else if (data.label === 'ham') {
            currentSpamConfidence = 1 - data.confidence;
        } else {
            // Trường hợp không có label hoặc label không mong muốn, ghi nhận lỗi
            console.error(`Unexpected label '${data.label}' in API response for n=${n}`);
            resultsData.push({ n, confidence: null, error: `Unexpected label: ${data.label}` });
            continue; // Bỏ qua lần lặp này và đi tới lần tiếp theo
        }
        resultsData.push({ n, confidence: currentSpamConfidence * 100 });

      } catch (error) {
        console.error('Error fetching prediction for n=', n, error);
        resultsData.push({ n, confidence: null, error: `Fetch Error: ${error.message}` });
      }
    }

    // Hiển thị kết quả dạng text
    resultsData.forEach(item => {
        const resultLine = document.createElement('div');
        let lineText = `n=${item.n}: \t`;
        if (item.confidence !== null) {
            const confidence = Math.max(0, Math.min(100, item.confidence)); // Kẹp giá trị từ 0-100
            const solidBlocks = Math.round(confidence / 4);
            const emptyBlocks = 25 - solidBlocks;
            lineText += '█'.repeat(solidBlocks);
            lineText += '░'.repeat(emptyBlocks);
            lineText += `  ${confidence.toFixed(0)}%`;
        } else {
            lineText += `Error: ${item.error || 'Unknown error'}`;
        }
        resultLine.textContent = lineText;
        textPlotResultsDiv.appendChild(resultLine);
    });

    plotConfidenceBtn.disabled = false;
    plotConfidenceBtn.textContent = 'Generate Text Plot';
  });
});

function getEmailContent() {
  try {
    const bodyElements = document.querySelectorAll('.a3s.aiL');
    if (bodyElements.length > 0) {
      return bodyElements[0].innerText;
    }
    return '';
  } catch (e) {
    console.error('Error getting email content:', e);
    return '';
  }
} 