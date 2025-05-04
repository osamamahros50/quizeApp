// https://opentdb.com/api.php?amount=10&category=20&difficulty=medium


const form = document.querySelector('form');
const categoryInput = document.getElementById('categoryMenu');
const difficultyInput = document.getElementById('difficultyOptions');
const numberInput = document.getElementById('questionsNumber');
const myRow = document.querySelector('.questions .container .row');
let myQuize;
let allQuestions;
form.addEventListener('submit',async (e)=>{
    e.preventDefault()
   let category= categoryInput.value;
    let difficulty= difficultyInput.value;
   let number = numberInput.value;
    myQuize =new Quize(category,difficulty,number)
    console.log(myQuize);
  allQuestions= await myQuize.getAllQuestions()
  console.log(allQuestions);
  let myQuestions = new Question(0)
  console.log(myQuestions);
  form.classList.replace('d-flex','d-none')
  myQuestions.displayQuesions()
  
})


class Quize{
    constructor(category,difficulty,number){
        this.category=category;
        this.difficulty=difficulty;
        this.number=number;
        this.score=0
    }
    getApi(){
        return`https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`
    }
   async getAllQuestions(){
        let response =await fetch(this.getApi());
        let data = await response.json();
       return data.results;
        
    }
      showResult(){
    return `
      <div class="question shadow-lg col-lg-12  p-5 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 overflow-hidden">
        <h2 class="mb-0 animate__animated animate__backInDown"> ${this.score == this.number  ?   'Congratulations <i class="fa-solid fa-face-smile-beam"></i> '   :   `your score is ${this.score}`}
        </h2>
        <button class="again  rounded-pill animate__animated animate__backInUp"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `
  }
}
class Question{
    constructor(index){
        this.index=index;
        this.category=allQuestions[index].category;
        this.correct_answer=allQuestions[index].correct_answer;
        this.incorrect_answers=allQuestions[index].incorrect_answers;
        this.question=allQuestions[index].question;  
        this.allAnswer=this.getAllAnswer();
        this.is_answerd=false;      
        
    }
    getAllAnswer(){
        let allAnswer =[... this.incorrect_answers , this.correct_answer]
        allAnswer.sort();
        return allAnswer;
    }
    displayQuesions(){
        const questionMarkUp = `
        <div
          class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3  animate__animated animate__backInLeft overflow-hidden"
        >
          <div class="w-100 d-flex justify-content-between overflow-hidden">
            <span class="btn btn-category text-white animate__animated animate__backInLeft">${this.category}</span>
            <span class="fs-6 btn btn-questions text-white animate__animated animate__backInRight"> ${this.index+1} of ${allQuestions.length} Questions</span>
          </div>
          <h2 class="text-capitalize h4 text-center animate__animated animate__bounceInDown">${this.question}</h2>  
          <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center text-white animate__animated animate__zoomInDown">
          ${this.allAnswer.map((li)=>`<li class="rounded-4 p-3 ">${li}</li>`).join('')}
          </ul>
          <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuize.score}</h2>        
        </div>
      `;
      myRow.innerHTML = questionMarkUp;
      let  allLi = document.querySelectorAll('.choices li')
      allLi.forEach((li)=>{
        li.addEventListener('click',()=>{
                this.checkAnswer(li)
                this.nextQuestion()
        })
      })
    }

    checkAnswer(li){
        if (this.is_answerd==false) {
            this.is_answerd =true;
            if (li.innerHTML == this.correct_answer) {
                li.classList.add('correct','animate__animated', 'animate__bounce');
                myQuize.score++
            }else{
                
                li.classList.add('wrong', 'animate__animated', 'animate__shakeX');

            }
        }
    }

    nextQuestion() {
        this.index++
    
        setTimeout(() => {
    
          if (this.index < allQuestions.length) {
            let myNewQuestion = new Question(this.index)
            myNewQuestion.displayQuesions()
          }else{
            let result = myQuize.showResult()
            myRow.innerHTML = result
            document.querySelector('.again').addEventListener('click',function(){
              window.location.reload()
            })
          }
    
    
        }, 1500)
    
      }
    }