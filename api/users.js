const BASE_URL = 'http://localhost:8081/user';

export async function saveUser(entries){
    try{
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entries)
        })

        return await res.json();

    }catch(e){
        console.error("Error registering user: " + e.message);
    }
}

export async function loginUser(entries){
    try{
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entries)
        })

        return await res.json();

    }catch(e){
        console.error("Error logging in user: " + e.message);
    }
}