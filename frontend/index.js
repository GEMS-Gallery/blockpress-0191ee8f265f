import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const newPostBtn = document.getElementById('new-post-btn');
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts');

    newPostBtn.addEventListener('click', () => {
        postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const body = quill.root.innerHTML;

        await backend.createPost(title, body, author);
        postForm.reset();
        quill.setContents([]);
        postForm.style.display = 'none';
        await displayPosts();
    });

    await displayPosts();
});

async function displayPosts() {
    const posts = await backend.getPosts();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">By ${post.author} on ${new Date(post.timestamp / 1000000).toLocaleString()}</div>
            <div>${post.body}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}