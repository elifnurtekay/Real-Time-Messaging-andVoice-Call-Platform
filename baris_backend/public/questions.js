const optionsContainer = document.getElementById('options');

// Function to add a new option input
function addOptionInput() {
    const newOption = document.createElement('div');
    newOption.classList.add('inputContent-Options');
    newOption.innerHTML = `
        <input type="text" placeholder="+Seçenekler ekleyin">
        <a href="#" class="emoji"><i class="fa-solid fa-face-smile"></i></a>
    `;
    optionsContainer.appendChild(newOption);
    
    // Attach the input listener to the new input field
    const newInput = newOption.querySelector('input');
    newInput.addEventListener('input', handleInput);
}

// Handle input event in the last option input
function handleInput(e) {
    const allInputs = optionsContainer.querySelectorAll('.inputContent-Options input');
    const lastInput = allInputs[allInputs.length - 1];
    
    // Check if the last input has content and is not empty
    if (lastInput.value.trim() !== '') {
        lastInput.removeEventListener('input', handleInput);
        addOptionInput(); // Add a new option input
    }
}

// Attach the initial input listener to the first input field
const firstInput = optionsContainer.querySelector('.inputContent-Options input');
firstInput.addEventListener('input', handleInput);
