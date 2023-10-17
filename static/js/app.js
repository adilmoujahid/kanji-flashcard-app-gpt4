async function fetchWord() {
    // Show loading component
    document.getElementById('loading').style.display = 'block';
    
    const description = document.getElementById('description').value;
    try {
        const response = await fetch('http://127.0.0.1:5000/get_words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
        const data = await response.json();
        wordsList = data; 
        nextWord(); 
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    } finally {
        // Hide loading component
        document.getElementById('loading').style.display = 'none';
    }
}


let currentIndex = -1;
let correctAnswer;

//Initial setup
document.getElementById('english').textContent = '- ';
document.getElementById('sentenceJP').textContent = '-';
document.getElementById('sentenceEN').textContent = '-';
document.getElementById('next').disabled = true;


function nextWord() {
  currentIndex = (currentIndex + 1) % wordsList.length;
  const word = wordsList[currentIndex];
  document.getElementById('word').textContent = word.word;
  correctAnswer = word.correct;
  const options = [word.correct, ...word.incorrect].sort(() => Math.random() - 0.5);
  
  document.getElementById('options').innerHTML = options.map(option => 
      `<button onclick="checkAnswer('${option}')">${option}</button>`
  ).join('');

  document.getElementById('english').textContent = '- ';
  document.getElementById('sentenceJP').textContent = '-';
  document.getElementById('sentenceEN').textContent = '-';

  document.getElementById('next').disabled = true;
}

function checkAnswer(answer) {
  const buttons = document.querySelectorAll('#options button');
  buttons.forEach(button => {
      button.disabled = true;
      if (button.textContent === answer && answer === correctAnswer) {
          button.style.backgroundColor = 'green';
      } else if (button.textContent === answer) {
          button.style.backgroundColor = 'red';
      }
      if (button.textContent === correctAnswer) {
          button.style.backgroundColor = 'green';
      }
  });

  document.getElementById('english').textContent = `Translation: ${wordsList[currentIndex].english}`;
  document.getElementById('sentenceJP').textContent = `${wordsList[currentIndex].sentenceJP}`;
  document.getElementById('sentenceEN').textContent = `${wordsList[currentIndex].sentenceEN}`;

  document.getElementById('next').disabled = false;
}

nextWord();
