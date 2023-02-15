// get user of query params and save in a const called user
const user = new URLSearchParams(window.location.search).get('user') || 'robot'

function init() {
  setTimeout(() => {
    document.querySelector('.input-container').innerHTML =
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

  if (command === '')return
  
  if (commands[command]) {
    commands[command].run(params)
  } else {
    // RENDER COMMAND NOT FOUND
    const messageElement = document.createElement('p')
    messageElement.innerText = `${command}: command not found. Try 'help'`
    document.querySelector('.history').appendChild(messageElement)
  }

}

window.addEventListener('keydown', event => {
  if (event.keyCode == 13) runCommand()
})
