const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct:true},
            { text: "High Tech Modern Language", correct:false},
            { text: "Hyperlinks and Text Markup Language", correct:false},
            { text: "Home tool Markup Language", correct:false},
        ]
    },
    {
        question: "What does CSS stand for?",
        answers: [
            { text: "Computer Style Sheets", correct:false},
            { text: "Cascading Style Sheets", correct:true},
            { text: "Creative Style Sheet", correct:false},
            { text: "Coloured Style Sheets", correct:false},
        ]
    },
    {
        question: "Which of the following are parts of the CSS box model?",
        answers: [
            { text: "margin", correct:false},
            { text: "Borders", correct:false},
            { text: "Padding", correct:false},
            { text: "None of the above", correct:true},
        ]
    },
    {
        question: "The CSS property Used to specify the transparency of an element is?",
        answers: [
            { text: "Opacity", correct:true},
            { text: "Visibility", correct:false},
            { text: "filter", correct:false},
            { text: "None of the above", correct:false},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex=0;
let score =0;

function startQuiz(){
    currentQuestionIndex =0;
    score =0;
    nextButton.innerHTML ="Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex +1;
    questionElement.innerHTML =questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer =>{
        const button = document.createElement("button")
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;           
        }
        button.addEventListener("click",selectAnswer);
    });
}
 
function resetState(){
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);      
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const iscorrect = selectedBtn.dataset.correct ==="true"
    if (iscorrect) {
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect")
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");           
        }
        button.disabled =true;    
    });
    nextButton.style.display ="block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `you scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if (currentQuestionIndex< questions.length) {
        showQuestion();  
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=> {
    if (currentQuestionIndex< questions.length) {
        handleNextButton();       
    }else{
        startQuiz();
    }
})

startQuiz();
