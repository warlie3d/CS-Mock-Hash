// This allows us to use the bcrypt algorithm in our Node.js project
const bcrypt = require('bcrypt')

// This allows us to read from the terminal
const readlineSync = require('readline-sync')

// We'll keep a global object to store usernames and password hashes
let globalStore = {}



/*
* SOLUTION CODE FOR BCRYPT FUNCTIONS
*/

// function for checking a password
checkPassword = async (username, plaintextPassword) => {
    // TODO: Make sure to delete this console.log once you're done implementing the function!
    //console.log('\n Uh-oh, checkPassword is not yet implemented. 😢')
    
    if (globalStore[username]) {
        try {
            // Ensure global store contains the user 
            const result = await bcrypt.compare(plaintextPassword, globalStore[username])
            if (result) {
                // TODO: Display message for valid credentials
                console.log('\n✅ Login successful!')
            }
            else {
                // TODO: Display message for invalid credentials
                console.log('\n❌ Invalid credentials. Please try again')
            }
        } catch (error) {
            console.error('Error during password comparison', error)
        }
        // TODO: Use bcrypt's compare methof to compare a plaintext password to a password hash
        
        // TODO: The result variable is a boolean. True means the user was valid. Take action accordingly.
    }
    else {
        // Tell the user they can't login to a non-existent account
        console.log('\n❌ Sorry, but this user does not exist.\n')
    }
}

hashPassword = async (username, password) => {
    try {
        //Generate a salt
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt)

        globalStore[username] = hashedPassword

        console.log(`\n✅ User "${username}" created with hashed password: ${hashedPassword} \n}`)
    } catch (error) {
        console.error('Error during password hashing', error)
    }
    

    
}





/* 
* CODE BELOW IS PROVIDED AND DOESN'T NEED TO BE ALTERED 
*/

createUser = async () => {
    // Prompt the user for a password
    let username = readlineSync.question(`\nWhat is your username? `)

    // Make sure the user doesn't already exist
    if (globalStore[username]) {
        console.log(`❌ Sorry, but there is already a user called ${username}\n`)
    }
    else {
        // If the user is new, prompt them for a password
        let password = readlineSync.question(`What is the password for ${username}? `)

        // Add the user to our system
        await hashPassword(username, password)
    }
}

loginUser = async () => {
    // Greet the user
    console.log(`\nGreat, let's log you in.\n`)

    // Prompt the user for their username
    let user = readlineSync.question(`What's your username? `)

    // Prompt the user for their password
    let pass = readlineSync.question(`What's your password? `)

    // See if they are a valid user
    await checkPassword(user, pass)
}

viewStore = () => {
    // Show the total user count
    console.log(`\nThere are ${Object.keys(globalStore).length} users in the system.\n`)

    // Some lines to break it up visually
    console.log('==================================\n')

    // Print each user
    for (let key in globalStore) {
        console.log(`${key}: ${globalStore[key]}`)
    }

    // Some lines to break it up visually
    console.log('\n==================================\n')
}

// Program loop
programLoop = async () => {
    while (true) {
        let action = readlineSync.question(`\nWhat action would you like to do? (type 'help' for options) `)
        switch (action.toLowerCase()) {
            case 'view':
                await viewStore()
                break
            case 'create':
                await createUser()
                break
            case 'login':
                await loginUser()
                break
            case 'help':
                console.log('\nYou can choose from the following actions:\n')
                console.log('\tview: see all users')
                console.log('\tcreate: add a new user')
                console.log('\tlogin: login to a specific user')
                console.log('\thelp: show available commands')
                console.log('\texit: quit this program\n\n')
                break
            case 'exit':
            case 'quit':
                console.log('\n👋 Goodbye!👋\n')
                process.exit()
            default:
                console.log('\n🤔 Sorry, I didn\'t get that...')
        }
    }
}

// Start the program loop
programLoop()