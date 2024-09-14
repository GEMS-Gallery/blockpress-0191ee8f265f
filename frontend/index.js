import { backend } from 'declarations/backend';

let currentCategory = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categories = await backend.getCategories();
        const categoriesContainer = document.getElementById('categories');
        const categorySelect = document.getElementById('postCategory');

        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.onclick = () => showPosts(category, categoryElement);
            categoryElement.innerHTML = `
                <h2>${category}</h2>
                <p>${getCategoryDescription(category)}</p>
            `;
            categoriesContainer.appendChild(categoryElement);

            // Populate category select in the new post form
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        setupNewPostModal();
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
});

async function showPosts(category, clickedElement) {
    try {
        document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
        clickedElement.classList.add('active');
        currentCategory = category;

        const posts = await backend.getPosts(category);
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = `<h2>${category} Posts</h2>`;
        
        posts.forEach(post => {
            const timestamp = Number(BigInt(post.timestamp) / BigInt(1000000));
            postsContainer.innerHTML += `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <div class="post-meta">Posted by ${post.author} on ${new Date(timestamp).toLocaleString()}</div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function setupNewPostModal() {
    const modal = document.getElementById('newPostModal');
    const newPostIcon = document.getElementById('newPostIcon');
    const closeBtn = document.getElementsByClassName('close')[0];
    const newPostForm = document.getElementById('newPostForm');

    newPostIcon.onclick = () => {
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    newPostForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const body = document.getElementById('postBody').value;
        const author = document.getElementById('postAuthor').value;
        const category = document.getElementById('postCategory').value;

        try {
            await backend.createPost(title, body, author, category);
            modal.style.display = 'none';
            newPostForm.reset();
            if (currentCategory === category) {
                await showPosts(category, document.querySelector(`.category:contains('${category}')`));
            }
        } catch (error) {
            console.error('Error creating new post:', error);
        }
    };
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