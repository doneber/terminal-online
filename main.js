// get user of query params and save in a const called user
const user = new URLSearchParams(window.location.search).get('user') || 'robot'

function init() {
  setTimeout(() => {
    document.querySelector('#prompt').innerHTML =
      `<span class="user-terminal">${user}@pc</span><span class="user-access">:<span class="user-path">~</span>$&nbsp; </span>
    <input type="text" id="terminal-prompt" autofocus>`
  }, 100)
}

init()

// when user clicks on the terminal, focus on the input
const terminal = document.querySelector('.terminal')
terminal.addEventListener('click', () => {
  document.querySelector('#terminal-prompt').focus()
})
const commands = {
  'clear': {
    run: () => { document.querySelector('.history').innerHTML = '' },
    description: ' - Clear the terminal screen.'
  },
  'help': {
    run: () => {
      // RENDER SOMETHING
      const historyElement = document.querySelector('.history')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      // iterates over the commands map and creates a new element for each command
      newLineContainerElement.innerHTML = '<p>Available commands:</p>'
      const newElement = document.createElement('p')
      newLineContainerElement.appendChild(newElement)
      // iterates commands and creates a new element for each command
      Object.keys(commands).forEach((key) => {
        const newElement = document.createElement('p')
        newElement.innerHTML = '&nbsp; ' + key + ' ' + (commands[key].description || '')
        newLineContainerElement.appendChild(newElement)
      })

      historyElement.appendChild(newLineContainerElement)
    },
    description: ' - Display information about builtin commands.'
  },
  'echo': {
    run: (texts) => {
      // RENDER SOMETHING
      const historyElement = document.querySelector('.history')
      const newElement = document.createElement('p')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      newElement.innerText = texts.join(' ')
      newLineContainerElement.appendChild(newElement)
      historyElement.appendChild(newLineContainerElement)
    },
    description: '[arg ...] - Prints the arguments'
  },
  'ls': {
    run: () => {
      // RENDER SOMETHING
      const historyElement = document.querySelector('.history')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      newLineContainerElement.innerHTML = '<p>index.html</p>'
      historyElement.appendChild(newLineContainerElement)
    },
    description: ' - List directory contents'
  },
  'cat': {
    run: (params) => {
      if (params[0] !== 'index.html') return
      // RENDER SOMETHING
      const historyElement = document.querySelector('.history')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      newLineContainerElement.innerText = `<!DOCTYPE html>
<html lang="en">

<head>
  <title>Terminal Online</title>
</head>

<body>
  <p>You're awesome <3 </p>
</body>

</html>`
      historyElement.appendChild(newLineContainerElement)
    },
    description: ' file - Prints only index.html on the standard output'
  },
  'hola': {
    run: () => {
      const messages = [
        'Hey!',
        '¿Cómo estás? 🙃',
        'Espero que bien',
        '¿Qué tal el día? 📅',
        'Espero que genial',
        '¿Qué tal el trabajo? 🛠',
        'Espero que productivo',
        '¿Qué tal el café? ☕',
        'Espero que rico',
        '...',
        '🥲',
        'ánimo! 👋',
      ]

      // display messages with a delay using promises
      messages.reduce((promise, message) => {
        document.querySelector('#prompt').style.display = 'none'
        return promise.then(() => {
          return new Promise(resolve => {
            // random delay time
            const delay = Math.floor(Math.random() * 400) + 2000
            setTimeout(() => {
              const historyElement = document.querySelector('.history')
              const newLineContainerElement = document.createElement('div')
              newLineContainerElement.classList = 'history-line'
              newLineContainerElement.innerText = message
              historyElement.appendChild(newLineContainerElement)
              resolve()
            }, delay)
          })
        })
      }, Promise.resolve()).then(
        () => {
          document.querySelector('#prompt').style.display = 'flex'

        }
      )
    },
    description: ' - Say hello and start my message for u'
  }
}


function render(commandArr) {

  // Creates new line container
  const newLineContainerElement = document.createElement('div')
  newLineContainerElement.classList = 'history-line'

  newLineContainerElement.innerHTML = `
  <div class="user">
    <span class="user-terminal">${user}@pc</span><span class="user-access">:<span class="user-path">~</span>$ </span>
  </div><span> ${commandArr.join(' ')}</span`

  // Insert new line in history
  const historyElement = document.querySelector('.history')
  historyElement.appendChild(newLineContainerElement)

}

function runCommand() {
  const terminalPrompt = document.querySelector('#terminal-prompt')
  const commandArr = terminalPrompt.value.trimStart().trimEnd().split(' ')

  // assing first element to command and the rest to params
  const [command, params] = [commandArr[0], commandArr.slice(1)]
  render(commandArr)
  terminalPrompt.value = ''

  if (command === '') return

  if (commands[command]) {
    commands[command].run(params)
  } else {
    // RENDER COMMAND NOT FOUND
    const messageElement = document.createElement('p')
    messageElement.innerText = `${command}: command not found. Try 'help'`
    document.querySelector('.history').appendChild(messageElement)
  }

}
// if user clicks on the '.history' element, stop the propagation and focus on the input
const historyElement = document.querySelector('.history')
historyElement.addEventListener('click', (event) => {
  event.stopPropagation()
  // document.querySelector('#terminal-prompt').focus()

})
window.addEventListener('keydown', event => {
  if (event.keyCode == 13) runCommand()
})
