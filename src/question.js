export class Question {
  static create(question) {
    return fetch(
      'https://podcast-project-ea50e-default-rtdb.europe-west1.firebasedatabase.app/questions.json',
      {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name
        return question
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage()
    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div class="nothing">Ничего нет :)</div>`

    const list = document.getElementById('questions-list')
    list.innerHTML = html
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">Что-то не так :(</p>')
    }
    return fetch(
      `https://podcast-project-ea50e-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`
        }

        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : []
      })
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map((q) => `<li>${q.text}</li>`).join('')}</ol>`
      : `<p>Вопросов нет</p>`
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage()
  all.push(question)
  localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
  return `
    <div class="question">
      <p>${question.text}</p>
      <div class="question-date">
        <div>${new Date(question.date).toLocaleDateString()}</div>
        <div>${new Date(question.date).toLocaleTimeString()}</div>
      </div>
    </div>
  `
}
