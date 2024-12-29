const CONFIG = {
    DEFAULT_PASSWORD_LENGTH: 20,
    COPY_FEEDBACK_DELAY: 2000,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 32
};

const mainEl = document.querySelector('.main');

const passwordEl = document.createElement('input');
passwordEl.classList.add('password');
passwordEl.setAttribute('placeholder' , 'Сгенерировать пароль');
passwordEl.setAttribute('readonly', true);

const copyBtn = document.createElement('button');
copyBtn.classList.add('password-button');
copyBtn.innerText = 'Скопировать';
copyBtn.addEventListener('click', (e) =>{
    if (passwordEl.value) {
        navigator.clipboard.writeText(passwordEl.value)
            .then(() => {
                copyBtn.innerText = 'Скопировано!';
                copyBtn.classList.add('success');
                setTimeout(() => {
                    copyBtn.innerText = 'Скопировать';
                    copyBtn.classList.remove('success');
                }, CONFIG.COPY_FEEDBACK_DELAY);
            })
            .catch(err => {
                console.error('Ошибка при копировании:', err);
                copyBtn.innerText = 'Ошибка!';
                copyBtn.classList.add('error');
                setTimeout(() => {
                    copyBtn.innerText = 'Скопировать';
                    copyBtn.classList.remove('error');
                }, CONFIG.COPY_FEEDBACK_DELAY);
            });
    }
});

const generateBtn = document.createElement('button');
generateBtn.classList.add('password-button');
generateBtn.innerText = 'Сгенерировать';
generateBtn.addEventListener('click', (e) => {
    const length = Math.min(
        Math.max(parseInt(lengthEl.value) || CONFIG.DEFAULT_PASSWORD_LENGTH, CONFIG.MIN_PASSWORD_LENGTH),
        CONFIG.MAX_PASSWORD_LENGTH
    );
    lengthEl.value = length;
    let password = generatePassword(length);
    passwordEl.value = password;
    
    passwordEl.classList.add('generating');
    setTimeout(() => {
        passwordEl.classList.remove('generating');
    }, 300);
    localStorage.setItem('lastPassword', password);
});

function generatePassword(passwordLength) {
    try {
        if (passwordLength < CONFIG.MIN_PASSWORD_LENGTH) {
            throw new Error(`Длина пароля не может быть меньше ${CONFIG.MIN_PASSWORD_LENGTH}`);
        }
        if (passwordLength > CONFIG.MAX_PASSWORD_LENGTH) {
            throw new Error(`Длина пароля не может быть больше ${CONFIG.MAX_PASSWORD_LENGTH}`);
        }
        const numberChars = "0123456789";
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const symbolChars = "!@#%^&*()_+№;:?-=";
        
        let password = [
            numberChars[Math.floor(Math.random() * numberChars.length)],
            upperChars[Math.floor(Math.random() * upperChars.length)],
            lowerChars[Math.floor(Math.random() * lowerChars.length)],
            symbolChars[Math.floor(Math.random() * symbolChars.length)]
        ];
        
        const allChars = numberChars + upperChars + lowerChars + symbolChars;
        
        for (let i = password.length; i < passwordLength; i++) {
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
        }
        
        return password.sort(() => Math.random() - 0.5).join('');
    } catch (error) {
        console.error('Ошибка при генерации пароля:', error);
        return '';
    }
} 

const lengthEl = document.createElement('input');
lengthEl.type = 'number';
lengthEl.min = CONFIG.MIN_PASSWORD_LENGTH;
lengthEl.max = CONFIG.MAX_PASSWORD_LENGTH;
lengthEl.value = CONFIG.DEFAULT_PASSWORD_LENGTH;
lengthEl.classList.add('password-length');
lengthEl.maxLength = 2;

lengthEl.addEventListener('input', function() {
    if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
    }
    if (parseInt(this.value) > CONFIG.MAX_PASSWORD_LENGTH) {
        this.value = CONFIG.MAX_PASSWORD_LENGTH;
    }
});

lengthEl.addEventListener('focus', function() {
    this.dataset.previousValue = this.value;
    this.value = '';
});

lengthEl.addEventListener('blur', function() {
    if (!this.value) {
        this.value = this.dataset.previousValue || CONFIG.DEFAULT_PASSWORD_LENGTH;
    }
});

const hintEl = document.createElement('div');
hintEl.classList.add('hint');
hintEl.textContent = `Длина пароля: ${CONFIG.MIN_PASSWORD_LENGTH}-${CONFIG.MAX_PASSWORD_LENGTH} символов`;

mainEl.appendChild(passwordEl);
mainEl.appendChild(copyBtn);
mainEl.appendChild(generateBtn);
mainEl.appendChild(lengthEl);
mainEl.insertBefore(hintEl, lengthEl);
const lastPassword = localStorage.getItem('lastPassword');
if (lastPassword) {
    passwordEl.value = lastPassword;
}
