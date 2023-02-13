// get user of query params and save in a const called user
const user = new URLSearchParams(window.location.search).get('user') || 'robot'

function init() {
  console.log('init');
  document.querySelector('.user-terminal').innerText = `${user}@pc`
}

init()


// when user clicks on the terminal, focus on the input
const terminal = document.querySelector('.terminal')
terminal.addEventListener('click', () => {
  document.querySelector('#terminal-prompt').focus()
})

const commands = new Map()
commands.set('clear', () => { document.querySelector('.history').innerHTML = '' })

commands.set('echo', (texts) => {
  // RENDER SOMETHING
  const historyElement = document.querySelector('.history')
  const newElement = document.createElement('p')
  const newLineContainerElement = document.createElement('div')
  newLineContainerElement.classList = 'history-line'
  newElement.innerText = texts.join(' ')
  newLineContainerElement.appendChild(newElement)
  historyElement.appendChild(newLineContainerElement)
})
commands.set('help', (texts) => {
  // RENDER SOMETHING
  const historyElement = document.querySelector('.history')
  const newLineContainerElement = document.createElement('div')
  newLineContainerElement.classList = 'history-line'
  // iterates over the commands map and creates a new element for each command
  newLineContainerElement.innerHTML = '<p>Available commands:</p>'
  const newElement = document.createElement('p')
  newLineContainerElement.appendChild(newElement)

  commands.forEach((value, key) => {
    const newElement = document.createElement('p')
    newElement.innerHTML = '&nbsp; ' + key
    newLineContainerElement.appendChild(newElement)
  })

  historyElement.appendChild(newLineContainerElement)
})

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
  const commandArr = terminalPrompt.value.trimStart().split(' ')

  // assing first element to command and the rest to params
  const [command, params] = [commandArr[0], commandArr.slice(1)]
  const validInput = commands.has(command)

  render(commandArr)

  if (!validInput) {
    // RENDER SOMETHING
    const messageElement = document.createElement('p')
    messageElement.innerText = `${command}: command not found. Try 'help'`
    document.querySelector('.history').appendChild(messageElement)
  } else {
    commands.get(command)(params)
  }

  terminalPrompt.value = ''
}

window.addEventListener('keydown', event => {
  if (event.keyCode == 13) runCommand()
})
