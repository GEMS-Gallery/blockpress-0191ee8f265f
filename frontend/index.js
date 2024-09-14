import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categories = await backend.getCategories();
        const categoriesContainer = document.getElementById('categories');

        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.onclick = () => showPosts(category, categoryElement);
            categoryElement.innerHTML = `
                <h2>${category}</h2>
                <p>${getCategoryDescription(category)}</p>
            `;
            categoriesContainer.appendChild(categoryElement);
        });

        document.getElementById('newPostIcon').addEventListener('click', createNewPost);
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
});

async function showPosts(category, clickedElement) {
    try {
        document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
        clickedElement.classList.add('active');

        const posts = await backend.getPosts(category);
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = `<h2>${category} Posts</h2>`;
        
        posts.forEach(post => {
            postsContainer.innerHTML += `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <div class="post-meta">Posted by ${post.author} on ${new Date(post.timestamp / 1000000).toLocaleString()}</div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function createNewPost() {
    // This function would open a modal or navigate to a new page for post creation
    alert("Creating a new post... (Functionality not fully implemented)");
}

function getCategoryDescription(category) {
    const descriptions = {
        'Red Team': 'Offensive security tactics and strategies',
        'Pen Testing': 'Penetration testing methodologies and tools',
        'Exploit Dev': 'Vulnerability research and exploit development',
        'Cryptography': 'Encryption, decryption, and cipher discussions',
        'Social Engineering': 'Human-focused attack techniques',
        'CTF': 'Capture The Flag challenges and writeups'
    };
    return descriptions[category] || '';
}