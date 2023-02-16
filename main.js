// get user of query params and save in a const called user
const user = new URLSearchParams(window.location.search).get('user') || 'robot'

function init() {
  setTimeout(() => {
    document.querySelector('#prompt').innerHTML =
      `<span class="user-terminal">${user}@pc</span><span class="user-access">:<span class="user-path">~</span>$&nbsp; </span>
    <input type="text" id="terminal-prompt" autofocus spellcheck="false" autocapitalize="off">`
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
    run: () => { document.querySelector('#history').innerHTML = '' },
    description: ' - Clear the terminal screen.'
  },
  'help': {
    run: () => {
      // RENDER SOMETHING
      const historyElement = document.querySelector('#history')
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
      const historyElement = document.querySelector('#history')
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
      const historyElement = document.querySelector('#history')
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
      const historyElement = document.querySelector('#history')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      newLineContainerElement.innerText = `<!DOCTYPE html>
<html lang="en">

<head>
  <title>Terminal Online</title>
</head>

<body>
  <p>Aquí no hay nada ${user.substring(0, 3)}. Pero buen intento 👍</p>
</body>

</html>`
      historyElement.appendChild(newLineContainerElement)
    },
    description: ' file - Prints only index.html on the standard output'
  },
  'dnbr': {
    run: function (parametersArr) {
      // recollect the parameters in the object 'ops'
      const ops = {}
      parametersArr.forEach((param, index) => {
        if (this.options[param] && parametersArr[index + 1] && !this.options[parametersArr[index + 1]]) {
          ops[param] = parametersArr[index + 1]
        }
      })
      // configRender is the object that will be passed to the render function
      const configRender = {
        velocity: ops['-v'] || 1,
      }
      // The messages of dnbr to you
      configRender.messages = [
        `Hola ${user.substring(0, 3)}! 👋`,
        'que tal 🙃',
        'espero que este todo bien',
        `sé que ya estamos en ${(new Date().getDate())} 📅`,
        'y tampoco nos conocemos mucho ',
        'pero me pareces una persona muy agradable',
        'de todas formas te deseo un feliz día 🎉',
        '🥳',
        ' ',
        'no tiene que ser un día "especial"',
        'pásala muy bien',
        'múcho ánimo!',
        `que tengas una buena ${
          // calculates the part of the day 
          (new Date().getHours() < 12) ? 'mañana' : (new Date().getHours() < 18) ? 'tarde' : 'noche'
        }`,
        '👋'
      ]
      this.render(configRender)
    },
    render: ({ messages = [], velocity = 1 }) => {
      // check if velocity is a number
      velocity = Number(velocity)
      velocity = (isNaN(velocity)) ? 1 : velocity

      // clean history except the last command
      const lastCommand = document.querySelector('#history').lastChild
      document.querySelector('#history').replaceChildren(lastCommand)

      // TODO: fix this error
      // this line is to cover the error that not display the last message
      messages.push('')
      const promptPalpitation = document.createElement('span')
      promptPalpitation.classList = 'prompt-palpitation'
      promptPalpitation.innerHTML = '&nbsp;'
      const historyElement = document.querySelector('#history')
      historyElement.appendChild(promptPalpitation)
      // display messages with a delay using promises
      let oldParant = null
      let newParant = null
      messages.reduce((promise, message, index) => {
        document.querySelector('#prompt').style.display = 'none'
        let delay = null
        return promise.then(() => {
          return new Promise(resolve => {
            // calculate delay time
            delay = (((messages[index - 1]?.length || 5) * 80) / velocity) + 1000
            setTimeout(() => {
              const historyElement = document.querySelector('#history')
              // create a div element to add the message
              const newLineContainerElement = document.createElement('div')
              newParant = newLineContainerElement
              newLineContainerElement.classList = 'history-line'
              historyElement.appendChild(newLineContainerElement)

              // create a span element to add the message
              const lineMessageElement = document.createElement('span')
              newLineContainerElement.appendChild(lineMessageElement)

              // add the prompt palpitation to the newLineContainerElement
              if (!oldParant) newLineContainerElement.appendChild(promptPalpitation)
              else newLineContainerElement.appendChild(oldParant.lastChild)

              // add letter by letter of the message to the newLineContainerElement every 100ms
              message.split('').reduce((promise, letter) => {
                return promise.then(() => {
                  return new Promise(resolve => {
                    setTimeout(() => {
                      lineMessageElement.innerHTML += letter
                      resolve()
                    }, 80 / velocity)
                  })
                })
              }, Promise.resolve())
              oldParant = newParant
              resolve()
            }, delay)
          })
        })
      }, Promise.resolve()).then(
        () => {
          document.querySelector('#prompt').style.display = 'flex'
          historyElement.removeChild(historyElement.lastChild)
          document.querySelector('#terminal-prompt').focus()
        }
      )
    },
    options: {
      '-v': { description: ' - Custom velocity messages displayed', },
    },
    description: '[-v velocity]  - dnbr message for you. Velocity parameter by default is 1.'
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
  const historyElement = document.querySelector('#history')
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
    // convert commands object to array
    const commandsArr = Object.keys(commands)
    // find the closest command
    const closestCommand = commandsArr.find((localCommand) => {
      if (levenshteinDistance(localCommand, command) === 1)
        return localCommand
    })
    if (closestCommand) {
      const historyElement = document.querySelector('#history')
      const newLineContainerElement = document.createElement('div')
      newLineContainerElement.classList = 'history-line'
      newLineContainerElement.innerHTML = `<p>${command}: command not found. Did you mean ${closestCommand}?</p>`
      historyElement.appendChild(newLineContainerElement)
      return
    } else {
      // RENDER COMMAND NOT FOUND
      const messageElement = document.createElement('p')
      messageElement.innerText = `${command}: command not found. Try 'help'`
      document.querySelector('#history').appendChild(messageElement)
    }
  }
}

function levenshteinDistance(a, b) {
  /* Calculates the distance beetween two Strings */
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;
  let matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// if user clicks on the '#history' element, stop the propagation and focus on the input
const historyElement = document.querySelector('#history')
historyElement.addEventListener('click', (event) => {
  event.stopPropagation()
  // document.querySelector('#terminal-prompt').focus()

})
window.addEventListener('keydown', event => {
  if (event.keyCode == 13) runCommand()
})
