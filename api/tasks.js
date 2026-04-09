import { getCookie } from '../front/helper.js';

const BASE_URL = 'http://localhost:8081/task';

export function addTask(newTaskObject) {
    const userId = getCookie('current_user_id');
    if (!userId) {
        console.error('User ID not found in cookies');
        return Promise.reject('User ID not found');
    }

    return fetch(`${BASE_URL}/user/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([newTaskObject])
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || response.statusText) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Task added:', data);
            return data;
        })
        .catch(error => {
            console.error('Error adding task:', error);
            throw error;
        });
}

export function getTasks(userId) {
    return fetch(`${BASE_URL}/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            throw error;
        });
}

export function deleteTask(userId, taskId) {
    return fetch(`${BASE_URL}/user/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            throw error;
        });
}